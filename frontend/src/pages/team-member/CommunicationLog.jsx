// Team Member - Communication Log Page
import { useState } from 'react'
import { FaPlus, FaEye, FaTimes, FaFileUpload, FaExclamationTriangle } from 'react-icons/fa'
import { toast } from '../../components/ui/Toast'

const CommunicationLog = () => {
    const [activeTab, setActiveTab] = useState('notes')
    const [showAddNoteModal, setShowAddNoteModal] = useState(false)
    const [showIncidentModal, setShowIncidentModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedLog, setSelectedLog] = useState(null)

    const logs = [
        {
            id: 'L001',
            dateTime: '2024-02-13 09:30',
            serviceUser: 'Client A',
            category: 'Note',
            message: 'Client feeling better today, completed all tasks',
            createdBy: 'John Smith',
            details: 'Full visit completed successfully. Client was in good spirits.'
        },
        {
            id: 'L002',
            dateTime: '2024-02-12 14:15',
            serviceUser: 'Client B',
            category: 'Incident',
            message: 'Client had a minor fall, no injuries',
            createdBy: 'Sarah Johnson',
            details: 'Client slipped in bathroom but caught themselves. No medical attention needed.'
        },
        {
            id: 'L003',
            dateTime: '2024-02-11 16:00',
            serviceUser: 'Client C',
            category: 'Update',
            message: 'Medication schedule changed by doctor',
            createdBy: 'Mike Wilson',
            details: 'New prescription received. Updated medication chart.'
        },
    ]

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Note':
                return 'bg-blue-100 text-blue-700'
            case 'Incident':
                return 'bg-red-100 text-red-700'
            case 'Update':
                return 'bg-green-100 text-green-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    const handleViewLog = (log) => {
        setSelectedLog(log)
        setShowViewModal(true)
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Communication Log</h1>
                <p className="text-gray-600">Notes, incidents, and service user messages</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setShowAddNoteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:shadow-lg"
                >
                    <FaPlus /> Add Note
                </button>
                <button
                    onClick={() => setShowIncidentModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:shadow-lg"
                >
                    <FaExclamationTriangle /> Report Incident
                </button>
            </div>

            {/* Tabs */}
            <div className="crm-card !p-0 overflow-hidden mb-6">
                <div className="flex border-b border-gray-200">
                    {['notes', 'incidents', 'messages'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 font-medium transition-all capitalize ${activeTab === tab
                                ? 'text-teal-600 border-b-2 border-teal-600'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            {tab === 'notes' && 'General Notes'}
                            {tab === 'incidents' && 'Incident Reports'}
                            {tab === 'messages' && 'Service User Messages'}
                        </button>
                    ))}
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date/Time</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service User</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Message</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created By</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-600">{log.dateTime}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{log.serviceUser}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(log.category)}`}>
                                            {log.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{log.message}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{log.createdBy}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleViewLog(log)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden divide-y divide-gray-200">
                    {logs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-[10px] text-gray-500">{log.dateTime}</p>
                                    <h3 className="font-bold text-gray-800">{log.serviceUser}</h3>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getCategoryColor(log.category)}`}>
                                    {log.category}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{log.message}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">By: {log.createdBy}</span>
                                <button
                                    onClick={() => handleViewLog(log)}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold"
                                >
                                    <FaEye className="inline mr-1" /> View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Note Modal */}
            {showAddNoteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Add New Note</h2>
                            <button onClick={() => setShowAddNoteModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Service User *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                                        <option>Select client</option>
                                        <option>Client A</option>
                                        <option>Client B</option>
                                        <option>Client C</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                                        <option>Select category</option>
                                        <option>General Note</option>
                                        <option>Health Update</option>
                                        <option>Medication Change</option>
                                        <option>Behavior Observation</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Enter your note..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Attach File (Optional)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-500 cursor-pointer">
                                        <FaFileUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Click to upload file</p>
                                        <input type="file" className="hidden" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddNoteModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        toast.success('Note added successfully!')
                                        setShowAddNoteModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Submit Note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Incident Report Modal */}
            {showIncidentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Report Incident</h2>
                            <button onClick={() => setShowIncidentModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Service User *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
                                        <option>Select client</option>
                                        <option>Client A</option>
                                        <option>Client B</option>
                                        <option>Client C</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Incident Type *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
                                        <option>Select incident type</option>
                                        <option>Fall</option>
                                        <option>Missed Medication</option>
                                        <option>Injury</option>
                                        <option>Abuse Concern</option>
                                        <option>Behavioral Issue</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Describe the incident in detail..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Immediate Action Taken *</label>
                                    <textarea
                                        rows="3"
                                        placeholder="What actions were taken immediately..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="w-4 h-4 text-red-600 rounded" defaultChecked />
                                        <span className="text-sm font-medium text-gray-700">Notify Admin Immediately</span>
                                    </label>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-800">
                                        ⚠️ This incident will be reported to admin and may require follow-up action
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowIncidentModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        toast.success('Incident reported successfully!')
                                        setShowIncidentModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Submit Incident
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Log Modal */}
            {showViewModal && selectedLog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Log Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Log ID</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedLog.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedLog.dateTime}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Service User</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedLog.serviceUser}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Category</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedLog.category)}`}>
                                        {selectedLog.category}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Message</p>
                                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedLog.message}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Details</p>
                                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedLog.details}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Created By</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedLog.createdBy}</p>
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

export default CommunicationLog


