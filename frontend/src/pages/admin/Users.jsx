import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaEye, FaTimes, FaUser, FaEnvelope, FaLock, FaPhone, FaBriefcase } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { useUserActions } from '../../hooks/useCrmMutations'
import { toast } from '../../components/ui/Toast'

const AdminUsers = () => {
    const location = useLocation()
    const [activeTab, setActiveTab] = useState('team-members')

    // Sync tab with URL query param
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const tab = params.get('tab')
        if (tab) {
            setActiveTab(tab)
        }
    }, [location.search])

    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    const { data: usersResponse, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => api.get('/users').then(res => res.data)
    })
    const teamMembers = usersResponse?.data || []

    const { addUser, updateUser, deleteUser } = useUserActions()
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'NURSE', status: 'Active' })

    const { data: customersResponse, isLoading: loadingCustomers } = useQuery({
        queryKey: ['customers'],
        queryFn: () => api.get('/customers').then(res => res.data)
    })
    const serviceUsers = customersResponse?.data || []

    const teamHolidays = [
        { id: 'H001', name: 'John Smith', type: 'Annual Leave', start: '2024-03-01', end: '2024-03-05', status: 'Approved' },
        { id: 'H002', name: 'Sarah Johnson', type: 'Sick Leave', start: '2024-02-15', end: '2024-02-16', status: 'Pending' },
    ]

    const serviceUserForms = [
        { id: 'F001', client: 'Client A', formType: 'Assessment', date: '2024-02-10', status: 'Signed' },
        { id: 'F002', client: 'Client B', formType: 'Care Plan Review', date: '2024-02-12', status: 'Draft' },
    ]

    const serviceUserHolidays = [
        { id: 'CH001', client: 'Client A', start: '2024-04-10', end: '2024-04-20', destination: 'Spain', emergencyContact: '123456789' },
    ]

    const communicationLogs = [
        { id: 'L001', client: 'Client A', source: 'Family', type: 'Phone Call', date: '2024-02-13 10:00', note: 'Family reported client feeling much better today.' },
        { id: 'L002', client: 'Client B', source: 'Carer', type: 'In-app', date: '2024-02-13 14:30', note: 'Client requested specific meal for dinner.' },
    ]

    const handleAddStaff = () => {
        setSelectedUser(null)
        setFormData({ name: '', email: '', password: '', phone: '', role: 'COUNSELOR', status: 'Active' })
        setShowAddModal(true)
    }

    const handleEditUser = (user) => {
        setSelectedUser(user)
        setFormData({ ...user, password: '' })
        setShowEditModal(true)
    }

    const handleViewUser = (user) => {
        setSelectedUser(user)
        setShowViewModal(true)
    }

    const handleDeleteUser = (user) => {
        setSelectedUser(user)
        setShowDeleteModal(true)
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {activeTab === 'team-members' ? 'Staff Directory' :
                        activeTab === 'team-holidays' ? 'Staff Absence Log' :
                            activeTab === 'service-users' ? 'Service User Directory' :
                                activeTab === 'service-forms' ? 'Client Assessment Forms' :
                                    activeTab === 'service-holidays' ? 'Client Holiday Log' :
                                        activeTab === 'service-location' ? 'Location tracking' : 'Communication Logs'}
                </h1>
                <p className="text-gray-600">Access and manage user records from the sidebar menu</p>
            </div>

            <div className="crm-card !p-0 overflow-hidden min-h-[500px] w-full min-w-0">
                <div className="p-4 md:p-6">
                    {activeTab === 'team-members' && (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Team Members</h2>
                                <button
                                    onClick={handleAddStaff}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    <FaPlus /> Add Staff
                                </button>
                            </div>

                            {/* Desktop Table - Team Members */}
                            <div className="hidden md:block overflow-x-auto w-full max-w-full">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Staff ID</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Full Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {isLoading ? (
                                            <tr><td colSpan="7" className="text-center py-4">Loading users...</td></tr>
                                        ) : teamMembers.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{member.id}</td>
                                                <td className="px-4 py-3 text-sm text-gray-800">{member.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{member.role}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{member.phone}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{member.email}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                        {member.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleViewUser(member)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                            title="View Details"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditUser(member)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(member)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                            title="Delete"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile List - Team Members */}
                            <div className="md:hidden space-y-4">
                                {teamMembers.map((member) => (
                                    <div key={member.id} className="crm-card !p-4 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">{member.id}</p>
                                                <h3 className="font-semibold text-gray-800">{member.name}</h3>
                                                <p className="text-xs text-teal-600 font-medium">{member.role}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-medium">
                                                {member.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-3 space-y-1">
                                            <p className="flex items-center gap-2"><FaPhone className="text-gray-400 text-xs" /> {member.phone}</p>
                                            <p className="flex items-center gap-2"><FaEnvelope className="text-gray-400 text-xs" /> {member.email}</p>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                            <button
                                                onClick={() => handleViewUser(member)}
                                                className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleEditUser(member)}
                                                className="p-2 text-green-600 bg-green-50 rounded-lg"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(member)}
                                                className="p-2 text-red-600 bg-red-50 rounded-lg"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'service-users' && (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Service Users</h2>
                                <button
                                    onClick={handleAddStaff}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    <FaPlus /> Add Service User
                                </button>
                            </div>

                            {/* Desktop Table - Service Users */}
                            <div className="hidden md:block overflow-x-auto w-full max-w-full">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Client ID</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Funder</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Care Plan</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {loadingCustomers ? (
                                            <tr><td colSpan="7" className="text-center py-4">Loading customers...</td></tr>
                                        ) : serviceUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{user.id}</td>
                                                <td className="px-4 py-3 text-sm text-gray-800">{user.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{user.funder}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                        {user.carePlan}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleViewUser(user)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                            title="View Details"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                            title="Delete"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile List - Service Users */}
                            <div className="md:hidden space-y-4">
                                {serviceUsers.map((user) => (
                                    <div key={user.id} className="crm-card !p-4 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">{user.id}</p>
                                                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                                <p className="text-xs text-gray-500">{user.funder}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-medium">
                                                {user.carePlan}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-3 space-y-1">
                                            <p className="flex items-center gap-2"><FaPhone className="text-gray-400 text-xs" /> {user.phone}</p>
                                            <p className="flex items-center gap-2"><FaEnvelope className="text-gray-400 text-xs" /> {user.email}</p>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                            <button
                                                onClick={() => handleViewUser(user)}
                                                className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="p-2 text-green-600 bg-green-50 rounded-lg"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user)}
                                                className="p-2 text-red-600 bg-red-50 rounded-lg"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'team-holidays' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Team Member Holidays/Absences</h2>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg shadow-md font-bold hover:shadow-lg transition-all"
                                >
                                    + Request Absence
                                </button>
                            </div>
                            <div className="overflow-x-auto no-scrollbar w-full max-w-full">
                                <table className="w-full min-w-[600px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Staff Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dates</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {teamHolidays.map((h) => (
                                            <tr key={h.id}>
                                                <td className="px-4 py-3 text-sm text-gray-800">{h.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{h.type}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{h.start} to {h.end}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${h.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{h.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'service-forms' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Service User Forms</h2>
                            <div className="overflow-x-auto no-scrollbar w-full max-w-full">
                                <table className="w-full min-w-[600px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Form Type</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {serviceUserForms.map((f) => (
                                            <tr key={f.id}>
                                                <td className="px-4 py-3 text-sm text-gray-800">{f.client}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{f.formType}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{f.date}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${f.status === 'Signed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{f.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'service-holidays' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Service User Holidays</h2>
                            <div className="overflow-x-auto no-scrollbar w-full max-w-full">
                                <table className="w-full min-w-[500px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Period</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Destination</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {serviceUserHolidays.map((h) => (
                                            <tr key={h.id}>
                                                <td className="px-4 py-3 text-sm text-gray-800">{h.client}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{h.start} - {h.end}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{h.destination}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'service-location' && (
                        <div className="text-center py-10 bg-gray-50 rounded-xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Location Tracking</h2>
                            <p className="text-gray-600 mb-4">Live location tracking of visits for service users.</p>
                            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                <p className="text-gray-500 font-medium">Interactive Map View Placeholder</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'service-comms' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Communication Log</h2>
                            <div className="space-y-4">
                                {communicationLogs.map((log) => (
                                    <div key={log.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-xs font-bold text-cyan-600 uppercase">{log.type}</span>
                                                <h3 className="font-semibold text-gray-800">{log.client} - {log.source}</h3>
                                            </div>
                                            <span className="text-xs text-gray-500">{log.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-700">{log.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center sticky top-0">
                            <h2 className="text-2xl font-bold">
                                {activeTab === 'team-members' ? 'Add Team Member' :
                                    activeTab === 'service-users' ? 'Add Service User' : 'Request Staff Absence'}
                            </h2>
                            <button onClick={() => setShowAddModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-4 md:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeTab === 'team-holidays' ? (
                                    <>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2"><FaUser className="inline mr-2" />Select Staff Member *</label>
                                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                                                <option>Search staff...</option>
                                                {teamMembers.map(m => <option key={m.id}>{m.name} ({m.role})</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Absence Type *</label>
                                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                                                <option>Annual Leave</option>
                                                <option>Sick Leave</option>
                                                <option>Training</option>
                                                <option>Compassionate Leave</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                                            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                                            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Note / Reason</label>
                                            <textarea placeholder="Optional notes..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-24"></textarea>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FaUser className="inline mr-2" />Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter full name"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FaEnvelope className="inline mr-2" />Email *
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="Enter email address"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FaLock className="inline mr-2" />Password *
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Enter password"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FaPhone className="inline mr-2" />Phone *
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="Enter phone number"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                        </div>
                                        {activeTab === 'team-members' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <FaBriefcase className="inline mr-2" />Role *
                                                </label>
                                                <select
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                >
                                                    <option value="">Select role</option>
                                                    <option value="COUNSELOR">Nurse / Counselor</option>
                                                    <option value="SUPPORT">Carer / Support Worker</option>
                                                    <option value="MANAGER">Manager</option>
                                                    <option value="TEAM_LEADER">Team Leader</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </div>
                                        )}
                                        {activeTab === 'service-users' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter address"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Funder</label>
                                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                                                        <option>Select funder</option>
                                                        <option>NHS</option>
                                                        <option>Private</option>
                                                        <option>Local Authority</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                                                <option>Active</option>
                                                <option>Inactive</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (activeTab === 'team-members') {
                                            addUser.mutate(formData, {
                                                onSuccess: () => setShowAddModal(false)
                                            })
                                        } else {
                                            toast.success(`${activeTab === 'service-users' ? 'Service User' : 'Absence request'} saved successfully!`)
                                            setShowAddModal(false)
                                        }
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
                                    disabled={addUser.isPending}
                                >
                                    {addUser.isPending ? 'Saving...' : activeTab === 'team-members' ? 'Add Staff' :
                                        activeTab === 'service-users' ? 'Add Service User' : 'Submit Request'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center sticky top-0">
                            <h2 className="text-2xl font-bold">Edit User - {selectedUser.name}</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-4 md:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaUser className="inline mr-2" />Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaEnvelope className="inline mr-2" />Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaLock className="inline mr-2" />New Password (leave blank to keep current)
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPhone className="inline mr-2" />Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        defaultValue={selectedUser.phone}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                                {selectedUser.role && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaBriefcase className="inline mr-2" />Role *
                                        </label>
                                        <select
                                            value={formData.role || ''}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        >
                                            <option value="COUNSELOR">Nurse</option>
                                            <option value="SUPPORT">Carer</option>
                                            <option value="MANAGER">Manager</option>
                                            <option value="TEAM_LEADER">Team Leader</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        defaultValue={selectedUser.status || selectedUser.carePlan}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    >
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        updateUser.mutate({ id: formData.id, ...formData }, {
                                            onSuccess: () => setShowEditModal(false)
                                        })
                                    }}
                                    disabled={updateUser.isPending}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
                                >
                                    {updateUser.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View User Modal */}
            {showViewModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">User Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-4 md:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">User ID</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedUser.id}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedUser.name}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Email</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedUser.email}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedUser.phone}</p>
                                </div>
                                {selectedUser.role && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Role</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedUser.role}</p>
                                    </div>
                                )}
                                {selectedUser.funder && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Funder</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedUser.funder}</p>
                                    </div>
                                )}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        {selectedUser.status || selectedUser.carePlan}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="w-full px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Confirm Delete</h2>
                            <button onClick={() => setShowDeleteModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <FaTrash className="text-6xl text-red-500 mx-auto mb-4" />
                                <p className="text-lg text-gray-800 mb-2">Are you sure you want to delete this user?</p>
                                <p className="text-xl font-bold text-gray-900">{selectedUser.name}</p>
                                <p className="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        deleteUser.mutate(selectedUser.id, {
                                            onSuccess: () => setShowDeleteModal(false)
                                        })
                                    }}
                                    disabled={deleteUser.isPending}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
                                >
                                    {deleteUser.isPending ? 'Deleting...' : 'Delete User'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminUsers



