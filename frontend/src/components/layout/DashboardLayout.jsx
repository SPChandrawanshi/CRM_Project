// Dashboard Layout Wrapper - Mobile Responsive with Hamburger Menu
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import useAppStore from '../../store/useStore'
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
            // Ensure the role matches the formats expected by Sidebar (e.g. 'Admin' vs 'admin')
            const displayRole = parsed.role.charAt(0).toUpperCase() + parsed.role.slice(1)
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
