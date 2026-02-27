// Team Member - Absences/Holiday Page
import { useState } from 'react'
import { FaPlus, FaEye, FaTimes, FaCalendarAlt, FaFileUpload } from 'react-icons/fa'

const AbsencesHoliday = () => {
    const [showRequestModal, setShowRequestModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)

    const [requests, setRequests] = useState([
        {
            id: 'HR001',
            dates: '2024-03-01 to 2024-03-05',
            startDate: '2024-03-01',
            endDate: '2024-03-05',
            type: 'Holiday',
            reason: 'Family vacation',
            status: 'Approved',
            adminComment: 'Approved - Enjoy your holiday!'
        },
        {
            id: 'HR002',
            dates: '2024-02-20 to 2024-02-21',
            startDate: '2024-02-20',
            endDate: '2024-02-21',
            type: 'Sick Leave',
            reason: 'Flu symptoms',
            status: 'Pending',
            adminComment: ''
        },
        {
            id: 'HR003',
            dates: '2024-01-15 to 2024-01-15',
            startDate: '2024-01-15',
            endDate: '2024-01-15',
            type: 'Emergency Leave',
            reason: 'Family emergency',
            status: 'Rejected',
            adminComment: 'Insufficient notice period'
        },
    ])

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-700'
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700'
            case 'Rejected':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    const handleViewRequest = (request) => {
        setSelectedRequest(request)
        setShowViewModal(true)
    }

    const handleCancelRequest = (id) => {
        if (confirm('Are you sure you want to cancel this request?')) {
            setRequests(requests.filter(r => r.id !== id))
        }
    }

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Absences / Holiday</h1>
                    <p className="text-gray-600">Manage your leave requests and absences</p>
                </div>

                <button
                    onClick={() => setShowRequestModal(true)}
                    className="w-full md:w-auto mt-4 md:mt-0 flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:shadow-lg font-medium"
                >
                    <FaPlus /> Request Leave
                </button>
            </div>

            {/* Requests Table */}
            <div className="crm-card !p-0 overflow-hidden">
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Request ID</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dates</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Admin Comment</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {requests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{request.id}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{request.dates}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{request.type}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{request.reason}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {request.adminComment || '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewRequest(request)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="View"
                                            >
                                                <FaEye />
                                            </button>
                                            {request.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleCancelRequest(request.id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden divide-y divide-gray-200">
                    {requests.map((request) => (
                        <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-[10px] text-gray-500 block">ID: {request.id}</span>
                                    <h3 className="font-bold text-gray-800">{request.type}</h3>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(request.status)}`}>
                                    {request.status}
                                </span>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-600">
                                <div className="mb-2">
                                    <span className="text-gray-400 block text-[10px] uppercase font-bold mb-0.5">Dates</span>
                                    <span className="font-medium text-gray-700">{request.dates}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block text-[10px] uppercase font-bold mb-0.5">Reason</span>
                                    <span className="text-gray-700 italic">{request.reason}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => handleViewRequest(request)}
                                    className="flex-1 max-w-[100px] py-1.5 text-blue-600 bg-blue-50 rounded-lg text-xs font-bold"
                                >
                                    View
                                </button>
                                {request.status === 'Pending' && (
                                    <button
                                        onClick={() => handleCancelRequest(request.id)}
                                        className="flex-1 max-w-[100px] py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Request Leave Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Request Leave</h2>
                            <button onClick={() => setShowRequestModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                                        <option>Select leave type</option>
                                        <option>Holiday</option>
                                        <option>Sick Leave</option>
                                        <option>Emergency Leave</option>
                                        <option>Personal Leave</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Provide reason for leave..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-500 cursor-pointer">
                                        <FaFileUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Click to upload medical certificate or proof</p>
                                        <input type="file" className="hidden" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowRequestModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Leave request submitted successfully!')
                                        setShowRequestModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Request Modal */}
            {showViewModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Leave Request Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Request ID</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedRequest.id}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Start Date</p>
                                        <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <FaCalendarAlt className="text-teal-600" />
                                            {selectedRequest.startDate}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">End Date</p>
                                        <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <FaCalendarAlt className="text-teal-600" />
                                            {selectedRequest.endDate}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Leave Type</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedRequest.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Reason</p>
                                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedRequest.reason}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                                {selectedRequest.adminComment && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Admin Comment</p>
                                        <p className="text-gray-800 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                            {selectedRequest.adminComment}
                                        </p>
                                    </div>
                                )}
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

export default AbsencesHoliday
