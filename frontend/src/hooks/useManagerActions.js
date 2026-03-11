import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { useCrmMutation } from './useCrmMutations'
import useAppStore from '../store/useStore'

export const useManagerActions = () => {
    const { country, statusFilter, teamMember, dateRange } = useAppStore()
    const dr = dateRange?.label || 'All Records'

    // Queries
    const useDashboard = () => useQuery({
        queryKey: ['manager', 'dashboard', country, statusFilter, teamMember, dr],
        queryFn: () => api.get(`/dashboard/manager?country=${country}&status=${statusFilter}&team=${teamMember}&dateRange=${encodeURIComponent(dr)}`)
    });

    const useFunnel = () => useQuery({
        queryKey: ['manager', 'funnel', country, statusFilter, teamMember, dr],
        queryFn: () => api.get(`/manager/funnel?country=${country}&status=${statusFilter}&team=${teamMember}&dateRange=${encodeURIComponent(dr)}`)
    });


    const useCountryAnalytics = () => useQuery({
        queryKey: ['manager', 'country', country, statusFilter, teamMember],
        queryFn: () => api.get(`/manager/country-analytics?country=${country}&status=${statusFilter}&team=${teamMember}`)
    });

    const useSlaMetrics = () => useQuery({
        queryKey: ['manager', 'sla', country, statusFilter, teamMember],
        queryFn: () => api.get(`/manager/sla-metrics?country=${country}&status=${statusFilter}&team=${teamMember}`)
    });

    const useConversionTracking = () => useQuery({
        queryKey: ['manager', 'conversion', country, statusFilter, teamMember],
        queryFn: () => api.get(`/manager/conversion-tracking?country=${country}&status=${statusFilter}&team=${teamMember}`)
    });

    const useTeamOverview = () => useQuery({
        queryKey: ['manager', 'team', country, statusFilter, teamMember],
        queryFn: () => api.get(`/manager/team-overview?country=${country}&status=${statusFilter}&team=${teamMember}`)
    });

    const useTeamCounselors = (teamName) => useQuery({
        queryKey: ['manager', 'team-counselors', teamName],
        queryFn: () => api.get(`/manager/team-counselors/${encodeURIComponent(teamName)}`),
        enabled: !!teamName
    });

    const useCallReports = () => useQuery({
        queryKey: ['manager', 'calls', country, statusFilter, teamMember],
        queryFn: () => api.get(`/manager/call-reports?country=${country}&status=${statusFilter}&team=${teamMember}`)
    });

    // Mutations
    const refreshData = useCrmMutation({
        mutationFn: (key) => api.post('/manager/refresh', { key }),
        successMessage: `Data refetched successfully`,
        invalidateQueries: [['manager']]
    });

    const exportCsv = useCrmMutation({
        mutationFn: async (type) => {
            const response = await api.get(`/manager/export?type=${type}`, { responseType: 'blob' });
            // By default, the apiClient interceptor might try to return `response.data`.
            // But if it's a blob, it gets passed through correctly if the interceptor is bypassed or handles it.
            // If response is the Blob itself, we use it directly:
            const blobData = response instanceof Blob ? response : response.data || response;

            const url = window.URL.createObjectURL(new Blob([blobData]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}-report-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            return { success: true };
        },
        successMessage: () => `Manager report exported successfully to Excel/CSV.`,
    });


    return {
        useDashboard,
        useFunnel,
        useCountryAnalytics,
        useSlaMetrics,
        useConversionTracking,
        useTeamOverview,
        useTeamCounselors,
        useCallReports,
        refreshData,
        exportCsv
    };
};



