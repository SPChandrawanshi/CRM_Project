import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FaPlus, FaCalendarDay, FaPrint, FaTools, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'

const AdminRota = () => {
    const location = useLocation()
    const [activeTab, setActiveTab] = useState('daily')

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const tab = params.get('tab')
        if (tab && ['add', 'daily', 'printable', 'build'].includes(tab)) {
            setActiveTab(tab)
        }
    }, [location])
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedRota, setSelectedRota] = useState(null)

    // Mock data
    const [rotaData, setRotaData] = useState([
        {
            id: 'R001',
            date: '2024-02-13',
            teamMember: 'John Smith',
            serviceUser: 'Client A',
            shiftTime: '09:00 - 17:00',
            shiftStart: '09:00',
            shiftEnd: '17:00',
            location: '123 Main St',
            notes: 'Regular morning shift',
            status: 'Scheduled'
        },
        {
            id: 'R002',
            date: '2024-02-13',
            teamMember: 'Sarah Johnson',
            serviceUser: 'Client B',
            shiftTime: '10:00 - 14:00',
            shiftStart: '10:00',
            shiftEnd: '14:00',
            location: '456 Oak Ave',
            notes: 'Afternoon care',
            status: 'Completed'
        },
        {
            id: 'R003',
            date: '2024-02-13',
            teamMember: 'Mike Wilson',
            serviceUser: 'Client C',
            shiftTime: '14:00 - 18:00',
            shiftStart: '14:00',
            shiftEnd: '18:00',
            location: '789 Pine Rd',
            notes: 'Evening shift',
            status: 'Missed'
        },
    ])

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-100 text-blue-700'
            case 'Completed':
                return 'bg-green-100 text-green-700'
            case 'Missed':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    const handleView = (rota) => {
        setSelectedRota(rota)
        setShowViewModal(true)
    }

    const handleEdit = (rota) => {
        setSelectedRota(rota)
        setShowEditModal(true)
    }

    const handleDelete = (rota) => {
        setSelectedRota(rota)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        setRotaData(rotaData.filter(r => r.id !== selectedRota.id))
        setShowDeleteModal(false)
        setSelectedRota(null)
    }

    const handleSaveRota = () => {
        alert('Rota saved successfully!')
        setShowAddModal(false)
        setActiveTab('daily')
    }

    const handleUpdateRota = () => {
        alert('Rota updated successfully!')
        setShowEditModal(false)
        setSelectedRota(null)
    }

    const tabs = [
        { id: 'add', label: 'Add Rota', icon: FaPlus },
        { id: 'daily', label: 'Daily Rota', icon: FaCalendarDay },
        { id: 'printable', label: 'Printable Rota', icon: FaPrint },
        { id: 'build', label: 'Build Rota', icon: FaTools },
    ]

    const getTitle = () => {
        switch (activeTab) {
            case 'add': return 'Add New Rota'
            case 'daily': return 'Daily Rota'
            case 'printable': return 'Printable Rota'
            case 'build': return 'Build Rota'
            default: return 'Rota Management'
        }
    }

    const getSubtitle = () => {
        switch (activeTab) {
            case 'add': return 'Create a new staff schedule entry'
            case 'daily': return 'View and manage today\'s staff assignments'
            case 'printable': return 'Generate weekly schedules for printing'
            case 'build': return 'Advanced tools for building complex rotas'
            default: return 'Manage staff schedules and assignments'
        }
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 uppercase tracking-tight">{getTitle()}</h1>
                <p className="text-gray-600 text-sm md:text-base">{getSubtitle()}</p>
            </div>

            {/* Content Area */}
            <div className="crm-card !p-0 mb-6 overflow-hidden">

                {/* Tab Content */}
                <div className="p-4 md:p-6">
                    {activeTab === 'add' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Rota</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Member</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none">
                                        <option>Select Team Member</option>
                                        <option>John Smith</option>
                                        <option>Sarah Johnson</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Service User</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none">
                                        <option>Select Service User</option>
                                        <option>Client A</option>
                                        <option>Client B</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift Start Time</label>
                                    <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift End Time</label>
                                    <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Visit Address</label>
                                    <input type="text" placeholder="Enter address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                    <textarea rows="3" placeholder="Additional notes..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <button
                                        onClick={handleSaveRota}
                                        className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                                    >
                                        Save Rota
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'daily' && (
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Daily Rota View</h2>
                                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                    <input type="date" className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                                    >
                                        <FaPlus /> Add Rota
                                    </button>
                                </div>
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rota ID</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Team Member</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service User</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Shift Time</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {rotaData.map((rota) => (
                                            <tr key={rota.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{rota.id}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{rota.date}</td>
                                                <td className="px-4 py-3 text-sm text-gray-800">{rota.teamMember}</td>
                                                <td className="px-4 py-3 text-sm text-gray-800">{rota.serviceUser}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{rota.shiftTime}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{rota.location}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rota.status)}`}>
                                                        {rota.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleView(rota)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(rota)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(rota)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

                            {/* Mobile List - Rota Cards */}
                            <div className="md:hidden space-y-4">
                                {rotaData.map((rota) => (
                                    <div key={rota.id} className="crm-card !p-4 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{rota.id}</span>
                                                    <span className="text-xs text-gray-500">{rota.date}</span>
                                                </div>
                                                <h3 className="font-semibold text-gray-800">{rota.serviceUser}</h3>
                                                <p className="text-xs text-cyan-600 font-medium">{rota.teamMember}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${getStatusColor(rota.status)}`}>
                                                {rota.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-3 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">🕒</span> {rota.shiftTime}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">📍</span> {rota.location}
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                            <button
                                                onClick={() => handleView(rota)}
                                                className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(rota)}
                                                className="p-2 text-green-600 bg-green-50 rounded-lg"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(rota)}
                                                className="p-2 text-red-600 bg-red-50 rounded-lg"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'printable' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">Printable Weekly Rota</h2>
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    <FaPrint /> Print Current View
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                                    <div key={day} className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                                        <h3 className="font-bold text-cyan-700 text-sm mb-3 border-b border-gray-200 pb-1">{day} (Feb {12 + idx})</h3>
                                        <div className="space-y-2">
                                            {rotaData.slice(0, 2).map((r, i) => (
                                                <div key={i} className="bg-white p-2 rounded border border-gray-100 text-[10px] shadow-sm">
                                                    <p className="font-bold text-gray-800">{r.shiftTime}</p>
                                                    <p className="text-gray-600 truncate">{r.teamMember}</p>
                                                    <p className="text-cyan-600 font-medium truncate">{r.serviceUser}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-cyan-50 border border-cyan-100 rounded-lg flex items-center gap-3">
                                <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white">
                                    <FaCalendarDay />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-cyan-900">Pro Tip</p>
                                    <p className="text-xs text-cyan-700">You can filter by staff or client before printing to generate personalized schedules.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'build' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">Advanced Rota Builder</h2>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Auto-Suggest</button>
                                    <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700">Publish Rota</button>
                                </div>
                            </div>

                            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-bold text-gray-500">Service User</th>
                                            {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map(time => (
                                                <th key={time} className="px-4 py-3 text-center font-bold text-gray-500 border-l border-gray-100">{time}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {['James P', 'Mary C', 'Robert T', 'Patricia M'].map(client => (
                                            <tr key={client}>
                                                <td className="px-4 py-4 font-bold text-gray-700 bg-gray-50/50">{client}</td>
                                                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                                    <td key={i} className="px-2 py-4 border-l border-gray-100">
                                                        {(i + client.length) % 3 === 0 ? (
                                                            <div className="bg-cyan-50 border border-cyan-200 text-cyan-700 p-2 rounded text-[10px] text-center cursor-pointer hover:bg-cyan-100 transition-all">
                                                                Assigned: {rotaData[0].teamMember}
                                                            </div>
                                                        ) : (
                                                            <div className="border border-dashed border-gray-200 p-2 rounded text-[10px] text-gray-400 text-center cursor-pointer hover:bg-gray-50">
                                                                + Add Slot
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Add New Rota</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Member *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none">
                                        <option>Select Team Member</option>
                                        <option>John Smith</option>
                                        <option>Sarah Johnson</option>
                                        <option>Mike Wilson</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Service User *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none">
                                        <option>Select Service User</option>
                                        <option>Client A</option>
                                        <option>Client B</option>
                                        <option>Client C</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift Start Time *</label>
                                    <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift End Time *</label>
                                    <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Visit Address *</label>
                                    <input type="text" placeholder="Enter address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                    <textarea rows="3" placeholder="Additional notes..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"></textarea>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveRota}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    Save Rota
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && selectedRota && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Rota Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Rota ID</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedRota.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Date</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedRota.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Team Member</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedRota.teamMember}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Service User</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedRota.serviceUser}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Shift Time</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedRota.shiftTime}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRota.status)}`}>
                                        {selectedRota.status}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600 mb-1">Location</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedRota.location}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600 mb-1">Notes</p>
                                    <p className="text-gray-800">{selectedRota.notes}</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="w-full px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedRota && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Edit Rota</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                                    <input type="date" defaultValue={selectedRota.date} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Member *</label>
                                    <select defaultValue={selectedRota.teamMember} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none">
                                        <option>John Smith</option>
                                        <option>Sarah Johnson</option>
                                        <option>Mike Wilson</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Service User *</label>
                                    <select defaultValue={selectedRota.serviceUser} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none">
                                        <option>Client A</option>
                                        <option>Client B</option>
                                        <option>Client C</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift Start Time *</label>
                                    <input type="time" defaultValue={selectedRota.shiftStart} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift End Time *</label>
                                    <input type="time" defaultValue={selectedRota.shiftEnd} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Visit Address *</label>
                                    <input type="text" defaultValue={selectedRota.location} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select defaultValue={selectedRota.status} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none">
                                        <option>Scheduled</option>
                                        <option>Completed</option>
                                        <option>Missed</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                    <textarea rows="3" defaultValue={selectedRota.notes} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"></textarea>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateRota}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    Update Rota
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedRota && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <div className="text-center mb-4">
                                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <FaTrash className="text-3xl text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Rota?</h2>
                                <p className="text-gray-600">Are you sure you want to delete this rota? This action cannot be undone.</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="text-sm text-gray-600">Rota ID: <span className="font-semibold text-gray-800">{selectedRota.id}</span></p>
                                <p className="text-sm text-gray-600">Team Member: <span className="font-semibold text-gray-800">{selectedRota.teamMember}</span></p>
                                <p className="text-sm text-gray-600">Date: <span className="font-semibold text-gray-800">{selectedRota.date}</span></p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminRota
