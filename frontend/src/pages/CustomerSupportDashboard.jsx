import React, { useState } from 'react'
import { MessageSquare, UserPlus, Zap, Filter, Search, MoreVertical, CheckCircle, UserCheck, ChevronDown, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useLeadActions } from '../hooks/useCrmMutations'
import apiClient from '../lib/apiClient'
import useAppStore from '../store/useStore'

const AssignmentModal = ({ lead, onClose, onAssign, isPending }) => {
    const [team, setTeam] = useState('Team South East Asia')
    const [counselor, setCounselor] = useState('Rahul Sharma')

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 border border-gray-100"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">Lead Assignment</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manual Redistribution</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-8 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center gap-4">
                    <div className="h-12 w-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-100">
                        {lead?.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-black text-[#111827] uppercase tracking-tight">{lead?.name}</p>
                        <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{lead?.country} • {lead?.source}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Target Region/Team</label>
                        <select
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest text-[#111827] focus:ring-2 focus:ring-[#3B5BDB] outline-none appearance-none transition-all"
                        >
                            <option>Team South East Asia</option>
                            <option>Global Direct Team</option>
                            <option>Middle East Division</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Select Active Counselor</label>
                        <select
                            value={counselor}
                            onChange={(e) => setCounselor(e.target.value)}
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest text-[#111827] focus:ring-2 focus:ring-[#3B5BDB] outline-none appearance-none transition-all"
                        >
                            <option>Rahul Sharma (Available)</option>
                            <option>Priya Singh (Busy)</option>
                            <option>Amit Kumar (Away)</option>
                            <option>Neha Gupta (Available)</option>
                        </select>
                    </div>
                </div>

                <div className="mt-10 flex gap-4">
                    <button onClick={onClose} className="flex-1 px-4 py-3.5 bg-white border border-gray-200 text-gray-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={() => onAssign(lead.id, counselor)}
                        disabled={isPending}
                        className="flex-1 px-4 py-3.5 bg-[#111827] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl shadow-indigo-100 transition-all disabled:opacity-50"
                    >
                        {isPending ? 'Assigning...' : 'Confirm Assignment'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

const CustomerSupportDashboard = () => {
    const [selectedLead, setSelectedLead] = useState(null)
    const { assignLead } = useLeadActions()

    // Fetch Stats
    const { data: dashboardResp } = useQuery({
        queryKey: ['support-dashboard'],
        queryFn: async () => {
            const resp = await apiClient.get('/dashboard/support')
            return resp.data
        }
    })
    const stats = dashboardResp?.data || {}

    const kpis = [
        { title: 'Inbound Inquiries', value: stats.newMessages || 0, icon: MessageSquare, color: 'bg-indigo-50 text-indigo-600' },
        { title: 'Triage Queue', value: stats.openTickets || 0, icon: UserPlus, color: 'bg-rose-50 text-rose-600' },
        { title: 'AI Conversational', value: stats.assignedChats || 0, icon: Zap, color: 'bg-emerald-50 text-emerald-600' },
    ]

    // Fetch Queue
    const { data: newLeads = [] } = useQuery({
        queryKey: ['support-queue'],
        queryFn: () => [
            { id: 201, name: 'Michael Chen', phone: '+65 9123 4567', source: 'WhatsApp', country: 'Singapore', score: 82 },
            { id: 202, name: 'Sarah Miller', phone: '+1 202 555 0192', source: 'Facebook Messenger', country: 'USA', score: 45 },
            { id: 203, name: 'Ahmed Khan', phone: '+971 50 123 4567', source: 'Direct Website', country: 'UAE', score: 91 },
            { id: 204, name: 'Elena Rossi', phone: '+39 02 123 4567', source: 'WhatsApp Business', country: 'Italy', score: null },
        ]
    })

    // Fetch AI Status
    const { data: aiStatus = [] } = useQuery({
        queryKey: ['support-ai-status'],
        queryFn: () => [
            { id: 301, name: 'Michael Chen', program: 'MBA Global', intake: '2024', budget: '$45k', score: 82, status: 'Qualified' },
            { id: 302, name: 'Ahmed Khan', program: 'MSc Data Science', intake: '2025', budget: '$30k', score: 91, status: 'High Intent' },
            { id: 303, name: 'Sarah Miller', program: 'Undecided', intake: 'None', budget: 'low', score: 45, status: 'Processing' },
        ]
    })

    const handleAssign = (leadId, counselor) => {
        assignLead.mutate({ leadId, counselorId: counselor.split(' ')[0] }, {
            onSuccess: () => setSelectedLead(null)
        })
    }

    return (
        <div className="space-y-8">
            <AnimatePresence>
                {selectedLead && (
                    <AssignmentModal
                        lead={selectedLead}
                        isPending={assignLead.isPending}
                        onClose={() => setSelectedLead(null)}
                        onAssign={handleAssign}
                    />
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] uppercase tracking-tight">Lead Triage & Support</h1>
                    <p className="text-sm font-medium text-[#6B7280]">Real-time management of new incoming leads and AI qualification status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border border-[#E5E7EB] px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-[#111827] shadow-sm hover:border-indigo-100 transition-all flex items-center gap-2">
                        <Filter size={16} className="text-indigo-400" /> Filter Queue
                    </button>
                    <button className="bg-[#111827] text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl shadow-indigo-100 transition-all">
                        Process All Queue
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => (
                    <div key={index} className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.title}</p>
                            <h3 className="text-2xl font-black text-[#111827] mt-1 uppercase tracking-tight">{kpi.value}</h3>
                        </div>
                        <div className={cn("p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform", kpi.color)}>
                            <kpi.icon size={22} strokeWidth={2.5} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* New Leads Queue */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-gray-50/30">
                        <h3 className="font-black text-[#111827] text-[10px] uppercase tracking-widest">New Leads Arrival Queue</h3>
                        <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-rose-100 animate-pulse">12 UNASSIGNED</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F9FAFB]">
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Lead Profile</th>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Channel / ID</th>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">AI Qualification</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]">
                                {newLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group cursor-default">
                                        <td className="px-6 py-5">
                                            <div className="font-black text-[#111827] uppercase tracking-tight group-hover:text-indigo-600 transition-colors text-xs">{lead.name}</div>
                                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{lead.country}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-gray-700 text-xs tracking-tight">{lead.phone}</div>
                                            <div className="text-[9px] text-indigo-500 font-black uppercase tracking-widest mt-0.5">{lead.source}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {lead.score ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${lead.score}%` }}
                                                            className="bg-emerald-500 h-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                                                        />
                                                    </div>
                                                    <span className="font-black text-[#111827] text-[10px]">{lead.score}%</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic animate-pulse">Syncing...</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => setSelectedLead(lead)}
                                                className="px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 ml-auto"
                                            >
                                                <UserCheck size={14} /> Assign
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AI Qualification Status */}
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
                    <div className="px-6 py-5 border-b border-[#E5E7EB] bg-gray-50/30">
                        <h3 className="font-black text-[#111827] text-[10px] uppercase tracking-widest">Active AI Sessions</h3>
                    </div>
                    <div className="p-6 space-y-5">
                        {aiStatus.map((status) => (
                            <motion.div
                                key={status.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-5 bg-[#F9FAFB] rounded-2xl border border-gray-100 space-y-4 hover:border-indigo-100 transition-all cursor-default group/card"
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className="font-black text-[#111827] uppercase tracking-tight text-xs group-hover/card:text-indigo-600 transition-colors">{status.name}</h4>
                                    <span className={cn(
                                        "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border shadow-sm",
                                        status.status === 'Qualified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                    )}>{status.status}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-[9px] font-black uppercase tracking-widest">
                                    <div>
                                        <p className="text-gray-400 mb-1">Target</p>
                                        <p className="text-[#111827] group-hover/card:translate-x-1 transition-transform">{status.program}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Est. Budget</p>
                                        <p className="text-[#111827] group-hover/card:translate-x-1 transition-transform">{status.budget}</p>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                        <span>Confidence Score</span>
                                        <span>{status.score}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full transition-all duration-1000 shadow-[0_0_5px_rgba(99,102,241,0.5)]" style={{ width: `${status.score}%` }} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <button className="w-full py-4 text-xs font-black uppercase tracking-widest text-[#3B5BDB] bg-indigo-50/50 hover:bg-indigo-100/50 border border-indigo-100/30 rounded-2xl transition-all shadow-sm">
                            View Deep Analytics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerSupportDashboard
