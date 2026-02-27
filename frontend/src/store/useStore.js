import { create } from 'zustand'

// Maps backend role enum → frontend role string used throughout app
export const ROLE_MAP = {
    'SUPER_ADMIN': 'Super Admin',
    'ADMIN': 'Admin',
    'MANAGER': 'Manager',
    'TEAM_LEADER': 'Team Leader',
    'COUNSELOR': 'Counselor',
    'SUPPORT': 'Customer Support',
}

const useAppStore = create((set) => ({
    role: 'Super Admin',
    isAuthenticated: false,
    user: null,
    authToken: localStorage.getItem('token') || null,
    country: 'Global',
    statusFilter: 'All Stages',
    dateRange: { label: 'Last 30 Days', from: null, to: null },
    userId: 'U-001',
    searchTerm: '',
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    teamMember: 'All Operators',
    selectedLeadId: null,
    counselorId: 'C-001',

    setRole: (role) => set({ role }),

    login: (role, userData) => set({
        role,
        isAuthenticated: true,
        user: userData || { name: 'Demo User', email: `${role.toLowerCase().replace(' ', '.')}@crm.com` }
    }),

    logout: () => {
        localStorage.removeItem('token')
        set({ isAuthenticated: false, user: null, role: 'Super Admin' })
    },

    setCountry: (country) => set({ country }),
    setDateRange: (range) => set({ dateRange: range }),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    setStatusFilter: (status) => set({ statusFilter: status }),
    setTeamMember: (member) => set({ teamMember: member }),
    setSearchTerm: (term) => set({ searchTerm: term }),
    setSelectedLeadId: (id) => set({ selectedLeadId: id }),
}))

export default useAppStore
