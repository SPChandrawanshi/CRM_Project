import React, { useEffect } from 'react'
import {
  LayoutDashboard,
  Inbox,
  Users,
  BrainCircuit,
  Phone,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Target,
  Users2,
  Globe,
  Clock,
  PieChart,
  BarChart,
  AlertTriangle,
  FileText,
  UserCheck,
  FileEdit,
  Layers,
  Sparkles,
  PhoneCall,
  UserPlus,
  Zap,
  MessageSquareQuote,
  RefreshCcw,
  ShieldCheck,
  X,
  Headphones,
  TrendingUp,
  Activity,
  Calendar,
  Link2,
  Building2,
  CreditCard,
  ScrollText,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import useAppStore from '../../store/useStore'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

const IconMap = {
  LayoutDashboard,
  Inbox,
  Users,
  BrainCircuit,
  Phone,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Target,
  Users2,
  Globe,
  Clock,
  PieChart,
  BarChart,
  AlertTriangle,
  FileText,
  UserCheck,
  FileEdit,
  Layers,
  Sparkles,
  PhoneCall,
  UserPlus,
  Zap,
  MessageSquareQuote,
  RefreshCcw,
  ShieldCheck,
  X,
  Headphones,
  TrendingUp,
  Activity,
  Calendar,
  Link2,
  Building2,
  CreditCard,
  ScrollText,
}

// Fallback menus when role doesn't match
const FALLBACK_MENUS = [
  { icon: 'LayoutDashboard', label: 'Dashboard', path: '/' },
  { icon: 'Inbox', label: 'Inbox', path: '/inbox' },
  { icon: 'Users', label: 'Leads', path: '/leads' },
]

const SidebarItem = ({ icon: Icon, label, path, collapsed, onClick }) => {
  const location = useLocation()
  const isActive = location.pathname === path

  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group no-underline relative",
        isActive
          ? "bg-[#0a3d62]/10 text-white font-semibold"
          : "text-gray-400 hover:bg-gray-800/40 hover:text-gray-200"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-[#0a3d62] shadow-[0_0_10px_rgba(10,61,98,0.5)]" />
      )}
      <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? "text-[#0a3d62]" : "text-gray-400 group-hover:text-gray-200")} />
      {!collapsed && <span className="text-sm">{label}</span>}
    </Link>
  )
}

const Sidebar = () => {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    role,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useAppStore()

  const location = useLocation()

  // Fetch menus dynamically
  const roleName = typeof role === 'object' ? (role?.name || 'Guest') : (role || 'Guest')
  const dashboardId = roleName.toLowerCase().replace(' ', '-')

  const { data: menuResp } = useQuery({
    queryKey: ['sidebar-menus', dashboardId],
    queryFn: () => api.get(`/system/menus/${dashboardId}`),
    enabled: !!dashboardId
  })

  // Get menus for current role
  const menuItems = menuResp?.data || FALLBACK_MENUS

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, setMobileMenuOpen])

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
            "fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm transition-all duration-500 ease-in-out",
            mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-[#111827] text-white transition-all duration-500 ease-in-out z-[70] flex flex-col shadow-2xl",
          sidebarCollapsed ? "md:w-20" : "w-64",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#1F2937] relative bg-[#0a3d62]/5">
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#0a3d62] rounded-lg flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(10,61,98,0.3)]">
                W
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">WhatsApp CRM</span>
            </div>
          )}
          {sidebarCollapsed && !mobileMenuOpen && (
            <div className="h-8 w-8 bg-[#0a3d62] rounded-lg flex items-center justify-center font-bold text-lg mx-auto shadow-lg hover:scale-110 transition-transform cursor-pointer">
              W
            </div>
          )}

          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex absolute -right-3 top-20 h-6 w-6 bg-[#0a3d62] border border-[#111827] rounded-full items-center justify-center text-white hover:bg-[#0c4a75] transition-all hover:scale-110 z-50 shadow-md"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Role Badge */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-[#1F2937]">
            <span className="text-[9px] font-black text-[#0a3d62] uppercase tracking-[0.2em] bg-[#0a3d62]/10 px-2.5 py-1 rounded-full border border-[#0a3d62]/20">
              {typeof role === 'object' ? (role?.name || 'Guest') : (role || 'Guest')}
            </span>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              {...item}
              icon={IconMap[item.icon] || LayoutDashboard}
              collapsed={sidebarCollapsed && !mobileMenuOpen}
              onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-[#1F2937] space-y-4">
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div className="bg-[#1F2937]/50 p-3 rounded-xl border border-[#374151]/50 backdrop-blur-sm">
              <p className="text-[10px] text-gray-400 font-semibold mb-2 uppercase tracking-wider">Quota Usage</p>
              <div className="w-full bg-[#374151] rounded-full h-1.5 mb-2 overflow-hidden">
                <div className="bg-[#0a3d62] h-1.5 rounded-full w-3/4 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(10,61,98,0.5)]"></div>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-300">75% Used</span>
                <span className="text-gray-500">750/1000</span>
              </div>
            </div>
          )}

          <button
            onClick={() => useAppStore.getState().logout()}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group text-rose-400 hover:bg-rose-500/10 hover:text-rose-300",
              sidebarCollapsed && !mobileMenuOpen ? "justify-center" : ""
            )}
          >
            <Zap className="h-5 w-5 shrink-0" />
            {(!sidebarCollapsed || mobileMenuOpen) && <span className="text-sm font-bold uppercase tracking-widest">Logout Protocol</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
