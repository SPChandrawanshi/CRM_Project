// Team Member Sidebar Component - Mobile Responsive
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
    FaCalendarAlt, FaClipboardList, FaFileAlt,
    FaCalendarTimes, FaComments, FaSignOutAlt, FaUserNurse, FaBars, FaTimes, FaCalendarDay,
    FaClock
} from 'react-icons/fa'

const TeamMemberSidebar = ({ onClose }) => {
    const navigate = useNavigate()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/login')
    }

    const handleLinkClick = () => {
        // Close mobile sidebar when link is clicked
        if (onClose) onClose()
    }

    const menuItems = [
        { path: '/team-member/daily-rota', icon: FaCalendarDay, label: 'Daily Rota' },
        { path: '/team-member/attendance', icon: FaClock, label: 'Attendance' },
        { path: '/team-member/my-shifts', icon: FaCalendarAlt, label: 'My Shifts' },
        { path: '/team-member/absences-holiday', icon: FaCalendarTimes, label: 'Absences & Holiday' },
        { path: '/team-member/communication', icon: FaComments, label: 'Communication Log' },
        { path: '/team-member/task-list', icon: FaClipboardList, label: 'Task List' },
    ]

    return (
        <div className={`h-screen bg-white border-r border-gray-200 flex flex-col shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Logo & Toggle */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between gap-3">
                    {!isCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl shadow-md">
                                <FaUserNurse className="text-2xl text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">POVA Care</h2>
                                <p className="text-xs text-gray-500">Team Member</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
                        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                    >
                        {isCollapsed ? <FaBars className="text-gray-700" /> : <FaTimes className="text-gray-700" />}
                    </button>
                </div>
                {isCollapsed && (
                    <div className="mt-3 flex justify-center">
                        <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl shadow-md">
                            <FaUserNurse className="text-2xl text-white" />
                        </div>
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-all ${isActive
                                ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                        title={isCollapsed ? item.label : ''}
                    >
                        <item.icon className="text-lg flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 text-white hover:shadow-lg transition-all"
                    title={isCollapsed ? 'Sign Out' : ''}
                >
                    <FaSignOutAlt className="flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
                </button>
            </div>
        </div>
    )
}

export default TeamMemberSidebar
