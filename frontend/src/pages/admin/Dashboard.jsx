// Admin Dashboard - Main Overview
import { FaCalendarAlt, FaUsers, FaUserInjured, FaClipboardCheck, FaMoneyBillWave, FaChartLine } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
    const navigate = useNavigate()

    const stats = [
        {
            title: 'Total Rotas',
            value: '156',
            icon: FaCalendarAlt,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Team Members',
            value: '24',
            icon: FaUsers,
            color: 'from-teal-500 to-green-600',
            bgColor: 'bg-teal-50',
            textColor: 'text-teal-600'
        },
        {
            title: 'Service Users',
            value: '48',
            icon: FaUserInjured,
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Completed Visits',
            value: '342',
            icon: FaClipboardCheck,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Pending Invoices',
            value: '12',
            icon: FaMoneyBillWave,
            color: 'from-yellow-500 to-orange-600',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600'
        },
        {
            title: 'Monthly Revenue',
            value: '£45,280',
            icon: FaChartLine,
            color: 'from-cyan-500 to-blue-600',
            bgColor: 'bg-cyan-50',
            textColor: 'text-cyan-600'
        },
    ]

    const quickActions = [
        { label: 'Add New Rota', path: '/admin/rota', icon: FaCalendarAlt, color: 'from-cyan-500 to-teal-600' },
        { label: 'Manage Staff', path: '/admin/users', icon: FaUsers, color: 'from-teal-500 to-green-600' },
        { label: 'View Reports', path: '/admin/reports', icon: FaChartLine, color: 'from-purple-500 to-pink-600' },
        { label: 'Invoicing', path: '/admin/invoicing', icon: FaMoneyBillWave, color: 'from-yellow-500 to-orange-600' },
    ]

    const recentActivities = [
        { action: 'New rota created', user: 'Admin User', time: '5 mins ago', type: 'success' },
        { action: 'Staff member added', user: 'John Smith', time: '15 mins ago', type: 'info' },
        { action: 'Invoice generated', user: 'Finance Team', time: '1 hour ago', type: 'warning' },
        { action: 'Report exported', user: 'Admin User', time: '2 hours ago', type: 'success' },
    ]

    const upcomingShifts = [
        { staff: 'John Smith', client: 'Client A', time: '09:00 - 17:00', date: 'Today' },
        { staff: 'Sarah Johnson', client: 'Client B', time: '10:00 - 14:00', date: 'Today' },
        { staff: 'Mike Wilson', client: 'Client C', time: '14:00 - 18:00', date: 'Tomorrow' },
    ]

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="crm-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                            </div>
                            <div className={`p-4 ${stat.bgColor} rounded-xl`}>
                                <stat.icon className={`text-2xl ${stat.textColor}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(action.path)}
                            className={cn(
                                "bg-gradient-to-r", action.color,
                                "text-white p-6 rounded-xl shadow-enterprise hover:-translate-y-1 hover:shadow-subtle-lift transition-all flex items-center gap-3 active:scale-95"
                            )}
                        >
                            <action.icon className="text-2xl" />
                            <span className="font-medium">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="crm-card">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-green-500' :
                                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`}></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                                    <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Shifts */}
                <div className="crm-card">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Shifts</h2>
                    <div className="space-y-4">
                        {upcomingShifts.map((shift, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-medium text-gray-800">{shift.staff}</p>
                                        <p className="text-sm text-gray-600">{shift.client}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                                        {shift.date}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{shift.time}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/admin/rota')}
                        className="w-full mt-4 py-2 text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                    >
                        View All Rotas →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
