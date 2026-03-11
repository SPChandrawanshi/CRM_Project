import React, { useState } from 'react'
import { Search, Filter, Shield, Calendar, Clock, Monitor, Globe, User, Download, X, ListFilter, ChevronLeft, ChevronRight, Hash, Terminal, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuditActions } from '../../hooks/useCrmMutations'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

const AuditDetailModal = ({ log, isOpen, onClose }) => {
    if (!isOpen || !log) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#0a3d62]/10 text-[#0a3d62] rounded-2xl">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">Audit Log Detail</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">LOG ID: #LOG-{Math.floor(Math.random() * 900000)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"><X size={20} className="text-gray-400" /></button>
                </div>
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Subject Identity</label>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-[#111827] text-white rounded-xl flex items-center justify-center font-black text-xs uppercase tracking-tighter">
                                        {log.user?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <div className="font-black text-xs text-[#111827] uppercase">{log.user}</div>
                                        <div className="text-[9px] text-[#0a3d62] font-bold uppercase tracking-widest">{log.role}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Module Cluster</label>
                                <div className="font-black text-xs text-[#111827] uppercase">{log.module} Protocol</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Execution Sync</label>
                                <div className="flex items-center gap-2 text-xs font-black text-gray-600">
                                    <Calendar size={14} className="text-gray-400" /> {log.time.split(' ')[0]}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-black text-gray-600 mt-1">
                                    <Clock size={14} className="text-gray-400" /> {log.time.split(' ')[1]}
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Execution Status</label>
                                <span className={cn(
                                    "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                                    log.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                )}>
                                    {log.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">Operation Details</label>
                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold text-sm text-gray-700 leading-relaxed shadow-inner">
                            {log.action}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Network Entry</label>
                            <div className="flex items-center gap-2 text-xs font-black text-[#0a3d62]">
                                <Globe size={12} /> {log.ip}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Device Blueprint</label>
                            <div className="flex items-center gap-2 text-xs font-black text-gray-600 truncate">
                                <Monitor size={12} /> {log.device}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-8 bg-gray-50/50 border-t border-gray-100 text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                        <Shield size={10} /> Tamper-proof architectural log verified
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

const AuditLogs = () => {
    const { exportLogs } = useAuditActions();
    const [searchTerm, setSearchTerm] = useState('');
    const [moduleFilter, setModuleFilter] = useState('All Modules');
    const [userFilter, setUserFilter] = useState('All Users');
    const [dateFilter, setDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLog, setSelectedLog] = useState(null);

    const { data: logs = [], isLoading } = useQuery({
        queryKey: ['audit-logs'],
        queryFn: async () => {
            const res = await api.get('/audit/logs');
            const logsData = res.data || [];
            return logsData.map(log => ({
                id: log.id,
                time: log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent',
                user: log.user || 'System',
                role: typeof log.role === 'object' ? (log.role?.name || 'Automated') : (log.role || 'Automated'),
                action: log.action,
                module: log.module,
                ip: log.ip || '0.0.0.0',
                device: log.device || 'Unrecognized',
                status: log.status
            }));
        }
    });

    const logsSource = Array.isArray(logs) ? logs : [];
    const filteredLogs = logsSource.filter(log => {
        const matchesSearch = log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.ip?.includes(searchTerm);
        const matchesModule = moduleFilter === 'All Modules' || log.module === moduleFilter;
        const matchesUser = userFilter === 'All Users' || log.user === userFilter;
        const matchesDate = !dateFilter || log.time?.startsWith(dateFilter);
        return matchesSearch && matchesModule && matchesUser && matchesDate;
    });

    const itemsPerPage = 5;
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0a3d62] uppercase tracking-tight">System Audit Logs</h1>
                    <p className="text-sm font-medium text-[#6B7280]">Real-time synchronization of system actions and events.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => exportLogs.mutate({ moduleFilter, userFilter, searchTerm })}
                        disabled={exportLogs.isPending}
                        className="flex-1 sm:flex-none justify-center bg-[#0a3d62] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 flex items-center gap-3 shadow-[0_4px_12px_rgba(10,61,98,0.3)] transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Download size={18} className={exportLogs.isPending ? "animate-bounce" : ""} />
                        Extract CSV Archive
                    </button>
                    <div className="flex-1 sm:flex-none justify-center px-5 py-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                            <Shield size={16} />
                        </div>
                        <div>
                            <span className="text-sm font-black text-rose-600 tracking-tighter uppercase">3 Blocked</span>
                            <span className="text-[9px] font-black text-rose-400 uppercase block tracking-widest -mt-1 whitespace-nowrap">Incidents Today</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="crm-card min-h-[600px]">
                <div className="p-4 md:p-8 border-b border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gray-50/50">
                    <div className="flex flex-wrap items-center gap-4 flex-1">
                        <div className="relative w-full max-w-sm">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Locate trace trace..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-[#0a3d62]/10 outline-none w-full transition-all"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="flex-1 lg:flex-none px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-[#0a3d62]/10 cursor-pointer min-w-[140px] text-gray-600 shadow-sm"
                            />
                            <div className="flex-1 lg:flex-none relative">
                                <select
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value)}
                                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-[#0a3d62]/10 cursor-pointer appearance-none min-w-[140px] shadow-sm"
                                >
                                    <option>All Users</option>
                                    <option>System</option>
                                    <option>Super_Admin</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                            </div>
                            <div className="flex-1 lg:flex-none relative">
                                <select
                                    value={moduleFilter}
                                    onChange={(e) => setModuleFilter(e.target.value)}
                                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-[#0a3d62]/10 cursor-pointer appearance-none min-w-[130px] shadow-sm"
                                >
                                    <option>All Modules</option>
                                    <option>Inbox</option>
                                    <option>Billing</option>
                                    <option>Auth</option>
                                    <option>Channels</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-4 border-l border-gray-100 pl-6 h-full">
                        <div className="text-right">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Signal Strength</span>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-xs font-black text-[#0a3d62] uppercase">Secure</span>
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="crm-table-container">
                    <table className="w-full text-left border-collapse min-w-[1100px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-4 sm:px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Timestamp</th>
                                <th className="px-4 sm:px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Identity</th>
                                <th className="px-4 sm:px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Action</th>
                                <th className="px-4 sm:px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Scope</th>
                                <th className="px-4 sm:px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Network</th>
                                <th className="px-4 sm:px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Trace</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            <AnimatePresence mode='popLayout'>
                                {paginatedLogs.map((log, i) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        key={i}
                                        onClick={() => setSelectedLog(log)}
                                        className="group hover:bg-gray-50/50 transition-all cursor-pointer"
                                    >
                                        <td className="px-4 sm:px-10 py-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 whitespace-nowrap">
                                                <Calendar size={14} className="text-gray-400 hidden sm:block" />
                                                <div className="font-black text-[10px] sm:text-[11px] text-[#111827] uppercase tracking-tighter">{log.time.split(' ')[0]}</div>
                                                <div className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase tracking-widest opacity-70">{log.time.split(' ')[1] || ''}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-[#111827] text-white rounded-xl flex items-center justify-center font-black text-[10px] shadow-sm shrink-0">
                                                    {log.user?.charAt(0) || 'S'}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-black text-xs text-[#111827] uppercase tracking-tighter truncate">{log.user}</div>
                                                    <div className="text-[9px] text-[#0a3d62] font-black tracking-widest uppercase truncate">{log.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-10 py-6">
                                            <div className="font-bold text-gray-800 text-[10px] sm:text-xs leading-relaxed max-w-[200px] sm:max-w-sm border border-gray-100 bg-white p-2 sm:p-3 rounded-xl shadow-sm italic">
                                                {log.action}
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-10 py-6">
                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 whitespace-nowrap">
                                                <Hash size={10} className="text-indigo-400" />
                                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-tight">{log.module}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-10 py-6">
                                            <div className="flex justify-end items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 whitespace-nowrap">
                                                <Globe size={10} className="text-gray-400 hidden sm:block" />
                                                <span className="text-[9px] font-black text-[#0a3d62] tracking-tighter">{log.ip}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-10 py-6 text-right">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedLog(log);
                                                }}
                                                className="p-1.5 sm:p-2 hover:bg-white rounded-xl transition-all shadow-sm group/btn"
                                            >
                                                <Monitor size={16} className="text-gray-400 group-hover/btn:text-indigo-600 transition-colors" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination Operational Plane */}
                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row items-center justify-between mt-auto gap-4">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center md:text-left">
                        Tracing <span className="text-[#0a3d62]">{filteredLogs.length}</span> security events in cluster
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#0a3d62] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-[#0a3d62]/10 shrink-0"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        <div className="h-12 px-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center justify-center min-w-[80px]">
                            <span className="text-[11px] font-black text-[#111827] uppercase tracking-widest whitespace-nowrap">
                                {currentPage} <span className="text-gray-300 mx-1">/</span> {totalPages || 1}
                            </span>
                        </div>

                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#0a3d62] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-[#0a3d62]/10 shrink-0"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedLog && (
                    <AuditDetailModal log={selectedLog} isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuditLogs;



