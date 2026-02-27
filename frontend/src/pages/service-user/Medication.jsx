// Service User - Medication Page
import { useState } from 'react'
import { FaEye, FaTimes, FaPills, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

const Medication = () => {
    const [activeTab, setActiveTab] = useState('active')
    const [showViewModal, setShowViewModal] = useState(false)
    const [showMARModal, setShowMARModal] = useState(false)
    const [selectedMedication, setSelectedMedication] = useState(null)

    const activeMedications = [
        {
            id: 'MED001',
            name: 'Paracetamol',
            dosage: '500mg',
            frequency: 'Twice Daily',
            startDate: '2024-01-15',
            prescribedBy: 'Dr. Smith',
            status: 'Active',
            instructions: 'Take with food. Do not exceed 4 doses in 24 hours.',
            sideEffects: 'May cause nausea, skin rash',
            nextReview: '2024-03-15'
        },
        {
            id: 'MED002',
            name: 'Aspirin',
            dosage: '75mg',
            frequency: 'Once Daily',
            startDate: '2024-02-01',
            prescribedBy: 'Dr. Johnson',
            status: 'Active',
            instructions: 'Take in the morning with water.',
            sideEffects: 'Stomach upset, bleeding risk',
            nextReview: '2024-04-01'
        },
    ]

    const marRecords = [
        { date: '2024-02-13', medicine: 'Paracetamol', givenBy: 'Nurse John', time: '09:00', status: 'Given' },
        { date: '2024-02-13', medicine: 'Aspirin', givenBy: 'Nurse Sarah', time: '09:30', status: 'Given' },
        { date: '2024-02-12', medicine: 'Paracetamol', givenBy: 'Nurse John', time: '21:00', status: 'Given' },
    ]

    const unverifiedMeds = [
        {
            id: 'UV001',
            medicine: 'Vitamin D',
            addedDate: '2024-02-12',
            status: 'Pending Verification',
            addedBy: 'Self-reported'
        },
    ]

    const handleViewMedication = (med) => {
        setSelectedMedication(med)
        setShowViewModal(true)
    }

    const getStatusColor = (status) => {
        return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
    }

    const getMARStatusColor = (status) => {
        return status === 'Given' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Medication</h1>
                <p className="text-gray-600">View your prescribed medications and administration records</p>
            </div>

            {/* Tabs */}
            <div className="crm-card !p-0 mb-6 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    {['active', 'mar', 'unverified', 'history'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 font-medium transition-all capitalize ${activeTab === tab
                                ? 'text-teal-600 border-b-2 border-teal-600'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            {tab === 'active' && 'Active Medicines'}
                            {tab === 'mar' && 'MAR Chart'}
                            {tab === 'unverified' && 'Unverified'}
                            {tab === 'history' && 'History'}
                        </button>
                    ))}
                </div>

                {/* Active Medicines Tab */}
                {activeTab === 'active' && (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Medicine Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dosage</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Frequency</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Start Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Prescribed By</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {activeMedications.map((med) => (
                                        <tr key={med.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800 flex items-center gap-2">
                                                <FaPills className="text-teal-600" />
                                                {med.name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{med.dosage}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{med.frequency}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{med.startDate}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{med.prescribedBy}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(med.status)}`}>
                                                    {med.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleViewMedication(med)}
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

                        {/* Mobile Cards */}
                        <div className="lg:hidden divide-y divide-gray-200">
                            {activeMedications.map((med) => (
                                <div key={med.id} className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <FaPills className="text-teal-600" />
                                            <div>
                                                <h3 className="font-bold text-gray-800">{med.name}</h3>
                                                <p className="text-xs text-gray-500">{med.dosage} • {med.frequency}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(med.status)}`}>
                                            {med.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-xs text-gray-500">
                                            Start: <span className="text-gray-700 font-medium">{med.startDate}</span>
                                        </div>
                                        <button
                                            onClick={() => handleViewMedication(med)}
                                            className="px-3 py-1.5 bg-teal-50 text-teal-600 rounded-lg text-xs font-bold"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* MAR Chart Tab */}
                {activeTab === 'mar' && (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Medicine</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Given By Staff</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {marRecords.map((record, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-800">{record.date}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">{record.medicine}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{record.givenBy}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{record.time}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMARStatusColor(record.status)}`}>
                                                    <FaCheckCircle className="inline mr-1" />
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden divide-y divide-gray-200">
                            {marRecords.map((record, index) => (
                                <div key={index} className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-[10px] text-gray-500">{record.date}</p>
                                            <h3 className="font-bold text-gray-800">{record.medicine}</h3>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getMARStatusColor(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <div className="text-xs">
                                            <p className="text-gray-500">Given by</p>
                                            <p className="text-gray-700 font-medium">{record.givenBy}</p>
                                        </div>
                                        <div className="text-xs text-right">
                                            <p className="text-gray-500">Time</p>
                                            <p className="text-teal-600 font-bold">{record.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Unverified Tab */}
                {activeTab === 'unverified' && (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Medicine</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Added Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Verification Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {unverifiedMeds.map((med) => (
                                        <tr key={med.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800 flex items-center gap-2">
                                                <FaExclamationTriangle className="text-yellow-600" />
                                                {med.medicine}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{med.addedDate}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                    {med.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => alert('Review request sent!')}
                                                    className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-xs font-medium"
                                                >
                                                    Request Review
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden divide-y divide-gray-200">
                            {unverifiedMeds.map((med) => (
                                <div key={med.id} className="p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaExclamationTriangle className="text-yellow-600" />
                                            <h3 className="font-bold text-gray-800">{med.medicine}</h3>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700">
                                            Pending
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500">Added: {med.addedDate}</p>
                                        <button
                                            onClick={() => alert('Review request sent!')}
                                            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold"
                                        >
                                            Request Review
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div className="p-8 text-center">
                        <p className="text-gray-600">No medication history available</p>
                    </div>
                )}
            </div>

            {/* View Medication Details Modal */}
            {showViewModal && selectedMedication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Medication Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Medicine ID</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedMedication.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Status</p>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMedication.status)}`}>
                                            {selectedMedication.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Medicine Name</p>
                                    <p className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <FaPills className="text-teal-600" />
                                        {selectedMedication.name}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Dosage</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedMedication.dosage}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Frequency</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedMedication.frequency}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Start Date</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedMedication.startDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Next Review</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedMedication.nextReview}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Prescribed By</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedMedication.prescribedBy}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Instructions</p>
                                    <p className="text-gray-800 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                        {selectedMedication.instructions}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Side Effects</p>
                                    <p className="text-gray-800 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                        ⚠️ {selectedMedication.sideEffects}
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
        </div>
    )
}

export default Medication
