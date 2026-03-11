import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PageLayout from './components/layout/PageLayout'
import api, { socket } from './services/api'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Inbox from './pages/Inbox'
import AIQualification from './pages/AIQualification'
import SuperAdminOverview from './pages/super-admin/Overview'
import ChannelsControl from './pages/super-admin/ChannelsControl'
import BillingPlans from './pages/super-admin/BillingPlans'
import AuditLogs from './pages/super-admin/AuditLogs'
import GlobalUsers from './pages/super-admin/GlobalUsers'
import SystemAnalytics from './pages/super-admin/SystemAnalytics'
import AdminManagement from './pages/super-admin/AdminManagement'
import SecuritySettings from './pages/super-admin/SecuritySettings'
import AdminDashboard from './pages/AdminDashboard'
import RoutingRules from './pages/RoutingRules'
import UserManagement from './pages/UserManagement'
import AdminAIConfig from './pages/AdminAIConfig'
import WorkingHours from './pages/WorkingHours'
import ChannelSetup from './pages/admin/ChannelSetup'
import CrmIntegration from './pages/CrmIntegration'
import ManagerDashboard from './pages/manager/Dashboard'
import LeadFunnel from './pages/manager/LeadFunnel'
import CountryAnalytics from './pages/manager/CountryAnalytics'
import SlaMetrics from './pages/manager/SlaMetrics'
import ConversionTracking from './pages/manager/ConversionTracking'
import TeamOverview from './pages/manager/TeamOverview'
import CallReports from './pages/manager/CallReports'
import TeamLeaderDashboard from './pages/TeamLeaderDashboard'
import TeamInbox from './pages/team-leader/TeamInbox'
import AssignedLeads from './pages/team-leader/AssignedLeads'
import CounselorPerformance from './pages/team-leader/CounselorPerformance'
import ReassignLeads from './pages/team-leader/ReassignLeads'
import SlaAlerts from './pages/team-leader/SlaAlerts'
import ActivityLogs from './pages/team-leader/ActivityLogs'
import CounselorDashboard from './pages/CounselorDashboard'
import LeadNotes from './pages/counselor/LeadNotes'
import LeadStages from './pages/counselor/LeadStages'
import AISummaryView from './pages/counselor/AISummaryView'
import CallLogging from './pages/CallLogging'
import SupportDashboard from './pages/support/SupportDashboard'
import LeadAssignment from './pages/support/LeadAssignment'
import AiStatus from './pages/support/AiStatus'
import TemplatesLibrary from './pages/TemplatesLibrary'
import LoginPage from './pages/auth/LoginPage'
import AnalyticsPage from './pages/AnalyticsPage'

// Admin Pages
import AdminUsers from './pages/admin/Users'

// Team Member Pages
import TeamMemberDashboard from './pages/team-member/Dashboard'

// Service User Pages
import ServiceUserDashboard from './pages/service-user/Dashboard'
import { useNavigate, useLocation } from 'react-router-dom'

import useAppStore, { ROLE_MAP } from './store/useStore'
import { ToastContainer } from './components/ui/Toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Prevent infinite buffering on 403 or network failures
      refetchOnWindowFocus: false,
      staleTime: 30000 // Cache for 30s to prevent constant reloading
    },
    mutations: {
      retry: false
    }
  }
})

const roleHomePages = {
  'Super Admin': '/super-admin',
  'Admin': '/admin',
  'Manager': '/manager',
  'Team Leader': '/team-leader',
  'Counselor': '/counselor',
  'Customer Support': '/support',
}

function AppRoutes() {
  const { isAuthenticated, role, login } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData && !isAuthenticated) {
      const parsed = JSON.parse(userData)
      const displayRole = ROLE_MAP[parsed.role] || parsed.role
      login(displayRole, parsed)
    }
  }, [isAuthenticated, login])

  if (!isAuthenticated && !localStorage.getItem('user')) {
    return (
      <>
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
        <ToastContainer />
      </>
    )
  }

  return (
    <PageLayout>
      <Routes>
        {/* Redirect bare "/" to role-specific homepage */}
        <Route path="/" element={<Navigate to={roleHomePages[role] || '/super-admin'} replace />} />

        <Route path="/inbox" element={<Inbox />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/ai-qualification" element={<AIQualification />} />
        <Route path="/super-admin" element={<SuperAdminOverview />} />
        <Route path="/super-admin/channels" element={<ChannelsControl />} />
        <Route path="/super-admin/billing" element={<BillingPlans />} />
        <Route path="/super-admin/audit" element={<AuditLogs />} />
        <Route path="/super-admin/users" element={<GlobalUsers />} />
        <Route path="/super-admin/analytics" element={<SystemAnalytics />} />
        <Route path="/super-admin/admins" element={<AdminManagement />} />
        <Route path="/super-admin/security" element={<SecuritySettings />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/channels" element={<ChannelSetup />} />
        <Route path="/admin/routing" element={<RoutingRules />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/ai-config" element={<AdminAIConfig />} />
        <Route path="/admin/crm-settings" element={<CrmIntegration />} />
        <Route path="/admin/working-hours" element={<WorkingHours />} />

        {/* Manager Routes */}
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/funnel" element={<LeadFunnel />} />
        <Route path="/manager/country" element={<CountryAnalytics />} />
        <Route path="/manager/sla" element={<SlaMetrics />} />
        <Route path="/manager/conversion" element={<ConversionTracking />} />
        <Route path="/manager/team" element={<TeamOverview />} />
        <Route path="/manager/calls" element={<CallReports />} />

        {/* Team Leader Routes */}
        <Route path="/team-leader" element={<TeamLeaderDashboard />} />
        <Route path="/team-leader/inbox" element={<TeamInbox />} />
        <Route path="/team-leader/leads" element={<AssignedLeads />} />
        <Route path="/team-leader/performance" element={<CounselorPerformance />} />
        <Route path="/team-leader/reassign" element={<ReassignLeads />} />
        <Route path="/team-leader/sla" element={<SlaAlerts />} />
        <Route path="/team-leader/logs" element={<ActivityLogs />} />

        {/* Team Member Routes */}
        <Route path="/team-member/dashboard" element={<TeamMemberDashboard />} />

        {/* Counselor Routes */}
        <Route path="/counselor" element={<CounselorDashboard />} />
        <Route path="/counselor/notes" element={<LeadNotes />} />
        <Route path="/counselor/stages" element={<LeadStages />} />
        <Route path="/counselor/ai-summary" element={<AISummaryView />} />
        <Route path="/counselor/calls" element={<CallLogging />} />

        {/* Customer Support Routes */}
        <Route path="/support" element={<SupportDashboard />} />
        <Route path="/support/assign" element={<LeadAssignment />} />
        <Route path="/support/ai-status" element={<AiStatus />} />
        <Route path="/support/templates" element={<TemplatesLibrary />} />

        {/* Service User Routes */}
        <Route path="/service-user/dashboard" element={<ServiceUserDashboard />} />

        <Route path="/calls" element={<div className="text-center py-20 text-gray-500">Calls Page (Work in Progress)</div>} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<div className="text-center py-20 text-gray-500">Settings Page (Work in Progress)</div>} />
      </Routes>
    </PageLayout>
  )
}

function App() {
  const { login } = useAppStore()


  // Global Socket Listener for Real-Time UI Updates
  useEffect(() => {
    const handleDashboardRefresh = () => {
      console.log('[Socket] Refreshing dashboard data...');
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['manager-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['team-leader-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['counselor-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['support-dashboard'] });
    };

    const handleLeadUpdate = () => {
      console.log('[Socket] Lead mutated - refreshing lists...');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['support-queue'] });
      handleDashboardRefresh(); // Stats often change when leads change
    };

    const handleMessageEvent = () => {
      console.log('[Socket] New message - refreshing chats...');
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    };

    socket.on('dashboard:refresh', handleDashboardRefresh);
    socket.on('lead:new', handleLeadUpdate);
    socket.on('lead:update', handleLeadUpdate);
    socket.on('lead:delete', handleLeadUpdate);
    socket.on('message:new', handleMessageEvent);
    socket.on('new_message', handleMessageEvent);

    return () => {
      socket.off('dashboard:refresh', handleDashboardRefresh);
      socket.off('lead:new', handleLeadUpdate);
      socket.off('lead:update', handleLeadUpdate);
      socket.off('lead:delete', handleLeadUpdate);
      socket.off('message:new', handleMessageEvent);
      socket.off('new_message', handleMessageEvent);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
        <ToastContainer />
      </Router>
    </QueryClientProvider>
  )
}

export default App


