import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FaFileAlt, FaPlus, FaEdit, FaTrash, FaEye, FaTimes, FaClock, FaTasks, FaUser } from 'react-icons/fa'

const AdminTemplates = () => {
    const location = useLocation()
    const [activeTab, setActiveTab] = useState('daily')

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const tab = params.get('tab')
        if (tab && ['daily', 'advanced', 'run-routes'].includes(tab)) {
            setActiveTab(tab)
        }
    }, [location])
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState(null)

    const templates = [
        {
            id: 'T001',
            name: 'Morning Care Routine',
            type: 'Daily',
            tasks: 5,
            duration: '2 hours',
            createdBy: 'Admin User',
            description: 'Standard morning care routine including personal hygiene, breakfast assistance, and medication',
            taskList: ['Personal Care', 'Breakfast Preparation', 'Medication Administration', 'Mobility Support', 'Documentation']
        },
        {
            id: 'T002',
            name: 'Medication Administration',
            type: 'Weekly',
            tasks: 3,
            duration: '1 hour',
            createdBy: 'Admin User',
            description: 'Weekly medication review and administration protocol',
            taskList: ['Medication Check', 'Administration', 'Documentation']
        },
    ]

    const tabs = [
        { id: 'daily', label: 'Daily Templates' },
        { id: 'advanced', label: 'Advanced Templates' },
        { id: 'run-routes', label: 'Templates Run Routes' },
    ]

    const handleAddTemplate = () => {
        setSelectedTemplate(null)
        setShowAddModal(true)
    }

    const handleEditTemplate = (template) => {
        setSelectedTemplate(template)
        setShowEditModal(true)
    }

    const handleViewTemplate = (template) => {
        setSelectedTemplate(template)
        setShowViewModal(true)
    }

    const handleDeleteTemplate = (template) => {
        setSelectedTemplate(template)
        setShowDeleteModal(true)
    }

    const getTitle = () => {
        switch (activeTab) {
            case 'daily': return 'Daily Templates'
            case 'advanced': return 'Advanced Assessments'
            case 'run-routes': return 'Templates Run Routes'
            default: return 'Templates'
        }
    }

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 uppercase tracking-tight">{getTitle()}</h1>
                <p className="text-gray-600 text-sm md:text-base">Manage care templates and routines from the sidebar menu</p>
            </div>

            <div className="crm-card !p-0 overflow-hidden">
                <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            {getTitle()}
                        </h2>
                        <button
                            onClick={handleAddTemplate}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            <FaPlus /> {activeTab === 'run-routes' ? 'Add Run Route' : 'Add Template'}
                        </button>
                    </div>

                    {/* Desktop View - Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{activeTab === 'routes' ? 'Route Name' : 'Template Name'}</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{activeTab === 'routes' ? 'Area' : 'Type'}</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{activeTab === 'routes' ? 'Total Stops' : 'Assigned Tasks'}</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estimated Duration</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Modified</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {(activeTab === 'run-routes' ? [
                                    { id: 'R001', name: 'North Sector Route 1', type: 'Residential', tasks: 12, duration: '4 hours', createdBy: 'Feb 12, 2024' },
                                    { id: 'R002', name: 'Central Care Run', type: 'Urban', tasks: 8, duration: '3 hours', createdBy: 'Feb 14, 2024' }
                                ] : templates).map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-800 font-bold">{item.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.type}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.tasks}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.duration}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 font-medium">{item.createdBy}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleViewTemplate(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FaEye /></button>
                                                <button onClick={() => handleEditTemplate(item)} className="p-2 text-green-600 hover:bg-green-50 rounded"><FaEdit /></button>
                                                <button onClick={() => handleDeleteTemplate(item)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View - Cards */}
                    <div className="md:hidden space-y-4">
                        {(activeTab === 'run-routes' ? [
                            { id: 'R001', name: 'North Sector Route 1', type: 'Residential', tasks: 12, duration: '4 hours', createdBy: 'Feb 12, 2024' },
                            { id: 'R002', name: 'Central Care Run', type: 'Urban', tasks: 8, duration: '3 hours', createdBy: 'Feb 14, 2024' }
                        ] : templates).map((item) => (
                            <div key={item.id} className="crm-card !p-4 mb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                                        <p className="text-xs text-cyan-600 font-medium">{item.type}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                                        {item.duration}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    <p>{item.tasks} {activeTab === 'routes' ? 'Stops' : 'Tasks'}</p>
                                    <p className="text-xs mt-1">Updated: {item.createdBy}</p>
                                </div>
                                <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
                                    <button onClick={() => handleViewTemplate(item)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><FaEye /></button>
                                    <button onClick={() => handleEditTemplate(item)} className="p-2 text-green-600 bg-green-50 rounded-lg"><FaEdit /></button>
                                    <button onClick={() => handleDeleteTemplate(item)} className="p-2 text-red-600 bg-red-50 rounded-lg"><FaTrash /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Template Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center sticky top-0">
                            <h2 className="text-2xl font-bold">Add New Template</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaFileAlt className="inline mr-2" />Template Name *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter template name"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Template Type *
                                        </label>
                                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                                            <option>Select type</option>
                                            <option>Daily</option>
                                            <option>Weekly</option>
                                            <option>Monthly</option>
                                            <option>Custom</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaTasks className="inline mr-2" />Number of Tasks *
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Enter number of tasks"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaClock className="inline mr-2" />Duration *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 2 hours"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        rows="3"
                                        placeholder="Enter template description"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Task List</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Enter tasks (one per line)"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    ></textarea>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-800">
                                        ℹ️ Templates can be assigned to team members and used for creating care routines
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Template created successfully!')
                                        setShowAddModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Create Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Template Modal */}
            {showEditModal && selectedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center sticky top-0">
                            <h2 className="text-2xl font-bold">Edit Template - {selectedTemplate.name}</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaFileAlt className="inline mr-2" />Template Name *
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={selectedTemplate.name}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Template Type *
                                        </label>
                                        <select
                                            defaultValue={selectedTemplate.type}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        >
                                            <option>Daily</option>
                                            <option>Weekly</option>
                                            <option>Monthly</option>
                                            <option>Custom</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaTasks className="inline mr-2" />Number of Tasks *
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue={selectedTemplate.tasks}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaClock className="inline mr-2" />Duration *
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={selectedTemplate.duration}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        rows="3"
                                        defaultValue={selectedTemplate.description}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Task List</label>
                                    <textarea
                                        rows="4"
                                        defaultValue={selectedTemplate.taskList?.join('\n')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Template updated successfully!')
                                        setShowEditModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Template Modal */}
            {showViewModal && selectedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center sticky top-0">
                            <h2 className="text-2xl font-bold">Template Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Template ID</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedTemplate.id}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Template Name</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedTemplate.name}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Type</p>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            {selectedTemplate.type}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Number of Tasks</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedTemplate.tasks}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Duration</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedTemplate.duration}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Created By</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedTemplate.createdBy}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">Description</p>
                                    <p className="text-gray-800">{selectedTemplate.description}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">Task List</p>
                                    <div className="space-y-2">
                                        {selectedTemplate.taskList?.map((task, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                                                <span className="text-teal-600 font-bold">{index + 1}.</span>
                                                <span className="text-gray-800">{task}</span>
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Confirm Delete</h2>
                            <button onClick={() => setShowDeleteModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <FaTrash className="text-6xl text-red-500 mx-auto mb-4" />
                                <p className="text-lg text-gray-800 mb-2">Are you sure you want to delete this template?</p>
                                <p className="text-xl font-bold text-gray-900">{selectedTemplate.name}</p>
                                <p className="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Template deleted successfully!')
                                        setShowDeleteModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Delete Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminTemplates
