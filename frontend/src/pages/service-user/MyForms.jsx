// Service User - My Forms Page
import { useState } from 'react'
import { FaEye, FaTimes, FaDownload, FaFileAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { jsPDF } from 'jspdf'

const MyForms = () => {
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedForm, setSelectedForm] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const forms = [
        {
            id: 'FORM001',
            formName: 'Initial Care Assessment',
            formType: 'Medical',
            dateSubmitted: '2024-01-15',
            status: 'Approved',
            reviewedBy: 'Dr. Smith',
            questions: [
                { q: 'Medical History', a: 'Diabetes, Hypertension' },
                { q: 'Current Medications', a: 'Metformin, Lisinopril' },
                { q: 'Allergies', a: 'Penicillin' }
            ],
            staffComments: 'Assessment completed. Care plan created based on medical needs.',
            signature: 'Client Signature - Jan 15, 2024'
        },
        {
            id: 'FORM002',
            formName: 'Risk Assessment Form',
            formType: 'Care',
            dateSubmitted: '2024-02-01',
            status: 'Pending',
            reviewedBy: '-',
            questions: [
                { q: 'Fall Risk Assessment', a: 'Medium risk - uses walking aid' },
                { q: 'Mobility Level', a: 'Independent with aid' },
                { q: 'Home Safety', a: 'Grab rails installed' }
            ],
            staffComments: '',
            signature: ''
        },
        {
            id: 'FORM003',
            formName: 'Monthly Care Review',
            formType: 'Review',
            dateSubmitted: '2024-02-10',
            status: 'Approved',
            reviewedBy: 'Care Coordinator',
            questions: [
                { q: 'Care Satisfaction', a: 'Very satisfied' },
                { q: 'Any Changes Needed', a: 'Request earlier morning visits' },
                { q: 'Health Updates', a: 'Feeling better overall' }
            ],
            staffComments: 'Positive review. Schedule adjusted as requested.',
            signature: 'Client Signature - Feb 10, 2024'
        },
    ]

    const handleDownloadPDF = (form) => {
        const doc = new jsPDF()

        // Header
        doc.setFillColor(147, 51, 234) // Purple color
        doc.rect(0, 0, 210, 40, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(24)
        doc.text('POVA Care - Form Export', 14, 25)

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(16)
        doc.setFont(undefined, 'bold')
        doc.text(form.formName, 14, 55)

        doc.setFontSize(12)
        doc.setFont(undefined, 'normal')
        doc.text(`Form ID: ${form.id}`, 14, 65)
        doc.text(`Date Submitted: ${form.dateSubmitted}`, 14, 75)
        doc.text(`Status: ${form.status}`, 14, 85)
        doc.text(`Reviewed By: ${form.reviewedBy}`, 14, 95)

        doc.setDrawColor(200, 200, 200)
        doc.line(14, 105, 196, 105)

        doc.setFontSize(14)
        doc.setFont(undefined, 'bold')
        doc.text('Form Responses', 14, 120)

        let yPos = 135
        form.questions.forEach((qa) => {
            if (yPos > 270) {
                doc.addPage()
                yPos = 20
            }
            doc.setFontSize(11)
            doc.setFont(undefined, 'bold')
            doc.text(`Q: ${qa.q}`, 14, yPos)
            yPos += 7
            doc.setFont(undefined, 'normal')
            const lines = doc.splitTextToSize(`A: ${qa.a}`, 180)
            doc.text(lines, 14, yPos)
            yPos += (lines.length * 5) + 5
        })

        if (form.staffComments) {
            yPos += 5
            doc.setFont(undefined, 'bold')
            doc.text('Staff Comments:', 14, yPos)
            yPos += 7
            doc.setFont(undefined, 'normal')
            doc.text(form.staffComments, 14, yPos)
        }

        doc.save(`${form.formName.toLowerCase().replace(/\s+/g, '-')}-${form.id}.pdf`)
        alert('PDF Downloaded Successfully!')
    }

    const handleViewForm = (form) => {
        setSelectedForm(form)
        setShowViewModal(true)
    }

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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved':
                return <FaCheckCircle className="inline mr-1" />
            case 'Rejected':
                return <FaTimesCircle className="inline mr-1" />
            default:
                return null
        }
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Forms</h1>
                <p className="text-gray-600">View your assessments, care forms and documents</p>
            </div>

            {/* Filters */}
            <div className="crm-card mb-6">
                <div className="flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="Search form name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <input
                        type="date"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>
            </div>

            {/* Forms List - Desktop Table / Mobile Cards */}
            <div className="crm-card !p-0 overflow-hidden">
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Form Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Form Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date Submitted</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reviewed By</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {forms.map((form) => (
                                <tr key={form.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800 flex items-center gap-2">
                                        <FaFileAlt className="text-purple-600" />
                                        {form.formName}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{form.formType}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{form.dateSubmitted}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                                            {getStatusIcon(form.status)}
                                            {form.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{form.reviewedBy}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewForm(form)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="View Form"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadPDF(form)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                title="Download PDF"
                                            >
                                                <FaDownload />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden divide-y divide-gray-200">
                    {forms.map((form) => (
                        <div key={form.id} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-start gap-2">
                                    <FaFileAlt className="text-purple-600 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm leading-tight">{form.formName}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{form.formType}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${getStatusColor(form.status)}`}>
                                    {form.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                <div>
                                    <p className="text-[10px] text-gray-400">SUBMITTED</p>
                                    <p className="text-xs text-gray-700 font-medium">{form.dateSubmitted}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400">REVIEWED BY</p>
                                    <p className="text-xs text-gray-700 font-medium">{form.reviewedBy}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewForm(form)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold"
                                >
                                    <FaEye /> View
                                </button>
                                <button
                                    onClick={() => handleDownloadPDF(form)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-semibold"
                                >
                                    <FaDownload /> PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Form Modal */}
            {showViewModal && selectedForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Form Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {/* Form Header */}
                                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Form ID</p>
                                            <p className="text-lg font-semibold text-gray-800">{selectedForm.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Status</p>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedForm.status)}`}>
                                                {getStatusIcon(selectedForm.status)}
                                                {selectedForm.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Form Name</p>
                                    <p className="text-xl font-bold text-gray-800">{selectedForm.formName}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Form Type</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedForm.formType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Date Submitted</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedForm.dateSubmitted}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Reviewed By</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedForm.reviewedBy || 'Pending Review'}</p>
                                </div>

                                {/* Questions & Answers */}
                                <div>
                                    <p className="text-sm text-gray-600 mb-3 font-semibold">Questions & Answers</p>
                                    <div className="space-y-3">
                                        {selectedForm.questions.map((qa, index) => (
                                            <div key={index} className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Q: {qa.q}</p>
                                                <p className="text-sm text-gray-800 bg-white p-2 rounded">A: {qa.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Staff Comments */}
                                {selectedForm.staffComments && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Staff Comments</p>
                                        <p className="text-gray-800 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                            {selectedForm.staffComments}
                                        </p>
                                    </div>
                                )}

                                {/* Signature */}
                                {selectedForm.signature && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Signature</p>
                                        <p className="text-gray-800 bg-green-50 border border-green-200 p-3 rounded-lg italic">
                                            ✍️ {selectedForm.signature}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleDownloadPDF(selectedForm)}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    <FaDownload /> Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyForms


