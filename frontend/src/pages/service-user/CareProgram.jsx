// Service User - Care Program Page
import { useState } from 'react'
import { FaEye, FaTimes, FaDownload, FaClipboardList, FaEdit } from 'react-icons/fa'
import { jsPDF } from 'jspdf'

const CareProgram = () => {
    const [showViewModal, setShowViewModal] = useState(false)
    const [showRequestModal, setShowRequestModal] = useState(false)
    const [selectedProgram, setSelectedProgram] = useState(null)

    const handleDownloadCarePlan = () => {
        const doc = new jsPDF()
        doc.setFillColor(6, 182, 212) // Cyan color
        doc.rect(0, 0, 210, 40, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(24)
        doc.text('POVA Care - Care Plan', 14, 25)

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(16)
        doc.text('Active Care Programs', 14, 55)

        let yPos = 70
        carePrograms.forEach((program, index) => {
            doc.setFontSize(14)
            doc.setFont(undefined, 'bold')
            doc.text(`${index + 1}. ${program.careService}`, 14, yPos)
            yPos += 7
            doc.setFontSize(11)
            doc.setFont(undefined, 'normal')
            doc.text(`Frequency: ${program.frequency}`, 14, yPos)
            yPos += 5
            doc.text(`Staff: ${program.assignedStaff}`, 14, yPos)
            yPos += 5
            doc.text(`Description: ${program.description}`, 14, yPos)
            yPos += 10
        })

        doc.save('my-care-plan.pdf')
        alert('Care Plan PDF Downloaded Successfully!')
    }

    const carePrograms = [
        {
            id: 'CP001',
            careService: 'Morning Visit',
            frequency: 'Daily',
            assignedStaff: 'Staff A',
            status: 'Active',
            description: 'Personal care, medication assistance, breakfast preparation',
            startDate: '2024-01-01',
            reviewDate: '2024-04-01',
            goals: ['Maintain independence', 'Medication compliance', 'Nutritional support']
        },
        {
            id: 'CP002',
            careService: 'Medication Support',
            frequency: 'Twice Daily',
            assignedStaff: 'Nurse B',
            status: 'Active',
            description: 'Morning and evening medication administration',
            startDate: '2024-01-15',
            reviewDate: '2024-03-15',
            goals: ['Medication adherence', 'Monitor side effects']
        },
        {
            id: 'CP003',
            careService: 'Mobility Support',
            frequency: 'Weekly',
            assignedStaff: 'Physiotherapist C',
            status: 'Active',
            description: 'Exercises and mobility assessment',
            startDate: '2024-02-01',
            reviewDate: '2024-05-01',
            goals: ['Improve mobility', 'Prevent falls', 'Increase strength']
        },
    ]

    const handleViewProgram = (program) => {
        setSelectedProgram(program)
        setShowViewModal(true)
    }

    const getStatusColor = (status) => {
        return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Care Program</h1>
                <p className="text-gray-600">View your complete care plan and program schedule</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={handleDownloadCarePlan}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg"
                >
                    <FaDownload /> Download Care Plan PDF
                </button>
                <button
                    onClick={() => setShowRequestModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg"
                >
                    <FaEdit /> Request Care Plan Update
                </button>
            </div>

            {/* Care Programs List - Desktop Table / Mobile Cards */}
            <div className="crm-card !p-0 overflow-hidden mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Active Care Plan</h2>
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Care Service</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Frequency</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Assigned Staff</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {carePrograms.map((program) => (
                                <tr key={program.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800 flex items-center gap-2">
                                        <FaClipboardList className="text-blue-600" />
                                        {program.careService}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{program.frequency}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{program.assignedStaff}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                                            {program.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleViewProgram(program)}
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
                    {carePrograms.map((program) => (
                        <div key={program.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <FaClipboardList className="text-blue-600" />
                                    <h3 className="font-bold text-gray-800">{program.careService}</h3>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(program.status)}`}>
                                    {program.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <div>
                                    <p className="text-gray-400 font-bold uppercase text-[9px] mb-0.5">Frequency</p>
                                    <p className="font-medium text-gray-700">{program.frequency}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 font-bold uppercase text-[9px] mb-0.5">Assigned Staff</p>
                                    <p className="font-medium text-gray-700">{program.assignedStaff}</p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2 border-t border-gray-100">
                                <button
                                    onClick={() => handleViewProgram(program)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold"
                                >
                                    <FaEye /> View Plan Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Monthly Review Summary */}
            <div className="crm-card">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Programs of Care Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Last Review Date</p>
                        <p className="text-2xl font-bold text-blue-700">Jan 15, 2024</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Next Review Date</p>
                        <p className="text-2xl font-bold text-green-700">Apr 15, 2024</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Care Goals Progress</p>
                        <p className="text-2xl font-bold text-purple-700">85%</p>
                    </div>
                </div>
            </div>

            {/* View Program Details Modal */}
            {showViewModal && selectedProgram && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Care Program Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Program ID</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedProgram.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Status</p>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProgram.status)}`}>
                                            {selectedProgram.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Care Service</p>
                                    <p className="text-xl font-bold text-gray-800">{selectedProgram.careService}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Frequency</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedProgram.frequency}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Assigned Staff</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedProgram.assignedStaff}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Start Date</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedProgram.startDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Review Date</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedProgram.reviewDate}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Description</p>
                                    <p className="text-gray-800 bg-gray-50 border border-gray-200 p-3 rounded-lg">
                                        {selectedProgram.description}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Care Goals</p>
                                    <div className="space-y-2">
                                        {selectedProgram.goals.map((goal, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-green-50 border border-green-200 p-2 rounded-lg">
                                                <span className="text-green-600">✓</span>
                                                <span className="text-gray-800">{goal}</span>
                                            </div>
                                        ))}
                                    </div>
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

            {/* Request Update Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Request Care Plan Update</h2>
                            <button onClick={() => setShowRequestModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Update Type *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                                        <option>Select update type</option>
                                        <option>Change in care needs</option>
                                        <option>Additional service request</option>
                                        <option>Schedule adjustment</option>
                                        <option>Staff preference</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Details *</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Describe the changes you would like to request..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    ></textarea>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-800">
                                        ℹ️ Your request will be reviewed by the care coordinator
                                    </p>
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
                                        alert('Care plan update request submitted successfully!')
                                        setShowRequestModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CareProgram


