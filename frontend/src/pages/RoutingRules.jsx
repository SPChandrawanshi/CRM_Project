import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Filter, Search, Globe, Power, Play, PauseCircle, Users, Activity, BarChart3, ChevronRight, Hash, ArrowRightLeft, Layers } from 'lucide-react'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { useRoutingActions } from '../hooks/useCrmMutations'
import { motion, AnimatePresence } from 'framer-motion'

const TabButton = ({ active, label, icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-2 md:gap-3 px-4 md:px-8 py-4 md:py-5 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap",
            active
                ? "text-indigo-600 border-indigo-600 bg-indigo-50/30"
                : "text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50/50"
        )}
    >
        <Icon size={14} strokeWidth={2.5} className="shrink-0" />
        {label}
    </button>
)

const RoutingRules = () => {
    const [view, setView] = useState('main') // 'main', 'country', 'round-robin', 'load-based'
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editRuleData, setEditRuleData] = useState(null)
    const { toggleRule, deleteRule, addRule, updateRule } = useRoutingActions()

    const { data: rulesResp, isLoading } = useQuery({
        queryKey: ['routing-rules'],
        queryFn: async () => {
            const res = await api.get('/routing');
            return res.data || res;
        }
    })

    const dataToMap = Array.isArray(rulesResp?.data) ? rulesResp.data : (Array.isArray(rulesResp) ? rulesResp : []);
    const rules = dataToMap.map(r => ({
        id: r.id,
        country: r.country,
        team: r.team,
        counselor: r.counselor || 'System Default',
        type: r.type,
        maxLoad: 50, // Mock for now
        status: r.status
    }))

    const filteredRules = rules.filter(rule =>
        (rule.country || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rule.team || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    const openCreateModal = () => {
        setIsEditing(false)
        setEditRuleData(null)
        setShowAddForm(true)
    }

    const openEditModal = (rule) => {
        setIsEditing(true)
        setEditRuleData(rule)
        setShowAddForm(true)
    }

    const renderMainTable = () => (
        <div className="w-full overflow-x-auto no-scrollbar max-w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-[#F9FAFB]/50">
                        <th className="px-6 md:px-8 py-4 md:py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] min-w-[150px]">Territory</th>
                        <th className="px-6 md:px-8 py-4 md:py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] min-w-[120px]">Operation Team</th>
                        <th className="px-6 md:px-8 py-4 md:py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] min-w-[150px]">Counselor (Primary)</th>
                        <th className="px-6 md:px-8 py-4 md:py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] min-w-[120px]">Architecture</th>
                        <th className="px-6 md:px-8 py-4 md:py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Max Load</th>
                        <th className="px-6 md:px-8 py-4 md:py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">State</th>
                        <th className="px-6 md:px-8 py-4 md:py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/50">
                    {filteredRules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-gray-50/50 transition-all group">
                            <td className="px-6 md:px-8 py-4 md:py-6">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <Globe size={14} className="text-indigo-400 shrink-0" />
                                    <span className="font-black text-[11px] md:text-xs text-[#111827] uppercase tracking-tight truncate">{rule.country}</span>
                                </div>
                            </td>
                            <td className="px-6 md:px-8 py-4 md:py-6">
                                <span className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest truncate block">{rule.team}</span>
                            </td>
                            <td className="px-6 md:px-8 py-4 md:py-6">
                                <div className="flex flex-col">
                                    <span className="text-[11px] md:text-xs font-black text-[#111827] uppercase tracking-tight truncate">{rule.counselor}</span>
                                    <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">Active ID: #{rule.id * 123}</span>
                                </div>
                            </td>
                            <td className="px-6 md:px-8 py-4 md:py-6">
                                <span className="text-[9px] md:text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 md:px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest shadow-sm whitespace-nowrap">
                                    {rule.type}
                                </span>
                            </td>
                            <td className="px-6 md:px-8 py-4 md:py-6">
                                <span className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest whitespace-nowrap">{rule.maxLoad} Leads</span>
                            </td>
                            <td className="px-6 md:px-8 py-4 md:py-6">
                                <button
                                    onClick={() => toggleRule.mutate({ id: rule.id, currentStatus: rule.status })}
                                    className={cn(
                                        "px-2 md:px-2.5 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                                        rule.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50' : 'bg-gray-50 text-gray-400 border-gray-100'
                                    )}
                                >
                                    {rule.status}
                                </button>
                            </td>
                            <td className="px-6 md:px-8 py-4 md:py-6">
                                <div className="flex items-center justify-end gap-1.5 md:gap-2 transition-all">
                                    <button onClick={() => openEditModal(rule)} className="p-2 md:p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm active:scale-90"><Edit2 size={14} /></button>
                                    <button onClick={() => deleteRule.mutate(rule.id)} className="p-2 md:p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-rose-600 transition-all shadow-sm active:scale-90"><Trash2 size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

    const renderCountryMapping = () => (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rules.map(rule => (
                <div key={rule.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm">
                            {(rule.country || 'GL').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-[#111827] uppercase tracking-widest">{rule.country || 'Global'}</h4>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Master Region</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Team</span>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{rule.team || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Primary Counselor</span>
                            <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">{rule.counselor}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

    const renderRoundRobin = () => (
        <div className="p-8 space-y-6">
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-4">
                <Layers className="text-amber-600" size={24} />
                <div>
                    <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">Rotation Terminal</h4>
                    <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest">Drag and drop counselors to reorder the distribution sequence.</p>
                </div>
            </div>
            <div className="space-y-3">
                {['Rahul K.', 'Susan V.', 'Ahmed K.', 'Emma W.'].map((name, i) => (
                    <motion.div
                        key={name}
                        whileHover={{ x: 10 }}
                        className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl cursor-grab active:cursor-grabbing hover:border-indigo-100 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">{i + 1}</div>
                            <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg italic">Wait in Queue</span>
                            <ArrowRightLeft size={14} className="text-gray-300" />
                        </div>
                    </motion.div>
                ))}
            </div>
            <button className="w-full py-4 rounded-2xl bg-[#111827] text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100/50">Save Sequence</button>
        </div>
    )

    const renderLoadBased = () => (
        <div className="w-full overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr className="bg-[#F9FAFB]/50">
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Counselor</th>
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Live Pressure</th>
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Max Capacity</th>
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Vibe Check</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/50">
                    {[
                        { name: 'Rahul K.', current: 42, max: 50, color: 'bg-indigo-500' },
                        { name: 'Sarah J.', current: 12, max: 50, color: 'bg-emerald-500' },
                        { name: 'John D.', current: 49, max: 50, color: 'bg-rose-500' },
                    ].map(node => (
                        <tr key={node.name} className="hover:bg-gray-50/50 transition-all group">
                            <td className="px-8 py-6">
                                <span className="font-black text-xs text-[#111827] uppercase tracking-tight">{node.name}</span>
                            </td>
                            <td className="px-8 py-6 min-w-[200px]">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase">
                                        <span>Utilized</span>
                                        <span>{Math.round((node.current / node.max) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div className={cn("h-full transition-all duration-1000", node.color)} style={{ width: `${(node.current / node.max) * 100}%` }} />
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6 font-black text-xs text-[#111827]">{node.max}</td>
                            <td className="px-8 py-6">
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                                    node.current > 45 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                )}>
                                    {node.current > 45 ? 'Full Pressure' : 'Ready to Absorb'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 w-full min-w-0 px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#111827] uppercase tracking-tight">Routing Rules</h1>
                    <p className="text-[10px] md:text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Multi-tier distribution architecture and load balancing.</p>
                </div>
                <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto justify-center flex items-center gap-2 md:gap-3 bg-[#111827] text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-[1.25rem] font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100 active:scale-95"
                    >
                        <Plus size={18} strokeWidth={3} className="shrink-0" />
                        Add New Rule
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden min-h-[500px] w-full min-w-0">
                <div className="flex flex-row overflow-x-auto border-b border-gray-100 bg-gray-50/50 no-scrollbar">
                    <TabButton active={view === 'main'} label="Main Routing" icon={Activity} onClick={() => setView('main')} />
                    <TabButton active={view === 'country'} label="Country Mapping" icon={Globe} onClick={() => setView('country')} />
                    <TabButton active={view === 'round-robin'} label="Round Robin" icon={ArrowRightLeft} onClick={() => setView('round-robin')} />
                    <TabButton active={view === 'load-based'} label="Load Based" icon={BarChart3} onClick={() => setView('load-based')} />
                </div>

                <div className="p-8 border-b border-[#E5E7EB] bg-white flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Identify specific distribution nodes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all placeholder:text-gray-300"
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {view === 'main' && renderMainTable()}
                        {view === 'country' && renderCountryMapping()}
                        {view === 'round-robin' && renderRoundRobin()}
                        {view === 'load-based' && renderLoadBased()}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-2xl md:rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl mx-auto max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col">
                            <div className="p-5 md:p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-[#111827] uppercase tracking-tight">
                                        {isEditing ? 'Architect Rule Update' : 'Architect New Rule'}
                                    </h3>
                                    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                        {isEditing ? 'Updating lead distribution logic' : 'Defining lead distribution logic'}
                                    </p>
                                </div>
                            </div>
                            <div className="overflow-y-auto no-scrollbar">
                            <form onSubmit={(e) => { 
                                e.preventDefault(); 
                                const formData = Object.fromEntries(new FormData(e.target));
                                // Handle radio button for 'type'
                                if (formData.assignment) {
                                    formData.type = formData.assignment;
                                    delete formData.assignment;
                                }
                                
                                if (isEditing && editRuleData) {
                                    updateRule.mutate({ id: editRuleData.id, ...formData });
                                } else {
                                    addRule.mutate(formData);
                                }
                                setShowAddForm(false); 
                            }} className="p-5 md:p-8 space-y-5 md:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Target Territory</label>
                                        <select name="country" defaultValue={editRuleData?.country || 'India'} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                            <option>India</option>
                                            <option>USA</option>
                                            <option>UK</option>
                                            <option>UAE</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Operation Team</label>
                                        <select name="team" defaultValue={editRuleData?.team || 'Admissions'} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                            <option>Admissions</option>
                                            <option>Sales</option>
                                            <option>Support</option>
                                            <option>Retention</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Logic Pattern</label>
                                    <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
                                        {['Country Based', 'Round Robin', 'Load Based'].map(type => (
                                            <label key={type} className="relative cursor-pointer group w-full">
                                                <input type="radio" name="type" value={type} defaultChecked={type === (editRuleData?.type || 'Country Based')} className="peer sr-only" />
                                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 text-center peer-checked:border-indigo-600 peer-checked:bg-indigo-50 transition-all group-hover:bg-white group-hover:shadow-sm w-full">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest peer-checked:text-indigo-600 leading-none">{type}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Primary Counselor</label>
                                    <select name="counselor" defaultValue={editRuleData?.counselor || 'System Default'} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                        <option>Rahul K.</option>
                                        <option>Susan V.</option>
                                        <option>Ahmed K.</option>
                                        <option>System Default</option>
                                    </select>
                                </div>
                                <div className="space-y-1 hidden">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Maximum Throughput (Load)</label>
                                    <input type="number" name="maxLoad" defaultValue={50} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                </div>
                                <div className="flex flex-col-reverse sm:grid sm:grid-cols-2 gap-3 sm:gap-4 mt-8 pt-4">
                                    <button type="button" onClick={() => setShowAddForm(false)} className="w-full px-6 py-4 rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest text-gray-400 border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-all">Abort</button>
                                    <button type="submit" className="w-full px-6 py-4 rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                                        {isEditing ? 'Deploy Update' : 'Deploy Rule'}
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

export default RoutingRules


