// Admin Settings Page
import { useState } from 'react'
import { FaSave, FaCalendarAlt, FaFileInvoice } from 'react-icons/fa'

const AdminSettings = () => {
    const [currency, setCurrency] = useState('GBP')
    const [invoicePrefix, setInvoicePrefix] = useState('INV')

    const bankHolidays = [
        { date: '2024-01-01', name: 'New Year\'s Day' },
        { date: '2024-12-25', name: 'Christmas Day' },
        { date: '2024-12-26', name: 'Boxing Day' },
    ]

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
                <p className="text-gray-600">Configure system preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="crm-card">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">General Settings</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                            >
                                <option value="GBP">GBP (£)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Prefix</label>
                            <input
                                type="text"
                                value={invoicePrefix}
                                onChange={(e) => setInvoicePrefix(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Format</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none">
                                <option>Standard Format</option>
                                <option>Detailed Format</option>
                                <option>Summary Format</option>
                            </select>
                        </div>

                        <button
                            onClick={() => alert('Settings saved successfully!')}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            <FaSave /> Save Settings
                        </button>
                    </div>
                </div>

                {/* Bank Holidays */}
                <div className="crm-card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Bank Holidays</h2>
                        <button
                            onClick={() => alert('Add Holiday functionality coming soon!')}
                            className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
                        >
                            + Add Holiday
                        </button>
                    </div>

                    <div className="space-y-3">
                        {bankHolidays.map((holiday, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-cyan-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{holiday.name}</p>
                                        <p className="text-xs text-gray-600">{holiday.date}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => alert('Holiday removed successfully!')}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Preferences */}
                <div className="crm-card">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">System Preferences</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Email Notifications</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">SMS Notifications</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Auto Backup</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Holiday Report */}
                <div className="crm-card">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Holiday Report</h2>
                    <p className="text-sm text-gray-600 mb-4">Generate staff holiday reports</p>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Period</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none">
                                <option>This Month</option>
                                <option>This Quarter</option>
                                <option>This Year</option>
                                <option>Custom Range</option>
                            </select>
                        </div>

                        <button
                            onClick={() => alert('Holiday report generation started...')}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all w-full justify-center"
                        >
                            <FaFileInvoice /> Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSettings
