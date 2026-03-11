// Admin - Daily Rota Page
import { useState } from 'react'
import { FaCalendarDay, FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa'
import { useAdminActions } from '../../../hooks/useCrmMutations'

const DailyRota = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const { executeAction } = useAdminActions()

    const rotaData = [
        { id: 1, teamMember: 'John Doe', serviceUser: 'Client A', time: '09:00 - 11:00', location: '123 Main St', status: 'Scheduled' },
        { id: 2, teamMember: 'Jane Smith', serviceUser: 'Client B', time: '10:00 - 12:00', location: '456 Oak Ave', status: 'Completed' },
        { id: 3, teamMember: 'Mike Johnson', serviceUser: 'Client C', time: '14:00 - 16:00', location: '789 Pine Rd', status: 'Scheduled' },
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700'
            case 'Scheduled': return 'bg-blue-100 text-blue-700'
            case 'Missed': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <FaCalendarDay className="text-cyan-600" />
                        Daily Rota
                    </h1>
                    <p className="text-gray-600">View and manage today's schedule</p>
                </div>
                <button
                    onClick={() => executeAction.mutate('add_shift')}
                    disabled={executeAction.isPending}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                    <FaPlus />
                    Add Shift
                </button>
            </div>

            {/* Date Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Select Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Responsive Rota View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rota ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Team Member</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Service User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rotaData.map((rota) => (
                                <tr key={rota.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900">#{rota.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{rota.teamMember}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{rota.serviceUser}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{rota.time}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{rota.location}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rota.status)}`}>
                                            {rota.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => executeAction.mutate('view_rota_details')}
                                                disabled={executeAction.isPending}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => executeAction.mutate('edit_rota')}
                                                disabled={executeAction.isPending}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => executeAction.mutate('delete_rota')}
                                                disabled={executeAction.isPending}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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

                {/* Mobile View - Cards */}
                <div className="md:hidden">
                    {rotaData.map((rota) => (
                        <div key={rota.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">Rota #{rota.id}</span>
                                    <h3 className="font-semibold text-gray-800">{rota.teamMember}</h3>
                                    <p className="text-sm text-cyan-600">{rota.serviceUser}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rota.status)}`}>
                                    {rota.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="w-20 text-gray-400">Time:</span>
                                    <span>{rota.time}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="w-20 text-gray-400">Location:</span>
                                    <span>{rota.location}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2 border-t border-gray-50">
                                <button
                                    onClick={() => executeAction.mutate('view_rota_details')}
                                    disabled={executeAction.isPending}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                    <FaEye /> View
                                </button>
                                <button
                                    onClick={() => executeAction.mutate('edit_rota')}
                                    disabled={executeAction.isPending}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    onClick={() => executeAction.mutate('delete_rota')}
                                    disabled={executeAction.isPending}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DailyRota


