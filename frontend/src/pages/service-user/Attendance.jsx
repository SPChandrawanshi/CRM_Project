import { useState } from 'react'
import { FaClock, FaCalendarCheck, FaUserNurse, FaCheckCircle, FaExclamationCircle, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'

const ServiceUserAttendance = () => {
    const [history] = useState([
        {
            id: 'V101',
            date: '2024-02-14',
            staffMember: 'John Smith',
            role: 'Senior Carer',
            checkin: '09:05 AM',
            checkout: '10:30 AM',
            status: 'Completed',
            tasks: 5
        },
        {
            id: 'V102',
            date: '2024-02-13',
            staffMember: 'Sarah Johnson',
            role: 'Carer',
            checkin: '12:10 PM',
            checkout: '01:50 PM',
            status: 'Completed',
            tasks: 3
        },
        {
            id: 'V103',
            date: '2024-02-12',
            staffMember: 'Mike Wilson',
            role: 'Nurse',
            checkin: '03:00 PM',
            checkout: '04:15 PM',
            status: 'Completed',
            tasks: 4
        }
    ])

    const currentStaff = {
        name: 'Sarah Johnson',
        role: 'Carer',
        status: 'On Site',
        checkin: '12:15 PM',
        photo: 'https://i.pravatar.cc/150?u=sarah'
    }

    const getStatusStyles = (status) => {
        return status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Visit History</h1>
                <p className="text-gray-600">Track care visits and staff arrival times</p>
            </div>

            {/* Current Visit Status */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50 rounded-full -mr-32 -mt-32 opacity-30 z-0"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <img src={currentStaff.photo} alt={currentStaff.name} className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white" />
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold uppercase rounded-full mb-3 inline-block">Staff Currently Active</span>
                            <h2 className="text-3xl font-black text-gray-800 tracking-tight">{currentStaff.name}</h2>
                            <p className="text-gray-500 font-medium">{currentStaff.role}</p>
                            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-sm bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                    <FaClock className="text-cyan-600" />
                                    <span className="text-gray-600">Arrived at </span>
                                    <span className="font-bold text-gray-800">{currentStaff.checkin}</span>
                                </div>
                                <button className="flex items-center gap-2 text-sm bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition-all shadow-md">
                                    <FaPhoneAlt size={12} /> Contact Staff
                                </button>
                            </div>
                        </div>
                        <div className="hidden lg:block text-right">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Last Update</p>
                                <p className="text-sm font-bold text-gray-800">Checked in via GPS</p>
                                <p className="text-[10px] text-cyan-600 font-bold mt-1 flex items-center justify-end gap-1">
                                    <FaMapMarkerAlt size={10} /> Verified Location
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FaCalendarCheck className="text-cyan-600" /> Past Visits
                    </h3>
                    <div className="text-xs text-gray-500 font-medium">Showing last 3 visits</div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
                    <table className="w-full">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Staff Member</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Check-In</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Check-Out</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Tasks</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.map((visit) => (
                                <tr key={visit.id} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{visit.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
                                                <FaUserNurse size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{visit.staffMember}</p>
                                                <p className="text-[10px] text-gray-500">{visit.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{visit.checkin}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{visit.checkout}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-800">{visit.tasks}</span>
                                        <span className="text-[10px] text-gray-500 ml-1">tasks</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold border inline-block ${visit.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            <FaCheckCircle className="inline mr-1" /> {visit.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {history.map((visit) => (
                        <div key={visit.id} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs font-bold text-cyan-600 mb-1">{visit.date}</p>
                                    <h4 className="font-bold text-gray-800">{visit.staffMember}</h4>
                                    <p className="text-[10px] text-gray-500">{visit.role}</p>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-[10px] font-bold border ${visit.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                    {visit.status}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-[8px] text-gray-400 uppercase font-bold">Checked In</p>
                                    <p className="text-sm font-bold text-gray-700">{visit.checkin}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] text-gray-400 uppercase font-bold">Checked Out</p>
                                    <p className="text-sm font-bold text-gray-700">{visit.checkout}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Help / Incident */}
            <div className="mt-8 p-6 bg-red-50 rounded-2xl border-2 border-dashed border-red-100 flex items-center gap-6">
                <div className="bg-red-500 w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-200">
                    <FaExclamationCircle size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-red-800">Something not right?</h4>
                    <p className="text-sm text-red-600">If staff arrival times are incorrect or a visit was missed, please contact the admin team immediately or log an issue through the communication tab.</p>
                </div>
            </div>
        </div>
    )
}

export default ServiceUserAttendance
