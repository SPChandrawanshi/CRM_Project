import React, { useMemo, useState } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel
} from '@tanstack/react-table'
import {
    MoreVertical,
    Filter,
    Download,
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Trash2,
    UserPlus,
    CheckCircle2,
    XCircle,
    RefreshCcw
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useLeadActions } from '../hooks/useCrmMutations'
import { motion, AnimatePresence } from 'framer-motion'
import apiClient from '../lib/apiClient'
import useAppStore from '../store/useStore'

const Leads = () => {
    const { updateStage, deleteLead, exportLeads, addLead, assignLead } = useLeadActions()
    const [sorting, setSorting] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [selectedLead, setSelectedLead] = useState(null)



    const { country, statusFilter, dateRange, searchTerm } = useAppStore()
    const { data: resp, isLoading } = useQuery({
        queryKey: ['leads', country, statusFilter, dateRange, searchTerm],
        queryFn: () => apiClient.get('/leads', {
            params: { country, status: statusFilter, dateRange: dateRange.label, search: searchTerm }
        })
    })

    const { data: usersResp } = useQuery({
        queryKey: ['users-assignable'],
        queryFn: () => apiClient.get('/users').then(res => res.data.filter(u => ['COUNSELOR', 'TEAM_LEADER', 'MANAGER'].includes(u.role)))
    })

    const leads = resp?.data || []
    const users = usersResp || []


    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <div
                    className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors uppercase tracking-[0.1em]"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Lead Identity
                    <ArrowUpDown className="h-3 w-3" />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-[14px] bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400 shadow-sm group-hover:scale-110 group-hover:bg-white group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all duration-500">
                        {row.original.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <div className="font-black text-slate-900 text-xs uppercase tracking-tight leading-none mb-1">{row.original.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{row.original.email}</div>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'country',
            header: () => <span className="uppercase tracking-[0.1em]">Territory</span>,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{getValue()}</span>
                </div>
            )
        },
        {
            accessorKey: 'status',
            header: () => <span className="uppercase tracking-[0.1em]">State</span>,
            cell: ({ row }) => {
                const statusConfig = {
                    'New': 'bg-indigo-500/10 border-indigo-100/50 text-indigo-600',
                    'Contacted': 'bg-amber-500/10 border-amber-100/50 text-amber-600',
                    'Qualified': 'bg-emerald-500/10 border-emerald-100/50 text-emerald-600',
                    'Converted': 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20',
                    'Lost': 'bg-rose-500/10 border-rose-100/50 text-rose-600',
                    'Active': 'bg-indigo-500/10 border-indigo-100/50 text-indigo-600',
                    'Pending': 'bg-amber-500/10 border-amber-100/50 text-amber-600'
                }
                const statusStr = row.original.stage || row.original.status || 'New'
                return (
                    <span className={cn(
                        "badge border shrink-0 font-black text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-full", 
                        statusConfig[statusStr] || 'bg-slate-50 border-slate-100 text-slate-400'
                    )}>
                        {statusStr}
                    </span>
                )
            }
        },
        {
            accessorKey: 'source',
            header: () => <span className="uppercase tracking-[0.1em]">Origin</span>,
            cell: ({ getValue }) => (
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{getValue()}</span>
            )
        },
        {
            accessorKey: 'assignedTo',
            header: () => <span className="uppercase tracking-[0.1em]">Custodian</span>,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-black text-slate-500 uppercase">
                        {getValue()?.charAt(0)}
                    </div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{getValue()}</span>
                </div>
            )
        },
        {
            accessorKey: 'createdAt',
            header: () => <span className="uppercase tracking-[0.1em]">Recorded</span>,
            cell: ({ getValue }) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{getValue()}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">System Stamp</span>
                </div>
            )
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={() => updateStage.mutate({ id: row.original.id, stage: 'Converted' })}
                        disabled={updateStage.isPending}
                        className="h-8 w-8 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/10 transition-all active:scale-90"
                        title="Mark as Converted"
                    >
                        <CheckCircle2 size={14} />
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete lead ${row.original.name}?`)) {
                                deleteLead.mutate(row.original.id)
                            }
                        }}
                        disabled={deleteLead.isPending}
                        className="h-8 w-8 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-lg hover:shadow-rose-500/10 transition-all active:scale-90"
                        title="Delete Lead"
                    >
                        <Trash2 size={14} className={deleteLead.isPending ? "animate-pulse" : ""} />
                    </button>
                     <button 
                        onClick={() => {
                            setSelectedLead(row.original)
                            setIsAssignModalOpen(true)
                        }}
                        className="h-8 w-8 flex items-center justify-center bg-[#020617] rounded-xl text-white hover:bg-black transition-all active:scale-90 shadow-lg shadow-slate-900/10" 
                        title="Assign Lead"
                    >
                        <UserPlus size={14} />
                    </button>

                </div>
            )
        }
    ], [updateStage.isPending, deleteLead.isPending])

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

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="h-16 w-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-indigo-600">G</div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Neural Network...</p>
            </div>
        )
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Live Lead Feed</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Intelligence</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 max-w-xl">
                        Total <span className="text-slate-900 font-black">{leads.length}</span> nodes identified in current operational cycle.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => exportLeads.mutate()}
                        disabled={exportLeads.isPending}
                        className="h-14 flex items-center gap-4 bg-white border border-slate-200 text-slate-900 px-8 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                    >
                        <Download className="h-4 w-4 text-slate-400" />
                        <span>Export Data</span>
                    </button>
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
                {/* Search & Utility Bar */}
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Universal Node Search..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 text-xs font-black uppercase tracking-widest transition-all shadow-inner"
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 font-black text-[9px] uppercase tracking-[0.2em] transition-all group">
                            <Filter className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                            <span>Neural Filters</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <React.Fragment key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className="px-8 py-6 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] border-b border-slate-100"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
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
                                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 40,
                                            delay: index * 0.02 
                                        }}
                                        key={row.id}
                                        className="group hover:bg-slate-50/50 transition-all"
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-8 py-8 transition-all">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {table.getRowModel().rows.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                                <Search size={32} />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No nodes found in current coordinate space</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">
                            System Matrix: {table.getFilteredRowModel().rows.length} Nodes Processed
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button
                            disabled={!table.getCanPreviousPage()}
                            onClick={() => table.previousPage()}
                            className="h-12 w-12 flex items-center justify-center border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-400 hover:text-indigo-600 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-slate-200/50 active:scale-90"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        
                        <div className="flex items-center gap-2">
                            {[...Array(table.getPageCount())].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => table.setPageIndex(i)}
                                    className={cn(
                                        "w-10 h-10 rounded-xl text-[10px] font-black transition-all border uppercase tracking-tighter",
                                        table.getState().pagination.pageIndex === i
                                            ? "bg-[#020617] text-white border-[#020617] shadow-xl shadow-slate-900/20 active:scale-90"
                                            : "bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-600"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={!table.getCanNextPage()}
                            onClick={() => table.nextPage()}
                            className="h-12 w-12 flex items-center justify-center border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-400 hover:text-indigo-600 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-slate-200/50 active:scale-90"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Lead Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100"
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
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Lead Identity</label>
                                        <input name="name" required placeholder="Full Name" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Channel Address</label>
                                        <input name="email" type="email" required placeholder="email@address.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all shadow-inner" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Territory</label>
                                        <input name="country" required placeholder="Country" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Operational Team</label>
                                        <input name="team" defaultValue="General" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all shadow-inner" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8">
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

                {/* Assign Lead Modal */}
                {isAssignModalOpen && selectedLead && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
                        >
                            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Custodian Assignment</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manual node distribution</p>
                                </div>
                                <button onClick={() => setIsAssignModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                                    <XCircle size={20} className="text-slate-300" />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                    <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Target Node</div>
                                    <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{selectedLead.name}</div>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Select Custodian</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all shadow-inner"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                assignLead.mutate({ leadId: selectedLead.id, userId: e.target.value }, {
                                                    onSuccess: () => setIsAssignModalOpen(false)
                                                })
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select User...</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-center pt-4">
                                    <button onClick={() => setIsAssignModalOpen(false)} className="px-6 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all">
                                        Abort Operations
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Leads

