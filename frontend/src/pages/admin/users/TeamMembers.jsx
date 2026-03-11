import { useState } from 'react'
import { FaUsers, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import { useAdminActions } from '../../../hooks/useCrmMutations'

const TeamMembers = () => {
    const teamMembers = [
        { id: 1, name: 'John Doe', role: 'Nurse', phone: '07123456789', email: 'john@pova.com', status: 'Active' },
        { id: 2, name: 'Jane Smith', role: 'Carer', phone: '07987654321', email: 'jane@pova.com', status: 'Active' },
        { id: 3, name: 'Mike Johnson', role: 'Nurse', phone: '07555123456', email: 'mike@pova.com', status: 'Inactive' },
    ]
    const { executeAction } = useAdminActions()

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <FaUsers className="text-teal-600" />
                        Team Members
                    </h1>
                    <p className="text-gray-600">Manage your staff members</p>
                </div>
                <button
                    onClick={() => executeAction.mutate('add_team_member')}
                    disabled={executeAction.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                    <FaPlus />
                    Add Team Member
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Staff ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Full Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {teamMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900">#{member.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{member.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{member.role}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{member.phone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => executeAction.mutate('view_team_member')}
                                                disabled={executeAction.isPending}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => executeAction.mutate('edit_team_member')}
                                                disabled={executeAction.isPending}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => executeAction.mutate('delete_team_member')}
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
            </div>
        </div>
    )
}

export default TeamMembers


