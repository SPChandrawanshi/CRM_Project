// Dashboard Layout Wrapper - Mobile Responsive with Hamburger Menu
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import useAppStore, { ROLE_MAP } from '../../store/useStore'
import { cn } from '../../lib/utils'

const DashboardLayout = () => {
    const { isAuthenticated, sidebarCollapsed, login } = useAppStore()
    const navigate = useNavigate()

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (!userData && !isAuthenticated) {
            navigate('/login')
        } else if (userData && !isAuthenticated) {
            const parsed = JSON.parse(userData)
            // Use ROLE_MAP to convert backend enum (e.g. SUPER_ADMIN) to display role (e.g. 'Super Admin')
            // This ensures sidebar menus are shown correctly
            const displayRole = ROLE_MAP[parsed.role] || parsed.role
            login(displayRole, parsed)
        }
    }, [isAuthenticated, navigate, login])

    // While checking auth, show nothing to prevent flicker
    if (!isAuthenticated && !localStorage.getItem('user')) return null

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-500",
                sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
            )}>
                <Navbar />
                
                <main className="flex-1 pt-24 px-4 md:px-8 pb-12">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout


