// Admin - Service Users Page
import { FaUserInjured, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'

const ServiceUsers = () => {
    const serviceUsers = [
        { id: 1, name: 'Client A', address: '123 Main St', funder: 'NHS', carePlan: 'Active' },
        { id: 2, name: 'Client B', address: '456 Oak Ave', funder: 'Private', carePlan: 'Active' },
        { id: 3, name: 'Client C', address: '789 Pine Rd', funder: 'Council', carePlan: 'Under Review' },
    ]

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
                    onClick={() => alert('Add Service User functionality coming soon!')}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
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
                                                onClick={() => alert(`Viewing details for ${user.name}...`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => alert(`Editing ${user.name}...`)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => alert(`Deleting ${user.name}...`)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
