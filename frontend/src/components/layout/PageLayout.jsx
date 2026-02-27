import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import GlobalFilterBar from './GlobalFilterBar'
import useAppStore from '../../store/useStore'
import { cn } from '../../lib/utils'

const PageLayout = ({ children }) => {
    const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed)

    return (
        <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Sidebar />
            
            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-500 ease-in-out min-w-0",
                    "lg:ml-72",
                    sidebarCollapsed && "lg:ml-20"
                )}
            >
                <Navbar />

                <div className={cn(
                    "fixed top-20 right-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-500 ease-in-out",
                    "left-0 lg:left-72",
                    sidebarCollapsed && "lg:left-20"
                )}>
                    <div className="max-w-[1600px] mx-auto px-6">
                        <GlobalFilterBar />
                    </div>
                </div>

                <main className="flex-1 mt-48 p-4 lg:p-8 overflow-x-hidden">
                    <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>
                
                <footer className="px-10 py-8 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">© 2026 GRAVITY CRM • COMMAND TERMINAL V2.4</p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Core Synchronized</span>
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default PageLayout
