// Team Member - My Shifts Page with Working Calendar View
import { useState } from 'react'
import { FaCalendarAlt, FaEye, FaDownload, FaTimes, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import jsPDF from 'jspdf'

const MyShifts = () => {
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedShift, setSelectedShift] = useState(null)
    const [viewMode, setViewMode] = useState('table') // 'table' or 'calendar'
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const shifts = [
        {
            id: 'S001',
            date: '2024-02-13',
            startTime: '09:00',
            endTime: '17:00',
            serviceUser: 'Client A',
            location: '123 Main St, London',
            status: 'Scheduled',
            tasks: ['Personal Care', 'Medication', 'Meal Prep'],
            emergencyContact: '07123 456789',
            adminNotes: 'Client prefers morning routine'
        },
        {
            id: 'S002',
            date: '2024-02-14',
            startTime: '10:00',
            endTime: '14:00',
            serviceUser: 'Client B',
            location: '456 Oak Ave, London',
            status: 'Scheduled',
            tasks: ['Medication Support', 'Companionship'],
            emergencyContact: '07987 654321',
            adminNotes: 'Check blood pressure'
        },
        {
            id: 'S003',
            date: '2024-02-15',
            startTime: '15:00',
            endTime: '18:00',
            serviceUser: 'Client C',
            location: '789 Pine Rd, London',
            status: 'Completed',
            tasks: ['Personal Care', 'Light Housekeeping'],
            emergencyContact: '07555 123456',
            adminNotes: 'Keys with neighbor'
        },
        {
            id: 'S004',
            date: '2024-02-20',
            startTime: '09:00',
            endTime: '12:00',
            serviceUser: 'Client A',
            location: '123 Main St, London',
            status: 'Scheduled',
            tasks: ['Personal Care', 'Medication'],
            emergencyContact: '07123 456789',
            adminNotes: 'Regular morning shift'
        },
        {
            id: 'S005',
            date: '2024-02-25',
            startTime: '14:00',
            endTime: '17:00',
            serviceUser: 'Client B',
            location: '456 Oak Ave, London',
            status: 'Scheduled',
            tasks: ['Companionship', 'Light Activities'],
            emergencyContact: '07987 654321',
            adminNotes: 'Afternoon visit'
        },
    ]

    const handleViewShift = (shift) => {
        setSelectedShift(shift)
        setShowViewModal(true)
    }

    const getStatusColor = (status) => {
        return status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
    }

    const handleDownloadPDF = () => {
        const doc = new jsPDF()

        // Header
        doc.setFillColor(20, 158, 150) // Teal color
        doc.rect(0, 0, 210, 40, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(24)
        doc.text('POVA Care - Weekly Rota', 14, 25)

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(12)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 50)

        // Content
        let yPos = 65

        // Table Header
        doc.setFillColor(240, 240, 240)
        doc.rect(10, yPos - 5, 190, 10, 'F')
        doc.setFont(undefined, 'bold')
        doc.text('Date', 15, yPos)
        doc.text('Time', 45, yPos)
        doc.text('Service User', 85, yPos)
        doc.text('Location', 135, yPos)

        yPos += 10
        doc.setFont(undefined, 'normal')

        shifts.forEach((shift) => {
            if (yPos > 270) {
                doc.addPage()
                yPos = 20
            }

            doc.text(shift.date, 15, yPos)
            doc.text(`${shift.startTime} - ${shift.endTime}`, 45, yPos)
            doc.text(shift.serviceUser, 85, yPos)
            doc.text(shift.location.split(',')[0], 135, yPos) // Shorten location

            yPos += 10
            // Divider line
            doc.setDrawColor(230, 230, 230)
            doc.line(10, yPos - 5, 200, yPos - 5)
        })

        doc.save('weekly-rota.pdf')
    }

    // Calendar functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        return { daysInMonth, startingDayOfWeek, year, month }
    }

    const getShiftsForDate = (dateString) => {
        return shifts.filter(shift => shift.date === dateString)
    }

    const formatDateString = (year, month, day) => {
        const m = String(month + 1).padStart(2, '0')
        const d = String(day).padStart(2, '0')
        return `${year}-${m}-${d}`
    }

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
        const days = []

        // Empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="min-h-[100px] bg-gray-50 border border-gray-200"></div>)
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = formatDateString(year, month, day)
            const dayShifts = getShiftsForDate(dateString)
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

            days.push(
                <div
                    key={day}
                    className={`min-h-[100px] border border-gray-200 p-2 ${isToday ? 'bg-teal-50 border-teal-400' : 'bg-white hover:bg-gray-50'}`}
                >
                    <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-teal-600' : 'text-gray-700'}`}>
                        {day}
                    </div>
                    <div className="space-y-1">
                        {dayShifts.map((shift, index) => (
                            <div
                                key={index}
                                onClick={() => handleViewShift(shift)}
                                className="text-xs p-1.5 bg-blue-100 text-blue-700 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                            >
                                <div className="font-medium truncate">{shift.serviceUser}</div>
                                <div className="text-[10px]">{shift.startTime} - {shift.endTime}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        return days
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Shifts</h1>
                <p className="text-gray-600">View your weekly and monthly schedule</p>
            </div>

            {/* View Toggle & Actions */}
            <div className="crm-card !p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'table' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Table View
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'calendar' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Calendar View
                        </button>
                    </div>
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        <FaDownload /> Download Weekly Rota PDF
                    </button>
                </div>
            </div>


            {/* Shifts Table */}
            {viewMode === 'table' && (
                <div className="crm-card !p-0 overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Shift Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Start Time</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">End Time</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service User</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {shifts.map((shift) => (
                                    <tr key={shift.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{shift.date}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{shift.startTime}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{shift.endTime}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{shift.serviceUser}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-gray-400" />
                                                {shift.location}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shift.status)}`}>
                                                {shift.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleViewShift(shift)}
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

                    {/* Mobile Card View */}
                    <div className="lg:hidden divide-y divide-gray-200">
                        {shifts.map((shift) => (
                            <div key={shift.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{shift.date}</p>
                                        <h3 className="font-bold text-gray-800 text-lg">{shift.serviceUser}</h3>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(shift.status)}`}>
                                        {shift.status}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaCalendarAlt className="text-teal-500 shrink-0" />
                                        <span>{shift.startTime} - {shift.endTime}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <FaMapMarkerAlt className="text-red-500 shrink-0 mt-1" />
                                        <span className="line-clamp-1">{shift.location}</span>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleViewShift(shift)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold"
                                    >
                                        <FaEye /> View Shift
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' && (
                <div className="crm-card">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={previousMonth}
                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <FaChevronLeft className="text-gray-600" />
                            </button>
                            <button
                                onClick={nextMonth}
                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <FaChevronRight className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Day Names */}
                    <div className="grid grid-cols-7 gap-0 mb-2">
                        {dayNames.map((day) => (
                            <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2 bg-gray-50 border border-gray-200">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="overflow-x-auto pb-2">
                        <div className="min-w-[700px]">
                            <div className="grid grid-cols-7 gap-0">
                                {renderCalendar()}
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-teal-50 border-2 border-teal-400 rounded"></div>
                            <span className="text-gray-600">Today</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-100 rounded"></div>
                            <span className="text-gray-600">Scheduled Shift</span>
                        </div>
                    </div>
                </div>
            )}

            {/* View Shift Details Modal */}
            {showViewModal && selectedShift && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Shift Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-white hover:text-gray-200">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Shift ID</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedShift.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Date</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedShift.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Start Time</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedShift.startTime}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">End Time</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedShift.endTime}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600 mb-1">Client Name</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedShift.serviceUser}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600 mb-1">Address</p>
                                    <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-teal-600" />
                                        {selectedShift.location}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600 mb-2">Tasks Required</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedShift.tasks.map((task, index) => (
                                            <span key={index} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                                                {task}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Emergency Contact</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedShift.emergencyContact}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedShift.status)}`}>
                                        {selectedShift.status}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600 mb-1">Notes from Admin</p>
                                    <p className="text-gray-800 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">{selectedShift.adminNotes}</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="w-full px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
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

export default MyShifts


