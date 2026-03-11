import React from 'react'
import {
    Plus,
    GripVertical,
    Trash2,
    Settings2,
    Save,
    BrainCircuit,
    Target,
    UserCheck
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

const QuestionItem = ({ question, index }) => (
    <div className="crm-card !p-4 flex gap-4 items-start group">
        <div className="mt-1 flex flex-col items-center gap-1 cursor-grab text-gray-300 group-hover:text-gray-400">
            <GripVertical size={20} />
        </div>
        <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-[#3B5BDB] uppercase tracking-wider shrink-0">Step {index + 1}</span>
                <div className="flex items-center gap-1 md:gap-2 shrink-0">
                    <button className="p-1 md:p-1.5 text-[#6B7280] hover:text-[#EF4444] rounded hover:bg-rose-50 transition-colors"><Trash2 size={14} md:size={16} /></button>
                    <button className="p-1 md:p-1.5 text-[#6B7280] hover:text-[#3B5BDB] rounded hover:bg-indigo-50 transition-colors"><Settings2 size={14} md:size={16} /></button>
                </div>
            </div>
            <input
                type="text"
                defaultValue={question}
                className="w-full font-medium text-[#111827] bg-transparent border-none focus:ring-0 p-0"
            />
            <div className="flex flex-wrap gap-2">
                <span className="text-[9px] md:text-[10px] px-2 py-1 bg-gray-100 rounded text-[#111827] font-medium border border-gray-200 whitespace-nowrap">Text Input</span>
                <span className="text-[9px] md:text-[10px] px-2 py-1 bg-indigo-50 text-[#3B5BDB] rounded font-medium border border-indigo-100 whitespace-nowrap">Extracts: Program</span>
            </div>
        </div>
    </div>
)

const AIQualification = () => {
    const { data: configResp, isLoading } = useQuery({
        queryKey: ['ai-config'],
        queryFn: async () => {
            const res = await api.get('/dashboard/ai-config');
            return res.data || res;
        }
    })

    const questions = configResp?.flow?.map(f => f.q) || [
        "What is your highest qualification?",
        "Which program are you interested in?",
        "When are you planning to start?",
        "Do you have a valid passport?"
    ]

    const threshold = configResp?.threshold || 65
    const rules = configResp?.rules || []
    const scoringRules = configResp?.scoringRules || []

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#111827] uppercase tracking-tight">AI Qualification Builder</h1>
                    <p className="text-[10px] md:text-xs font-medium text-[#6B7280] mt-1 uppercase tracking-widest">Design the chat flow and extraction rules for automatic lead qualification.</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#111827] px-4 py-2.5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm">
                        <Save size={14} className="shrink-0" />
                        <span>Save</span>
                    </button>
                    <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-[#111827] text-white px-4 py-2.5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-xl shadow-indigo-100">
                        <Plus size={14} className="shrink-0" />
                        <span>Question</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Flow Builder */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                        <BrainCircuit size={18} className="text-[#3B5BDB]" />
                        Qualification Flow
                    </h3>
                    <div className="space-y-3">
                        {questions.map((q, i) => (
                            <QuestionItem key={i} question={q} index={i} />
                        ))}
                    </div>
                </div>

                {/* Right: Rules & Preview */}
                <div className="space-y-6">
                    <div className="crm-card">
                        <h3 className="text-sm font-bold text-[#111827] mb-4 flex items-center gap-2">
                            <Target size={18} className="text-[#3B5BDB]" />
                            Scoring Rules
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#6B7280]">Minimum Score</span>
                                <span className="text-sm font-bold text-[#111827]">{threshold}</span>
                            </div>
                            <input type="range" className="w-full accent-[#3B5BDB]" value={threshold} readOnly />
                            <div className="space-y-2 pt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="rounded text-[#3B5BDB] focus:ring-[#3B5BDB]" defaultChecked />
                                    <span className="text-sm text-[#111827]">Auto-assign qualified leads</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="rounded text-[#3B5BDB] focus:ring-[#3B5BDB]" defaultChecked />
                                    <span className="text-sm text-[#111827]">Send WhatsApp notification</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111827] p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-gray-800">
                        <div className="relative z-10">
                            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <UserCheck size={16} className="text-[#10B981]" />
                                Extraction Preview
                            </h3>
                            <div className="space-y-3">
                                {['Name', 'Email', 'Program', 'Qualification', 'Timeline'].map((field) => (
                                    <div key={field} className="flex justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-[#1F2937] pb-2">
                                        <span className="text-gray-400">{field}</span>
                                        <span className="text-indigo-400">Pending</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 opacity-5 pointer-events-none text-indigo-500">
                            <BrainCircuit size={160} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AIQualification


