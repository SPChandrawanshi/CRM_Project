// Team Member - Forms Page
import { useState } from 'react'
import { FaFileAlt, FaEye, FaDownload, FaTimes, FaCheckCircle, FaClock } from 'react-icons/fa'
import { jsPDF } from 'jspdf'

const Forms = () => {
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedForm, setSelectedForm] = useState(null)

    const forms = [
        {
            id: 'F001',
            formName: 'Daily Care Report',
            serviceUser: 'Client A',
            date: '2024-02-13',
            status: 'Completed',
            submittedBy: 'John Smith',
            type: 'Care Report'
        },
        {
            id: 'F002',
            formName: 'Medication Administration Record',
            serviceUser: 'Client B',
            date: '2024-02-13',
            status: 'Pending',
            submittedBy: 'Sarah Johnson',
            type: 'Medication'
        },
        {
            id: 'F003',
            formName: 'Personal Care Assessment',
            serviceUser: 'Client C',
            date: '2024-02-12',
            status: 'Completed',
            submittedBy: 'Mike Wilson',
            type: 'Assessment'
        },
        {
            id: 'F004',
            formName: 'Risk Assessment Form',
            serviceUser: 'Client A',
            date: '2024-02-11',
            status: 'Completed',
            submittedBy: 'John Smith',
            type: 'Risk Assessment'
        },
    ]

    const getStatusColor = (status) => {
        return status === 'Completed'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
    }

    const getStatusIcon = (status) => {
        return status === 'Completed' ? FaCheckCircle : FaClock
    }

    const handleViewForm = (form) => {
        setSelectedForm(form)
        setShowViewModal(true)
    }

    const handleDownloadPDF = (form) => {
        const doc = new jsPDF()

        // Header
        doc.setFillColor(20, 158, 150) // Teal color
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
        doc.text(`Service User: ${form.serviceUser}`, 14, 75)
        doc.text(`Date: ${form.date}`, 14, 85)
        doc.text(`Status: ${form.status}`, 14, 95)
        doc.text(`Submitted By: ${form.submittedBy}`, 14, 105)

        doc.setDrawColor(200, 200, 200)
        doc.line(14, 115, 196, 115)

        doc.setFontSize(14)
        doc.setFont(undefined, 'bold')
        doc.text('Form Content', 14, 130)

        doc.setFontSize(11)
        doc.setFont(undefined, 'normal')
        const splitText = doc.splitTextToSize(
            'This is a generated PDF for the selected form. In a live environment, this would contain all individual field responses and data recorded during the care session. The data above represents the metadata collected for this form instance.',
            180
        )
        doc.text(splitText, 14, 140)

        doc.save(`${form.formName.toLowerCase().replace(/\s+/g, '-')}-${form.id}.pdf`)
        alert('Form PDF Downloaded Successfully!')
    }

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Forms</h1>
                <p className="text-sm lg:text-base text-gray-600">View and manage care forms and documentation</p>
            </div>

            {/* Forms List - Desktop Table / Mobile Cards */}
            <div className="crm-card !p-0 overflow-hidden">
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Form Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service User</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {forms.map((form) => {
                                const StatusIcon = getStatusIcon(form.status)
                                return (
                                    <tr key={form.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-800">{form.formName}</p>
                                            <p className="text-xs text-gray-500">{form.type}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{form.serviceUser}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{form.date}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                                                <StatusIcon className="text-xs" />
                                                {form.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewForm(form)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="View"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadPDF(form)}
                                                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg"
                                                    title="Download"
                                                >
                                                    <FaDownload />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>


                {/* Mobile View */}
                <div className="lg:hidden divide-y divide-gray-200">
                    {forms.map((form) => {
                        const StatusIcon = getStatusIcon(form.status)
                        return (
                            <div key={form.id} className="p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm">{form.formName}</h3>
                                        <p className="text-xs text-gray-500">{form.serviceUser}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${getStatusColor(form.status)}`}>
                                        <StatusIcon className="text-[10px]" />
                                        {form.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-xs text-gray-500">{form.date}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewForm(form)}
                                            className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPDF(form)}
                                            className="p-2 text-teal-600 bg-teal-50 rounded-lg"
                                        >
                                            <FaDownload />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* View Form Modal */}
            {showViewModal && selectedForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 lg:px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-xl lg:text-2xl font-bold">Form Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-lg lg:text-xl" />
                            </button>
                        </div>
                        <div className="p-4 lg:p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Form ID</p>
                                    <p className="text-base lg:text-lg font-semibold text-gray-800">{selectedForm.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Form Name</p>
                                    <p className="text-base lg:text-lg font-semibold text-gray-800">{selectedForm.formName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Type</p>
                                    <p className="text-base lg:text-lg font-semibold text-gray-800">{selectedForm.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Service User</p>
                                    <p className="text-base lg:text-lg font-semibold text-gray-800">{selectedForm.serviceUser}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Date</p>
                                    <p className="text-base lg:text-lg font-semibold text-gray-800">{selectedForm.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedForm.status)}`}>
                                        {selectedForm.status === 'Completed' ? <FaCheckCircle /> : <FaClock />}
                                        {selectedForm.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Submitted By</p>
                                    <p className="text-base lg:text-lg font-semibold text-gray-800">{selectedForm.submittedBy}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">Form Content</p>
                                    <p className="text-sm text-gray-800">
                                        This is a placeholder for the actual form content. In a real application,
                                        this would display the complete form data with all fields and responses.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="flex-1 px-4 lg:px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm lg:text-base"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleDownloadPDF(selectedForm)}
                                    className="flex-1 px-4 lg:px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:shadow-lg text-sm lg:text-base"
                                >
                                    <FaDownload className="inline mr-2" />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Forms
