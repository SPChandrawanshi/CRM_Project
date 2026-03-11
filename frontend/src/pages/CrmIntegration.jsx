import React, { useState } from 'react'
import {
    Plus,
    Database,
    Globe,
    Trash2,
    Zap,
    ShieldCheck,
    Settings2,
    Link,
    Activity,
    CheckCircle2,
    AlertCircle,
    Share2,
    Cpu,
    ExternalLink,
    RefreshCcw,
    X,
    Server
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useIntegrationActions } from '../hooks/useCrmMutations'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'

const IntegrationCard = React.forwardRef(({ integration, onTest, onDelete }, ref) => (
    <motion.tr
        ref={ref}
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="hover:bg-slate-50/50 transition-all group border-b border-slate-50 last:border-0"
    >
        <td className="px-6 md:px-10 py-7">
            <div className="flex items-center gap-4 md:gap-5">
                <div className={cn(
                    "h-12 w-12 md:h-14 md:w-14 rounded-[1.25rem] md:rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-all duration-300 border border-slate-100",
                    integration.name === 'HubSpot' ? "bg-orange-50 text-orange-600" :
                        integration.name === 'Salesforce' ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"
                )}>
                    {integration.name === 'HubSpot' ? <Database size={20} /> :
                        integration.name === 'Salesforce' ? <Cpu size={20} /> : <Share2 size={20} />}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="font-black text-slate-900 uppercase tracking-tight text-xs md:text-sm mb-0.5 truncate">{integration.name} Node</div>
                    <div className="text-[10px] text-slate-400 font-black flex items-center gap-2 uppercase tracking-widest truncate">
                        <Link size={12} className="text-indigo-400 shrink-0" />
                        <span className="truncate">{integration.url}</span>
                    </div>
                </div>
            </div>
        </td>
        <td className="px-6 md:px-10 py-7">
            <div className="flex items-center gap-2">
                <Server size={14} className="text-slate-400 shrink-0" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] whitespace-nowrap">
                    {integration.name.includes('Webhook') ? 'REST Protocol' : 'SECURE OAUTH'}
                </span>
            </div>
        </td>
        <td className="px-6 md:px-10 py-7">
            <div className="flex items-center gap-3">
                <div className={cn("h-1.5 w-1.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(var(--color-pulse),0.5)]", 
                    integration.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300')} />
                <span className={cn(
                    "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap",
                    integration.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                        : 'bg-slate-50 text-slate-400 border-slate-100'
                )}>
                    {integration.status === 'Active' ? 'Operational' : 'Offline'}
                </span>
            </div>
        </td>
        <td className="px-6 md:px-10 py-7 text-right">
            <div className="flex items-center justify-end gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all lg:translate-x-4 lg:group-hover:translate-x-0">
                <button
                    onClick={() => onTest(integration.id)}
                    className="h-10 w-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-95"
                    title="Test Protocol"
                >
                    <RefreshCcw size={14} />
                </button>
                <button
                    onClick={() => onDelete(integration.id)}
                    className="h-10 w-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm active:scale-95"
                    title="Sever Connection"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </td>
    </motion.tr>
))



const CrmIntegration = () => {
    const [showAddForm, setShowAddForm] = useState(false)
    const { addIntegration, deleteIntegration, testConnection } = useIntegrationActions()

    const { data: resp, isLoading } = useQuery({
        queryKey: ['integrations'],
        queryFn: async () => {
            const res = await api.get('/admin/integrations');
            return res.data || res;
        }
    })

    const integrations = Array.isArray(resp?.data) ? resp.data : (Array.isArray(resp) ? resp : []);

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Master Records</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Ecosystem</h1>
                    <p className="text-xs md:text-sm font-medium text-slate-500 mt-2 max-w-xl">Centralized synchronization hub for external CRM nodes and data flow protocols.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="h-12 md:h-14 px-8 md:px-10 w-full md:w-auto bg-[#020617] text-white rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 active:scale-95 ring-1 ring-slate-800"
                >
                    <Plus size={16} md:size={18} />
                    <span>Establish Hub</span>
                </button>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 md:px-10 py-6 font-black text-slate-400 uppercase tracking-[0.2em] text-[9px] min-w-[200px]">Master Identity</th>
                                        <th className="px-6 md:px-10 py-6 font-black text-slate-400 uppercase tracking-[0.2em] text-[9px]">Protocol</th>
                                        <th className="px-6 md:px-10 py-6 font-black text-slate-400 uppercase tracking-[0.2em] text-[9px]">Sync Status</th>
                                        <th className="px-6 md:px-10 py-6 font-black text-slate-400 uppercase tracking-[0.2em] text-[10px] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 overflow-hidden">
                                    <AnimatePresence mode='popLayout'>
                                        {integrations.map((int) => (
                                            <IntegrationCard
                                                key={int.id}
                                                integration={int}
                                                onTest={testConnection.mutate}
                                                onDelete={deleteIntegration.mutate}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {integrations.length === 0 && !isLoading && (
                            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                                <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100 border-dashed">
                                    <Database size={32} className="text-slate-200" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Zero Active Nodes</h3>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-[#111827] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
                        <div className="relative z-10">
                            <Activity className="text-indigo-400 mb-8 group-hover:scale-110 transition-transform" size={40} />
                            <h3 className="font-black text-lg mb-4 uppercase tracking-tight">Sync Health</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Uptime</span>
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">99.98%</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Latency</span>
                                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">240ms</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Failed Packets</span>
                                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">0.02%</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                            <Cpu size={240} />
                        </div>
                    </div>

                    <div className="crm-card p-10 relative overflow-hidden group">
                        <h3 className="text-[10px] font-black text-gray-400 mb-8 uppercase tracking-[0.2em] border-b border-gray-50 pb-4">
                            Supported Ecosystems
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['HubSpot', 'Salesforce', 'Custom Webhook', 'Zapier', 'Make.com', 'Pipedrive'].map(tech => (
                                <div key={tech} className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{tech}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            POVA-CRM uses standard REST protocols and secure OAuth flows for all external sync operations.
                        </p>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl mx-auto max-h-[85vh] overflow-y-auto no-scrollbar flex flex-col">
                            <div className="p-6 md:p-10 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-[#111827] uppercase tracking-tight">Provision CRM Node</h3>
                                    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Establishing secure data synchronization</p>
                                </div>
                                <button onClick={() => setShowAddForm(false)} className="text-gray-300 hover:text-[#111827] transition-colors bg-white border border-gray-100 p-2 md:p-3 rounded-xl shadow-sm"><X size={20} /></button>
                            </div>
                            <form onSubmit={(e) => { 
                                e.preventDefault(); 
                                const formData = Object.fromEntries(new FormData(e.target));
                                // Cleanup type if needed (HubSpot (REST OAuth) -> HubSpot)
                                if (formData.type && formData.type.includes(' ')) {
                                    formData.type = formData.type.split(' ')[0];
                                }
                                addIntegration.mutate(formData); 
                                setShowAddForm(false); 
                            }} className="p-6 md:p-10 space-y-6 md:space-y-8 overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Integration Identity</label>
                                    <input name="name" required placeholder="HUBSPOT MAIN PRODUCTION" className="w-full bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-xs md:text-sm font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all placeholder:text-gray-200" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">CRM Logic Provider</label>
                                    <select name="type" className="w-full bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-xs md:text-sm font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                        <option>HubSpot (REST OAuth)</option>
                                        <option>Salesforce (Lightning API)</option>
                                        <option>Custom Webhook (JSON)</option>
                                        <option>Pipedrive API</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Master Endpoint / Client Domain</label>
                                    <div className="relative">
                                        <Link size={16} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                                        <input name="url" required placeholder="https://api.hubapi.com/v1" className="w-full bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl pl-12 md:pl-14 pr-4 md:pr-6 py-4 md:py-5 text-xs md:text-sm font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all placeholder:text-gray-200" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Access Token / Private Key</label>
                                    <input name="key" type="password" required className="w-full bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-xs md:text-sm font-black tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6 shrink-0">
                                    <button type="button" onClick={() => setShowAddForm(false)} className="px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest text-gray-400 border border-gray-200 hover:bg-gray-50 transition-all">Abort Protocol</button>
                                    <button type="submit" className="px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Establish Link</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CrmIntegration


