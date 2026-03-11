// Service User - Communication Log Page
import { useState } from 'react'
import { FaEye, FaTimes, FaPlus, FaEnvelope, FaPaperclip } from 'react-icons/fa'

const CommunicationLog = () => {
    const [showViewModal, setShowViewModal] = useState(false)
    const [showNewMessageModal, setShowNewMessageModal] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState(null)

    const messages = [
        {
            id: 'MSG001',
            dateTime: '2024-02-13 10:30',
            sentBy: 'Care Coordinator',
            messageType: 'Update',
            message: 'Your care plan has been reviewed and updated',
            fullMessage: 'Dear Client, your care plan has been reviewed by the care team. We have made some adjustments to better meet your needs. Please review the updated plan in your Care Program section.',
            attachments: ['care_plan_v2.pdf'],
            response: 'Thank you for the update'
        },
        {
            id: 'MSG002',
            dateTime: '2024-02-12 14:15',
            sentBy: 'Nurse John',
            messageType: 'Reminder',
            message: 'Medication review appointment scheduled',
            fullMessage: 'This is a reminder that your medication review appointment is scheduled for February 20th at 2:00 PM. Please ensure you have all your current medications available.',
            attachments: [],
            response: ''
        },
        {
            id: 'MSG003',
            dateTime: '2024-02-10 09:00',
            sentBy: 'Admin Team',
            messageType: 'Alert',
            message: 'Staff change notification',
            fullMessage: 'We would like to inform you that Nurse Sarah will be covering your morning visits next week while your regular carer is on leave. Nurse Sarah has been fully briefed on your care needs.',
            attachments: [],
            response: 'Acknowledged'
        },
    ]

    const handleViewMessage = (msg) => {
        setSelectedMessage(msg)
        setShowViewModal(true)
    }

    const getMessageTypeColor = (type) => {
        switch (type) {
            case 'Update':
                return 'bg-blue-100 text-blue-700'
            case 'Reminder':
                return 'bg-yellow-100 text-yellow-700'
            case 'Alert':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Communication Log</h1>
                <p className="text-gray-600">Messages and updates from your care team</p>
            </div>

            {/* New Message Button */}
            <div className="mb-6">
                <button
                    onClick={() => setShowNewMessageModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg"
                >
                    <FaPlus /> Send New Message
                </button>
            </div>

            {/* Messages List - Desktop Table / Mobile Cards */}
            <div className="crm-card !p-0 overflow-hidden">
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date/Time</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sent By</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Message Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Message</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {messages.map((msg) => (
                                <tr key={msg.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-600">{msg.dateTime}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{msg.sentBy}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMessageTypeColor(msg.messageType)}`}>
                                            {msg.messageType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FaEnvelope className="text-gray-400" />
                                            {msg.message}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleViewMessage(msg)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            title="View & Reply"
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
                    {messages.map((msg) => (
                        <div key={msg.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-[10px] text-gray-500">{msg.dateTime}</p>
                                    <h3 className="font-bold text-gray-800">{msg.sentBy}</h3>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getMessageTypeColor(msg.messageType)}`}>
                                    {msg.messageType}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 italic">
                                "{msg.message}"
                            </p>

                            <div className="flex justify-end pt-2 border-t border-gray-100">
                                <button
                                    onClick={() => handleViewMessage(msg)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold"
                                >
                                    <FaEye /> View & Reply
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Message Modal */}
            {showViewModal && selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Message Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Message ID</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedMessage.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedMessage.dateTime}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Sent By</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedMessage.sentBy}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Message Type</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMessageTypeColor(selectedMessage.messageType)}`}>
                                        {selectedMessage.messageType}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Full Message</p>
                                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                        <FaEnvelope className="text-blue-600 mb-2" />
                                        <p className="text-gray-800">{selectedMessage.fullMessage}</p>
                                    </div>
                                </div>
                                {selectedMessage.attachments.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Attachments</p>
                                        <div className="space-y-2">
                                            {selectedMessage.attachments.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-blue-50 border border-blue-200 p-2 rounded-lg">
                                                    <FaPaperclip className="text-blue-600" />
                                                    <span className="text-gray-800">{file}</span>
                                                    <button
                                                        onClick={() => alert(`Downloading ${file}...`)}
                                                        className="ml-auto text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                    >
                                                        Download
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {selectedMessage.response && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Your Response</p>
                                        <p className="text-gray-800 bg-green-50 border border-green-200 p-3 rounded-lg">
                                            {selectedMessage.response}
                                        </p>
                                    </div>
                                )}
                                {!selectedMessage.response && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Reply to this message</p>
                                        <textarea
                                            rows="3"
                                            placeholder="Type your reply..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        ></textarea>
                                        <button
                                            onClick={() => {
                                                alert('Reply sent!')
                                                setShowViewModal(false)
                                            }}
                                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Send Reply
                                        </button>
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

            {/* New Message Modal */}
            {showNewMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Send New Message</h2>
                            <button onClick={() => setShowNewMessageModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Send To *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option>Select recipient</option>
                                        <option>Care Coordinator</option>
                                        <option>My Assigned Nurse</option>
                                        <option>Admin Team</option>
                                        <option>Specific Staff Member</option>
                                        <option>Emergency Contact</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Topic *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option>Select topic</option>
                                        <option>Medication Question</option>
                                        <option>Care Complaint</option>
                                        <option>Schedule Request</option>
                                        <option>General Inquiry</option>
                                        <option>Feedback</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Type your message..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer">
                                        <FaPaperclip className="text-3xl text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Click to attach file</p>
                                        <input type="file" className="hidden" />
                                    </div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-800">
                                        ℹ️ Your message will be sent to the care team
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowNewMessageModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Message sent to care team!')
                                        setShowNewMessageModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Send Message
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


