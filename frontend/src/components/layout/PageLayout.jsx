import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import useAppStore from '../../store/useStore'
import { cn } from '../../lib/utils'

const PageLayout = ({ children }) => {
    const { sidebarCollapsed } = useAppStore()

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            <Sidebar />
            
            <div className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-500",
                sidebarCollapsed ? "md:ml-20" : "md:ml-64"
            )}>
                <Navbar />
                
                <main className="flex-1 overflow-y-auto pt-16">
                    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default PageLayout
