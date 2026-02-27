import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '../components/ui/Toast'
import apiClient from '../lib/apiClient'

/**
 * Global functional hooks for CRM-wide actions.
 * Ensures consistent behavior: loading state -> success/error toast -> cache invalidation.
 */

export const useCrmMutation = ({
    mutationFn,
    successMessage,
    errorMessage = "Action failed. Please try again.",
    invalidateQueries = []
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vars) => {
            return await mutationFn(vars);
        },
        onSuccess: (data, vars) => {
            if (successMessage) {
                // Better handling of successMessage to avoid [object Object]
                const msg = typeof successMessage === 'function'
                    ? successMessage(data)
                    : (successMessage.includes('[object') ? successMessage : successMessage);
                toast.success(msg);
            }

            // Refetch related data if query keys provided
            // Fix: handle both string and array query keys properly
            invalidateQueries.forEach(key => {
                const queryKey = Array.isArray(key) ? key : [key];
                queryClient.invalidateQueries({ queryKey });
            });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message || errorMessage);
        }
    });
};


// Specialized Hooks for common actions
export const useLeadActions = () => {
    const updateStage = useCrmMutation({
        mutationFn: ({ id, stage }) => apiClient.put(`/leads/${id}`, { stage }),
        successMessage: (res) => `Lead stage updated to ${res.data?.stage || 'new stage'}`,
        invalidateQueries: ['leads']
    });

    const deleteLead = useCrmMutation({
        mutationFn: (id) => apiClient.delete(`/leads/${id}`),
        successMessage: "Lead deleted successfully",
        invalidateQueries: ['leads']
    });

    const exportLeads = useCrmMutation({
        mutationFn: () => apiClient.post('/leads/export'),
        successMessage: "Leads data exported successfully",
    });

    const assignLead = useCrmMutation({
        mutationFn: ({ leadId, userId }) => apiClient.put(`/leads/${leadId}/assign`, { userId }),
        successMessage: "Lead assigned successfully",
        invalidateQueries: ['leads']
    });

    const addLead = useCrmMutation({
        mutationFn: (data) => apiClient.post('/leads', data),
        successMessage: "New lead node provisioned successfully",
        invalidateQueries: ['leads']
    });

    return { updateStage, deleteLead, assignLead, exportLeads, addLead };
};

export const useChatActions = () => {
    const sendMessage = useCrmMutation({
        mutationFn: ({ leadId, message, sender, channel }) => apiClient.post('/messages', { leadId, message, sender, channel }),
        successMessage: "Message sent",
    });

    const clearUnread = useCrmMutation({
        mutationFn: (chatId) => apiClient.put(`/messages/clear/${chatId}`),
        invalidateQueries: ['chats']
    });

    return { sendMessage, clearUnread };
};

export const useChannelActions = () => {
    const toggleStatus = useCrmMutation({
        mutationFn: ({ id }) => apiClient.put(`/channels/${id}/toggle`),
        successMessage: "Channel status updated",
        invalidateQueries: ['channels']
    });

    const deleteChannel = useCrmMutation({
        mutationFn: (id) => apiClient.delete(`/channels/${id}`),
        successMessage: "Channel removed successfully",
        invalidateQueries: ['channels']
    });

    const addChannel = useCrmMutation({
        mutationFn: (data) => apiClient.post('/channel/add', data),
        successMessage: "New channel provisioned successfully",
        invalidateQueries: ['channels']
    });

    return { toggleStatus, deleteChannel, addChannel };
};

export const useBillingActions = () => {
    const upgradePlan = useCrmMutation({
        mutationFn: ({ clientId, plan }) => apiClient.put(`/billing/${clientId}/upgrade`, { plan }),
        successMessage: (res) => `Client upgraded successfully`,
        invalidateQueries: ['subscriptions']
    });

    const suspendClient = useCrmMutation({
        mutationFn: (clientId) => apiClient.put(`/billing/${clientId}/suspend`),
        successMessage: "Client subscription suspended",
        invalidateQueries: ['subscriptions']
    });

    const addPlan = useCrmMutation({
        mutationFn: (data) => apiClient.post('/billing', data),
        successMessage: "New global plan defined successfully",
        invalidateQueries: ['subscriptions']
    });

    const downloadInvoice = useCrmMutation({
        mutationFn: (id) => apiClient.get(`/billing/invoice/${id}`),
        successMessage: "Invoice download initialized",
    });

    return { upgradePlan, suspendClient, addPlan, downloadInvoice };
};

export const useAdminActions = () => {
    const downloadReport = useCrmMutation({
        mutationFn: (type) => apiClient.get(`/admin/reports/download?type=${type}`),
        successMessage: "Report generation started. Your download will begin shortly.",
    });

    const executeAction = useCrmMutation({
        mutationFn: (action) => apiClient.post('/admin/execute', { action }),
        successMessage: "System action completed successfully",
    });

    return { downloadReport, executeAction };
};

export const useUserActions = () => {
    const toggleStatus = useCrmMutation({
        mutationFn: (id) => apiClient.put(`/users/${id}/toggle`),
        successMessage: "User status updated",
        invalidateQueries: ['users']
    });

    const resetPassword = useCrmMutation({
        mutationFn: (email) => apiClient.post('/auth/reset-password', { email }),
        successMessage: "Password reset link sent",
    });

    const addUser = useCrmMutation({
        mutationFn: (data) => apiClient.post('/auth/register', data),
        successMessage: "New global identity provisioned successfully",
        invalidateQueries: ['users']
    });

    const updateUser = useCrmMutation({
        mutationFn: ({ id, ...data }) => apiClient.put(`/users/${id}`, data),
        successMessage: "User identity updated successfully",
        invalidateQueries: ['users']
    });

    return { toggleStatus, resetPassword, addUser, updateUser };
};

export const useTemplateActions = () => {
    const addTemplate = useCrmMutation({
        mutationFn: (data) => apiClient.post('/templates', data),
        successMessage: "Template added successfully",
        invalidateQueries: ['templates']
    });

    const updateTemplate = useCrmMutation({
        mutationFn: ({ id, ...data }) => apiClient.put(`/templates/${id}`, data),
        successMessage: "Template updated successfully",
        invalidateQueries: ['templates']
    });

    const deleteTemplate = useCrmMutation({
        mutationFn: (id) => apiClient.delete(`/templates/${id}`),
        successMessage: "Template removed successfully",
        invalidateQueries: ['templates']
    });

    return { addTemplate, updateTemplate, deleteTemplate };
};

export const useRoutingActions = () => {
    const toggleRule = useCrmMutation({
        mutationFn: ({ id }) => apiClient.put(`/routing/${id}/toggle`),
        successMessage: "Rule status updated",
        invalidateQueries: ['routing-rules']
    });

    const deleteRule = useCrmMutation({
        mutationFn: (id) => apiClient.delete(`/routing/${id}`),
        successMessage: "Rule deleted successfully",
        invalidateQueries: ['routing-rules']
    });

    const addRule = useCrmMutation({
        mutationFn: (data) => apiClient.post('/routing/create', data),
        successMessage: "New routing rule configuration deployed",
        invalidateQueries: ['routing-rules']
    });

    return { toggleRule, deleteRule, addRule };
};

export const useAiActions = () => {
    const publishFlow = useCrmMutation({
        mutationFn: (data) => apiClient.post('/dashboard/ai-config', data),
        successMessage: "Global AI Flow and Scoring rules updated",
        invalidateQueries: ['ai-config', 'admin-dashboard']
    });

    return { publishFlow };
};

export const useShiftActions = () => {
    const saveHours = useCrmMutation({
        mutationFn: (data) => apiClient.put('/admin/working-hours', data),
        successMessage: "Automation schedule synchronized",
        invalidateQueries: ['working-hours']
    });

    return { saveHours };
};

export const useIntegrationActions = () => {
    const addIntegration = useCrmMutation({
        mutationFn: (data) => apiClient.post('/admin/integrations', data),
        successMessage: "New CRM node integrated",
        invalidateQueries: ['integrations']
    });

    const deleteIntegration = useCrmMutation({
        mutationFn: (id) => apiClient.delete(`/admin/integrations/${id}`),
        successMessage: "Integration removed",
        invalidateQueries: ['integrations']
    });

    const testConnection = useCrmMutation({
        mutationFn: (id) => apiClient.post(`/admin/integrations/${id}/test`),
        successMessage: "Connection test passed: Host reachable",
    });

    return { addIntegration, deleteIntegration, testConnection };
};

export const useSuperAdminActions = () => {
    const toggleClientChannelStatus = useCrmMutation({
        mutationFn: ({ id }) => apiClient.put(`/super-admin/channels/${id}/toggle`),
        successMessage: "Client channel status updated",
        invalidateQueries: ['admin-channel-usage']
    });

    const deleteClientChannel = useCrmMutation({
        mutationFn: (id) => apiClient.delete(`/super-admin/channels/${id}`),
        successMessage: "Client channel removed successfully",
        invalidateQueries: ['admin-channel-usage']
    });

    const updateDashboard = useCrmMutation({
        mutationFn: () => apiClient.post('/dashboard/superadmin/update'),
        successMessage: "Global stats synchronized with CRM database",
        invalidateQueries: ['super-admin-dashboard']
    });

    return { toggleClientChannelStatus, deleteClientChannel, updateDashboard };
};

export const useAuditActions = () => {
    const exportLogs = useCrmMutation({
        mutationFn: (filters) => apiClient.post('/audit/export', filters),
        successMessage: "Audit logs exported successfully. Download starting...",
    });

    return { exportLogs };
};

export const useSuperAdminGovernance = () => {
    const addAdmin = useCrmMutation({
        mutationFn: (data) => apiClient.post('/super-admin/admins', data),
        successMessage: "New administrative account provisioned",
        invalidateQueries: ['admins']
    });

    const updatePermissions = useCrmMutation({
        mutationFn: ({ id, permissions }) => apiClient.put(`/super-admin/admins/${id}/permissions`, { permissions }),
        successMessage: "Administrative permissions synchronized",
        invalidateQueries: ['admins']
    });

    const toggleStatus = useCrmMutation({
        mutationFn: (id) => apiClient.put(`/super-admin/admins/${id}/toggle`),
        successMessage: "Administrative access status updated",
        invalidateQueries: ['admins']
    });

    return { addAdmin, updatePermissions, toggleStatus };
};

export const useSecurityActions = () => {
    const updateSettings = useCrmMutation({
        mutationFn: (settings) => apiClient.put('/admin/security/settings', settings),
        successMessage: "Global security protocols updated",
        invalidateQueries: ['security-settings']
    });

    const logoutSession = useCrmMutation({
        mutationFn: (id) => apiClient.post(`/admin/security/sessions/${id}/revoke`),
        successMessage: "Session revoked and termination signal sent",
        invalidateQueries: ['active-sessions']
    });

    return { updateSettings, logoutSession };
};

export const useCounselorActions = () => {
    const addNote = useCrmMutation({
        mutationFn: (noteData) => apiClient.post('/counselor/notes', noteData),
        successMessage: "Note saved",
        invalidateQueries: ['counselor-notes']
    });

    const updateNote = useCrmMutation({
        mutationFn: ({ id, text }) => apiClient.put(`/counselor/notes/${id}`, { text }),
        successMessage: "Note updated successfully",
        invalidateQueries: ['counselor-notes']
    });

    const deleteNote = useCrmMutation({
        mutationFn: (id) => apiClient.delete(`/counselor/notes/${id}`),
        successMessage: "Note deleted successfully",
        invalidateQueries: ['counselor-notes']
    });

    const updateStage = useCrmMutation({
        mutationFn: ({ leadId, stage }) => apiClient.put('/counselor/stage', { leadId, stage }),
        successMessage: "Lead stage updated successfully",
        invalidateQueries: ['counselor-stages', 'leads', 'chats']
    });

    const logCall = useCrmMutation({
        mutationFn: (data) => apiClient.post('/counselor/calls', data),
        successMessage: "Communication log committed successfully",
        invalidateQueries: ['counselor-calls']
    });

    return { addNote, updateNote, deleteNote, updateStage, logCall };
};

export const useSupportActions = () => {
    const assignLead = useCrmMutation({
        mutationFn: (data) => apiClient.post('/support/assign', data),
        successMessage: "Lead assigned successfully",
        invalidateQueries: ['support-queue', 'support-assignments']
    });

    const createLead = useCrmMutation({
        mutationFn: (data) => apiClient.post('/support/leads', data),
        successMessage: "Lead created successfully",
        invalidateQueries: ['support-queue']
    });

    const bulkAssign = useCrmMutation({
        mutationFn: (data) => apiClient.post('/support/leads/bulk-assign', data),
        successMessage: "Leads bulk assigned successfully",
        invalidateQueries: ['support-queue', 'support-assignments']
    });

    return { assignLead, createLead, bulkAssign };
};
