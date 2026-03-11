// Team Member Daily Rota - Complete with All Modals
import { useState } from 'react'
import { FaMapMarkerAlt, FaClock, FaCheck, FaTimes, FaEye, FaStickyNote, FaExclamationTriangle } from 'react-icons/fa'
import { toast } from '../../components/ui/Toast'

const TeamMemberDailyRota = () => {
    const [showCheckinModal, setShowCheckinModal] = useState(false)
    const [showCompleteModal, setShowCompleteModal] = useState(false)
    const [showNotesModal, setShowNotesModal] = useState(false)
    const [showMissedModal, setShowMissedModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedVisit, setSelectedVisit] = useState(null)
    const [filterDate, setFilterDate] = useState('today')
    const [filterStatus, setFilterStatus] = useState('all')

    const [visits, setVisits] = useState([
        {
            id: 'V001',
            date: '2024-02-13',
            serviceUser: 'Client A',
            timeSlot: '09:00 - 11:00',
            address: '123 Main St, London',
            visitType: 'Personal Care',
            checkinTime: '09:05',
            checkoutTime: '-',
            status: 'In Progress',
            tasks: ['Bathing', 'Medication', 'Meal Prep'],
            notes: 'Client prefers morning routine'
        },
        {
            id: 'V002',
            date: '2024-02-13',
            serviceUser: 'Client B',
            timeSlot: '12:00 - 14:00',
            address: '456 Oak Ave, London',
            visitType: 'Medication Support',
            checkinTime: '-',
            checkoutTime: '-',
            status: 'Pending',
            tasks: ['Medication', 'Vital Signs'],
            notes: 'Check blood pressure'
        },
        {
            id: 'V003',
            date: '2024-02-13',
            serviceUser: 'Client C',
            timeSlot: '15:00 - 17:00',
            address: '789 Pine Rd, London',
            visitType: 'Personal Care',
            checkinTime: '15:00',
            checkoutTime: '17:00',
            status: 'Completed',
            tasks: ['Personal Care', 'Companionship'],
            notes: 'Visit completed successfully'
        },
    ])

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700'
            case 'In Progress':
                return 'bg-blue-100 text-blue-700'
            case 'Completed':
                return 'bg-green-100 text-green-700'
            case 'Missed':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    const handleStartVisit = (visit) => {
        setSelectedVisit(visit)
        setShowCheckinModal(true)
    }

    const handleCompleteVisit = (visit) => {
        setSelectedVisit(visit)
        setShowCompleteModal(true)
    }

    const handleAddNotes = (visit) => {
        setSelectedVisit(visit)
        setShowNotesModal(true)
    }

    const handleReportMissed = (visit) => {
        setSelectedVisit(visit)
        setShowMissedModal(true)
    }

    const handleViewDetails = (visit) => {
        setSelectedVisit(visit)
        setShowViewModal(true)
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Rota</h1>
                <p className="text-gray-600">Your assigned visits for today</p>
            </div>

            {/* Filters */}
            <div className="crm-card mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <select
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        >
                            <option value="today">Today</option>
                            <option value="tomorrow">Tomorrow</option>
                            <option value="week">This Week</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="missed">Missed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service User</label>
                        <input
                            type="text"
                            placeholder="Search client..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            placeholder="Filter by area..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Visits List - Desktop Table / Mobile Cards */}
            <div className="crm-card !p-0 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service User</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time Slot</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Visit Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Check-in</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Check-out</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {visits.map((visit) => (
                                <tr key={visit.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-800">{visit.date}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{visit.serviceUser}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{visit.timeSlot}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <FaMapMarkerAlt className="text-gray-400" />
                                            {visit.address}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{visit.visitType}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {visit.checkinTime !== '-' && (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <FaClock className="text-xs" />
                                                {visit.checkinTime}
                                            </div>
                                        )}
                                        {visit.checkinTime === '-' && <span className="text-gray-400">-</span>}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {visit.checkoutTime !== '-' && (
                                            <div className="flex items-center gap-1 text-blue-600">
                                                <FaClock className="text-xs" />
                                                {visit.checkoutTime}
                                            </div>
                                        )}
                                        {visit.checkoutTime === '-' && <span className="text-gray-400">-</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                                            {visit.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {visit.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleStartVisit(visit)}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium"
                                                >
                                                    Start
                                                </button>
                                            )}
                                            {visit.status === 'In Progress' && (
                                                <button
                                                    onClick={() => handleCompleteVisit(visit)}
                                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium"
                                                >
                                                    Complete
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleViewDetails(visit)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="View"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleAddNotes(visit)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                title="Add Notes"
                                            >
                                                <FaStickyNote />
                                            </button>
                                            {visit.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleReportMissed(visit)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Report Missed"
                                                >
                                                    <FaExclamationTriangle />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden divide-y divide-gray-200">
                    {visits.map((visit) => (
                        <div key={visit.id} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">{visit.date} • {visit.visitType}</p>
                                    <h3 className="font-bold text-gray-800 text-lg">{visit.serviceUser}</h3>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${getStatusColor(visit.status)}`}>
                                    {visit.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FaClock className="text-teal-500 shrink-0" />
                                    <span>{visit.timeSlot}</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                    <FaMapMarkerAlt className="text-red-500 shrink-0 mt-1" />
                                    <span>{visit.address}</span>
                                </div>
                                {(visit.checkinTime !== '-' || visit.checkoutTime !== '-') && (
                                    <div className="flex gap-4 pt-1">
                                        {visit.checkinTime !== '-' && (
                                            <div className="text-xs">
                                                <span className="text-gray-500">In:</span> <span className="text-green-600 font-medium">{visit.checkinTime}</span>
                                            </div>
                                        )}
                                        {visit.checkoutTime !== '-' && (
                                            <div className="text-xs">
                                                <span className="text-gray-500">Out:</span> <span className="text-blue-600 font-medium">{visit.checkoutTime}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleViewDetails(visit)}
                                        className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => handleAddNotes(visit)}
                                        className="p-2 text-green-600 bg-green-50 rounded-lg"
                                    >
                                        <FaStickyNote />
                                    </button>
                                    {visit.status === 'Pending' && (
                                        <button
                                            onClick={() => handleReportMissed(visit)}
                                            className="p-2 text-red-600 bg-red-50 rounded-lg"
                                        >
                                            <FaExclamationTriangle />
                                        </button>
                                    )}
                                </div>

                                {visit.status === 'Pending' && (
                                    <button
                                        onClick={() => handleStartVisit(visit)}
                                        className="flex-1 max-w-[120px] py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm"
                                    >
                                        Start Visit
                                    </button>
                                )}
                                {visit.status === 'In Progress' && (
                                    <button
                                        onClick={() => handleCompleteVisit(visit)}
                                        className="flex-1 max-w-[120px] py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm"
                                    >
                                        Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Check-in Modal */}
            {showCheckinModal && selectedVisit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Check-in Visit</h2>
                            <button onClick={() => setShowCheckinModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Service User</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedVisit.serviceUser}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Scheduled Time</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedVisit.timeSlot}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Location</p>
                                    <p className="text-gray-800 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-green-600" />
                                        {selectedVisit.address}
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">✓ GPS Location Captured</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Check-in Time</p>
                                    <input
                                        type="time"
                                        defaultValue={new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                                    <textarea
                                        rows="3"
                                        placeholder="Any notes before starting visit..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCheckinModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        toast.success('Check-in confirmed!')
                                        setShowCheckinModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Confirm Check-in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Complete Visit Modal */}
            {showCompleteModal && selectedVisit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Complete Visit</h2>
                            <button onClick={() => setShowCompleteModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Service User</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedVisit.serviceUser}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Check-out Time</p>
                                        <input
                                            type="time"
                                            defaultValue={new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tasks Completed *</label>
                                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                                        {selectedVisit.tasks.map((task, index) => (
                                            <label key={index} className="flex items-center gap-2">
                                                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                                                <span className="text-gray-700">{task}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Medication Given?</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="medication" value="yes" className="w-4 h-4 text-blue-600" />
                                            <span className="text-gray-700">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="medication" value="no" className="w-4 h-4 text-blue-600" />
                                            <span className="text-gray-700">No</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="medication" value="na" className="w-4 h-4 text-blue-600" defaultChecked />
                                            <span className="text-gray-700">N/A</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Visit Notes *</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Describe the visit, client condition, any observations..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="w-4 h-4 text-red-600 rounded" />
                                        <span className="text-sm font-medium text-gray-700">Report an Incident</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCompleteModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        toast.success('Visit completed successfully!')
                                        setShowCompleteModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Submit Visit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Notes Modal */}
            {showNotesModal && selectedVisit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Add Notes</h2>
                            <button onClick={() => setShowNotesModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Service User</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedVisit.serviceUser}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes *</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Add your notes here..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowNotesModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        toast.success('Notes saved!')
                                        setShowNotesModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Save Notes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Missed Modal */}
            {showMissedModal && selectedVisit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Report Missed Visit</h2>
                            <button onClick={() => setShowMissedModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Service User</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedVisit.serviceUser}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
                                        <option>Select reason</option>
                                        <option>Service User unavailable</option>
                                        <option>Staff emergency</option>
                                        <option>Wrong address</option>
                                        <option>Client refused service</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Details *</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Provide detailed explanation..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    ></textarea>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-sm text-yellow-800">
                                        ⚠️ Admin will be notified automatically
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowMissedModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        toast.success('Missed visit reported!')
                                        setShowMissedModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Submit Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {showViewModal && selectedVisit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Visit Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Visit ID</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedVisit.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Date</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedVisit.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Service User</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedVisit.serviceUser}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Time Slot</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedVisit.timeSlot}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600 mb-1">Address</p>
                                    <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-teal-600" />
                                        {selectedVisit.address}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Visit Type</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedVisit.visitType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedVisit.status)}`}>
                                        {selectedVisit.status}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600 mb-2">Tasks Required</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedVisit.tasks.map((task, index) => (
                                            <span key={index} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                                                {task}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600 mb-1">Notes</p>
                                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedVisit.notes}</p>
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
        </div>
    )
}

export default TeamMemberDailyRota


