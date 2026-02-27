import React, { useState } from 'react'
import { Calendar, MapPin, Users, Tag, ChevronDown, Filter } from 'lucide-react'
import useAppStore from '../../store/useStore'
import { cn } from '../../lib/utils'
import { useQueryClient } from '@tanstack/react-query'

const FilterItem = ({ label, value, icon: Icon, options, onChange }) => (
    <div className="relative flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group shrink-0">
        <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm group-hover:border-indigo-100 transition-colors">
            <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </div>
        <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{value}</span>
                <ChevronDown size={10} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </div>
        </div>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        >
            {options.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
)

const GlobalFilterBar = () => {
    const {
        country, setCountry,
        statusFilter, setStatusFilter,
        teamMember, setTeamMember,
        dateRange, setDateRange
    } = useAppStore()

    const [localCountry, setLocalCountry] = useState(country)
    const [localStatus, setLocalStatus] = useState(statusFilter)
    const [localTeamMember, setLocalTeamMember] = useState(teamMember || 'All Operators')
    const [localDateRange, setLocalDateRange] = useState(dateRange?.label || 'Last 30 Days')

    const queryClient = useQueryClient()

    const handleApplyFilters = () => {
        setCountry(localCountry)
        setStatusFilter(localStatus)
        setTeamMember(localTeamMember)
        setDateRange({ label: localDateRange, from: null, to: null })
        queryClient.invalidateQueries()
    }

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-5">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1 w-full lg:w-auto">
                <FilterItem
                    label="Chronology"
                    value={localDateRange}
                    icon={Calendar}
                    options={['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'All Records']}
                    onChange={setLocalDateRange}
                />
                <FilterItem
                    label="Territory"
                    value={localCountry}
                    icon={MapPin}
                    options={['Global', 'India', 'USA', 'UK', 'UAE', 'Canada']}
                    onChange={setLocalCountry}
                />
                <FilterItem
                    label="Lead State"
                    value={localStatus}
                    icon={Tag}
                    options={['All Stages', 'Hot Priority', 'Warm Inbound', 'Cold Prospect']}
                    onChange={setLocalStatus}
                />
                <FilterItem
                    label="Operator"
                    value={localTeamMember}
                    icon={Users}
                    options={['All Operators', 'John Doe', 'Sarah Johnson', 'Rahul K.']}
                    onChange={setLocalTeamMember}
                />
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto justify-end">
                <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 group">
                    <Filter size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Advanced Matrix</span>
                </button>
                <button
                    onClick={handleApplyFilters}
                    className="bg-[#020617] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95 ring-1 ring-slate-800"
                >
                    Apply Scopes
                </button>
            </div>
        </div>
    )
}

export default GlobalFilterBar
