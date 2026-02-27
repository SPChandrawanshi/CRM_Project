import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'

// Pages
import Dashboard from '../pages/Dashboard'
import Inbox from '../pages/Inbox'
import Leads from '../pages/Leads'
import AIQualification from '../pages/AIQualification'
import CallLogging from '../pages/CallLogging'
import RoutingRules from '../pages/RoutingRules'
import UserManagement from '../pages/UserManagement'
import AdminAIConfig from '../pages/AdminAIConfig'
import CrmIntegration from '../pages/CrmIntegration'
import WorkingHours from '../pages/WorkingHours'
import TemplatesLibrary from '../pages/TemplatesLibrary'

// Super Admin
import Overview from '../pages/super-admin/Overview'
import ChannelsControl from '../pages/super-admin/ChannelsControl'
import BillingPlans from '../pages/super-admin/BillingPlans'
import AuditLogs from '../pages/super-admin/AuditLogs'
import GlobalUsers from '../pages/super-admin/GlobalUsers'
import SystemAnalytics from '../pages/super-admin/SystemAnalytics'
import AdminManagement from '../pages/super-admin/AdminManagement'
import SecuritySettings from '../pages/super-admin/SecuritySettings'

// Admin
import AdminDashboard from '../pages/admin/Dashboard'

// Manager
import ManagerDashboard from '../pages/manager/Dashboard'
import LeadFunnel from '../pages/manager/LeadFunnel'
import CountryAnalytics from '../pages/manager/CountryAnalytics'
import SlaMetrics from '../pages/manager/SlaMetrics'
import ConversionTracking from '../pages/manager/ConversionTracking'
import TeamOverview from '../pages/manager/TeamOverview'
import CallReports from '../pages/manager/CallReports'

// Team Leader
import TeamLeaderDashboard from '../pages/TeamLeaderDashboard'
import TeamInbox from '../pages/team-leader/TeamInbox'
import AssignedLeads from '../pages/team-leader/AssignedLeads'
import CounselorPerformance from '../pages/team-leader/CounselorPerformance'
import ReassignLeads from '../pages/team-leader/ReassignLeads'
import SlaAlerts from '../pages/team-leader/SlaAlerts'
import ActivityLogs from '../pages/team-leader/ActivityLogs'

// Counselor
import LeadNotes from '../pages/counselor/LeadNotes'
import LeadStages from '../pages/counselor/LeadStages'
import AISummaryView from '../pages/counselor/AISummaryView'

// Support
import SupportDashboard from '../pages/support/SupportDashboard'
import LeadAssignment from '../pages/support/LeadAssignment'
import AiStatus from '../pages/support/AiStatus'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<DashboardLayout />}>
                {/* Standard Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/ai-qualification" element={<AIQualification />} />
                <Route path="/calls" element={<CallLogging />} />
                <Route path="/analytics" element={<SystemAnalytics />} />
                <Route path="/settings" element={<CrmIntegration />} />

                {/* Super Admin Routes */}
                <Route path="/super-admin" element={<Overview />} />
                <Route path="/super-admin/channels" element={<ChannelsControl />} />
                <Route path="/super-admin/billing" element={<BillingPlans />} />
                <Route path="/super-admin/audit" element={<AuditLogs />} />
                <Route path="/super-admin/users" element={<GlobalUsers />} />
                <Route path="/super-admin/analytics" element={<SystemAnalytics />} />
                <Route path="/super-admin/admins" element={<AdminManagement />} />
                <Route path="/super-admin/security" element={<SecuritySettings />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/channels" element={<ChannelsControl />} />
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

                {/* Counselor Routes */}
                <Route path="/counselor" element={<Leads />} />
                <Route path="/counselor/notes" element={<LeadNotes />} />
                <Route path="/counselor/stages" element={<LeadStages />} />
                <Route path="/counselor/ai-summary" element={<AISummaryView />} />
                <Route path="/counselor/calls" element={<CallLogging />} />

                {/* Support Routes */}
                <Route path="/support" element={<SupportDashboard />} />
                <Route path="/support/assign" element={<LeadAssignment />} />
                <Route path="/support/ai-status" element={<AiStatus />} />
                <Route path="/support/templates" element={<TemplatesLibrary />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}

export default AppRoutes
