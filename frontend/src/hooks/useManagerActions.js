import { useQuery } from '@tanstack/react-query'
import apiClient from '../lib/apiClient'
import { useCrmMutation } from './useCrmMutations'

export const useManagerActions = () => {
    // Queries
    const useDashboard = () => useQuery({
        queryKey: ['manager', 'dashboard'],
        queryFn: () => apiClient.get('/dashboard/manager')
    });

    const useFunnel = () => useQuery({
        queryKey: ['manager', 'funnel'],
        queryFn: () => apiClient.get('/manager/funnel')
    });

    const useCountryAnalytics = () => useQuery({
        queryKey: ['manager', 'country'],
        queryFn: () => apiClient.get('/manager/country-analytics')
    });

    const useSlaMetrics = () => useQuery({
        queryKey: ['manager', 'sla'],
        queryFn: () => apiClient.get('/manager/sla-metrics')
    });

    const useConversionTracking = () => useQuery({
        queryKey: ['manager', 'conversion'],
        queryFn: () => apiClient.get('/manager/conversion-tracking')
    });

    const useTeamOverview = () => useQuery({
        queryKey: ['manager', 'team'],
        queryFn: () => apiClient.get('/manager/team-overview')
    });

    const useCallReports = () => useQuery({
        queryKey: ['manager', 'calls'],
        queryFn: () => apiClient.get('/manager/call-reports')
    });

    // Mutations
    const refreshData = useCrmMutation({
        mutationFn: (key) => apiClient.post('/manager/refresh', { key }),
        successMessage: `Data refetched successfully`,
    });

    const exportCsv = useCrmMutation({
        mutationFn: (type) => apiClient.get(`/manager/export?type=${type}`),
        successMessage: `Report exported as CSV successfully`,
    });

    return {
        useDashboard,
        useFunnel,
        useCountryAnalytics,
        useSlaMetrics,
        useConversionTracking,
        useTeamOverview,
        useCallReports,
        refreshData,
        exportCsv
    };
};
