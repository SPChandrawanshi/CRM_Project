import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Facebook, MousePointer2, Users, ArrowUpRight, TrendingUp, RefreshCcw, Shield, Clock, Power, BrainCircuit } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useAiActions, useAdminActions } from '../hooks/useCrmMutations'
import api from '../services/api'
import useAppStore from '../store/useStore'

const AdminKPICard = ({ title, value, icon: Icon, subValue, color, isRefetching, onClick }) => (
    <motion.div
        onClick={onClick}
        whileHover={{ y: -5, scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("crm-card relative overflow-hidden group border-none shadow-2xl shadow-slate-200/50", onClick && "cursor-pointer")}
    >
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
                <div className={cn(
                    "p-4 rounded-[1.25rem] transition-all duration-500 group-hover:rotate-[10deg] shadow-lg shadow-current/10",
                    color.replace('bg-', 'bg-gradient-to-br from-').replace('text-', 'bg-opacity-20 text-')
                )}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2">
                    {isRefetching && <RefreshCcw size={12} className="text-indigo-500 animate-spin" />}
                    <span className="text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-sm bg-emerald-500/10 text-emerald-600 border border-emerald-100">
                        <TrendingUp size={10} className="inline mr-1" />
                        12%
                    </span>
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
                    {subValue && <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{subValue}</span>}
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Node</p>
                </div>
            </div>
        </div>
        
        {/* Decorative background circle */}
        <div className={cn(
            "absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-1000",
            color.split(' ')[0]
        )} />
    </motion.div>
)

const AdminDashboard = () => {
    const navigate = useNavigate()
    const { publishFlow } = useAiActions()
    const { executeAction } = useAdminActions()

    const { country, statusFilter, dateRange, searchTerm } = useAppStore()
    const { data: resp, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['admin-dashboard', country, statusFilter, dateRange, searchTerm],
        queryFn: async () => {
            const res = await api.get('/dashboard/admin', {
                params: { country, status: statusFilter, dateRange: dateRange.label, search: searchTerm }
            });
            return res.data || res;
        }
    })

    const dashboard = resp || {
        connectedWhatsapp: 0,
        facebookPages: 0,
        websiteLeads: 0,
        routingPreview: [],
        aiStatus: { enabled: false, lastUpdated: 'N/A' }
    }

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="h-16 w-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-indigo-600">G</div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Initializing Terminal...</p>
            </div>
        )
    }

    const kpis = [
        { title: 'Global WhatsApp Nodes', value: dashboard.connectedWhatsapp, subValue: 'Active', icon: Phone, color: 'bg-emerald-50 text-emerald-600', onClick: () => navigate('/admin/channels') },
        { title: 'Social Distribution', value: dashboard.facebookPages, subValue: 'Connected', icon: Facebook, color: 'bg-blue-50 text-blue-600', onClick: () => navigate('/admin/channels') },
        { title: 'Network Lead Influx', value: dashboard.websiteLeads, subValue: 'Total', icon: MousePointer2, color: 'bg-indigo-50 text-indigo-600', onClick: () => navigate('/leads') },
    ]

    return (
        <div className="space-y-10 pb-20 max-w-7xl w-full min-w-0 mx-auto px-4 sm:px-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Master Operations</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Admin Console</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 max-w-xl">Centralized node management and autonomous routing architecture synchronization.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                    <button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="h-12 md:h-14 w-full sm:w-14 bg-white border border-slate-200 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all active:scale-95 group shrink-0"
                    >
                        <RefreshCcw size={18} className={cn("transition-transform duration-700", isRefetching ? "animate-spin text-indigo-500" : "group-hover:rotate-180")} />
                        <span className="sm:hidden ml-2 text-[10px] font-black uppercase tracking-widest">Refresh</span>
                    </button>
                    <button 
                        onClick={() => executeAction.mutate('deploy_master_command')}
                        disabled={executeAction.isPending}
                        className="h-12 md:h-14 bg-[#020617] text-white px-6 md:px-10 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3 md:gap-4 ring-1 ring-slate-800 flex-1"
                    >
                        {executeAction.isPending && executeAction.variables === 'deploy_master_command' ? (
                            <RefreshCcw size={16} className="animate-spin" />
                        ) : (
                            <ArrowUpRight className="h-4 w-4" />
                        )}
                        <span>{executeAction.isPending && executeAction.variables === 'deploy_master_command' ? 'Deploying...' : 'Deploy Command'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {kpis.map((kpi, index) => (
                    <AdminKPICard key={index} {...kpi} isRefetching={isRefetching} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Routing Preview Table */}
                <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col w-full min-w-0">
                    <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/30">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="h-8 w-8 md:h-10 md:w-10 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center text-indigo-500 shrink-0">
                                <Shield size={16} md:size={18} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 text-[10px] md:text-xs uppercase tracking-[0.2em] leading-tight">Matrix Distribution</h3>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest leading-none">Autonomous assignment protocol</p>
                            </div>
                        </div>
                        <span className="badge badge-info bg-indigo-500/10 border-none text-indigo-600 self-start sm:self-auto shrink-0">LIVE FEED</span>
                    </div>
                    <div className="overflow-x-auto no-scrollbar w-full max-w-full">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 md:px-8 py-4 md:py-5 min-w-[150px]">Territory</th>
                                    <th className="px-6 md:px-8 py-4 md:py-5 min-w-[150px]">Core Target</th>
                                    <th className="px-6 md:px-8 py-4 md:py-5 min-w-[120px]">Mechanism</th>
                                    <th className="px-6 md:px-8 py-4 md:py-5">State</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {dashboard.routingPreview.map((rule, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/30 transition-all group">
                                        <td className="px-6 md:px-8 py-6 md:py-8">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors shadow-inner shrink-0" />
                                                <span className="font-black text-[10px] md:text-xs text-slate-900 uppercase tracking-tight leading-none truncate max-w-[100px] sm:max-w-none">{rule.country}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-8 py-6 md:py-8">
                                            <div className="flex flex-col gap-1 min-w-[100px]">
                                                <span className="text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none truncate">{rule.team}</span>
                                                <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none truncate">{rule.counselor}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-8 py-6 md:py-8">
                                            <span className="text-[8px] md:text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-500/10 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-indigo-100/50 whitespace-nowrap">
                                                {rule.type}
                                            </span>
                                        </td>
                                        <td className="px-6 md:px-8 py-6 md:py-8">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className={cn("h-1.5 w-1.5 md:h-2 md:w-2 rounded-full shrink-0", rule.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300')} />
                                                <span className={cn("text-[8px] md:text-[9px] font-black uppercase tracking-widest leading-none whitespace-nowrap", rule.status === 'Active' ? 'text-emerald-600' : 'text-slate-400')}>
                                                    {rule.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AI Bot Status Card */}
                <div className="lg:col-span-4 space-y-8">
                    <motion.div
                        className="bg-[#020617] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-800/50"
                    >
                        <div className="relative z-10">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-6">
                                <div className="h-12 w-12 md:h-14 md:w-14 bg-indigo-500/10 rounded-2xl backdrop-blur-md border border-indigo-500/20 flex items-center justify-center shrink-0">
                                    <BrainCircuit size={24} md:size={28} className="text-indigo-400" />
                                </div>
                                <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">System Pulse</span>
                                        <div className={cn("h-1.5 w-1.5 md:h-2 md:w-2 rounded-full", dashboard.aiStatus.enabled ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse" : "bg-rose-400")} />
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] text-indigo-400 animate-pulse">{dashboard.aiStatus.enabled ? 'NEURAL ACTIVE' : 'SYSTEM IDLE'}</span>
                                </div>
                            </div>

                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 md:mb-3 leading-tight text-white/90">Artificial<br />Intelligence</h3>
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-500 leading-relaxed mb-8 md:mb-10 uppercase tracking-[0.2em] max-w-[200px] sm:max-w-none">Autonomous lead validation and qualification layer v4.2</p>

                            <div className="p-4 md:p-6 bg-slate-900/50 rounded-2xl border border-slate-800/50 mb-6 md:mb-8 backdrop-blur-md">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-[#020617] rounded-xl flex items-center justify-center text-indigo-400 border border-slate-800 shadow-xl">
                                            <Power size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-widest text-white">Master Override</span>
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">Core AI Control</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => publishFlow.mutate({ enabled: !dashboard.aiStatus.enabled })}
                                        className={cn(
                                            "relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-500 ease-in-out ring-2 ring-slate-800",
                                            dashboard.aiStatus.enabled ? "bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]" : "bg-slate-800"
                                        )}
                                    >
                                        <motion.span 
                                            animate={{ x: dashboard.aiStatus.enabled ? 32 : 4 }}
                                            className="inline-block h-5 w-5 rounded-full bg-white shadow-lg" 
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-[10px] text-slate-600 font-black uppercase tracking-[0.15em]">
                                <Clock size={12} className="text-slate-700" />
                                <span>Last Synchronization: {dashboard.aiStatus.lastUpdated}</span>
                            </div>
                        </div>
                        <div className="absolute -top-10 -right-10 p-20 opacity-10 pointer-events-none text-indigo-500">
                            <RefreshCcw size={240} className="animate-[spin_20s_linear_infinite]" />
                        </div>
                    </motion.div>

                    <div className="crm-card !p-10 border-slate-200/40">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-2 w-2 rounded-full bg-slate-900" />
                            <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.25em]">Maintenance Matrices</h4>
                        </div>
                        <div className="space-y-4">
                            {[
                                { id: 'cache', label: 'Force Cache Sync', icon: TrendingUp },
                                { id: 'logs', label: 'Export Operations Log', icon: MousePointer2 },
                                { id: 'health', label: 'Diagnostic Routine', icon: Shield }
                            ].map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => executeAction.mutate(action.id)}
                                    disabled={executeAction.isPending}
                                    className="w-full flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all group group"
                                >
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                                        {executeAction.isPending && executeAction.variables === action.id ? 'Routine Active...' : action.label}
                                    </span>
                                    {executeAction.isPending && executeAction.variables === action.id ? (
                                        <RefreshCcw size={14} className="animate-spin text-indigo-600" />
                                    ) : (
                                        <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard


