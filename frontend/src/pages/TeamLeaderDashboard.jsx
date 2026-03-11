import React from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    MessageSquare,
    AlertTriangle,
    RefreshCcw,
    TrendingUp,
    Clock,
    ChevronRight,
    UserCheck,
    FileText
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useTeamLeaderActions } from '../hooks/useTeamLeaderActions'
import { useNavigate } from 'react-router-dom'

const KpiCard = ({ title, value, subText, icon: Icon, color, onRefresh }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white p-5 md:p-6 rounded-[2rem] md:rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3 md:space-y-4 group relative overflow-hidden"
    >
        <div className="absolute -right-6 -top-6 text-gray-50 opacity-50 pointer-events-none transition-transform group-hover:scale-110 group-hover:rotate-12">
            <Icon size={100} className="md:w-[120px] md:h-[120px]" />
        </div>
        <div className="flex items-center justify-between relative z-10">
            <div className={cn("p-2 md:p-2.5 rounded-xl", color)}>
                <Icon size={18} className="md:w-5 md:h-5 text-current" />
            </div>
            {onRefresh && (
                <button
                    onClick={onRefresh}
                    className="p-1 md:p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 bg-gray-50 border border-gray-100/50 rounded-lg transition-all"
                >
                    <RefreshCcw size={12} className="md:w-3.5 md:h-3.5" />
                </button>
            )}
        </div>
        <div className="space-y-1 relative z-10">
            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{title}</p>
            <div className="flex items-end gap-2 md:gap-3">
                <h3 className="text-2xl md:text-3xl font-black text-[#111827] tracking-tighter truncate">{value}</h3>
                {subText && (
                    <span className="text-[10px] md:text-xs font-bold text-emerald-500 mb-0.5 md:mb-1 flex items-center gap-0.5 whitespace-nowrap">
                        <TrendingUp size={10} className="md:w-3 md:h-3" /> {subText}
                    </span>
                )}
            </div>
        </div>
    </motion.div>
)

const QuickActionCard = ({ title, description, icon: Icon, onClick, color }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="bg-white p-4 md:p-5 rounded-[1.5rem] md:rounded-2xl border border-[#E5E7EB] shadow-sm text-left flex items-start gap-3 md:gap-4 hover:border-indigo-200 transition-colors group"
    >
        <div className={cn("p-2.5 md:p-3 rounded-xl shrink-0 transition-transform group-hover:scale-110 group-hover:-rotate-3 mt-1", color)}>
            <Icon size={18} className="md:w-5 md:h-5 text-current" />
        </div>
        <div className="min-w-0 pr-4">
            <h4 className="text-xs md:text-sm font-black text-[#111827] uppercase tracking-tight truncate">{title}</h4>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase mt-1 leading-relaxed line-clamp-2 md:line-clamp-none">{description}</p>
        </div>
        <div className="ml-auto mt-2 text-gray-300 group-hover:text-indigo-600 transition-colors shrink-0">
            <ChevronRight size={14} className="md:w-4 md:h-4" />
        </div>
    </motion.button>
)

const TeamLeaderDashboard = () => {
    const { useDashboard, refreshData } = useTeamLeaderActions()
    const { data: dashboard, isLoading } = useDashboard()
    const navigate = useNavigate()

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const stats = dashboard?.data || { teamLeads: '0', pendingReplies: '0', slaBreaches: '0' }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-[#111827] uppercase tracking-tighter">Team Control <span className="text-indigo-600">Center</span></h1>
                    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live operational metrics and management</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => refreshData.mutate('dashboard')}
                        className="flex-1 sm:flex-none justify-center bg-white border border-[#E5E7EB] text-[#111827] px-4 md:px-5 py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <RefreshCcw size={14} className={refreshData.isPending ? "animate-spin shrink-0" : "shrink-0"} /> Sync Data
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard
                    title="My Team Leads"
                    value={stats.teamLeads}
                    icon={Users}
                    color="bg-indigo-50 text-indigo-600"
                    onRefresh={() => refreshData.mutate('dashboard')}
                />
                <KpiCard
                    title="Pending Replies"
                    value={stats.pendingReplies}
                    icon={MessageSquare}
                    color="bg-amber-50 text-amber-600"
                    onRefresh={() => refreshData.mutate('dashboard')}
                />
                <KpiCard
                    title="SLA Breaches"
                    value={stats.slaBreaches}
                    icon={AlertTriangle}
                    color="bg-rose-50 text-rose-600"
                    onRefresh={() => refreshData.mutate('dashboard')}
                />
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Command Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="Inbox Monitor"
                        description="View all active team conversations and send reminder pings."
                        icon={MessageSquare}
                        color="bg-blue-50 text-blue-600"
                        onClick={() => navigate('/team-leader/inbox')}
                    />
                    <QuickActionCard
                        title="Assigned Leads"
                        description="Manage team portfolio, update statuses, and add internal notes."
                        icon={Users}
                        color="bg-emerald-50 text-emerald-600"
                        onClick={() => navigate('/team-leader/leads')}
                    />
                    <QuickActionCard
                        title="Counselor Perf."
                        description="Track individual metrics, conversions, and SLA averages."
                        icon={TrendingUp}
                        color="bg-purple-50 text-purple-600"
                        onClick={() => navigate('/team-leader/performance')}
                    />
                    <QuickActionCard
                        title="Reassign Leads"
                        description="Perform single or bulk lead transfers between team members."
                        icon={UserCheck}
                        color="bg-orange-50 text-orange-600"
                        onClick={() => navigate('/team-leader/reassign')}
                    />
                    <QuickActionCard
                        title="SLA Alerts"
                        description="Respond to delayed responses and force emergency transfers."
                        icon={AlertTriangle}
                        color="bg-rose-50 text-rose-600"
                        onClick={() => navigate('/team-leader/sla')}
                    />
                    <QuickActionCard
                        title="Activity Logs"
                        description="Audit team actions and add global protocol records."
                        icon={FileText}
                        color="bg-gray-100/80 text-gray-600"
                        onClick={() => navigate('/team-leader/logs')}
                    />
                </div>
            </div>

            {/* Team Activity Feed (Compact) */}
            <div className="bg-white rounded-[2rem] border border-[#E5E7EB] shadow-sm p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                    <div>
                        <h3 className="text-base md:text-lg font-black text-[#111827] uppercase tracking-tighter">Live Operations Feed</h3>
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5 md:mt-1">Real-time team activity</p>
                    </div>
                    <button
                        onClick={() => navigate('/team-leader/logs')}
                        className="text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors flex items-center gap-1 w-fit"
                    >
                        View Full Ledger <ChevronRight size={12} className="shrink-0" />
                    </button>
                </div>

                <div className="space-y-5 md:space-y-6">
                    {[
                        { time: '10 Mins Ago', event: 'Lead Reassigned', detail: 'Maria G. transferred from Mike to Jane.' },
                        { time: '1 Hr Ago', event: 'SLA Warning Triggered', detail: 'Ahmed A. waiting for response (45m).' },
                        { time: '2 Hrs Ago', event: 'Status Updated', detail: 'Rahul marked John D. as Qualified.' }
                    ].map((act, i) => (
                        <div key={i} className="flex gap-3 md:gap-4 items-start relative before:absolute before:inset-y-[20px] md:before:inset-y-[24px] before:left-[9px] md:before:left-[11px] before:w-px before:bg-gray-100 last:before:hidden">
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-indigo-50 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10 text-indigo-600 mt-0.5">
                                <Clock size={10} className="md:w-[10px] md:h-[10px]" />
                            </div>
                            <div className="space-y-1 pb-2 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                                    <h4 className="text-[10px] md:text-[11px] font-black text-[#111827] uppercase tracking-tight">{act.event}</h4>
                                    <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-1.5 md:px-2 py-0.5 rounded whitespace-nowrap">{act.time}</span>
                                </div>
                                <p className="text-[11px] md:text-xs text-gray-600 line-clamp-2">{act.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TeamLeaderDashboard


