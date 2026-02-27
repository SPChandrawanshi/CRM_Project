import React, { useState } from 'react'
import { Search, Bell, User, MapPin, ChevronDown, Menu } from 'lucide-react'
import useAppStore from '../../store/useStore'
import { cn } from '../../lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const roleHomePages = {
  'Super Admin': '/super-admin',
  'Admin': '/admin',
  'Manager': '/manager',
  'Team Leader': '/team-leader',
  'Counselor': '/counselor',
  'Customer Support': '/support',
}

const Navbar = () => {
  const { role, sidebarCollapsed, setMobileMenuOpen, setSearchTerm } = useAppStore()
  const [searchInput, setSearchInput] = useState('')
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(searchInput)
      queryClient.invalidateQueries()
    }
  }

  const handleRoleChange = (e) => {
    const newRole = e.target.value
    useAppStore.getState().setRole(newRole)
    const homePath = roleHomePages[newRole] || '/'
    navigate(homePath)
  }

  return (
    <header
      className={cn(
        "h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 fixed top-0 right-0 z-40 transition-all duration-500",
        "left-0 lg:left-72",
        sidebarCollapsed && "lg:left-20"
      )}
    >
      <div className="flex items-center gap-6 flex-1">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="relative w-full max-w-xl hidden md:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search Intelligence Terminal (Press Enter)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative group" title="Intelligence Alerts">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/20 group-hover:scale-125 transition-transform"></span>
        </button>

        <div className="h-10 w-px bg-slate-200 mx-1 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="relative inline-block">
              <select
                value={role}
              onChange={handleRoleChange}
                className="appearance-none bg-transparent pr-5 text-xs font-black text-slate-900 uppercase tracking-widest border-none focus:ring-0 cursor-pointer text-right block p-0"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Team Leader">Team Leader</option>
                <option value="Counselor">Counselor</option>
                <option value="Customer Support">CS Core</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Operator Profile</p>
          </div>
          <div className="h-11 w-11 bg-[#020617] rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xl shadow-slate-900/10 border border-slate-700/50">
            JD
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
