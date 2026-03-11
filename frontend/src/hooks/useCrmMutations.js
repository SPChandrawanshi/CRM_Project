import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '../components/ui/Toast'
import api from '../services/api'

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
        mutationFn: ({ id, stage }) => api.put(`/leads/${id}`, { stage }),
        successMessage: (res) => `Lead stage updated to ${res.data?.stage || 'new stage'}`,
        invalidateQueries: ['leads']
    });

    const deleteLead = useCrmMutation({
        mutationFn: (id) => api.delete(`/leads/${id}`),
        successMessage: "Lead deleted successfully",
        invalidateQueries: ['leads']
    });

    const exportLeads = useCrmMutation({
        mutationFn: async () => {
            const response = await api.post('/leads/export', {}, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            return { success: true };
        },
        successMessage: "Leads data exported successfully",
    });

    const assignLead = useCrmMutation({
        mutationFn: ({ leadId, userId }) => api.put(`/leads/${leadId}/assign`, { userId }),
        successMessage: "Lead assigned successfully",
        invalidateQueries: ['leads']
    });

    const addLead = useCrmMutation({
        mutationFn: (data) => api.post('/leads', data),
        successMessage: "New lead node provisioned successfully",
        invalidateQueries: ['leads']
    });

    return { updateStage, deleteLead, assignLead, exportLeads, addLead };
};

export const useChatActions = () => {
    const sendMessage = useCrmMutation({
        mutationFn: ({ leadId, message, sender, channel }) => api.post('/messages', { leadId, message, sender, channel }),
        successMessage: "Message sent",
    });

    const clearUnread = useCrmMutation({
        mutationFn: (chatId) => api.put(`/messages/clear/${chatId}`),
        invalidateQueries: ['chats']
    });

    return { sendMessage, clearUnread };
};

export const useChannelActions = () => {
    const toggleStatus = useCrmMutation({
        mutationFn: ({ id }) => api.put(`/channels/${id}/toggle`),
        successMessage: "Channel status updated",
        invalidateQueries: ['channels']
    });

    const deleteChannel = useCrmMutation({
        mutationFn: (id) => api.delete(`/channels/${id}`),
        successMessage: "Channel removed successfully",
        invalidateQueries: ['channels']
    });

    const addChannel = useCrmMutation({
        mutationFn: (data) => api.post('/channels', data),
        successMessage: "New channel provisioned successfully",
        invalidateQueries: ['channels']
    });

    return { toggleStatus, deleteChannel, addChannel };
};

export const useBillingActions = () => {
    const upgradePlan = useCrmMutation({
        mutationFn: ({ clientId, plan }) => api.put(`/billing/${clientId}/upgrade`, { plan }),
        successMessage: (res) => `Client upgraded successfully`,
        invalidateQueries: ['subscriptions']
    });

    const suspendClient = useCrmMutation({
        mutationFn: (clientId) => api.put(`/billing/${clientId}/suspend`),
        successMessage: "Client subscription suspended",
        invalidateQueries: ['subscriptions']
    });

    const addPlan = useCrmMutation({
        mutationFn: (data) => api.post('/billing', data),
        successMessage: "New global plan defined successfully",
        invalidateQueries: ['subscriptions']
    });

    const downloadInvoice = useCrmMutation({
        mutationFn: (id) => api.get(`/billing/invoice/${id}`),
        successMessage: "Invoice download initialized",
    });

    const updatePaymentMethod = useCrmMutation({
        mutationFn: (clientId) => api.put(`/billing/${clientId}/payment-method`),
        successMessage: "Secure payment portal link generated for client",
    });

    return { upgradePlan, suspendClient, addPlan, downloadInvoice, updatePaymentMethod };
};

export const useSnapshot = () => {
    const createSnapshot = useCrmMutation({
        mutationFn: () => api.post('/dashboard/superadmin/snapshot'),
        successMessage: "Database snapshot created successfully",
    });

    return { createSnapshot };
};

export const useAdminActions = () => {
    const downloadReport = useCrmMutation({
        mutationFn: async (type) => {
            const response = await api.get(`/admin/reports/download?type=${type}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `global-system-report-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            return { success: true };
        },
        successMessage: "Report generation started. Your download will begin shortly.",
    });

    const executeAction = useCrmMutation({
        mutationFn: (action) => api.post('/admin/execute', { action }),
        successMessage: "System action completed successfully",
    });

    return { downloadReport, executeAction };
};

export const useUserActions = () => {
    const toggleStatus = useCrmMutation({
        mutationFn: (id) => api.put(`/users/${id}/toggle`),
        successMessage: "User status updated",
        invalidateQueries: ['users']
    });

    const resetPassword = useCrmMutation({
        mutationFn: (email) => api.post('/auth/reset-password', { email }),
        successMessage: "Password reset link sent",
    });

    const addUser = useCrmMutation({
        mutationFn: (data) => api.post('/auth/register', data),
        successMessage: "New global identity provisioned successfully",
        invalidateQueries: ['users']
    });

    const updateUser = useCrmMutation({
        mutationFn: ({ id, ...data }) => api.put(`/users/${id}`, data),
        successMessage: "User identity updated successfully",
        invalidateQueries: ['users']
    });

    const deleteUser = useCrmMutation({
        mutationFn: (id) => api.delete(`/users/${id}`),
        successMessage: "User deleted successfully",
        invalidateQueries: ['users']
    });

    return { toggleStatus, resetPassword, addUser, updateUser, deleteUser };
};

export const useTemplateActions = () => {
    const addTemplate = useCrmMutation({
        mutationFn: (data) => api.post('/templates', data),
        successMessage: "Template added successfully",
        invalidateQueries: ['templates']
    });

    const updateTemplate = useCrmMutation({
        mutationFn: ({ id, ...data }) => api.put(`/templates/${id}`, data),
        successMessage: "Template updated successfully",
        invalidateQueries: ['templates']
    });

    const deleteTemplate = useCrmMutation({
        mutationFn: (id) => api.delete(`/templates/${id}`),
        successMessage: "Template removed successfully",
        invalidateQueries: ['templates']
    });

    return { addTemplate, updateTemplate, deleteTemplate };
};

export const useCareTemplateActions = () => {
    const addTemplate = useCrmMutation({
        mutationFn: (data) => api.post('/care-templates', data),
        successMessage: "Care Template defined successfully",
        invalidateQueries: ['care-templates']
    });

    const updateTemplate = useCrmMutation({
        mutationFn: ({ id, ...data }) => api.put(`/care-templates/${id}`, data),
        successMessage: "Care Template config updated",
        invalidateQueries: ['care-templates']
    });

    const deleteTemplate = useCrmMutation({
        mutationFn: (id) => api.delete(`/care-templates/${id}`),
        successMessage: "Care Template deactivated and deleted",
        invalidateQueries: ['care-templates']
    });

    return { addTemplate, updateTemplate, deleteTemplate };
};

export const useRotaActions = () => {
    const addRota = useCrmMutation({
        mutationFn: (data) => api.post('/rota', data),
        successMessage: "Rota assigned successfully",
        invalidateQueries: ['rota']
    });

    const updateRota = useCrmMutation({
        mutationFn: ({ id, ...data }) => api.put(`/rota/${id}`, data),
        successMessage: "Rota shift updated",
        invalidateQueries: ['rota']
    });

    const deleteRota = useCrmMutation({
        mutationFn: (id) => api.delete(`/rota/${id}`),
        successMessage: "Rota removed from calendar",
        invalidateQueries: ['rota']
    });

    return { addRota, updateRota, deleteRota };
};

export const useRoutingActions = () => {
    const toggleRule = useCrmMutation({
        mutationFn: ({ id }) => api.put(`/routing/${id}/toggle`),
        successMessage: "Rule status updated",
        invalidateQueries: ['routing-rules']
    });

    const deleteRule = useCrmMutation({
        mutationFn: (id) => api.delete(`/routing/${id}`),
        successMessage: "Rule deleted successfully",
        invalidateQueries: ['routing-rules']
    });

    const addRule = useCrmMutation({
        mutationFn: (data) => api.post('/routing/create', data),
        successMessage: "New routing rule configuration deployed",
        invalidateQueries: ['routing-rules']
    });

    const updateRule = useCrmMutation({
        mutationFn: ({ id, ...data }) => api.put(`/routing/${id}`, data),
        successMessage: "Routing rule configuration updated",
        invalidateQueries: ['routing-rules']
    });

    return { toggleRule, deleteRule, addRule, updateRule };
};

export const useAiActions = () => {
    const publishFlow = useCrmMutation({
        mutationFn: (data) => api.post('/dashboard/ai-config', data),
        successMessage: "Global AI Flow and Scoring rules updated",
        invalidateQueries: ['ai-config', 'admin-dashboard']
    });

    return { publishFlow };
};

export const useShiftActions = () => {
    const saveHours = useCrmMutation({
        mutationFn: (data) => api.put('/admin/working-hours', data),
        successMessage: "Automation schedule synchronized",
        invalidateQueries: ['working-hours']
    });

    return { saveHours };
};

export const useIntegrationActions = () => {
    const addIntegration = useCrmMutation({
        mutationFn: (data) => api.post('/admin/integrations', data),
        successMessage: "New CRM node integrated",
        invalidateQueries: ['integrations']
    });

    const deleteIntegration = useCrmMutation({
        mutationFn: (id) => api.delete(`/admin/integrations/${id}`),
        successMessage: "Integration removed",
        invalidateQueries: ['integrations']
    });

    const testConnection = useCrmMutation({
        mutationFn: (id) => api.post(`/admin/integrations/${id}/test`),
        successMessage: "Connection test passed: Host reachable",
    });

    return { addIntegration, deleteIntegration, testConnection };
};

export const useSuperAdminActions = () => {
    const toggleClientChannelStatus = useCrmMutation({
        mutationFn: ({ id }) => api.put(`/super-admin/channels/${id}/toggle`),
        successMessage: "Client channel status updated",
        invalidateQueries: ['admin-channel-usage']
    });

    const deleteClientChannel = useCrmMutation({
        mutationFn: (id) => api.delete(`/super-admin/channels/${id}`),
        successMessage: "Client channel removed successfully",
        invalidateQueries: ['admin-channel-usage']
    });

    const updateDashboard = useCrmMutation({
        mutationFn: () => api.post('/dashboard/superadmin/update'),
        successMessage: "Global stats synchronized with CRM database",
        invalidateQueries: ['super-admin-dashboard']
    });

    return { toggleClientChannelStatus, deleteClientChannel, updateDashboard };
};

export const useAuditActions = () => {
    const exportLogs = useCrmMutation({
        mutationFn: async (filters) => {
            const response = await api.post('/audit/export', filters, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            return { success: true };
        },
        successMessage: "Audit logs exported successfully. Download starting...",
    });

    return { exportLogs };
};

export const useSuperAdminGovernance = () => {
    const addAdmin = useCrmMutation({
        mutationFn: (data) => api.post('/super-admin/admins', data),
        successMessage: "New administrative account provisioned",
        invalidateQueries: ['admins']
    });

    const updatePermissions = useCrmMutation({
        mutationFn: ({ id, permissions }) => api.put(`/super-admin/admins/${id}/permissions`, { permissions }),
        successMessage: "Administrative permissions synchronized",
        invalidateQueries: ['admins']
    });

    const toggleStatus = useCrmMutation({
        mutationFn: (id) => api.put(`/super-admin/admins/${id}/toggle`),
        successMessage: "Administrative access status updated",
        invalidateQueries: ['admins']
    });

    return { addAdmin, updatePermissions, toggleStatus };
};

export const useSecurityActions = () => {
    const updateSettings = useCrmMutation({
        mutationFn: (settings) => api.put('/admin/security/settings', settings),
        successMessage: "Global security protocols updated",
        invalidateQueries: ['security-settings']
    });

    const logoutSession = useCrmMutation({
        mutationFn: (id) => api.post(`/admin/security/sessions/${id}/revoke`),
        successMessage: "Session revoked and termination signal sent",
        invalidateQueries: ['active-sessions']
    });

    return { updateSettings, logoutSession };
};

export const useCounselorActions = () => {
    const addNote = useCrmMutation({
        mutationFn: (noteData) => api.post('/counselor/notes', noteData),
        successMessage: "Note saved",
        invalidateQueries: ['counselor-notes']
    });

    const updateNote = useCrmMutation({
        mutationFn: ({ id, text }) => api.put(`/counselor/notes/${id}`, { text }),
        successMessage: "Note updated successfully",
        invalidateQueries: ['counselor-notes']
    });

    const deleteNote = useCrmMutation({
        mutationFn: (id) => api.delete(`/counselor/notes/${id}`),
        successMessage: "Note deleted successfully",
        invalidateQueries: ['counselor-notes']
    });

    const updateStage = useCrmMutation({
        mutationFn: ({ leadId, stage }) => api.put('/counselor/stage', { leadId, stage }),
        successMessage: "Lead stage updated successfully",
        invalidateQueries: ['counselor-stages', 'leads', 'chats']
    });

    const logCall = useCrmMutation({
        mutationFn: (data) => api.post('/counselor/calls', data),
        successMessage: "Communication log committed successfully",
        invalidateQueries: ['counselor-calls', ['manager', 'calls']]
    });

    return { addNote, updateNote, deleteNote, updateStage, logCall };
};

export const useSupportActions = () => {
    const assignLead = useCrmMutation({
        mutationFn: (data) => api.post('/support/assign', data),
        successMessage: "Lead assigned successfully",
        invalidateQueries: ['support-queue', 'support-assignments']
    });

    const createLead = useCrmMutation({
        mutationFn: (data) => api.post('/support/leads', data),
        successMessage: "Lead created successfully",
        invalidateQueries: ['support-queue']
    });

    const bulkAssign = useCrmMutation({
        mutationFn: (data) => api.post('/support/leads/bulk-assign', data),
        successMessage: "Leads bulk assigned successfully",
        invalidateQueries: ['support-queue', 'support-assignments']
    });

    const convertLead = useCrmMutation({
        mutationFn: (leadId) => api.put(`/leads/${leadId}`, { stage: 'Converted' }),
        successMessage: (res) => `${res?.data?.name || 'Lead'} mapped to CRM ecosystem rules successfully`,
        invalidateQueries: ['support-queue', 'leads', 'support-ai-status']
    });

    return { assignLead, createLead, bulkAssign, convertLead };
};


