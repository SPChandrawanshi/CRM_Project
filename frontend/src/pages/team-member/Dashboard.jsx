// Team Member Dashboard
import { FaCalendarDay, FaTasks, FaUmbrellaBeach, FaComments, FaClock, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const TeamMemberDashboard = () => {
    const navigate = useNavigate()

    const stats = [
        { label: 'Today\'s Visits', value: '5', icon: FaCalendarDay, color: 'from-blue-500 to-cyan-600', bgColor: 'bg-blue-50' },
        { label: 'Pending Tasks', value: '8', icon: FaTasks, color: 'from-orange-500 to-yellow-600', bgColor: 'bg-orange-50' },
        { label: 'Completed Today', value: '3', icon: FaCheckCircle, color: 'from-green-500 to-teal-600', bgColor: 'bg-green-50' },
        { label: 'Leave Balance', value: '12 days', icon: FaUmbrellaBeach, color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50' },
    ]

    const todayVisits = [
        { time: '09:00 - 11:00', client: 'Client A', address: '123 Main St', status: 'In Progress' },
        { time: '12:00 - 14:00', client: 'Client B', address: '456 Oak Ave', status: 'Pending' },
        { time: '15:00 - 17:00', client: 'Client C', address: '789 Pine Rd', status: 'Pending' },
    ]

    const recentActivities = [
        { action: 'Completed visit', client: 'Client D', time: '2 hours ago', type: 'success' },
        { action: 'Added notes', client: 'Client A', time: '3 hours ago', type: 'info' },
        { action: 'Reported incident', client: 'Client B', time: '1 day ago', type: 'warning' },
    ]

    const getActivityColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-600 bg-green-50'
            case 'info': return 'text-blue-600 bg-blue-50'
            case 'warning': return 'text-yellow-600 bg-yellow-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
                <p className="text-gray-600">Here's your schedule for today</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <div key={index} className="crm-card">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="text-2xl text-white" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Visits */}
                <div className="crm-card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Today's Visits</h2>
                        <button
                            onClick={() => navigate('/team-member/daily-rota')}
                            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                        >
                            View All →
                        </button>
                    </div>
                    <div className="space-y-3">
                        {todayVisits.map((visit, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-100 rounded-lg">
                                        <FaClock className="text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{visit.client}</p>
                                        <p className="text-sm text-gray-600">{visit.time}</p>
                                        <p className="text-xs text-gray-500">{visit.address}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${visit.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {visit.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="crm-card">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
                    <div className="space-y-3">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                                    <FaComments className="text-sm" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                                    <p className="text-sm text-gray-600">{activity.client}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 crm-card">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => navigate('/team-member/daily-rota')}
                        className="p-4 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        <FaCalendarDay className="text-2xl mb-2" />
                        <p className="font-medium">Daily Rota</p>
                    </button>
                    <button
                        onClick={() => navigate('/team-member/task-list')}
                        className="p-4 bg-gradient-to-br from-orange-500 to-yellow-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        <FaTasks className="text-2xl mb-2" />
                        <p className="font-medium">My Tasks</p>
                    </button>
                    <button
                        onClick={() => navigate('/team-member/absences-holiday')}
                        className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        <FaUmbrellaBeach className="text-2xl mb-2" />
                        <p className="font-medium">Request Leave</p>
                    </button>
                    <button
                        onClick={() => navigate('/team-member/communication')}
                        className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        <FaComments className="text-2xl mb-2" />
                        <p className="font-medium">Communication</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TeamMemberDashboard


