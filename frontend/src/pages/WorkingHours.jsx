import React, { useState } from 'react'
import { Clock, Calendar, ShieldCheck, ToggleLeft, ToggleRight, Save, Sparkles, Coffee, Moon, Sun } from 'lucide-react'
import { cn } from '../lib/utils'
import { useShiftActions } from '../hooks/useCrmMutations'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../lib/apiClient'
import { motion, AnimatePresence } from 'framer-motion'

const DayRow = React.forwardRef(({ day, active, start, end, onToggle, onStartChange, onEndChange }, ref) => (
    <motion.div
        ref={ref}
        layout
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white border border-[#E5E7EB] rounded-[1.5rem] shadow-sm hover:shadow-md transition-all group gap-4 sm:gap-0"
    >
        <div className="flex items-center gap-4 w-48">
            <div className={cn(
                "h-3 w-3 rounded-full transition-all duration-500",
                active ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-110" : "bg-gray-200"
            )}></div>
            <span className={cn("font-black uppercase tracking-widest text-xs transition-colors", active ? "text-[#111827]" : "text-gray-300")}>{day}</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto">
            <div className={cn(
                "flex items-center gap-3 border px-4 py-2.5 rounded-xl transition-all flex-1 sm:flex-none",
                active ? "bg-gray-50 border-gray-100 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:bg-white focus-within:border-indigo-200" : "bg-gray-50/50 border-gray-50 opacity-40"
            )}>
                <Sun size={14} className={active ? "text-amber-500" : "text-gray-300"} />
                <input
                    type="time"
                    value={start}
                    onChange={(e) => onStartChange(e.target.value)}
                    disabled={!active}
                    className="bg-transparent text-xs font-black uppercase tracking-tighter focus:outline-none disabled:cursor-not-allowed w-full"
                />
            </div>
            <span className="text-gray-200 font-bold hidden sm:block">—</span>
            <div className={cn(
                "flex items-center gap-3 border px-4 py-2.5 rounded-xl transition-all flex-1 sm:flex-none",
                active ? "bg-gray-50 border-gray-100 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:bg-white focus-within:border-indigo-200" : "bg-gray-50/50 border-gray-50 opacity-40"
            )}>
                <Moon size={14} className={active ? "text-indigo-500" : "text-gray-300"} />
                <input
                    type="time"
                    value={end}
                    onChange={(e) => onEndChange(e.target.value)}
                    disabled={!active}
                    className="bg-transparent text-xs font-black uppercase tracking-tighter focus:outline-none disabled:cursor-not-allowed w-full"
                />
            </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0">
            <div className="flex items-center gap-4 px-4 py-2 bg-gray-50/50 border border-gray-100 rounded-2xl group-hover:border-indigo-100 transition-colors">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Service Active</span>
                <button
                    onClick={onToggle}
                    className={cn("transition-all active:scale-90", active ? "text-emerald-500" : "text-gray-300")}
                >
                    {active ? <ToggleRight size={32} strokeWidth={1.5} /> : <ToggleLeft size={32} strokeWidth={1.5} />}
                </button>
            </div>
        </div>
    </motion.div>
))

const WorkingHours = () => {
    const [days, setDays] = useState([
        { id: 1, day: 'Monday', active: true, start: '09:00', end: '18:00' },
        { id: 2, day: 'Tuesday', active: true, start: '09:00', end: '18:00' },
        { id: 3, day: 'Wednesday', active: true, start: '09:00', end: '18:00' },
        { id: 4, day: 'Thursday', active: true, start: '09:00', end: '18:00' },
        { id: 5, day: 'Friday', active: true, start: '09:00', end: '18:00' },
        { id: 6, day: 'Saturday', active: false, start: '10:00', end: '14:00' },
        { id: 7, day: 'Sunday', active: false, start: '00:00', end: '00:00' },
    ])

    const { saveHours } = useShiftActions()

    const { data: serverHours } = useQuery({
        queryKey: ['working-hours'],
        queryFn: () => apiClient.get('/admin/working-hours')
    })

    React.useEffect(() => {
        const hoursArr = Array.isArray(serverHours?.data) ? serverHours.data : (Array.isArray(serverHours) ? serverHours : null)
        if (hoursArr && hoursArr.length > 0) {
            setDays(hoursArr)
        }
    }, [serverHours])

    const handleToggle = (id) => {
        setDays(days.map(d => d.id === id ? { ...d, active: !d.active } : d))
    }

    const handleTimeChange = (id, type, value) => {
        setDays(days.map(d => d.id === id ? { ...d, [type]: value } : d))
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] uppercase tracking-tight flex items-center gap-3">
                        <Clock className="text-indigo-600" size={28} />
                        Operational Windows
                    </h1>
                    <p className="text-sm font-medium text-[#6B7280]">Establish global service availability and automated lead redistribution parameters.</p>
                </div>
                <button
                    onClick={() => saveHours.mutate(days)}
                    className="flex items-center gap-3 bg-[#111827] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-indigo-200 active:scale-95"
                >
                    <Save size={18} strokeWidth={2.5} />
                    <span>Sync Configuration</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-3 mb-2 px-2">
                        <Sparkles size={16} className="text-amber-500" />
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Shift Architecture</h3>
                    </div>
                    <AnimatePresence mode='popLayout'>
                        {days.map((d) => (
                            <DayRow
                                key={d.id}
                                {...d}
                                onToggle={() => handleToggle(d.id)}
                                onStartChange={(val) => handleTimeChange(d.id, 'start', val)}
                                onEndChange={(val) => handleTimeChange(d.id, 'end', val)}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#111827] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
                        <div className="relative z-10">
                            <ShieldCheck className="text-emerald-400 mb-6 group-hover:scale-110 transition-transform" size={40} />
                            <h3 className="font-black text-lg mb-3 uppercase tracking-tight">Overflow Intelligence</h3>
                            <p className="text-[10px] text-gray-400 mb-8 leading-relaxed font-bold uppercase tracking-widest opacity-80">Leads received outside active windows are automatically staged for the next operational cycle.</p>
                            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all hover:border-indigo-500/50">
                                Configure Global Queue
                            </button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                            <Calendar size={180} />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                            <Coffee className="text-amber-500" size={20} />
                            <h3 className="font-black text-[#111827] text-xs uppercase tracking-widest">Holiday Mode</h3>
                        </div>
                        <p className="text-[10px] text-[#6B7280] mb-6 font-bold uppercase tracking-widest opacity-70">Instantly suspend all autonomous assignments across global territories.</p>
                        <button className="w-full border border-gray-100 bg-gray-50/50 hover:bg-white py-4 rounded-2xl text-[9px] font-black text-[#111827] uppercase tracking-widest transition-all hover:border-rose-100 hover:text-rose-600">
                            Deploy Holiday Protocol
                        </button>
                    </div>

                    <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">System Timezone</span>
                            <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">UTC +5:30</span>
                        </div>
                        <div className="h-px bg-indigo-100 w-full" />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Server Status</span>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkingHours
