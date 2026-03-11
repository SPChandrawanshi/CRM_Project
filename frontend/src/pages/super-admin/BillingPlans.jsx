import React, { useState } from 'react'
import { CreditCard, Calendar, CheckCircle, AlertTriangle, Search, Filter, ArrowUpCircle, FileText, Ban, PlusCircle, ChevronDown, X, Download, ExternalLink, ShieldCheck, Zap, Globe, Users, DollarSign, Activity, Save, RefreshCcw, Loader } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useBillingActions } from '../../hooks/useCrmMutations'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../services/api'

const AddPlanModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({ name: '', price: '', channelLimit: '', userLimit: '', cycle: 'Monthly' });
    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">Define Global Plan</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Configuring new subscription tier for platform nodes</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"><X size={20} className="text-gray-400" /></button>
                </div>
                <div className="p-8 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tier Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Enterprise Platinum" className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 rounded-2xl text-sm font-bold outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (USD)</label>
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 rounded-2xl text-sm font-bold outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cycle</label>
                            <select value={formData.cycle} onChange={e => setFormData({ ...formData, cycle: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all cursor-pointer appearance-none">
                                <option>Monthly</option>
                                <option>Annually</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Channel Limit</label>
                            <div className="relative">
                                <Globe size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input type="number" value={formData.channelLimit} onChange={e => setFormData({ ...formData, channelLimit: e.target.value })} placeholder="Shared Nodes" className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">User Limit</label>
                            <div className="relative">
                                <Users size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input type="number" value={formData.userLimit} onChange={e => setFormData({ ...formData, userLimit: e.target.value })} placeholder="Team seats" className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 px-8 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100">Cancel</button>
                    <button onClick={() => onAdd(formData)} className="flex-[2] bg-[#111827] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow flex items-center justify-center gap-2">
                        <Save size={16} /> Publish Tier
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

const UpgradeModal = ({ subscription, isOpen, onClose, onUpgrade }) => {
    const plans = [
        { name: 'Startup', price: '$200', features: ['5 Channels', '10 Users', 'Basic AI'] },
        { name: 'Professional', price: '$800', features: ['20 Channels', '50 Users', 'Advanced AI'] },
        { name: 'Enterprise Plus', price: '$1,200', features: ['Unlimited Channels', 'Unlimited Users', 'Dedicated Support'] },
    ];

    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-2xl font-black text-[#111827] uppercase tracking-tight">Upgrade Infrastructure: {subscription.client}</h3>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">Current Tier: <span className="text-indigo-600 underline font-black">{subscription.plan}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"><X size={24} className="text-gray-400" /></button>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((p) => (
                        <div key={p.name} className={cn(
                            "p-8 rounded-[2.5rem] border-2 transition-all flex flex-col justify-between group h-full",
                            subscription.plan === p.name ? "border-indigo-100 bg-indigo-50/20 opacity-60" : "border-gray-100 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100"
                        )}>
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <h4 className="text-lg font-black text-[#111827] uppercase tracking-tighter leading-none">{p.name}</h4>
                                    {p.name === 'Enterprise Plus' && <Zap size={18} className="text-amber-500 fill-amber-500" />}
                                </div>
                                <div className="mb-8">
                                    <span className="text-4xl font-black text-[#111827] tracking-tighter">{p.price}</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">/ Month</span>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    {p.features.map(f => (
                                        <li key={f} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                            <div className="p-1 bg-emerald-100 rounded-full"><CheckCircle size={10} className="text-emerald-600" /></div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                disabled={subscription.plan === p.name}
                                onClick={() => onUpgrade(p.name)}
                                className={cn(
                                    "w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                                    subscription.plan === p.name ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#111827] text-white hover:bg-black shadow-lg shadow-indigo-100"
                                )}
                            >
                                {subscription.plan === p.name ? "Current Protocol" : "Deploy Upgrade"}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-100 text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Scalable cloud orchestration powered by Antigravity OS</p>
                </div>
            </motion.div>
        </motion.div>
    );
}

const InvoiceDrawer = ({ isOpen, onClose, subscription, downloadInvoice, updatePaymentMethod }) => {
    const { data: invoicesResp, isLoading: loadingInvoices } = useQuery({
        queryKey: ['invoices', subscription?.id],
        queryFn: () => api.get(`/billing/invoice/${subscription.id}`),
        enabled: isOpen && !!subscription?.id
    })
    const invoices = Array.isArray(invoicesResp?.data) ? invoicesResp.data : []

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 z-[60] w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">Invoice Archive</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Billing identity: {subscription?.clientName || subscription?.client}</p>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm"><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {loadingInvoices ? (
                                <div className="flex items-center justify-center h-32 opacity-50">
                                    <Loader className="animate-spin text-indigo-600" size={28} />
                                </div>
                            ) : invoices.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-32 opacity-40">
                                    <FileText size={32} className="text-gray-400 mb-2" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No invoices found</p>
                                </div>
                            ) : invoices.map((inv, i) => (
                                <div key={inv.id || i} className="p-6 rounded-[2rem] border border-gray-100 hover:border-indigo-100 hover:bg-gray-50/50 transition-all group cursor-pointer">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-white border border-gray-100 rounded-xl"><FileText size={18} className="text-[#111827]" /></div>
                                            <div>
                                                <p className="text-xs font-black text-[#111827] uppercase tracking-tight">{inv.id}</p>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{inv.date}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                            inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        )}>{inv.status}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-black text-[#111827] tracking-tighter">${inv.amount?.toLocaleString()}.00</span>
                                        <button
                                            onClick={() => downloadInvoice?.mutate(inv.subscriptionId)}
                                            disabled={downloadInvoice?.isPending}
                                            className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline disabled:opacity-50"
                                        >
                                            {downloadInvoice?.isPending ? <RefreshCcw size={14} className="animate-spin" /> : <Download size={14} />}
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 border-t border-gray-100 bg-gray-50/30">
                            <button 
                                onClick={() => updatePaymentMethod?.mutate(subscription?.id)}
                                disabled={updatePaymentMethod?.isPending}
                                className="w-full py-4 bg-[#111827] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow disabled:opacity-50"
                            >
                                {updatePaymentMethod?.isPending ? <RefreshCcw size={16} className="animate-spin" /> : <CreditCard size={16} />} 
                                Manage Payment Method
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

const BillingPlans = () => {
    const { upgradePlan, suspendClient, addPlan, downloadInvoice, updatePaymentMethod } = useBillingActions()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All Status')

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedSubscription, setSelectedSubscription] = useState(null)
    const [viewingInvoicesFor, setViewingInvoicesFor] = useState(null)

    const { data: subscriptions = [], isLoading } = useQuery({
        queryKey: ['subscriptions'],
        queryFn: async () => {
            const res = await api.get('/billing');
            const dataToMap = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
            return dataToMap.map(sub => ({
                id: sub.id,
                client: sub.clientName,
                plan: sub.plan,
                usage: { 
                    messages: sub.messagesCount || 0, 
                    contacts: sub.contactsCount || 0 
                },
                renewalDate: sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : 'N/A',
                status: sub.status
            }));
        }
    })

    // Fallback data if DB is empty
    const baseSubscriptions = [
        { id: 101, client: "Acme Corp", plan: "Enterprise", status: "Active", usage: { messages: 125000, contacts: 45000 }, renewalDate: "2024-12-01" },
        { id: 102, client: "TechStart Inc", plan: "Professional", status: "Active", usage: { messages: 45000, contacts: 12000 }, renewalDate: "2024-11-15" },
        { id: 103, client: "Local Retail", plan: "Starter", status: "Expired", usage: { messages: 8500, contacts: 2100 }, renewalDate: "2024-02-01" },
        { id: 104, client: "Global Trade", plan: "Enterprise", status: "Suspended", usage: { messages: 0, contacts: 0 }, renewalDate: "2024-03-10" }
    ];
    
    const displaySubscriptions = subscriptions.length > 0 ? subscriptions : baseSubscriptions;

    const filteredSubscriptions = displaySubscriptions.filter(sub => {
        const matchesSearch = sub.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'All Status' || sub.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleUpgrade = (newPlan) => {
        if (!selectedSubscription?.id) return;
        upgradePlan.mutate({ clientId: selectedSubscription.id, plan: newPlan }, {
            onSuccess: () => setSelectedSubscription(null)
        })
    }

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Revenue & Tiers</h1>
                    <p className="text-sm font-medium text-[#6B7280]">Subscription orchestration for localized and global client deployments.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto px-8 py-4 bg-[#111827] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black flex items-center justify-center gap-3 shadow transition-all active:scale-95"
                >
                    <PlusCircle size={18} strokeWidth={2.5} />
                    New Global Tier
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-4 md:p-8 border-b border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gray-50/50">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-sm">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Locate client identity..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 outline-none w-full transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white border border-gray-100 p-2 rounded-2xl flex items-center gap-2 shadow-sm">
                            {['All Status', 'Active', 'Expired', 'Suspended'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        statusFilter === s ? "bg-[#111827] text-white shadow-lg" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    {s === 'All Status' ? 'Unified' : s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-4 sm:px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Client / Current Plan</th>
                                <th className="px-4 sm:px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Usage Metrics</th>
                                <th className="px-4 sm:px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Renewal Date</th>
                                <th className="px-4 sm:px-10 py-6 text-right font-black text-gray-400 uppercase tracking-widest text-[9px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            <AnimatePresence mode='popLayout'>
                                {filteredSubscriptions.map((sub) => (
                                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} key={sub.id} className="transition-all cursor-pointer hover:bg-gray-50/50 group">
                                        <td className="px-4 sm:px-10 py-6">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="p-2.5 sm:p-3 bg-indigo-50 rounded-2xl text-indigo-600 shrink-0">
                                                    <CreditCard size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-black text-sm text-[#111827] uppercase tracking-tight truncate">{sub.client}</div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", sub.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500')} />
                                                        <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest truncate">{sub.plan}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-10 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 sm:w-auto text-right sm:text-left">
                                                        <span className="text-xs font-black text-[#111827]">{sub.usage.messages.toLocaleString()}</span>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">MSG</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 sm:w-auto text-right sm:text-left">
                                                        <span className="text-xs font-black text-[#111827]">{sub.usage.contacts.toLocaleString()}</span>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">CON</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-10 py-6">
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <Calendar size={14} className={cn(sub.status === 'Expired' ? 'text-rose-400' : 'text-gray-400')} />
                                                <span className={cn("text-[10px] sm:text-[11px] font-black uppercase tracking-tight", sub.status === 'Expired' ? 'text-rose-600' : 'text-[#111827]')}>
                                                    {sub.renewalDate}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-10 py-6 text-right">
                                            <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setSelectedSubscription(sub)} 
                                                    className="w-full sm:w-auto px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                                                >
                                                    <ArrowUpCircle size={14} strokeWidth={2.5} /> Upgrade
                                                </button>
                                                <button 
                                                    onClick={() => setViewingInvoicesFor(sub)} 
                                                    className="w-full sm:w-auto px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                                                >
                                                    <Download size={14} strokeWidth={2.5} /> Invoice
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Components */}
            <AddPlanModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={(data) => addPlan.mutate(data, { onSuccess: () => setIsAddModalOpen(false) })} />
            <AnimatePresence>
                {selectedSubscription && (
                    <UpgradeModal subscription={selectedSubscription} isOpen={!!selectedSubscription} onClose={() => setSelectedSubscription(null)} onUpgrade={handleUpgrade} />
                )}
            </AnimatePresence>
            <InvoiceDrawer
                isOpen={!!viewingInvoicesFor}
                onClose={() => setViewingInvoicesFor(null)}
                subscription={viewingInvoicesFor}
                downloadInvoice={downloadInvoice}
                updatePaymentMethod={updatePaymentMethod}
            />
        </div>
    )
}

export default BillingPlans



