import { FaUserInjured, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import { useAdminActions } from '../../../hooks/useCrmMutations'

const ServiceUsers = () => {
    const serviceUsers = [
        { id: 1, name: 'Client A', address: '123 Main St', funder: 'NHS', carePlan: 'Active' },
        { id: 2, name: 'Client B', address: '456 Oak Ave', funder: 'Private', carePlan: 'Active' },
        { id: 3, name: 'Client C', address: '789 Pine Rd', funder: 'Council', carePlan: 'Under Review' },
    ]
    const { executeAction } = useAdminActions()

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <FaUserInjured className="text-blue-600" />
                        Service Users
                    </h1>
                    <p className="text-gray-600">Manage service user profiles</p>
                </div>
                <button
                    onClick={() => executeAction.mutate('add_service_user')}
                    disabled={executeAction.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                    <FaPlus />
                    Add Service User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Address</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Funder</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Care Plan Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {serviceUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900">#{user.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.address}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.funder}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.carePlan === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {user.carePlan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => executeAction.mutate('view_service_user')}
                                                disabled={executeAction.isPending}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => executeAction.mutate('edit_service_user')}
                                                disabled={executeAction.isPending}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => executeAction.mutate('delete_service_user')}
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

export default ServiceUsers


