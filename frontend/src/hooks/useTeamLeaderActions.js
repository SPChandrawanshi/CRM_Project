import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useCrmMutation } from './useCrmMutations';
import useAppStore from '../store/useStore';

export const useTeamLeaderActions = () => {
    const { country, statusFilter, teamMember } = useAppStore();

    // Queries
    const useDashboard = () => useQuery({
        queryKey: ['teamLeader', 'dashboard', country, statusFilter, teamMember],
        queryFn: () => api.get(`/dashboard/teamleader?country=${country}&status=${statusFilter}&team=${teamMember}`)
    });

    const useInbox = () => useQuery({
        queryKey: ['teamLeader', 'inbox', country, statusFilter, teamMember],
        queryFn: () => api.get(`/team-leader/inbox?country=${country}&status=${statusFilter}&team=${teamMember}`)
    });

    const useLeads = () => useQuery({
        queryKey: ['teamLeader', 'leads', country, statusFilter, teamMember],
        queryFn: () => api.get(`/team-leader/leads?country=${country}&status=${statusFilter}&team=${teamMember}`)
    });

    const usePerformance = () => useQuery({
        queryKey: ['teamLeader', 'performance', country, statusFilter, teamMember],
        queryFn: () => api.get(`/team-leader/performance?country=${country}&status=${statusFilter}&team=${teamMember}`)
    });

    const useReassignList = () => useQuery({
        queryKey: ['teamLeader', 'reassignList', country, statusFilter, teamMember],
        queryFn: () => api.get(`/team-leader/reassign-list?country=${country}&status=${statusFilter}&team=${teamMember}`)
    });

    const useSlaAlerts = () => useQuery({
        queryKey: ['teamLeader', 'slaAlerts', country, statusFilter, teamMember],
        queryFn: () => api.get(`/team-leader/sla-alerts?country=${country}&status=${statusFilter}&team=${teamMember}`)
    });

    const useActivityLogs = () => useQuery({
        queryKey: ['teamLeader', 'activityLogs', country, statusFilter, teamMember],
        queryFn: () => api.get(`/team-leader/activity-logs?country=${country}&status=${statusFilter}&team=${teamMember}`)
    });

    // Mutations
    const sendReminder = useCrmMutation({
        mutationFn: (counselorId) => api.post('/team-leader/reminder', { counselorId }),
        successMessage: "Reminder sent to counselor successfully",
    });

    const reassignLead = useCrmMutation({
        mutationFn: ({ leadId, newCounselor }) => api.put(`/team-leader/leads/${leadId}/reassign`, { newCounselor }),
        successMessage: "Lead reassigned successfully",
        invalidateQueries: [['teamLeader', 'reassignList'], ['teamLeader', 'leads']]
    });

    const updateLeadStatus = useCrmMutation({
        mutationFn: ({ leadId, status }) => api.put(`/team-leader/leads/${leadId}/status`, { status }),
        successMessage: "Lead status updated successfully",
        invalidateQueries: [['teamLeader', 'leads']]
    });

    const addTeamNote = useCrmMutation({
        mutationFn: (noteData) => api.post('/team-leader/notes', noteData),
        successMessage: "Team note added successfully",
        invalidateQueries: [['teamLeader', 'activityLogs']]
    });

    // Utilities
    const refreshData = useCrmMutation({
        mutationFn: (type) => api.post('/team-leader/refresh', { type }),
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



