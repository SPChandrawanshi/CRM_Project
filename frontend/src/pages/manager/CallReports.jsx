import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Phone,
    Download,
    Search,
    Filter,
    ChevronRight,
    Clock,
    User,
    Globe,
    Calendar,
    X,
    MessageSquare,
    RefreshCcw,
    CheckCircle,
    Activity,
    TrendingUp,
    Shield,
    Zap,
    Play
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useManagerActions } from '../../hooks/useManagerActions'

const TelemetryCard = ({ label, value, icon: Icon, trend, color }) => (
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
                {trend && (
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                        +{trend}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <h3 className="text-3xl font-black text-[#111827] tracking-tighter mt-1">{value}</h3>
            </div>
        </div>
    </motion.div>
)

const CallReports = () => {
    const managerActions = useManagerActions()
    const { data: calls, isLoading } = managerActions.useCallReports()
    const exportCalls = managerActions.exportCsv
    const refreshCalls = managerActions.refreshData

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCall, setSelectedCall] = useState(null)

    const callLogs = useMemo(() => calls?.data || [], [calls])
    
    const stats = useMemo(() => {
        if (!callLogs.length) return { total: 0, avgDuration: '0s', conversion: '0%' }
        const converted = callLogs.filter(c => c.outcome === 'Converted').length
        const totalDuration = callLogs.reduce((acc, c) => acc + (parseInt(c.duration) || 0), 0)
        return {
            total: callLogs.length,
            avgDuration: `${Math.round(totalDuration / callLogs.length || 0)}s`,
            conversion: `${Math.round((converted / callLogs.length) * 100)}%`
        }
    }, [callLogs])

    const filteredCalls = callLogs.filter(c =>
        c.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.counselor.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) return (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-50 rounded-full animate-pulse" />
                <Activity className="absolute inset-0 m-auto text-indigo-600 animate-spin" size={24} />
            </div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Decoding Telemetry...</p>
        </div>
    )

    return (
        <div className="space-y-8 pb-12">
            {/* Header Intelligence */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded-md">Live Terminal</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-black text-[#111827] uppercase tracking-tighter leading-none">
                        Call <span className="text-indigo-600">Protocol</span> Reports
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Detailed telephony logs and outcome attribution hierarchy</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-white border border-gray-100 rounded-3xl px-6 py-4 flex items-center gap-8 shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Active Shards</span>
                            <span className="text-sm font-black text-[#111827]">0x7FF...2D</span>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Security Level</span>
                            <div className="flex items-center gap-1">
                                <Shield size={10} className="text-indigo-600" />
                                <span className="text-sm font-black text-[#111827]">L3-ADV</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => refreshCalls.mutate('calls')}
                        className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 shadow-sm transition-all active:scale-95 group"
                    >
                        <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                    <button
                        onClick={() => exportCalls.mutate('calls')}
                        disabled={exportCalls.isPending}
                        className="bg-[#111827] text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center gap-3 shadow-2xl shadow-indigo-100/20 active:scale-95"
                    >
                        {exportCalls.isPending ? <RefreshCcw size={14} className="animate-spin" /> : <Download size={14} />}
                        Export Matrix
                    </button>
                </div>
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TelemetryCard label="Total Call Protocol Sessions" value={stats.total} icon={Phone} trend={12} color="bg-indigo-600" />
                <TelemetryCard label="Avg Response Velocity" value={stats.avgDuration} icon={Clock} trend={5} color="bg-emerald-600" />
                <TelemetryCard label="Conversion Efficiency" value={stats.conversion} icon={TrendingUp} trend={18} color="bg-blue-600" />
            </div>

            {/* Intelligence Table Area */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative group w-full max-w-xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH BY LEAD IDENTITY OR AGENT SIGNATURE..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border-2 border-gray-100 rounded-[2rem] py-5 pl-16 pr-6 text-[10px] font-black uppercase tracking-widest w-full focus:border-indigo-500 transition-all outline-none shadow-sm"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr>
                                <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Counselor Signature</th>
                                <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Lead Identity</th>
                                <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Geographic Shard</th>
                                <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Protocol Duration</th>
                                <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Outcome Status</th>
                                <th className="px-10 py-8 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCalls.map((call, i) => (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={i}
                                    onClick={() => setSelectedCall(call)}
                                    className="hover:bg-indigo-50/30 transition-all group cursor-pointer"
                                >
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-100">
                                                {call.counselor.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{call.counselor}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">System Agent</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <span className="text-xs font-black text-gray-600 uppercase tracking-tight">{call.lead}</span>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-indigo-400" />
                                            <span className="text-[10px] font-black text-gray-600 uppercase">{call.country}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <Clock size={12} className="text-gray-400" />
                                                <span className="text-[10px] font-black text-[#111827] italic">{call.duration}</span>
                                            </div>
                                            <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (parseInt(call.duration) / 600) * 100)}%` }}
                                                    className="h-full bg-indigo-600"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                            call.outcome === 'Converted' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                call.outcome === 'Interested' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    "bg-amber-50 text-amber-600 border-amber-100"
                                        )}>
                                            {call.outcome.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <motion.div 
                                            whileHover={{ x: 5 }}
                                            className="inline-flex w-10 h-10 shrink-0 rounded-2xl bg-white border border-gray-100 items-center justify-center text-indigo-600 shadow-sm transition-all group-hover:border-indigo-200"
                                        >
                                            <ChevronRight size={18} />
                                        </motion.div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Protocol Detail Terminal */}
            <AnimatePresence>
                {selectedCall && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCall(null)}
                            className="absolute inset-0 bg-[#0B0F1A]/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="bg-white rounded-[3.5rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl border border-gray-800/10 mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar"
                        >
                            <div className="p-10 space-y-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-200">
                                            <Zap size={32} className="fill-current" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Protocol Detail</h3>
                                                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded uppercase">Encrypted</span>
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol ID: INT-CL-{selectedCall.id}-X</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCall(null)}
                                        className="p-4 bg-gray-50 text-gray-400 hover:text-rose-500 rounded-2xl transition-all active:scale-90"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operator Attribution</p>
                                        <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
                                            <User size={20} className="text-indigo-600" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-[#111827] uppercase">{selectedCall.counselor}</span>
                                                <span className="text-[8px] font-bold text-indigo-500 uppercase">Verification Passed</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lead Identification</p>
                                        <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
                                            <MessageSquare size={20} className="text-indigo-600" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-[#111827] uppercase">{selectedCall.lead}</span>
                                                <span className="text-[8px] font-bold text-gray-400 uppercase">Primary Shard: {selectedCall.country}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Telemetry Metrics</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'Time Matrix', val: selectedCall.date, icon: Calendar, color: 'text-blue-600' },
                                            { label: 'Pulse Duration', val: selectedCall.duration, icon: Clock, color: 'text-indigo-600' },
                                            { label: 'Protocol Status', val: selectedCall.outcome.replace('_', ' '), icon: CheckCircle, color: 'text-emerald-600' },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2 transition-all hover:border-indigo-100 hover:shadow-md cursor-pointer active:scale-95 group/stat">
                                                <item.icon size={18} className={cn(item.color, "group-hover/stat:scale-110 transition-transform")} />
                                                <p className="text-[8px] font-black text-gray-400 uppercase mt-1">{item.label}</p>
                                                <p className="text-xs font-black text-[#111827] uppercase tracking-tight">{item.val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transcription Stream</p>
                                        <button className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase hover:underline">
                                            <Play size={10} className="fill-current" /> Play Audio
                                        </button>
                                    </div>
                                    <div className="p-8 bg-indigo-50/50 border-2 border-dashed border-indigo-100/50 rounded-[2.5rem] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4">
                                            <Zap size={24} className="text-indigo-200 opacity-20" />
                                        </div>
                                        <p className="text-xs font-bold text-indigo-900 leading-relaxed italic relative z-10">
                                            "System Analysis indicates high intent in Q1 Enrollment. Lead requested detailed stratification of payment protocols and visa attribution. Response velocity suggests immediate follow-up is warranted."
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => exportCalls.mutate(`intelligence_${selectedCall.id}`)}
                                    disabled={exportCalls.isPending}
                                    className="w-full bg-[#111827] text-white py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-black transition-all shadow-2xl shadow-indigo-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {exportCalls.isPending ? <RefreshCcw size={16} className="animate-spin" /> : <Download size={16} />}
                                    Download Intelligence Report
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CallReports



