import React, { useState } from 'react'
import {
    Plus,
    GripVertical,
    Trash2,
    Settings2,
    Save,
    BrainCircuit,
    Target,
    UserCheck,
    ChevronRight,
    ToggleRight,
    Sparkles,
    Activity,
    Database,
    Cpu,
    CheckCircle2,
    ArrowRight,
    MessageSquare,
    Zap,
    Scale,
    Edit2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useAiActions } from '../hooks/useCrmMutations'

const PipelineStage = ({ label, icon: Icon, active, completed }) => (
    <div className="flex items-center gap-3">
        <div className={cn(
            "flex flex-col items-center gap-2 px-6 py-4 rounded-[2rem] border transition-all shadow-sm",
            active ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-100 shadow-xl" :
                completed ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-white border-gray-100 text-gray-400"
        )}>
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        {!label.includes('CRM') && <ArrowRight size={16} className="text-gray-200" />}
    </div>
)

const QuestionItem = React.forwardRef(({ question, index, tag, onDelete, onChange }, ref) => (
    <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="crm-card !p-6 flex gap-6 items-start group transition-all"
    >
        <div className="mt-2 flex flex-col items-center gap-1 cursor-grab text-gray-200 group-hover:text-indigo-400">
            <GripVertical size={24} />
        </div>
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black border border-indigo-100 shadow-inner">
                        {index + 1}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logic Node</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onDelete}
                        className="p-2.5 text-gray-300 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            <input
                type="text"
                value={question}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter qualification question..."
                className="w-full font-black text-[#111827] bg-transparent border-none focus:ring-0 p-0 text-xl placeholder:text-gray-200 uppercase tracking-tight"
            />
            <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-indigo-600 rounded-lg border border-gray-100 group-hover:border-indigo-100 transition-colors">
                    <Database size={12} className="text-indigo-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Extraction: {tag}</span>
                </div>
            </div>
        </div>
    </motion.div>
))

import apiClient from '../lib/apiClient'
import { useQuery } from '@tanstack/react-query'

const AdminAIConfig = () => {
    const { publishFlow } = useAiActions()
    
    // Fetch AI Config
    const { data: configResp, isLoading } = useQuery({
        queryKey: ['ai-config'],
        queryFn: async () => {
            const res = await apiClient.get('/dashboard/ai-config');
            return res.data || res;
        }
    })

    const [flow, setFlow] = useState([])
    const [threshold, setThreshold] = useState(70)
    const [rules, setRules] = useState([])
    const [scoringRules, setScoringRules] = useState([])

    // Sync state when data is loaded
    React.useEffect(() => {
        const config = configResp?.data || configResp
        if (config && (config.flow || config.rules)) {
            setFlow(config.flow || [])
            setThreshold(config.threshold || 75)
            setRules(config.rules || [])
            setScoringRules(config.scoringRules || [])
        }
    }, [configResp])

    const handleDelete = (id) => setFlow(flow.filter(f => f.id !== id))
    const handleAdd = () => setFlow([...flow, { id: Date.now(), q: "", t: "CustomField" }])
    const handleUpdate = (id, val) => setFlow(flow.map(f => f.id === id ? { ...f, q: val } : f))

    const handleToggleRule = (id) => {
        setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r))
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight flex items-center gap-3">
                        <Cpu className="text-indigo-600" size={32} />
                        Intelligence Orchestration
                    </h1>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Configure NLP flow architectures and autonomous extraction parameters.</p>
                </div>
                <button
                    onClick={() => publishFlow.mutate({ flow, threshold, rules, scoringRules })}
                    className="group relative flex items-center gap-4 bg-[#111827] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-indigo-100 active:scale-95"
                >
                    <Save size={18} strokeWidth={2.5} />
                    Deploy Global Protocol
                </button>
            </div>

            <div className="crm-card flex items-center gap-2 justify-center overflow-x-auto">
                <PipelineStage label="Init Response" icon={MessageSquare} completed />
                <PipelineStage label="Intent Sync" icon={BrainCircuit} completed />
                <PipelineStage label="Qualification" icon={Zap} active />
                <PipelineStage label="CRM Master Sync" icon={Database} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-black text-[#111827] uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="text-indigo-600" size={18} />
                                    Logic Node Stream
                                </h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Managing {flow.length} active extraction nodes</p>
                            </div>
                            <button
                                onClick={handleAdd}
                                className="bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-6 py-3 rounded-2xl border border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm"
                            >
                                <Plus size={14} strokeWidth={3} /> Inject Logic Step
                            </button>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode='popLayout'>
                                {flow.map((item, i) => (
                                    <QuestionItem
                                        key={item.id}
                                        question={item.q}
                                        tag={item.t}
                                        index={i}
                                        onDelete={() => handleDelete(item.id)}
                                        onChange={(val) => handleUpdate(item.id, val)}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div>
                            <h3 className="text-sm font-black text-[#111827] uppercase tracking-widest flex items-center gap-2">
                                <Scale className="text-indigo-600" size={18} />
                                Lead Scoring Matrix
                            </h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Weights for autonomous lead prioritization</p>
                        </div>
                        <div className="crm-card !p-0 overflow-hidden overflow-x-auto no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-[#F9FAFB]/50">
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Constraint / Rule Identity</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Impact (Points)</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E7EB]/50">
                                    {scoringRules.map(rule => (
                                        <tr key={rule.id} className="hover:bg-gray-50/50 transition-all group">
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{rule.desc}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "text-[10px] font-black px-3 py-1 rounded-lg border",
                                                    rule.score > 0 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                                                )}>
                                                    {rule.score > 0 ? `+${rule.score}` : rule.score}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-indigo-600 transition-all shadow-sm active:scale-90 opacity-0 group-hover:opacity-100">
                                                    <Edit2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="w-full py-4 bg-gray-50/50 text-[9px] font-black text-gray-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-all border-t border-gray-100">
                                <Plus size={10} className="inline mr-2" /> Append Scoring Constraint
                            </button>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <div className="crm-card p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                            <Target size={120} />
                        </div>
                        <h3 className="text-[10px] font-black text-gray-400 mb-10 uppercase tracking-[0.2em] border-b border-gray-50 pb-4">
                            Precision Parameters
                        </h3>
                        <div className="space-y-10 relative z-10">
                            <div>
                                <div className="flex justify-between text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">
                                    <span>Confidence Floor</span>
                                    <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">{threshold}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={threshold}
                                    onChange={(e) => setThreshold(e.target.value)}
                                    className="w-full accent-indigo-600 h-2 bg-gray-100 rounded-full appearance-none cursor-pointer"
                                />
                                <p className="text-[9px] font-bold text-gray-300 mt-4 uppercase tracking-widest leading-relaxed">Minimum vector distance required for autonomous field mapping</p>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-50">
                                {rules.map((rule) => (
                                    <button
                                        key={rule.id}
                                        onClick={() => handleToggleRule(rule.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-6 rounded-3xl border transition-all text-left group/btn",
                                            rule.active
                                                ? "bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100 text-white"
                                                : "bg-white border-gray-100 hover:border-indigo-100 text-gray-400"
                                        )}
                                    >
                                        <div className="flex-1">
                                            <div className={cn("text-[10px] font-black uppercase tracking-widest mb-1", rule.active ? "text-white" : "text-[#111827]")}>
                                                {rule.label}
                                            </div>
                                            <div className={cn("text-[9px] font-medium opacity-60", rule.active ? "text-indigo-100" : "text-gray-400 uppercase tracking-tighter")}>
                                                {rule.desc}
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-10 h-6 rounded-full relative transition-colors",
                                            rule.active ? "bg-white/20" : "bg-gray-100"
                                        )}>
                                            <div className={cn(
                                                "w-4 h-4 rounded-full absolute top-1 transition-all shadow-sm",
                                                rule.active ? "bg-white left-5" : "bg-gray-300 left-1"
                                            )} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111827] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black mb-8 flex items-center gap-3 uppercase tracking-[0.2em] text-indigo-400">
                                <Sparkles size={18} className="animate-pulse" />
                                Protocol Guard
                            </h3>
                            <div className="space-y-4">
                                {['Zero-shot Classifier', 'Context Window v4', 'Lead Sentiment Analysis'].map((f) => (
                                    <div key={f} className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                        <span className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">{f}</span>
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 pt-10 border-t border-white/5">
                                <p className="text-center text-[9px] font-black text-gray-600 uppercase tracking-widest">Core Engine: Pova-AI v7.4.2</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                            <BrainCircuit size={280} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminAIConfig
