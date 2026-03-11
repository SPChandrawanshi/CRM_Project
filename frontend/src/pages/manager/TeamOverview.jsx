import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users2,
    ArrowLeft,
    ChevronRight,
    Search,
    Filter,
    Clock,
    Target,
    CheckCircle,
    UserCircle2,
    Activity,
    RefreshCcw,
    Zap,
    TrendingUp,
    Shield,
    Globe,
    Layout
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useManagerActions } from '../../hooks/useManagerActions'
import { useNavigate } from 'react-router-dom'

const PerformanceMetric = ({ label, value, subValue, icon: Icon, color }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white border border-gray-100 p-6 rounded-[2.5rem] shadow-sm relative overflow-hidden group"
    >
        <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 rounded-full -mr-16 -mt-16", color)} />
        <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-2xl", color.replace('bg-', 'bg-opacity-10 text-'))}>
                    <Icon size={20} />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">{value}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{subValue}</span>
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-3xl font-black text-[#111827] tracking-tighter">{value}</h3>
                    {subValue && <span className="text-[10px] font-black text-gray-300">/ Total</span>}
                </div>
            </div>
        </div>
    </motion.div>
)

const TeamOverview = () => {
    const navigate = useNavigate()
    const { useTeamOverview, useTeamCounselors, refreshData } = useManagerActions()
    const { data: teams, isLoading } = useTeamOverview()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTeam, setSelectedTeam] = useState(null)

    const { data: counselorsResp, isLoading: isCounselorsLoading } = useTeamCounselors(selectedTeam?.team)
    const counselorBreakdown = useMemo(() => counselorsResp?.data || [], [counselorsResp])

    const teamData = useMemo(() => teams?.data || [], [teams])
    
    const globalStats = useMemo(() => {
        if (!teamData.length) return { leads: 0, conversion: '0%', response: '0m', agents: 0 }
        const totalLeads = teamData.reduce((acc, t) => acc + (t.activeLeads || 0), 0)
        const totalConverted = teamData.reduce((acc, t) => acc + (t.converted || 0), 0)
        const totalAgents = teamData.reduce((acc, t) => acc + (t.counselors || 0), 0)
        return {
            leads: totalLeads,
            conversion: `${Math.round((totalConverted / totalLeads || 0) * 100)}%`,
            response: '2.4m',
            agents: totalAgents
        }
    }, [teamData])

    const filteredTeams = teamData.filter(t =>
        t.team.toLowerCase().includes(searchQuery.toLowerCase())
    )


    if (isLoading) return (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-50 rounded-full animate-pulse" />
                <Activity className="absolute inset-0 m-auto text-indigo-600 animate-spin" size={24} />
            </div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Compiling Cluster Matrix...</p>
        </div>
    )

    return (
        <div className="space-y-8 pb-12">
            {/* Intel Header */}
            <AnimatePresence mode="wait">
                {!selectedTeam ? (
                    <motion.div
                        key="header-main"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
                    >
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-[#111827] text-white text-[8px] font-black uppercase tracking-widest rounded-md">Cluster Control</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            </div>
                            <h1 className="text-4xl font-black text-[#111827] uppercase tracking-tighter leading-none">
                                Team <span className="text-indigo-600">Operational</span> Matrix
                            </h1>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational hierarchy and collective performance monitoring</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="bg-white border border-gray-100 rounded-3xl px-6 py-4 flex items-center gap-8 shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Active Clusters</span>
                                    <span className="text-sm font-black text-[#111827]">{teamData.length} Shards</span>
                                </div>
                                <div className="w-px h-8 bg-gray-100" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Integrity Rank</span>
                                    <div className="flex items-center gap-1">
                                        <Shield size={10} className="text-indigo-600" />
                                        <span className="text-sm font-black text-[#111827]">AAA+</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => refreshData.mutate('team')}
                                className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 shadow-sm transition-all active:scale-95 group"
                            >
                                <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                            </button>
                            <button className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95">
                                Pulse Audit
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="header-detail"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setSelectedTeam(null)}
                                className="w-14 h-14 bg-white border border-gray-100 rounded-[1.5rem] text-gray-400 hover:text-indigo-600 shadow-sm transition-all active:scale-95 flex items-center justify-center group"
                            >
                                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">{selectedTeam.team} <span className="text-indigo-600">Attribution</span></h1>
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black rounded uppercase">Matrix Live</span>
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Counselor-level performance attribution and latency flow</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-[#111827] text-white rounded-[2rem] border border-gray-800 shadow-xl">
                            <Zap size={16} className="text-amber-400 fill-current" />
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-60">System Mode</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Autonomous Sync</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Operational Flow */}
            <AnimatePresence mode="wait">
                {!selectedTeam ? (
                    <motion.section
                        key="team-matrix-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-8"
                    >
                        {/* Global Telemetry */}
                        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <PerformanceMetric label="Active Lead Payload" value={globalStats.leads} icon={Target} color="bg-indigo-600" />
                            <PerformanceMetric label="Aggregated Conversion" value={globalStats.conversion} icon={TrendingUp} color="bg-blue-600" />
                            <PerformanceMetric label="Mean Latency" value={globalStats.response} icon={Clock} color="bg-emerald-600" />
                            <PerformanceMetric label="Agent Workforce" value={globalStats.agents} icon={Users2} color="bg-amber-600" />
                        </div>

                        {/* Cluster Table */}
                        <div className="space-y-6">
                            <div className="relative group w-full max-w-xl">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="IDENTIFY CLUSTER SIGNATURE..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white border-2 border-gray-100 rounded-[2rem] py-5 pl-16 pr-6 text-[10px] font-black uppercase tracking-widest w-full focus:border-indigo-500 transition-all outline-none shadow-sm"
                                />
                            </div>

                            <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden overflow-x-auto no-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[1000px]">
                                    <thead>
                                        <tr>
                                            <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Cluster Identity</th>
                                            <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Lead Saturation</th>
                                            <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Qualification Score</th>
                                            <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Conversion Yield</th>
                                            <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Avg Latency</th>
                                            <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Cluster Topology</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredTeams.map((team, i) => (
                                            <motion.tr
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                key={i}
                                                onClick={() => setSelectedTeam(team)}
                                                className="hover:bg-indigo-50/30 transition-all group cursor-pointer"
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-[#111827] text-white flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                                            <Users2 size={20} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{team.team}</span>
                                                            <span className="text-[9px] font-bold text-gray-400 uppercase">Operational Unit</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-black text-gray-600">{team.activeLeads}</span>
                                                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500" style={{ width: '65%' }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="text-xs font-black text-emerald-600">{team.qualified}</span>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="text-xs font-black text-blue-600">{team.converted}</span>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-indigo-400" />
                                                        <span className="text-[10px] font-black text-indigo-700 italic">{team.avgResponse}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-4">
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[10px] font-black text-[#111827] uppercase">{team.counselors} Units</span>
                                                            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Active Status</span>
                                                        </div>
                                                        <motion.div 
                                                            whileHover={{ scale: 1.1 }}
                                                            className="w-10 h-10 shrink-0 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-sm"
                                                        >
                                                            <ChevronRight size={18} />
                                                        </motion.div>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.section>
                ) : (
                    <motion.section
                        key="counselor-matrix"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="space-y-8"
                    >
                        {/* Summary Dashboard for Selected Cluster */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Cluster Payload', val: selectedTeam.activeLeads, color: 'text-indigo-600', icon: Layout },
                                { label: 'Cluster Yield', val: selectedTeam.converted, color: 'text-blue-600', icon: TrendingUp },
                                { label: 'Response Integrity', val: selectedTeam.avgResponse, color: 'text-emerald-600', icon: Zap },
                                { label: 'Operator Shards', val: selectedTeam.counselors, color: 'text-amber-600', icon: Users2 },
                            ].map((s, i) => (
                                <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center gap-4">
                                    <div className={cn("p-4 rounded-[1.5rem]", s.color.replace('text-', 'bg-').concat('/10'), s.color)}>
                                        <s.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                                        <h4 className={cn("text-2xl font-black mt-1", s.color)}>{s.val}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Operator Attribution Table */}
                        <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden overflow-x-auto no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr>
                                        <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Operator Identity</th>
                                        <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Payload Allocation</th>
                                        <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Qualification Rank</th>
                                        <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Enrolment Yield</th>
                                        <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Latency Index</th>
                                    <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {isCounselorsLoading ? (
                                        <tr>
                                            <td colSpan={6} className="px-10 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Activity className="text-indigo-600 animate-spin" size={20} />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Decoding Shard Data...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : counselorBreakdown.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-10 py-12 text-center">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Operator Units Detected in Cluster</span>
                                            </td>
                                        </tr>
                                    ) : counselorBreakdown.map((c, i) => (
                                        <tr key={i} className="hover:bg-indigo-50/30 transition-all group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-full bg-white border-4 border-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm relative">
                                                        <UserCircle2 size={32} strokeWidth={1} />
                                                        <div className={cn(
                                                            "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white",
                                                            c.status === 'Active' ? "bg-emerald-500" : "bg-amber-500"
                                                        )} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{c.name}</span>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <Activity size={10} className={c.status === 'Active' ? "text-emerald-500" : "text-amber-500"} />
                                                            <span className={cn(
                                                                "text-[8px] font-black uppercase tracking-widest",
                                                                c.status === 'Active' ? "text-emerald-600" : "text-amber-600"
                                                            )}>{c.status} Protocol</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="text-xs font-black text-indigo-900">{c.leads} Leads</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="text-xs font-black text-emerald-600">{c.qualified} QLF</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="text-xs font-black text-blue-600">{c.converted} CNV</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: i === 0 ? '90%' : '60%' }}
                                                            className="bg-indigo-600 h-full" 
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-black text-[#111827] italic">{c.responseTime}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button 
                                                    onClick={() => navigate('/analytics')}
                                                    className="px-6 py-3 bg-[#111827] text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-indigo-100/10"
                                                >
                                                    Audit Intelligence
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    )
}

export default TeamOverview



