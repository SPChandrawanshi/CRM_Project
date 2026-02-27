// Service User - Notes Page
import { useState } from 'react'
import { FaEye, FaTimes, FaPlus, FaStickyNote, FaComment } from 'react-icons/fa'

const Notes = () => {
    const [showViewModal, setShowViewModal] = useState(false)
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const [selectedNote, setSelectedNote] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')

    const notes = [
        {
            id: 'N001',
            date: '2024-02-13',
            staffMember: 'Nurse John',
            noteType: 'Care Update',
            summary: 'Morning visit completed successfully',
            fullNote: 'Client was in good spirits. Personal care completed. Medication administered as prescribed. Client ate breakfast well.',
            tasksPerformed: ['Personal Care', 'Medication', 'Breakfast Assistance'],
            followUp: 'Continue current care plan'
        },
        {
            id: 'N002',
            date: '2024-02-12',
            staffMember: 'Carer Sarah',
            noteType: 'Medication',
            summary: 'Evening medication administered',
            fullNote: 'All evening medications given. Client reminded about morning dose timing.',
            tasksPerformed: ['Medication Administration'],
            followUp: 'Monitor for side effects'
        },
        {
            id: 'N003',
            date: '2024-02-11',
            staffMember: 'Nurse Mike',
            noteType: 'Incident',
            summary: 'Minor fall reported - no injuries',
            fullNote: 'Client slipped in bathroom but caught themselves on grab rail. No visible injuries. Client assessed and comfortable.',
            tasksPerformed: ['Incident Assessment', 'Safety Check'],
            followUp: 'Review bathroom safety equipment'
        },
    ]

    const handleViewNote = (note) => {
        setSelectedNote(note)
        setShowViewModal(true)
    }

    const getNoteTypeColor = (type) => {
        switch (type) {
            case 'Care Update':
                return 'bg-blue-100 text-blue-700'
            case 'Medication':
                return 'bg-purple-100 text-purple-700'
            case 'Incident':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Care Notes</h1>
                <p className="text-gray-600">View your care visit notes and staff observations</p>
            </div>

            {/* Filters & Add Feedback */}
            <div className="crm-card mb-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-3 flex-1">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="all">All Categories</option>
                            <option value="care">Care Update</option>
                            <option value="medication">Medication</option>
                            <option value="incident">Incident</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setShowFeedbackModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg"
                    >
                        <FaPlus /> Add Feedback
                    </button>
                </div>
            </div>

            {/* Notes List - Desktop Table / Mobile Cards */}
            <div className="crm-card !p-0 overflow-hidden">
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Staff Member</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Note Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Summary</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {notes.map((note) => (
                                <tr key={note.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-800">{note.date}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{note.staffMember}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getNoteTypeColor(note.noteType)}`}>
                                            {note.noteType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{note.summary}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleViewNote(note)}
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
                    {notes.map((note) => (
                        <div key={note.id} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-[10px] text-gray-500">{note.date}</p>
                                    <h3 className="font-bold text-gray-800">{note.staffMember}</h3>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getNoteTypeColor(note.noteType)}`}>
                                    {note.noteType}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{note.summary}</p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleViewNote(note)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold"
                                >
                                    <FaEye /> View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Note Details Modal */}
            {showViewModal && selectedNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Care Note Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Note ID</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedNote.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Date</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedNote.date}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Staff Member</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedNote.staffMember}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Note Type</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getNoteTypeColor(selectedNote.noteType)}`}>
                                        {selectedNote.noteType}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Full Care Note</p>
                                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                        <FaStickyNote className="text-blue-600 mb-2" />
                                        <p className="text-gray-800">{selectedNote.fullNote}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Tasks Performed</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedNote.tasksPerformed.map((task, index) => (
                                            <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                ✓ {task}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Follow-up Required</p>
                                    <p className="text-gray-800 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                        {selectedNote.followUp}
                                    </p>
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

            {/* Add Feedback Modal */}
            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Add Feedback</h2>
                            <button onClick={() => setShowFeedbackModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                                        <option>Select category</option>
                                        <option>Appreciation</option>
                                        <option>Complaint</option>
                                        <option>Suggestion</option>
                                        <option>General Feedback</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Enter your feedback..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    ></textarea>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-800">
                                        <FaComment className="inline mr-2" />
                                        Your feedback will be reviewed by the care team
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowFeedbackModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Feedback submitted successfully!')
                                        setShowFeedbackModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Submit Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notes
