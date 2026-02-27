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
  X
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import useAppStore from '../../store/useStore'
import { cn } from '../../lib/utils'

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
          ? "bg-indigo-600/10 text-indigo-100 font-semibold"
          : "text-gray-400 hover:bg-gray-800/40 hover:text-gray-200"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
      )}
      <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? "text-indigo-400" : "text-gray-400 group-hover:text-gray-200")} />
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, setMobileMenuOpen])

  const standardMenus = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'Inbox', path: '/inbox' },
    { icon: Users, label: 'Leads', path: '/leads' },
    { icon: BrainCircuit, label: 'AI Qualification', path: '/ai-qualification' },
    { icon: Phone, label: 'Calls', path: '/calls' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  const superAdminMenus = [
    { icon: LayoutDashboard, label: 'Overview', path: '/super-admin' },
    { icon: MessageSquare, label: 'All Channels Control', path: '/super-admin/channels' },
    { icon: Phone, label: 'Billing & Plans', path: '/super-admin/billing' },
    { icon: BrainCircuit, label: 'Audit Logs', path: '/super-admin/audit' },
    { icon: Users, label: 'Global Users', path: '/super-admin/users' },
    { icon: BarChart3, label: 'System Analytics', path: '/super-admin/analytics' },
    { icon: Users, label: 'Admin Management', path: '/super-admin/admins' },
    { icon: Settings, label: 'Security Settings', path: '/super-admin/security' },
  ]

  const adminMenus = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: MessageSquare, label: 'Channels', path: '/admin/channels' },
    { icon: Globe, label: 'Routing Rules', path: '/admin/routing' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: BrainCircuit, label: 'AI Configuration', path: '/admin/ai-config' },
    { icon: Settings, label: 'CRM Integration', path: '/admin/crm-settings' },
    { icon: Clock, label: 'Working Hours', path: '/admin/working-hours' },
  ]

  const managerMenus = [
    { icon: LayoutDashboard, label: 'Performance Dashboard', path: '/manager' },
    { icon: PieChart, label: 'Lead Funnel Reports', path: '/manager/funnel' },
    { icon: Globe, label: 'Country Analytics', path: '/manager/country' },
    { icon: Clock, label: 'SLA Metrics', path: '/manager/sla' },
    { icon: Target, label: 'Conversion Tracking', path: '/manager/conversion' },
    { icon: Users2, label: 'Team Overview', path: '/manager/team' },
    { icon: BarChart, label: 'Call Reports', path: '/manager/calls' },
  ]

  const teamLeaderMenus = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/team-leader' },
    { icon: Inbox, label: 'Team Inbox Monitor', path: '/team-leader/inbox' },
    { icon: Users, label: 'Assigned Leads', path: '/team-leader/leads' },
    { icon: Target, label: 'Counselor Performance', path: '/team-leader/performance' },
    { icon: UserCheck, label: 'Reassign Leads', path: '/team-leader/reassign' },
    { icon: AlertTriangle, label: 'SLA Alerts', path: '/team-leader/sla' },
    { icon: FileText, label: 'Notes & Logs', path: '/team-leader/logs' },
  ]

  const counselorMenus = [
    { icon: Users, label: 'My Leads', path: '/counselor' },
    { icon: Inbox, label: 'Unified Inbox', path: '/inbox' },
    { icon: FileEdit, label: 'Lead Notes', path: '/counselor/notes' },
    { icon: Layers, label: 'Lead Stages', path: '/counselor/stages' },
    { icon: Sparkles, label: 'AI Summary View', path: '/counselor/ai-summary' },
    { icon: PhoneCall, label: 'Call Logging', path: '/counselor/calls' },
  ]

  const supportMenus = [
    { icon: MessageSquare, label: 'Unified Inbox', path: '/inbox' },
    { icon: UserPlus, label: 'New Leads Queue', path: '/support' },
    { icon: UserCheck, label: 'Lead Assignment', path: '/support/assign' },
    { icon: Zap, label: 'AI Qualification Status', path: '/support/ai-status' },
    { icon: MessageSquareQuote, label: 'Templates & Replies', path: '/support/templates' },
  ]

  const menuItems = role === 'Super Admin' ? superAdminMenus :
    (role === 'Admin' ? adminMenus :
      (role === 'Manager' ? managerMenus :
        (role === 'Team Leader' ? teamLeaderMenus :
          (role === 'Counselor' ? counselorMenus :
            (role === 'Customer Support' ? supportMenus : standardMenus)))))

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-[#111827] text-white transition-all duration-300 z-50 flex flex-col",
          // Responsive behavior
          sidebarCollapsed ? "lg:w-20" : "w-64",
          mobileMenuOpen ? "flex translate-x-0" : "hidden lg:flex lg:translate-x-0 -translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#1F2937] relative bg-indigo-500/5">
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                W
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">WhatsApp CRM</span>
            </div>
          )}
          {sidebarCollapsed && !mobileMenuOpen && (
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg mx-auto shadow-lg hover:scale-110 transition-transform cursor-pointer">
              W
            </div>
          )}

          {/* Close Button for Mobile */}
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>

          {/* Collapse Button for Desktop */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 bg-[#0a3d62] border border-[#111827] rounded-full items-center justify-center text-white hover:bg-[#0c4a75] transition-all hover:scale-110 z-50 shadow-md"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              {...item}
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
