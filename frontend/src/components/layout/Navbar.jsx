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
  const { role, sidebarCollapsed, setMobileMenuOpen } = useAppStore()
  const navigate = useNavigate()

  return (
    <header
      className={cn(
        "border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 h-20 fixed top-0 right-0 z-40 transition-all duration-500",
        "left-0 md:left-64",
        sidebarCollapsed ? "md:left-20" : "md:left-64"
      )}
    >
      <div className="flex items-center md:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 px-2 md:px-4">
        <h2 className="text-base md:text-lg font-bold text-slate-800">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-[#0a3d62] hover:bg-[#0a3d62]/5 rounded-xl transition-all relative group">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/20"></span>
        </button>

        <div className="h-10 w-px bg-slate-200 mx-1 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <h3 className="text-xs font-bold text-slate-900">{typeof role === 'object' ? role?.name : role}</h3>
            <p className="text-[10px] text-slate-400">Online</p>
          </div>
          <div className="h-10 w-10 bg-[#0a3d62] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-[0_4px_12px_rgba(10,61,98,0.3)]">
            {role?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

