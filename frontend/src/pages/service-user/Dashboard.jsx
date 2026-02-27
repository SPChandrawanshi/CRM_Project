// Service User - Dashboard Page
import { FaFileAlt, FaPills, FaStickyNote, FaHeartbeat, FaCalendarCheck, FaBell } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const stats = [
        { icon: FaFileAlt, label: 'Pending Forms', value: '1', color: 'from-purple-500 to-pink-600', link: '/service-user/forms' },
        { icon: FaPills, label: 'Active Medications', value: '2', color: 'from-cyan-500 to-teal-600', link: '/service-user/medication' },
        { icon: FaCalendarCheck, label: 'Upcoming Visits', value: '3', color: 'from-green-500 to-teal-600', link: '/service-user/dashboard' },
        { icon: FaBell, label: 'New Messages', value: '2', color: 'from-orange-500 to-yellow-600', link: '/service-user/communication' },
    ]

    const upcomingVisits = [
        { date: '2024-02-13', time: '09:00', staff: 'Nurse John', service: 'Morning Care' },
        { date: '2024-02-13', time: '21:00', staff: 'Carer Sarah', service: 'Evening Medication' },
        { date: '2024-02-14', time: '10:00', staff: 'Nurse John', service: 'Personal Care' },
    ]

    const recentNotes = [
        { date: '2024-02-12', staff: 'Nurse John', note: 'Morning visit completed successfully' },
        { date: '2024-02-11', staff: 'Carer Sarah', note: 'Evening medication administered' },
        { date: '2024-02-10', staff: 'Care Coordinator', note: 'Care plan reviewed and updated' },
    ]

    return (
        <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
                <p className="text-gray-600">Here's an overview of your care information</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <Link
                        key={index}
                        to={stat.link}
                        className="crm-card block"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                            </div>
                            <div className={`p-4 bg-gradient-to-r ${stat.color} rounded-xl`}>
                                <stat.icon className="text-2xl text-white" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Visits */}
                <div className="crm-card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Upcoming Visits</h2>
                        <FaCalendarCheck className="text-green-600 text-xl" />
                    </div>
                    <div className="space-y-3">
                        {upcomingVisits.map((visit, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold text-gray-800">{visit.service}</p>
                                        <p className="text-sm text-gray-600">by {visit.staff}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                        {visit.time}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">{visit.date}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Care Notes */}
                <div className="crm-card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Recent Care Notes</h2>
                        <FaStickyNote className="text-blue-600 text-xl" />
                    </div>
                    <div className="space-y-3">
                        {recentNotes.map((note, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-medium text-gray-800">{note.staff}</p>
                                    <p className="text-xs text-gray-500">{note.date}</p>
                                </div>
                                <p className="text-sm text-gray-600">{note.note}</p>
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/service-user/notes"
                        className="mt-4 block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        View All Notes
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 crm-card">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/service-user/medication"
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        <FaPills className="text-2xl" />
                        <div>
                            <p className="font-semibold">View Medications</p>
                            <p className="text-xs opacity-90">Check your medication schedule</p>
                        </div>
                    </Link>
                    <Link
                        to="/service-user/care-program"
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        <FaHeartbeat className="text-2xl" />
                        <div>
                            <p className="font-semibold">Care Program</p>
                            <p className="text-xs opacity-90">View your care plan</p>
                        </div>
                    </Link>
                    <Link
                        to="/service-user/communication"
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        <FaBell className="text-2xl" />
                        <div>
                            <p className="font-semibold">Messages</p>
                            <p className="text-xs opacity-90">Contact your care team</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
