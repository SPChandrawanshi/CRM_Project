import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useCrmMutation } from './useCrmMutations';

export const useTeamLeaderActions = () => {
    // Queries
    const useDashboard = () => useQuery({
        queryKey: ['teamLeader', 'dashboard'],
        queryFn: () => apiClient.get('/dashboard/teamleader')
    });

    const useInbox = () => useQuery({
        queryKey: ['teamLeader', 'inbox'],
        queryFn: () => apiClient.get('/team-leader/inbox')
    });

    const useLeads = () => useQuery({
        queryKey: ['teamLeader', 'leads'],
        queryFn: () => apiClient.get('/team-leader/leads')
    });

    const usePerformance = () => useQuery({
        queryKey: ['teamLeader', 'performance'],
        queryFn: () => apiClient.get('/team-leader/performance')
    });

    const useReassignList = () => useQuery({
        queryKey: ['teamLeader', 'reassignList'],
        queryFn: () => apiClient.get('/team-leader/reassign-list')
    });

    const useSlaAlerts = () => useQuery({
        queryKey: ['teamLeader', 'slaAlerts'],
        queryFn: () => apiClient.get('/team-leader/sla-alerts')
    });

    const useActivityLogs = () => useQuery({
        queryKey: ['teamLeader', 'activityLogs'],
        queryFn: () => apiClient.get('/team-leader/activity-logs')
    });

    // Mutations
    const sendReminder = useCrmMutation({
        mutationFn: (counselorId) => apiClient.post('/team-leader/reminder', { counselorId }),
        successMessage: "Reminder sent to counselor successfully",
    });

    const reassignLead = useCrmMutation({
        mutationFn: ({ leadId, newCounselor }) => apiClient.put(`/team-leader/leads/${leadId}/reassign`, { newCounselor }),
        successMessage: "Lead reassigned successfully",
        invalidateQueries: [['teamLeader', 'reassignList'], ['teamLeader', 'leads']]
    });

    const updateLeadStatus = useCrmMutation({
        mutationFn: ({ leadId, status }) => apiClient.put(`/team-leader/leads/${leadId}/status`, { status }),
        successMessage: "Lead status updated successfully",
        invalidateQueries: [['teamLeader', 'leads']]
    });

    const addTeamNote = useCrmMutation({
        mutationFn: (noteData) => apiClient.post('/team-leader/notes', noteData),
        successMessage: "Team note added successfully",
        invalidateQueries: [['teamLeader', 'activityLogs']]
    });

    // Utilities
    const refreshData = useCrmMutation({
        mutationFn: (type) => apiClient.post('/team-leader/refresh', { type }),
        successMessage: `Data refreshed successfully`,
    });

    return {
        useDashboard,
        useInbox,
        useLeads,
        usePerformance,
        useReassignList,
        useSlaAlerts,
        useActivityLogs,
        sendReminder,
        reassignLead,
        updateLeadStatus,
        addTeamNote,
        refreshData
    };
};
