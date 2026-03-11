import React, { useState } from 'react'
import { Plus, Mail, Shield, UserPlus, MoreVertical, Search, Filter, ShieldCheck, UserX, UserCheck, Key, Globe, Layout, Lock, X, Edit2, RefreshCcw } from 'lucide-react'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useUserActions } from '../hooks/useCrmMutations'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRole, setSelectedRole] = useState('All')
    const [showAddForm, setShowAddForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editUserData, setEditUserData] = useState(null)
    const { toggleStatus, resetPassword, addUser, updateUser } = useUserActions()

    const openCreateModal = () => {
        setIsEditing(false)
        setEditUserData(null)
        setShowAddForm(true)
    }

    const openEditModal = (user) => {
        setIsEditing(true)
        setEditUserData(user)
        setShowAddForm(true)
    }

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await api.get('/users');
            const arr = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
            // Normalize role: backend returns role as object {id, name, description}
            return arr.map(user => ({
                ...user,
                role: typeof user.role === 'object' ? (user.role?.name || 'N/A').toUpperCase() : (user.role || 'N/A').toUpperCase(),
                team: user.team || user.department || 'Staff',
                country: user.country || 'Global',
                status: user.status || (user.isActive ? 'Active' : 'Inactive'),
            }));
        }
    })

    const roles = ['All', 'Manager', 'Team Leader', 'Counselor', 'Customer Support']

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = selectedRole === 'All' || user.role === selectedRole.toUpperCase() || (selectedRole === 'Customer Support' && user.role === 'SUPPORT')
        return matchesSearch && matchesRole
    })

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
                <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <span className="text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Identity Governance</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Personnel</h1>
                    <p className="text-[10px] md:text-sm font-medium text-slate-500 mt-2 max-w-xl">Comprehensive node administration and authority designation protocols.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="h-12 md:h-14 px-6 md:px-10 bg-[#020617] text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-2 md:gap-4 active:scale-95 ring-1 ring-slate-800 w-full md:w-auto shrink-0"
                >
                    <UserPlus className="h-4 w-4 shrink-0" />
                    <span className="shrink-0 min-w-max">Provision Node</span>
                </button>
            </div>

            <div className="crm-card !p-4 md:!p-6 flex flex-col md:flex-row gap-4 md:gap-8 items-center border-none shadow-2xl shadow-slate-200/50">
                <div className="relative flex-1 w-full group">
                    <Search size={16} className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Scan identities by name, team, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 transition-all placeholder:text-slate-300 shadow-inner"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1">
                    {roles.map(role => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={cn(
                                "px-4 md:px-6 py-3 md:py-4 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap active:scale-95",
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
                <div className="overflow-x-auto no-scrollbar max-w-full">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-6 md:px-8 py-4 md:py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] min-w-[200px]">Identity</th>
                                <th className="px-6 md:px-8 py-4 md:py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] min-w-[150px]">Operational Role</th>
                                <th className="px-6 md:px-8 py-4 md:py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] min-w-[150px]">Territory / Team</th>
                                <th className="px-6 md:px-8 py-4 md:py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] min-w-[150px]">Access State</th>
                                <th className="px-6 md:px-8 py-4 md:py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Governance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-50 last:border-0">
                                    <td className="px-6 md:px-10 py-5 md:py-7">
                                        <div className="flex items-center gap-3 md:gap-5">
                                            <div className="h-10 w-10 md:h-14 md:w-14 bg-slate-900 rounded-xl md:rounded-[1.5rem] flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-all duration-300 shrink-0">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-black text-slate-900 uppercase tracking-tight text-xs md:text-sm mb-0.5 truncate">{user.name}</div>
                                                <div className="text-[9px] md:text-[10px] text-slate-400 font-black flex items-center gap-1.5 md:gap-2 uppercase tracking-widest truncate">
                                                    <Mail size={12} className="text-indigo-400 shrink-0" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-10 py-5 md:py-7">
                                        <div className="flex items-center gap-1.5 md:gap-2">
                                            <ShieldCheck size={14} className="text-indigo-600 shrink-0" />
                                            <span className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] whitespace-nowrap">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-10 py-5 md:py-7">
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <Globe size={12} className="text-slate-300 shrink-0" />
                                                <span className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-widest truncate">{user.country}</span>
                                            </div>
                                            <div className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest italic truncate">{user.team}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-10 py-5 md:py-7">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className={cn("h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(var(--color-pulse),0.5)] shrink-0", 
                                                user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300')} />
                                            <span className={cn(
                                                "text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-2.5 md:px-3 py-1 md:py-1.5 rounded-xl border transition-all whitespace-nowrap",
                                                user.status === 'Active' 
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                                                    : 'bg-slate-50 text-slate-400 border-slate-100'
                                            )}>
                                                {user.status === 'Active' ? 'Operational' : 'Restricted'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-10 py-5 md:py-7 text-right">
                                        <div className="flex items-center justify-end gap-2 md:gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all md:translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => resetPassword.mutate(user.email)}
                                                className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-white border border-slate-100 rounded-lg md:rounded-xl text-slate-400 hover:text-amber-600 transition-all shadow-sm active:scale-95"
                                                title="Reset Credentials"
                                            >
                                                <Key size={14} />
                                            </button>
                                            <button
                                                 onClick={() => toggleStatus.mutate(user.id)}
                                                 disabled={toggleStatus.isPending && toggleStatus.variables === user.id}
                                                 className={cn(
                                                     "h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-lg md:rounded-xl transition-all shadow-sm active:scale-95 border",
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
                                            <button 
                                                onClick={() => openEditModal(user)}
                                                className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-white border border-slate-100 rounded-lg md:rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
                                            >
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
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-xl mx-auto shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">
                                        {isEditing ? 'Modify Identity' : 'Provision Identity'}
                                    </h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                        {isEditing ? 'Updating corporate node data' : 'Configuring new organizational access'}
                                    </p>
                                </div>
                            </div>
                            <div className="overflow-y-auto no-scrollbar">
                            <form onSubmit={(e) => { 
                                e.preventDefault(); 
                                const formData = Object.fromEntries(new FormData(e.target));
                                if (isEditing && editUserData) {
                                    if (!formData.password) delete formData.password;
                                    updateUser.mutate({ id: editUserData.id, ...formData });
                                } else {
                                    addUser.mutate(formData);
                                }
                                setShowAddForm(false); 
                            }} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Full Legal Name</label>
                                        <input name="name" defaultValue={editUserData?.name} required placeholder="JASON BOURNE" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Corporate Email</label>
                                        <input name="email" type="email" defaultValue={editUserData?.email} required placeholder="J.BOURNE@POVA.IO" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Strategic Role</label>
                                        <select name="role" defaultValue={editUserData?.role || 'Counselor'} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                            {roles.filter(r => r !== 'All').map(role => <option key={role}>{role}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Node Territory</label>
                                        <select name="country" defaultValue={editUserData?.country || 'India'} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                            <option>India</option>
                                            <option>USA</option>
                                            <option>UK</option>
                                            <option>Global</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Operation Team</label>
                                        <input name="team" defaultValue={editUserData?.team} required placeholder="ADMISSIONS SOUTH" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">{isEditing ? 'New Password (Optional)' : 'Initial Password'}</label>
                                        <input name="password" type="password" required={!isEditing} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="flex flex-col-reverse sm:grid sm:grid-cols-2 gap-3 md:gap-4 mt-8 pt-4">
                                    <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 bg-gray-50 border border-gray-100 transition-all">Abort</button>
                                    <button type="submit" className="px-6 py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
                                        {isEditing ? 'Apply Updates' : 'Establish Access'}
                                    </button>
                                </div>
                            </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default UserManagement


