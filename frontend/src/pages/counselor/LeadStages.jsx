import React, { useState, useMemo } from 'react'
import { Search, Loader, Filter, CheckCircle2, ChevronRight, Activity, ArrowRight, Save, Plus, Clock, MessageSquare, XCircle, RefreshCcw, FileEdit, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useCounselorActions } from '../../hooks/useCrmMutations'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table'

const LeadStages = () => {
    const navigate = useNavigate()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const { updateStage, addLead } = useCounselorActions()
    const [sorting, setSorting] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [selectedStoryLead, setSelectedStoryLead] = useState(null)

    const { data: resp, isLoading } = useQuery({
        queryKey: ['leads-stages'],
        queryFn: async () => {
            const res = await api.get('/leads');
            const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
            return data;
        }
    })
    const leads = resp || []

    const { data: storyData, isLoading: loadingStory } = useQuery({
        queryKey: ['lead-story', selectedStoryLead?.id],
        queryFn: async () => {
            const res = await api.get(`/counselor/leads/${selectedStoryLead.id}/story`);
            return Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        },
        enabled: !!selectedStoryLead
    })

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: () => <span className="uppercase tracking-[0.2em] text-[10px]">Lead Identity</span>,
            cell: ({ row }) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-xs text-indigo-600 shadow-sm group-hover:scale-110 transition-all">
                        {row.original.name.charAt(0)}
                    </div>
                    <div>
                        <div className="font-black text-slate-900 text-xs uppercase tracking-tight">{row.original.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{row.original.country}</div>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'stage',
            header: () => <span className="uppercase tracking-[0.2em] text-[10px]">Current Status</span>,
            cell: ({ row }) => (
                <select 
                    value={row.original.stage}
                    onChange={(e) => updateStage.mutate({ leadId: row.original.id, stage: e.target.value })}
                    className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border appearance-none outline-none cursor-pointer transition-all",
                        row.original.stage === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        row.original.stage === 'Converted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        row.original.stage === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        row.original.stage === 'Lost' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                    )}
                >
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Pending</option>
                    <option>Qualified</option>
                    <option>Converted</option>
                    <option>Lost</option>
                </select>
            )
        },
        {
            accessorKey: 'updatedAt',
            header: () => <span className="uppercase tracking-[0.2em] text-[10px]">Last Progression</span>,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock className="h-3 w-3" />
                    {getValue() ? new Date(getValue()).toLocaleDateString() : 'Awaiting Logic'}
                </div>
            )
        },
        {
            id: 'actions',
            header: () => <div className="text-right uppercase tracking-[0.2em] text-[10px]">Operations</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-2">
                    <button 
                        onClick={() => setSelectedStoryLead(row.original)}
                        className="h-8 w-8 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all active:scale-90"
                        title="View Story"
                    >
                        <Activity size={14} />
                    </button>
                    <button 
                        onClick={() => navigate('/inbox')}
                        className="h-8 w-8 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/10 transition-all active:scale-90"
                        title="Communicate"
                    >
                        <MessageSquare size={14} />
                    </button>
                </div>
            )
        }
    ], [updateStage.isPending])

    const table = useReactTable({
        data: leads,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    if (isLoading) return (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Lifecycle Data...</p>
        </div>
    )

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Operational Pipeline</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Lead Stages</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 max-w-xl">
                        Monitor and execute transitions across the entire lead lifecycle. Use <span className="text-indigo-600 font-black">Story View</span> for deep historical context.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-14 bg-[#020617] text-white px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-900/20 active:scale-95 flex items-center gap-4 ring-1 ring-slate-800"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Manual Node</span>
                    </button>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Universal Lifecycle Search..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 text-xs font-black uppercase tracking-widest transition-all shadow-inner"
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 font-black text-[9px] uppercase tracking-[0.2em] transition-all group">
                            <Filter className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                            <span>Stage Filters</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <React.Fragment key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} className="px-8 py-6 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode='popLayout'>
                                {table.getRowModel().rows.map((row, index) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.02 }}
                                        key={row.id}
                                        className="group hover:bg-slate-50/50 transition-all"
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-8 py-7 transition-all">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Lead Story Modal */}
            <AnimatePresence>
                {selectedStoryLead && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] mx-2 sm:mx-auto"
                        >
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                        <Activity className="text-indigo-600" /> Lead Chronicles
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Lifecycle progression for <span className="text-indigo-600">{selectedStoryLead.name}</span></p>
                                </div>
                                <button onClick={() => setSelectedStoryLead(null)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                                    <XCircle size={20} className="text-slate-300 hover:text-rose-500" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto no-scrollbar flex-1">
                                {loadingStory ? (
                                    <div className="h-64 flex flex-col items-center justify-center gap-4 text-indigo-500 opacity-50">
                                        <RefreshCcw className="animate-spin" size={32} />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Recalling memory records...</p>
                                    </div>
                                ) : !storyData || storyData.length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-300">
                                        <Activity size={48} className="opacity-20" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Primitive node. No historical log identified.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-12 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                                        {storyData.map((item, idx) => (
                                            <motion.div 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                key={idx} 
                                                className="relative pl-12"
                                            >
                                                <div className={cn(
                                                    "absolute left-0 top-0 h-6 w-6 rounded-lg flex items-center justify-center shadow-sm z-10 border",
                                                    item.type === 'Activity' ? 'bg-indigo-500 text-white border-indigo-400' :
                                                    item.type === 'Note' ? 'bg-amber-500 text-white border-amber-400' :
                                                    'bg-emerald-500 text-white border-emerald-400'
                                                )}>
                                                    {item.type === 'Activity' ? <Activity size={10} /> :
                                                     item.type === 'Note' ? <FileEdit size={10} /> :
                                                     <Phone size={10} />}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.action}</h4>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(item.timestamp).toLocaleString()}</span>
                                                    </div>
                                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                                        <p className="text-[11px] font-medium text-slate-600 leading-relaxed uppercase tracking-tighter">{item.details}</p>
                                                        {item.type === 'Activity' && <div className="mt-2 text-[8px] font-black text-indigo-400 uppercase tracking-widest italic">{item.action} Execution</div>}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-center">
                                <button 
                                    onClick={() => setSelectedStoryLead(null)}
                                    className="px-8 py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                                >
                                    Egress Chronicles
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Lead Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar"
                        >
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Provision Manual Node</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Direct lead injection into operations</p>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                                    <XCircle size={20} className="text-slate-300" />
                                </button>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                const formData = Object.fromEntries(new FormData(e.target))
                                addLead.mutate(formData, {
                                    onSuccess: () => setIsAddModalOpen(false)
                                })
                            }} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Lead Identity</label>
                                        <input name="name" required placeholder="Full Name" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Channel Address</label>
                                        <input name="email" type="email" required placeholder="email@address.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all shadow-inner" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Territory</label>
                                        <input 
                                            name="country" 
                                            required 
                                            placeholder="Country" 
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all shadow-inner" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Lead Stage</label>
                                        <select 
                                            name="stage" 
                                            defaultValue="New"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all shadow-inner appearance-none"
                                        >
                                            {['New', 'Contacted', 'Qualified', 'Converted', 'Lost'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Abort</button>
                                    <button 
                                        type="submit" 
                                        disabled={addLead.isPending}
                                        className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
                                    >
                                        {addLead.isPending && <RefreshCcw size={14} className="animate-spin" />}
                                        Establish Node
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default LeadStages
