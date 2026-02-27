import React, { useState } from 'react'
import { Plus, Mail, Shield, UserPlus, MoreVertical, Search, Filter, ShieldCheck, UserX, UserCheck, Key, Globe, Layout, Lock, X, Edit2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useUserActions } from '../hooks/useCrmMutations'
import { motion, AnimatePresence } from 'framer-motion'
import apiClient from '../lib/apiClient'

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRole, setSelectedRole] = useState('All')
    const [showAddForm, setShowAddForm] = useState(false)
    const { toggleStatus, resetPassword, addUser, updateUser } = useUserActions()

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await apiClient.get('/users');
            return Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
        }
    })

    const roles = ['All', 'Manager', 'Team Leader', 'Counselor', 'Customer Support']

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = selectedRole === 'All' || user.role === selectedRole
        return matchesSearch && matchesRole
    })

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Identity Governance</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Personnel</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 max-w-xl">Comprehensive node administration and authority designation protocols.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="h-14 px-10 bg-[#020617] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-4 active:scale-95 ring-1 ring-slate-800"
                >
                    <UserPlus className="h-4 w-4" />
                    <span>Provision Node</span>
                </button>
            </div>

            <div className="crm-card !p-6 flex flex-col md:flex-row gap-8 items-center border-none shadow-2xl shadow-slate-200/50">
                <div className="relative flex-1 w-full group">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Scan identities by name, team, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 transition-all placeholder:text-slate-300 shadow-inner"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1">
                    {roles.map(role => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={cn(
                                "px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap active:scale-95",
                                selectedRole === role
                                    ? "bg-[#020617] text-white border-slate-800 shadow-xl shadow-slate-900/10 ring-1 ring-slate-800"
                                    : "bg-white text-slate-400 border-slate-100 hover:border-indigo-100 hover:text-indigo-600 shadow-sm"
                            )}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>


            <div className="crm-card !p-0 overflow-hidden flex flex-col min-h-[500px]">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Identity</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Operational Role</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Territory / Team</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Access State</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Governance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-50 last:border-0">
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-all duration-300">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 uppercase tracking-tight text-sm mb-0.5">{user.name}</div>
                                                <div className="text-[10px] text-slate-400 font-black flex items-center gap-2 uppercase tracking-widest">
                                                    <Mail size={12} className="text-indigo-400" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-indigo-600" />
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Globe size={12} className="text-slate-300" />
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{user.country}</span>
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{user.team}</div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(var(--color-pulse),0.5)]", 
                                                user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300')} />
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border transition-all",
                                                user.status === 'Active' 
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                                                    : 'bg-slate-50 text-slate-400 border-slate-100'
                                            )}>
                                                {user.status === 'Active' ? 'Operational' : 'Restricted'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => resetPassword.mutate(user.email)}
                                                className="h-10 w-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-amber-600 transition-all shadow-sm active:scale-95"
                                                title="Reset Credentials"
                                            >
                                                <Key size={14} />
                                            </button>
                                            <button
                                                 onClick={() => toggleStatus.mutate(user.id)}
                                                 disabled={toggleStatus.isPending && toggleStatus.variables === user.id}
                                                 className={cn(
                                                     "h-10 w-10 flex items-center justify-center rounded-xl transition-all shadow-sm active:scale-95 border",
                                                     user.status === 'Active' ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white',
                                                     toggleStatus.isPending && toggleStatus.variables === user.id && "opacity-50 animate-pulse"
                                                 )}
                                                 title={user.status === 'Active' ? 'Deactivate Node' : 'Initialize Node'}
                                             >
                                                 {toggleStatus.isPending && toggleStatus.variables === user.id ? (
                                                     <RefreshCcw size={14} className="animate-spin" />
                                                 ) : (
                                                     user.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />
                                                 )}
                                             </button>
                                            <button className="h-10 w-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm active:scale-95">
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">Provision Identity</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Configuring new organizational access</p>
                                </div>
                            </div>
                            <form onSubmit={(e) => { 
                                e.preventDefault(); 
                                const formData = Object.fromEntries(new FormData(e.target));
                                addUser.mutate(formData); 
                                setShowAddForm(false); 
                            }} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Full Legal Name</label>
                                        <input name="name" required placeholder="JASON BOURNE" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Corporate Email</label>
                                        <input name="email" type="email" required placeholder="J.BOURNE@POVA.IO" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Strategic Role</label>
                                        <select name="role" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                            {roles.filter(r => r !== 'All').map(role => <option key={role}>{role}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Node Territory</label>
                                        <select name="country" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                            <option>India</option>
                                            <option>USA</option>
                                            <option>UK</option>
                                            <option>Global</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Operation Team</label>
                                        <input name="team" required placeholder="ADMISSIONS SOUTH" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Initial Password</label>
                                        <input name="password" type="password" required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">Abort</button>
                                    <button type="submit" className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow">Establish Access</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default UserManagement
