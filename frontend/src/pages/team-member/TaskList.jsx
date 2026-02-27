// Team Member - Task List Page
import { useState } from 'react'
import { FaCheck, FaEye, FaTimes, FaExclamationCircle } from 'react-icons/fa'

const TaskList = () => {
    const [showViewModal, setShowViewModal] = useState(false)
    const [showCompleteModal, setShowCompleteModal] = useState(false)
    const [showIssueModal, setShowIssueModal] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)

    const [tasks, setTasks] = useState([
        {
            id: 'T001',
            taskName: 'Medication Administration',
            serviceUser: 'Client A',
            dueDate: '2024-02-13',
            priority: 'High',
            status: 'Pending',
            instructions: 'Administer morning medication as per prescription chart',
            assignedBy: 'Admin User',
            completionNotes: '',
            timeCompleted: ''
        },
        {
            id: 'T002',
            taskName: 'Personal Care - Bathing',
            serviceUser: 'Client B',
            dueDate: '2024-02-13',
            priority: 'Medium',
            status: 'Pending',
            instructions: 'Assist with morning bathing routine',
            assignedBy: 'Admin User',
            completionNotes: '',
            timeCompleted: ''
        },
        {
            id: 'T003',
            taskName: 'Meal Preparation',
            serviceUser: 'Client C',
            dueDate: '2024-02-12',
            priority: 'Low',
            status: 'Completed',
            instructions: 'Prepare lunch according to dietary requirements',
            assignedBy: 'Admin User',
            completionNotes: 'Meal prepared successfully. Client ate well.',
            timeCompleted: '12:30'
        },
    ])

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-700'
            case 'Medium':
                return 'bg-yellow-100 text-yellow-700'
            case 'Low':
                return 'bg-green-100 text-green-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    const getStatusColor = (status) => {
        return status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
    }

    const handleViewTask = (task) => {
        setSelectedTask(task)
        setShowViewModal(true)
    }

    const handleMarkComplete = (task) => {
        setSelectedTask(task)
        setShowCompleteModal(true)
    }

    const handleReportIssue = (task) => {
        setSelectedTask(task)
        setShowIssueModal(true)
    }

    const confirmComplete = () => {
        setTasks(tasks.map(t =>
            t.id === selectedTask.id
                ? { ...t, status: 'Completed', timeCompleted: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }
                : t
        ))
        setShowCompleteModal(false)
        setSelectedTask(null)
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Task List</h1>
                <p className="text-gray-600">Your assigned care tasks and activities</p>
            </div>

            {/* Tasks List - Desktop Table / Mobile Cards */}
            <div className="crm-card !p-0 overflow-hidden">
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Task Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service User</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{task.taskName}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{task.serviceUser}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{task.dueDate}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {task.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleMarkComplete(task)}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium"
                                                >
                                                    Mark Done
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleViewTask(task)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="View"
                                            >
                                                <FaEye />
                                            </button>
                                            {task.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleReportIssue(task)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Report Issue"
                                                >
                                                    <FaExclamationCircle />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden divide-y divide-gray-200">
                    {tasks.map((task) => (
                        <div key={task.id} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-800">{task.taskName}</h3>
                                    <p className="text-sm text-gray-600">{task.serviceUser}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <div className="text-xs text-gray-500">
                                    Due: <span className="font-medium text-gray-700">{task.dueDate}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority} Priority
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleViewTask(task)}
                                        className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                                    >
                                        <FaEye />
                                    </button>
                                    {task.status === 'Pending' && (
                                        <button
                                            onClick={() => handleReportIssue(task)}
                                            className="p-2 text-red-600 bg-red-50 rounded-lg"
                                        >
                                            <FaExclamationCircle />
                                        </button>
                                    )}
                                </div>

                                {task.status === 'Pending' && (
                                    <button
                                        onClick={() => handleMarkComplete(task)}
                                        className="flex-1 max-w-[120px] py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm"
                                    >
                                        Mark Done
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Task Modal */}
            {showViewModal && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Task Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Task ID</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedTask.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Task Name</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedTask.taskName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Service User</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedTask.serviceUser}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Due Date</p>
                                        <p className="text-lg font-semibold text-gray-800">{selectedTask.dueDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Priority</p>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTask.priority)}`}>
                                            {selectedTask.priority}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTask.status)}`}>
                                        {selectedTask.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Task Instructions</p>
                                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedTask.instructions}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Assigned By</p>
                                    <p className="text-gray-800">{selectedTask.assignedBy}</p>
                                </div>
                                {selectedTask.status === 'Completed' && (
                                    <>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Time Completed</p>
                                            <p className="text-gray-800">{selectedTask.timeCompleted}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Completion Notes</p>
                                            <p className="text-gray-800 bg-green-50 border border-green-200 p-3 rounded-lg">
                                                {selectedTask.completionNotes}
                                            </p>
                                        </div>
                                    </>
                                )}
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

            {/* Mark Complete Modal */}
            {showCompleteModal && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Mark Task Complete</h2>
                            <button onClick={() => setShowCompleteModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Task Name</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedTask.taskName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Service User</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedTask.serviceUser}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Completion Notes *</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Add notes about task completion..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    ></textarea>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-sm text-green-800">
                                        ✓ Task will be marked as completed at {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCompleteModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmComplete}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Confirm Complete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Issue Modal */}
            {showIssueModal && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Report Issue</h2>
                            <button onClick={() => setShowIssueModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Task Name</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedTask.taskName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type *</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
                                        <option>Select issue type</option>
                                        <option>Unable to complete</option>
                                        <option>Client unavailable</option>
                                        <option>Missing supplies</option>
                                        <option>Safety concern</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Describe the issue..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    ></textarea>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-sm text-yellow-800">
                                        ⚠️ Admin will be notified about this issue
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowIssueModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Issue reported successfully!')
                                        setShowIssueModal(false)
                                    }}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:shadow-lg"
                                >
                                    Submit Issue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskList
