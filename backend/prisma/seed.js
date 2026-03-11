const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});



async function main() {
    console.log('🌱 Seeding CRM database...');

    // 1. Clear existing data in reverse order of dependencies
    const models = [
        'submenu', 'menu', 'rolePermission', 'notification', 'counselorNote',
        'call', 'message', 'activity', 'lead', 'leadStatus', 'user', 'role',
        'subscription', 'channel', 'activityLog', 'routingRule', 'integration',
        'aiConfig', 'workingHours', 'securitySetting', 'superAdminDashboard'
    ];

    for (const model of models) {
        try {
            if (prisma[model]) {
                await prisma[model].deleteMany();
                console.log(`🧹 Cleared ${model}`);
            }
        } catch (e) {
            console.log(`⚠️ Skipping clear for ${model}: ${e.message}`);
        }
    }

    // Hash a shared demo password
    const password = await bcrypt.hash('password123', 10);

    // ── Roles ──
    const rolesData = [
        { name: 'SUPER_ADMIN', description: 'System owner with full access' },
        { name: 'ADMIN', description: 'Institutional administrator' },
        { name: 'MANAGER', description: 'Operational performance monitor' },
        { name: 'TEAM_LEADER', description: 'Team supervisor and lead reassigner' },
        { name: 'COUNSELOR', description: 'Frontline lead handler' },
        { name: 'SUPPORT', description: 'First point of contact and routing' }
    ];

    const roles = {};
    for (const r of rolesData) {
        roles[r.name] = await prisma.role.create({ data: r });
    }
    console.log('✅ Roles seeded');

    // ── Users ──
    const superAdmin = await prisma.user.create({
        data: { name: 'Super Admin', email: 'super.admin@crm.com', password, roleId: roles['SUPER_ADMIN'].id, team: 'Executive-Super' }
    });

    const admin = await prisma.user.create({
        data: { name: 'EDU Admin', email: 'admin@edu-corp.com', password, roleId: roles['ADMIN'].id, team: 'Central Admin' }
    });

    const manager = await prisma.user.create({
        data: { name: 'Analytics Manager', email: 'manager@analytics.crm', password, roleId: roles['MANAGER'].id, team: 'Ops Management' }
    });

    const teamLeader = await prisma.user.create({
        data: { name: 'Team Leader', email: 'leader@teams.crm', password, roleId: roles['TEAM_LEADER'].id, team: 'Alpha Squad' }
    });

    const counselor = await prisma.user.create({
        data: { name: 'Sales Counselor', email: 'counselor@sales.crm', password, roleId: roles['COUNSELOR'].id, team: 'Alpha Squad' }
    });

    const support = await prisma.user.create({
        data: { name: 'Support Agent', email: 'support@help.crm', password, roleId: roles['SUPPORT'].id, team: 'Alpha Squad' }
    });

    console.log('✅ Users seeded');

    // ── Channels ──
    await prisma.channel.createMany({
        skipDuplicates: true,
        data: [
            { name: 'WhatsApp Business – UK', type: 'WhatsApp', status: 'Active', usage_count: 412 },
            { name: 'Facebook Messenger – EU', type: 'Facebook', status: 'Active', usage_count: 280 },
            { name: 'Website Chat Widget', type: 'Website', status: 'Active', usage_count: 200 },
            { name: 'Instagram DM', type: 'Instagram', status: 'Inactive', usage_count: 45 },
            { name: 'Telegram Bot', type: 'Telegram', status: 'Active', usage_count: 130 },
        ]
    });
    console.log('✅ Channels seeded');

    // ── Leads ──
    const countries = ['India', 'USA', 'UK', 'UAE', 'France', 'Spain', 'Japan', 'Saudi Arabia', 'Nigeria', 'Australia', 'Mexico', 'Canada', 'Germany', 'Italy', 'Brazil'];
    const programs = ['MBA', 'Data Science', 'Finance', 'Marketing', 'Engineering', 'Medicine', 'Law', 'Psychology', 'Architecture', 'Computer Science'];
    const sources = ['WhatsApp', 'Facebook', 'Website', 'Instagram', 'Telegram', 'Referral'];
    const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost', 'Converted'];
    const priorities = ['High', 'Medium', 'Low'];
    const names = [
        'Ahmad Al-Rashid', 'Priya Sharma', 'James Wilson', 'Sophie Dubois', 'Carlos Mendez',
        'Yuki Tanaka', 'Fatima Al-Hassan', 'David Okafor', 'Emma Thompson', 'Luis García',
        'Zoe Chen', 'Arjun Patel', 'Elena Rossi', 'Mohammed Ali', 'Sarah Miller',
        'Ivan Petrov', 'Lucia Ferrari', 'Hans Schmidt', 'Anna Kowalski', 'Jean Dupont',
        'Maria Rodriguez', 'Kim Min-su', 'Chen Wei', 'Sato Kenji', 'Ravi Kumar',
        'Amara Diallo', 'Kwame Nkrumah', 'Beatriz Silva', 'Jorge Santos', 'Isabella Costa',
        'William Brown', 'Oliver Smith', 'Charlotte Jones', 'Noah Williams', 'Amelia Taylor',
        'Liam Johnson', 'Sophia White', 'Lucas Martin', 'Mia Thompson', 'Ethan Moore',
        'Ava Wilson', 'Mason Anderson', 'Isabella Harris', 'Logan Clark', 'Sophia Lewis',
        'Jackson Young', 'Olivia Walker', 'Aiden Hall', 'Mia Allen', 'Lucas Wright'
    ];

    const leads = names.map((name, i) => ({
        name,
        country: countries[i % countries.length],
        phone: `+${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 900000000) + 100000000}`,
        email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        program: programs[i % programs.length],
        stage: stages[i % stages.length],
        score: Math.floor(Math.random() * 100),
        source: sources[i % sources.length],
        assignedTo: i % 3 === 0 ? counselor.id : (i % 5 === 0 ? teamLeader.id : null),
        priority: priorities[i % priorities.length],
        team: 'Alpha Squad'
    }));

    const createdLeads = [];
    for (const lead of leads) {
        const created = await prisma.lead.create({ data: lead });
        createdLeads.push(created);
    }
    console.log(`✅ ${leads.length} Leads seeded`);

    // ── Messages (for SLA Alerts) ──
    const messages = [];
    for (let i = 0; i < 15; i++) {
        const lead = createdLeads[i];
        if (!lead) continue;

        // Create a mix of read and unread messages
        // Some older than 30 mins to trigger SLA breaches
        const timestamp = new Date();
        if (i < 5) timestamp.setMinutes(timestamp.getMinutes() - 45); // Breached
        else if (i < 10) timestamp.setMinutes(timestamp.getMinutes() - 20); // Warning
        else timestamp.setMinutes(timestamp.getMinutes() - 5); // New

        messages.push({
            leadId: lead.id,
            sender: lead.name,
            message: `Inquiry from ${lead.name} regarding ${lead.program}`,
            isRead: i > 10, // Some are read
            timestamp
        });
    }

    await prisma.message.createMany({ data: messages });
    console.log('✅ Messages seeded');

    // ── Routing Rules ──
    await prisma.routingRule.createMany({
        skipDuplicates: true,
        data: [
            { name: 'UAE–MBA Route', team: 'Gulf Team', country: 'UAE', type: 'Round_Robin', status: 'Active', priority: 1 },
            { name: 'India–Tech Route', team: 'South Asia', country: 'India', type: 'Weightage', status: 'Active', priority: 2 },
            { name: 'UK–Finance Route', team: 'Europe', country: 'UK', type: 'Direct', status: 'Active', priority: 1 },
            { name: 'Facebook All', team: 'Social Team', country: null, type: 'Round_Robin', status: 'Paused', priority: 3 },
            { name: 'USA Admissions', team: 'North America', country: 'USA', type: 'Direct', status: 'Active', priority: 1 },
            { name: 'Global Support', team: 'Support', country: null, type: 'Round_Robin', status: 'Active', priority: 5 },
        ]
    });
    console.log('✅ Routing rules seeded');

    // ── Message Templates ──
    await prisma.messageTemplate.createMany({
        skipDuplicates: true,
        data: [
            { name: 'Welcome Message', content: 'Hello {{name}}, welcome to our CRM! How can we help you today?', category: 'greeting', variable_count: 1, createdBy: admin.id },
            { name: 'Follow Up', content: 'Hi {{name}}, just following up on your inquiry about {{program}}. Are you still interested?', category: 'follow-up', variable_count: 2, createdBy: admin.id },
            { name: 'Proposal Sent', content: 'Dear {{name}}, we have sent you a detailed proposal for {{program}}. Please review it at your earliest convenience.', category: 'proposal', variable_count: 2, createdBy: counselor.id },
            { name: 'Closure', content: 'Thank you {{name}} for choosing us! Your application for {{program}} is confirmed.', category: 'closure', variable_count: 2, createdBy: counselor.id },
            { name: 'Meeting Invite', content: 'Hi {{name}}, I would like to invite you for a discovery call regarding {{program}}.', category: 'scheduling', variable_count: 2, createdBy: teamLeader.id },
        ]
    });
    console.log('✅ Templates seeded');

    // ── Subscriptions (Billing) ──
    await prisma.subscription.createMany({
        skipDuplicates: true,
        data: [
            { clientName: 'EDU Corp Global', plan: 'Enterprise', status: 'Active', renewalDate: new Date('2026-12-31'), messagesCount: 45000, contactsCount: 12000 },
            { clientName: 'LearnPath Academy', plan: 'Professional', status: 'Active', renewalDate: new Date('2026-06-30'), messagesCount: 18000, contactsCount: 3500 },
            { clientName: 'SkillBridge Institute', plan: 'Starter', status: 'Active', renewalDate: new Date('2026-03-31'), messagesCount: 4200, contactsCount: 800 },
            { clientName: 'GlobalEd Partners', plan: 'Enterprise', status: 'Suspended', renewalDate: new Date('2025-12-31'), messagesCount: 0, contactsCount: 0 },
            { clientName: 'TechSkills Ltd', plan: 'Professional', status: 'Active', renewalDate: new Date('2026-08-15'), messagesCount: 12000, contactsCount: 2500 },
        ]
    });
    console.log('✅ Subscriptions seeded');

    // ── Integrations ──
    await prisma.integration.createMany({
        skipDuplicates: true,
        data: [
            { name: 'HubSpot CRM', type: 'CRM', url: 'https://api.hubspot.com/v1', apiKey: 'hs_demo_key_xxx', status: 'Active' },
            { name: 'Salesforce', type: 'CRM', url: 'https://login.salesforce.com', apiKey: 'sf_demo_key_xxx', status: 'Inactive' },
            { name: 'Mailchimp', type: 'Marketing', url: 'https://us1.api.mailchimp.com/3.0', apiKey: 'mc_demo_key_xxx', status: 'Active' },
            { name: 'Slack Notifications', type: 'Communication', url: 'https://hooks.slack.com/...', apiKey: 'slack_webhook_xxx', status: 'Active' },
        ]
    });
    console.log('✅ Integrations seeded');

    // ── Activity Logs ──
    const activities = [
        { action: 'System Login', module: 'Auth', details: 'User logged in', status: 'Success' },
        { action: 'Lead Created', module: 'Leads', details: 'New inbound lead recorded', status: 'Success' },
        { action: 'Lead Updated', module: 'Leads', details: 'Lead stage changed', status: 'Success' },
        { action: 'Channel Created', module: 'Channels', details: 'Protocol provisioned', status: 'Success' },
        { action: 'Routing Rule Added', module: 'Routing', details: 'New distribution logic applied', status: 'Success' },
        { action: 'Password Reset', module: 'Auth', details: 'Credential recovery executed', status: 'Success' },
        { action: 'Lead Reassigned', module: 'Leads', details: 'Ownership transfer complete', status: 'Success' }
    ];

    const logs = [];
    for (let i = 0; i < 30; i++) {
        const act = activities[i % activities.length];
        logs.push({
            userId: i % 2 === 0 ? superAdmin.id : admin.id,
            action: act.action,
            module: act.module,
            details: act.details,
            status: act.status,
            ip: `192.168.1.${10 + i}`,
            device: i % 3 === 0 ? 'Chrome / Windows' : (i % 3 === 1 ? 'Safari / iPhone' : 'Firefox / Mac')
        });
    }

    await prisma.activityLog.createMany({ data: logs });
    console.log('✅ Activity logs seeded');

    // ── Menus ──
    console.log('🌱 Seeding menus...');
    const menuDefinitions = [
        // SUPER_ADMIN
        { label: 'Overview', icon: 'LayoutDashboard', path: '/super-admin', roleId: roles['SUPER_ADMIN'].id, order: 1 },
        { label: 'All Channels', icon: 'MessageSquare', path: '/super-admin/channels', roleId: roles['SUPER_ADMIN'].id, order: 2 },
        { label: 'Global Users', icon: 'Users', path: '/super-admin/users', roleId: roles['SUPER_ADMIN'].id, order: 3 },
        { label: 'Admin Management', icon: 'UserPlus', path: '/super-admin/admins', roleId: roles['SUPER_ADMIN'].id, order: 4 },
        { label: 'Billing & Plans', icon: 'CreditCard', path: '/super-admin/billing', roleId: roles['SUPER_ADMIN'].id, order: 5 },
        { label: 'System Analytics', icon: 'BarChart3', path: '/super-admin/analytics', roleId: roles['SUPER_ADMIN'].id, order: 6 },
        { label: 'Audit Logs', icon: 'ScrollText', path: '/super-admin/audit', roleId: roles['SUPER_ADMIN'].id, order: 7 },
        { label: 'Security', icon: 'ShieldCheck', path: '/super-admin/security', roleId: roles['SUPER_ADMIN'].id, order: 8 },
        { label: 'Inbox', icon: 'Inbox', path: '/inbox', roleId: roles['SUPER_ADMIN'].id, order: 9 },
        { label: 'Leads', icon: 'Users', path: '/leads', roleId: roles['SUPER_ADMIN'].id, order: 10 },

        // ADMIN
        { label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin', roleId: roles['ADMIN'].id, order: 1 },
        { label: 'Channel Setup', icon: 'MessageSquare', path: '/admin/channels', roleId: roles['ADMIN'].id, order: 2 },
        { label: 'Routing Rules', icon: 'Globe', path: '/admin/routing', roleId: roles['ADMIN'].id, order: 3 },
        { label: 'User Management', icon: 'Users', path: '/admin/users', roleId: roles['ADMIN'].id, order: 4 },
        { label: 'AI Config', icon: 'BrainCircuit', path: '/admin/ai-config', roleId: roles['ADMIN'].id, order: 5 },
        { label: 'Working Hours', icon: 'Clock', path: '/admin/working-hours', roleId: roles['ADMIN'].id, order: 6 },
        { label: 'CRM Integration', icon: 'Link2', path: '/admin/crm-settings', roleId: roles['ADMIN'].id, order: 7 },
        { label: 'Templates', icon: 'FileText', path: '/admin/templates', roleId: roles['ADMIN'].id, order: 8 },
        { label: 'Inbox', icon: 'Inbox', path: '/inbox', roleId: roles['ADMIN'].id, order: 9 },
        { label: 'Leads', icon: 'Users', path: '/leads', roleId: roles['ADMIN'].id, order: 10 },

        // MANAGER
        { label: 'Dashboard', icon: 'LayoutDashboard', path: '/manager', roleId: roles['MANAGER'].id, order: 1 },
        { label: 'Lead Funnel', icon: 'PieChart', path: '/manager/funnel', roleId: roles['MANAGER'].id, order: 2 },
        { label: 'Country Analysis', icon: 'Globe', path: '/manager/country', roleId: roles['MANAGER'].id, order: 3 },
        { label: 'SLA Metrics', icon: 'TrendingUp', path: '/manager/sla', roleId: roles['MANAGER'].id, order: 4 },
        { label: 'Conversion', icon: 'Activity', path: '/manager/conversion', roleId: roles['MANAGER'].id, order: 5 },
        { label: 'Team Overview', icon: 'Users2', path: '/manager/team', roleId: roles['MANAGER'].id, order: 6 },
        { label: 'Call Reports', icon: 'PhoneCall', path: '/manager/calls', roleId: roles['MANAGER'].id, order: 7 },
        { label: 'Leads', icon: 'Users', path: '/leads', roleId: roles['MANAGER'].id, order: 8 },

        // TEAM_LEADER
        { label: 'Dashboard', icon: 'LayoutDashboard', path: '/team-leader', roleId: roles['TEAM_LEADER'].id, order: 1 },
        { label: 'Team Inbox', icon: 'Inbox', path: '/team-leader/inbox', roleId: roles['TEAM_LEADER'].id, order: 2 },
        { label: 'Assigned Leads', icon: 'Users', path: '/team-leader/leads', roleId: roles['TEAM_LEADER'].id, order: 3 },
        { label: 'Performance', icon: 'UserCheck', path: '/team-leader/performance', roleId: roles['TEAM_LEADER'].id, order: 4 },
        { label: 'Reassign Leads', icon: 'RefreshCcw', path: '/team-leader/reassign', roleId: roles['TEAM_LEADER'].id, order: 5 },
        { label: 'SLA Alerts', icon: 'AlertTriangle', path: '/team-leader/sla', roleId: roles['TEAM_LEADER'].id, order: 6 },
        { label: 'Activity Logs', icon: 'FileText', path: '/team-leader/logs', roleId: roles['TEAM_LEADER'].id, order: 7 },

        // COUNSELOR
        { label: 'My Dashboard', icon: 'LayoutDashboard', path: '/counselor', roleId: roles['COUNSELOR'].id, order: 1 },
        { label: 'My Leads', icon: 'Target', path: '/leads', roleId: roles['COUNSELOR'].id, order: 2 },
        { label: 'Inbox', icon: 'Inbox', path: '/inbox', roleId: roles['COUNSELOR'].id, order: 3 },
        { label: 'Lead Stages', icon: 'Layers', path: '/counselor/stages', roleId: roles['COUNSELOR'].id, order: 4 },
        { label: 'Lead Notes', icon: 'FileEdit', path: '/counselor/notes', roleId: roles['COUNSELOR'].id, order: 5 },
        { label: 'AI Summary', icon: 'Sparkles', path: '/counselor/ai-summary', roleId: roles['COUNSELOR'].id, order: 6 },
        { label: 'Call History', icon: 'Phone', path: '/counselor/calls', roleId: roles['COUNSELOR'].id, order: 7 },

        // SUPPORT
        { label: 'Support Dash', icon: 'LayoutDashboard', path: '/support', roleId: roles['SUPPORT'].id, order: 1 },
        { label: 'Lead Assignment', icon: 'UserCheck', path: '/support/assign', roleId: roles['SUPPORT'].id, order: 2 },
        { label: 'AI Status', icon: 'Zap', path: '/support/ai-status', roleId: roles['SUPPORT'].id, order: 3 },
        { label: 'Templates', icon: 'FileText', path: '/support/templates', roleId: roles['SUPPORT'].id, order: 4 },
        { label: 'Inbox', icon: 'Inbox', path: '/inbox', roleId: roles['SUPPORT'].id, order: 5 }
    ];

    for (const menuData of menuDefinitions) {
        await prisma.menu.create({ data: menuData });
    }
    console.log('✅ Menus seeded');

    console.log('\n🎉 Database seeded successfully!');
    console.log('Demo login credentials (all use password: password123):');
    console.log('  Super Admin : super.admin@crm.com');
    console.log('  Admin       : admin@edu-corp.com');
    console.log('  Manager     : manager@analytics.crm');
    console.log('  Team Leader : leader@teams.crm');
    console.log('  Counselor   : counselor@sales.crm');
    console.log('  Support     : support@help.crm');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
