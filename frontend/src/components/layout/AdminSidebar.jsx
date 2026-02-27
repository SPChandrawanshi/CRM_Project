import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
    FaCalendarAlt, FaFileAlt, FaUsers, FaChartBar,
    FaMoneyBillWave, FaCog, FaSignOutAlt, FaUserShield, FaBars, FaTimes, FaChevronDown, FaChevronRight
} from 'react-icons/fa'

const AdminSidebar = ({ onClose }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [openSubmenu, setOpenSubmenu] = useState(null)

    useEffect(() => {
        // Auto-open submenu if current path matches
        if (location.pathname.includes('/admin/users')) {
            setOpenSubmenu('users')
        }
    }, [location.pathname])

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/login')
    }

    const handleLinkClick = () => {
        if (window.innerWidth < 1024 && onClose) onClose()
    }

    const toggleSubmenu = (name) => {
        if (isCollapsed) setIsCollapsed(false)
        setOpenSubmenu(openSubmenu === name ? null : name)
    }

    const menuItems = [
        {
            id: 'rota',
            label: 'Rota Management',
            icon: FaCalendarAlt,
            children: [
                { path: '/admin/rota?tab=add', label: 'Add Rota' },
                { path: '/admin/rota?tab=daily', label: 'Daily Rota' },
                { path: '/admin/rota?tab=printable', label: 'Printable Rota' },
                { path: '/admin/rota?tab=build', label: 'Build Rota' },
            ]
        },
        {
            id: 'templates',
            label: 'Templates',
            icon: FaFileAlt,
            children: [
                { path: '/admin/templates?tab=daily', label: 'Daily Templates' },
                { path: '/admin/templates?tab=advanced', label: 'Advanced Templates' },
                { path: '/admin/templates?tab=run-routes', label: 'Run Routes' },
            ]
        },
        {
            id: 'users',
            label: 'Users',
            icon: FaUsers,
            children: [
                { path: '/admin/users?tab=team-members', label: 'Staff Directory' },
                { path: '/admin/users?tab=team-holidays', label: 'Staff Holidays' },
                { path: '/admin/users?tab=service-users', label: 'Client Directory' },
                { path: '/admin/users?tab=service-forms', label: 'Client Forms' },
                { path: '/admin/users?tab=service-holidays', label: 'Client Holidays' },
                { path: '/admin/users?tab=service-location', label: 'Location Tracking' },
                { path: '/admin/users?tab=service-comms', label: 'Communication Log' },
            ]
        },
        {
            id: 'reports',
            label: 'Reporting Center',
            icon: FaChartBar,
            children: [
                { path: '/admin/reports?tab=team', label: 'Staff Reports' },
                { path: '/admin/reports?tab=service', label: 'Client Reports' },
                { path: '/admin/reports?tab=general', label: 'General Reports' },
            ]
        },
        {
            id: 'invoicing',
            label: 'Finance & Wage',
            icon: FaMoneyBillWave,
            children: [
                { path: '/admin/invoicing?tab=invoicing', label: 'Invoicing' },
                { path: '/admin/invoicing?tab=wage', label: 'Wage' },
                { path: '/admin/invoicing?tab=tariffs', label: 'Tariffs' },
                { path: '/admin/invoicing?tab=funders', label: 'Funders' },
                { path: '/admin/invoicing?tab=settings', label: 'Finance Settings' },
                { path: '/admin/invoicing?tab=bank-holiday', label: 'Bank Holidays' },
                { path: '/admin/invoicing?tab=holiday-report', label: 'Holiday Report' },
            ]
        },
    ]

    return (
        <div className={`h-screen bg-white border-r border-gray-200 flex flex-col shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Logo & Toggle */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between gap-3">
                    {!isCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl shadow-md">
                                <FaUserShield className="text-2xl text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">POVA Care</h2>
                                <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
                    >
                        {isCollapsed ? <FaBars className="text-gray-700" /> : <FaTimes className="text-gray-700" />}
                    </button>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
                {menuItems.map((item, index) => (
                    <div key={index}>
                        {item.children ? (
                            <>
                                <button
                                    onClick={() => toggleSubmenu(item.id)}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-300 ${openSubmenu === item.id
                                        ? 'bg-cyan-50 text-cyan-700'
                                        : 'text-gray-700 hover:bg-gray-100/80 hover:translate-x-1'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-md transition-colors ${openSubmenu === item.id ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
                                            <item.icon className="text-base flex-shrink-0" />
                                        </div>
                                        {!isCollapsed && <span className="text-sm font-semibold">{item.label}</span>}
                                    </div>
                                    {!isCollapsed && (
                                        <div className={`transition-transform duration-300 ${openSubmenu === item.id ? 'rotate-180' : 'rotate-0'}`}>
                                            <FaChevronDown className="text-[10px] opacity-50" />
                                        </div>
                                    )}
                                </button>
                                {openSubmenu === item.id && !isCollapsed && (
                                    <div className="ml-9 mb-2 mt-1 border-l-2 border-gray-100/50 space-y-1 animate-in slide-in-from-top-2 duration-300">
                                        {item.children.map((child, idx) => {
                                            const isActive = location.pathname === child.path.split('?')[0] &&
                                                (location.search === '' || location.search.includes(child.path.split('?')[1]));

                                            return (
                                                <NavLink
                                                    key={idx}
                                                    to={child.path}
                                                    onClick={handleLinkClick}
                                                    className={`group relative flex items-center py-2.5 px-5 ml-1 rounded-full text-[13px] transition-all duration-200 ${isActive
                                                        ? 'text-cyan-700 font-bold bg-cyan-50'
                                                        : 'text-gray-500 hover:text-cyan-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {/* Active Left Indicator Bar */}
                                                    {isActive && (
                                                        <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 h-6 w-[3px] bg-cyan-600 rounded-full shadow-[0_0_8px_rgba(8,145,178,0.4)]"></div>
                                                    )}

                                                    {child.label}
                                                </NavLink>
                                            )
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            <NavLink
                                to={item.path}
                                onClick={handleLinkClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-300 ${isActive
                                        ? 'bg-cyan-600 text-white shadow-md font-bold'
                                        : 'text-gray-700 hover:bg-gray-100 group hover:translate-x-1'
                                    }`
                                }
                            >
                                <div className={`p-1.5 rounded-md transition-colors ${location.pathname === item.path ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-white'}`}>
                                    <item.icon className="text-base flex-shrink-0" />
                                </div>
                                {!isCollapsed && <span className="text-sm font-semibold">{item.label}</span>}
                            </NavLink>
                        )}
                    </div>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm group"
                >
                    <FaSignOutAlt className="flex-shrink-0 group-hover:scale-110 transition-transform" />
                    {!isCollapsed && <span>Sign Out</span>}
                </button>
            </div>
        </div>
    )
}

export default AdminSidebar
