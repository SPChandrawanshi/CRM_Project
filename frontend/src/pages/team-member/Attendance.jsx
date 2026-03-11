import { useState, useEffect } from 'react'
import { FaClock, FaSignInAlt, FaSignOutAlt, FaMapMarkerAlt, FaCheckCircle, FaUserNurse } from 'react-icons/fa'

const TeamMemberAttendance = () => {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isShiftActive, setIsShiftActive] = useState(false)
    const [activeVisit, setActiveVisit] = useState(null)
    const [shiftStartTime, setShiftStartTime] = useState(null)

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const upcomingVisit = {
        id: 'V002',
        serviceUser: 'Client B',
        timeSlot: '12:00 - 14:00',
        address: '456 Oak Ave, London',
        visitType: 'Medication Support'
    }

    const handleStartShift = () => {
        setIsShiftActive(true)
        setShiftStartTime(new Date().toLocaleTimeString())
    }

    const handleEndShift = () => {
        if (activeVisit) {
            alert('Please check-out from your current visit first!')
            return
        }
        setIsShiftActive(false)
        setShiftStartTime(null)
    }

    const handleCheckIn = () => {
        setActiveVisit(upcomingVisit)
    }

    const handleCheckOut = () => {
        setActiveVisit(null)
        alert('Visit completed successfully!')
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Attendance</h1>
                <p className="text-gray-600">Manage your daily shift and visit check-ins</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Clock Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center bg-gradient-to-br from-white to-gray-50">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-50 rounded-full mb-4">
                            <FaClock className="text-4xl text-cyan-600 animate-pulse" />
                        </div>
                        <h2 className="text-5xl font-black text-gray-800 mb-2 tracking-tight">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </h2>
                        <p className="text-lg text-gray-500 font-medium">
                            {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            {!isShiftActive ? (
                                <button
                                    onClick={handleStartShift}
                                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg"
                                >
                                    <FaSignInAlt /> Start Your Day (Clock-In)
                                </button>
                            ) : (
                                <button
                                    onClick={handleEndShift}
                                    className="px-8 py-4 bg-white border-2 border-red-500 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-3 text-lg"
                                >
                                    <FaSignOutAlt /> End Your Day (Clock-Out)
                                </button>
                            )}
                        </div>
                        {shiftStartTime && (
                            <p className="mt-4 text-sm font-bold text-green-600 bg-green-50 inline-block px-4 py-1 rounded-full border border-green-100">
                                Day started at: {shiftStartTime}
                            </p>
                        )}
                    </div>

                    {/* Visit Tracking */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-red-500" /> Visit Tracking
                        </h3>

                        {!isShiftActive ? (
                            <div className="py-12 text-center text-gray-400">
                                <p>Please clock-in to start tracking visits</p>
                            </div>
                        ) : activeVisit ? (
                            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="px-3 py-1 bg-teal-600 text-white text-[10px] font-bold uppercase rounded-full mb-2 inline-block shadow-sm">Currently At Visit</span>
                                        <h4 className="text-2xl font-bold text-gray-800">{activeVisit.serviceUser}</h4>
                                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                                            <FaMapMarkerAlt className="text-gray-400" /> {activeVisit.address}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-teal-700">{activeVisit.timeSlot}</p>
                                        <p className="text-xs text-teal-600 mt-1">{activeVisit.visitType}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-teal-100 text-center">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Checked In At</p>
                                        <p className="text-lg font-bold text-teal-600">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <button
                                        onClick={handleCheckOut}
                                        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaCheckCircle /> Complete Visit
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                                <p className="text-gray-500 mb-4 font-medium">No active visit. Your next visit is with:</p>
                                <div className="max-w-xs mx-auto bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
                                    <p className="font-bold text-gray-800">{upcomingVisit.serviceUser}</p>
                                    <p className="text-sm text-gray-500">{upcomingVisit.timeSlot}</p>
                                </div>
                                <button
                                    onClick={handleCheckIn}
                                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                                >
                                    Check-In to This Visit
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Information Card */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full -mr-16 -mt-16 opacity-50 z-0"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="text-sm text-gray-600">Total Hours Today</span>
                                    <span className="font-bold text-cyan-600">0.0h</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="text-sm text-gray-600">Visits Completed</span>
                                    <span className="font-bold text-teal-600">0 / 5</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="text-sm text-gray-600">Mileage Recorded</span>
                                    <span className="font-bold text-blue-600">0 mi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-cyan-900 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative">
                        <FaUserNurse className="absolute bottom-0 right-0 text-9xl text-white opacity-10 -mr-8 -mb-8" />
                        <div className="relative z-10">
                            <h4 className="font-bold text-xl mb-2">Notice</h4>
                            <p className="text-indigo-100 text-sm leading-relaxed">
                                Please remember to enable GPS on your device. All check-ins are verified with location data to ensure accurate care reporting.
                            </p>
                            <button className="mt-4 text-xs font-bold uppercase tracking-wider text-white bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all">
                                System Status: Online
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamMemberAttendance


