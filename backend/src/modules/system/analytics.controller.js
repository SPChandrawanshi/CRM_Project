const prisma = require('../../config/prisma');

BigInt.prototype.toJSON = function () {
    return Number(this);
};

// @desc    Get system-wide analytics summary
// @route   GET /api/analytics/summary
exports.getSummary = async (req, res, next) => {
    try {
        const { country, status, operator, dateLabel } = req.query;

        const leadWhere = {};
        if (country && country !== 'Global') leadWhere.country = country;
        if (status && status !== 'All Stages') leadWhere.stage = status;

        if (operator && operator !== 'All Operators') {
            const opUser = await prisma.user.findFirst({ where: { name: operator } });
            if (opUser) leadWhere.assignedTo = opUser.id;
        }

        if (dateLabel && dateLabel !== 'All Records') {
            const now = new Date();
            let gte;
            if (dateLabel === 'Today') {
                gte = new Date(now.setHours(0, 0, 0, 0));
            } else if (dateLabel === 'Last 7 Days') {
                gte = new Date(now.setDate(now.getDate() - 7));
            } else if (dateLabel === 'Last 30 Days') {
                gte = new Date(now.setDate(now.getDate() - 30));
            } else if (dateLabel === 'This Month') {
                gte = new Date(now.getFullYear(), now.getMonth(), 1);
            }
            if (gte) leadWhere.createdAt = { gte };
        }

        const [leads, users] = await Promise.all([
            prisma.lead.findMany({
                where: leadWhere,
                select: { country: true, stage: true, source: true }
            }),
            prisma.user.findMany({ select: { role: true, status: true } })
        ]);

        // Group leads by country
        const countryMap = {};
        leads.forEach(l => {
            const key = l.country || 'Unknown';
            if (!countryMap[key]) countryMap[key] = { 'Country Zone': key, 'Total Leads Generated': 0, 'Qualified Pipelines': 0 };
            countryMap[key]['Total Leads Generated']++;
            if (l.stage?.toLowerCase() === 'qualified') countryMap[key]['Qualified Pipelines']++;
        });

        // Group leads by source
        const sourceMap = {};
        leads.forEach(l => {
            const key = l.source || 'Direct';
            if (!sourceMap[key]) sourceMap[key] = { 'Ingress Channel': key, 'Total Leads': 0, 'Successful Conversions': 0 };
            sourceMap[key]['Total Leads']++;
            if (l.stage?.toLowerCase() === 'converted') sourceMap[key]['Successful Conversions']++;
        });

        // Group users by role (Users are global, usually not filtered by lead criteria)
        const roleMap = {};
        users.forEach(u => {
            const key = typeof u.role === 'object' ? (u.role?.name || 'Unknown') : (u.role || 'Unknown');
            if (!roleMap[key]) roleMap[key] = { 'Operational Tier': key, 'Allocated Seats': 0, 'Online Today': 0 };
            roleMap[key]['Allocated Seats']++;
            if (u.status === 'Active') roleMap[key]['Online Today']++;
        });

        res.json({
            success: true,
            data: {
                leadsByCountry: Object.values(countryMap),
                leadsBySource: Object.values(sourceMap),
                activeUsers: Object.values(roleMap)
            }
        });
    } catch (error) {
        next(error);
    }
};
// @desc    Export system analytics metadata
// @route   GET /api/analytics/export
exports.getExport = async (req, res, next) => {
    try {
        const [leadsByCountry, leadsBySource, activeUsers] = await Promise.all([
            prisma.$queryRaw`SELECT country, COUNT(*) as count FROM leads GROUP BY country`,
            prisma.$queryRaw`SELECT source, COUNT(*) as count FROM leads GROUP BY source`,
            prisma.$queryRaw`SELECT role, COUNT(*) as count FROM users GROUP BY role`
        ]);

        const exportData = {
            exportDate: new Date().toISOString(),
            generatedBy: req.user.id,
            metrics: {
                geographicDistribution: leadsByCountry,
                ingressChannels: leadsBySource,
                operationalTiers: activeUsers
            }
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=crm-intelligence-metadata.json');
        res.send(JSON.stringify(exportData, null, 2));
    } catch (error) {
        next(error);
    }
};
