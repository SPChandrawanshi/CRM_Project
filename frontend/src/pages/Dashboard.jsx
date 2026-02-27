import React from 'react'
import { Users, MessageSquare, CheckCircle, Clock, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

const KPICard = ({ title, value, icon: Icon, color, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="crm-card group h-full"
    >
        <div className="relative z-10 flex flex-col h-full">
            <div className={`p-2.5 rounded-lg ${color} w-fit mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="mt-auto">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
        </div>
        <div className="absolute top-0 right-0 p-4 text-[#0a3d62] opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
            <Icon size={72} />
        </div>
    </motion.div>
)

const Dashboard = () => {
    const kpis = [
        { title: 'Total Leads', value: '1,284', icon: Users, color: 'bg-[#0a3d62]/10 text-[#0a3d62]' },
        { title: 'Active Chats', value: '56', icon: MessageSquare, color: 'bg-blue-50 text-blue-600' },
        { title: 'Converted Leads', value: '412', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
        { title: 'Pending Follow-ups', value: '89', icon: Clock, color: 'bg-amber-50 text-amber-600' },
        { title: 'New Messages', value: '12', icon: MessageSquare, color: 'bg-rose-50 text-rose-600' },
    ]

    return (
        <div className="crm-section space-y-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back! Here's what's happening with your leads today.</p>
                </div>
                <button className="btn-primary gap-2 w-full md:w-auto">
                    <Plus className="h-4 w-4" />
                    <span>Add New Lead</span>
                </button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 crm-grid">
                {kpis.map((kpi, index) => (
                    <KPICard key={index} {...kpi} index={index} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 crm-grid">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 crm-card h-[400px] flex flex-col items-center justify-center text-gray-400 border-dashed border-2 border-gray-100"
                >
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <Users className="h-8 w-8 text-gray-300" />
                    </div>
                    <span className="font-medium text-lg">Activity Feed</span>
                    <p className="text-sm">Comprehensive lead activity visualization coming soon.</p>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="crm-card h-[400px] flex flex-col items-center justify-center text-gray-400 border-dashed border-2 border-gray-100"
                >
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <Clock className="h-8 w-8 text-gray-300" />
                    </div>
                    <span className="font-medium text-lg">Recent Tasks</span>
                    <p className="text-sm text-center px-4">Your daily task management panel will appear here.</p>
                </motion.div>
            </div>
        </div>
    )
}

export default Dashboard
