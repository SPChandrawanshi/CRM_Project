import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaEye, FaFileInvoice, FaTimes, FaMoneyBillWave, FaShieldAlt, FaCalendarAlt, FaCog } from 'react-icons/fa'
import { useAdminActions } from '../../hooks/useCrmMutations'

const AdminInvoicing = () => {
    const location = useLocation()
    const [activeTab, setActiveTab] = useState('invoicing')
    const { executeAction } = useAdminActions()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const tab = params.get('tab')
        if (tab && ['invoicing', 'wage', 'tariffs', 'funders', 'settings', 'bank-holiday', 'holiday-report'].includes(tab)) {
            setActiveTab(tab)
        }
    }, [location])

    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const handleAction = (action, item) => {
        setSelectedItem(item)
        if (action === 'add') setShowAddModal(true)
        if (action === 'edit') setShowEditModal(true)
        if (action === 'view') setShowViewModal(true)
        if (action === 'delete') setShowDeleteModal(true)
    }

    const invoices = [
        { id: 'INV-2024-001', client: 'James Peterson', funder: 'NHS (Direct)', hours: '45.5', amount: '£1,137.50', status: 'Paid', date: '2024-02-01' },
        { id: 'INV-2024-002', client: 'Mary Collins', funder: 'Private', hours: '30.0', amount: '£900.00', status: 'Unpaid', date: '2024-02-05' },
        { id: 'INV-2024-003', client: 'Robert Taylor', funder: 'Local Authority', hours: '22.5', amount: '£450.00', status: 'Overdue', date: '2024-01-20' },
        { id: 'INV-2024-004', client: 'Patricia Moore', funder: 'NHS (CCG)', hours: '50.0', amount: '£1,250.00', status: 'Paid', date: '2024-02-10' },
    ]

    const wages = [
        { name: 'John Smith', role: 'Nurse', hours: '160', rate: '£18.50', mileage: '120.5m', totalPay: '£3,010.50' },
        { name: 'Sarah Johnson', role: 'Support Worker', hours: '140', rate: '£14.20', mileage: '85.0m', totalPay: '£2,028.00' },
        { name: 'Mike Wilson', role: 'Carer', hours: '120', rate: '£13.50', mileage: '45.2m', totalPay: '£1,642.75' },
        { name: 'Emma Davis', role: 'Manager', hours: '160', rate: '£22.00', mileage: '10.0m', totalPay: '£3,525.00' },
    ]

    const tariffs = [
        { service: 'Personal Care (Standard)', rate: '£25.00', holiday: '£37.50', weekend: '£31.25', unit: 'Hour' },
        { service: 'Waking Night Support', rate: '£180.00', holiday: '£270.00', weekend: '£225.00', unit: 'Shift' },
        { service: 'Medication Visit (15m)', rate: '£12.50', holiday: '£18.75', weekend: '£15.60', unit: 'Visit' },
        { service: 'Live-in Care', rate: '£1,200.00', holiday: '£1,800.00', weekend: '£1,500.00', unit: 'Week' },
    ]

    const funders = [
        { id: 'F001', name: 'NHS England', type: 'Health Authority', paymentTerms: '30 days', clients: 12 },
        { id: 'F002', name: 'Blue Cross Insurance', type: 'Private Insurance', paymentTerms: '14 days', clients: 4 },
        { id: 'F003', name: 'City Council', type: 'Local Authority', paymentTerms: '45 days', clients: 25 },
    ]

    const tabs = [
        { id: 'invoicing', label: 'Invoicing' },
        { id: 'wage', label: 'Wage' },
        { id: 'tariffs', label: 'Tariffs' },
        { id: 'funders', label: 'Funders' },
        { id: 'settings', label: 'Settings' },
        { id: 'bank-holiday', label: 'Bank Holiday' },
        { id: 'holiday-report', label: 'Holiday Report' },
    ]

    const getTitle = () => {
        switch (activeTab) {
            case 'invoicing': return 'Client Invoicing'
            case 'wage': return 'Staff Wages'
            case 'tariffs': return 'Service Tariffs'
            case 'funders': return 'Funder Management'
            case 'settings': return 'Finance Settings'
            case 'bank-holiday': return 'Bank Holidays'
            case 'holiday-report': return 'Holiday Accrual Report'
            default: return 'Finance & Wage'
        }
    }

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 uppercase tracking-tight">{getTitle()}</h1>
                <p className="text-gray-600 text-sm md:text-base">Manage financial operations and payroll from the sidebar menu</p>
            </div>

            <div className="crm-card !p-0 overflow-hidden">
                <div className="p-4 md:p-6">
                    {activeTab === 'invoicing' && (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Invoices</h2>
                                <button
                                    onClick={() => handleAction('add', null)}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    <FaPlus /> Create Invoice
                                </button>
                            </div>

                            {/* Desktop Table - Invoices */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invoice No</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Client Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hours</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {invoices.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{invoice.id}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{invoice.date}</td>
                                                <td className="px-4 py-3 text-sm text-gray-800">{invoice.client}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{invoice.hours}</td>
                                                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{invoice.amount}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${invoice.status === 'Paid'
                                                        ? 'bg-green-100 text-green-700'
                                                        : invoice.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {invoice.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleAction('view', invoice)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FaEye /></button>
                                                        <button onClick={() => handleAction('edit', invoice)} className="p-2 text-green-600 hover:bg-green-50 rounded"><FaEdit /></button>
                                                        <button onClick={() => handleAction('delete', invoice)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile List - Invoices */}
                            <div className="md:hidden space-y-4">
                                {invoices.map((invoice) => (
                                    <div key={invoice.id} className="crm-card !p-4 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs text-gray-500">{invoice.id} - {invoice.date}</p>
                                                <h3 className="font-semibold text-gray-800">{invoice.client}</h3>
                                                <p className="text-xs text-gray-600">Hours: {invoice.hours}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${invoice.status === 'Paid'
                                                ? 'bg-green-100 text-green-700'
                                                : invoice.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {invoice.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                            <span className="font-bold text-gray-800">{invoice.amount}</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleAction('view', invoice)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><FaEye /></button>
                                                <button onClick={() => handleAction('edit', invoice)} className="p-2 text-green-600 bg-green-50 rounded-lg"><FaEdit /></button>
                                                <button onClick={() => handleAction('delete', invoice)} className="p-2 text-red-600 bg-red-50 rounded-lg"><FaTrash /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'wage' && (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Staff Wages</h2>
                                <button
                                    onClick={() => handleAction('add', null)}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    <FaFileInvoice /> Generate Payslips
                                </button>
                            </div>

                            {/* Desktop Table - Wages */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Staff Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Hours</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mileage</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Pay</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {wages.map((wage, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-bold text-gray-800">{wage.name}</td>
                                                <td className="px-4 py-3 text-sm text-cyan-600 font-medium">{wage.role}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{wage.hours}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{wage.mileage}</td>
                                                <td className="px-4 py-3 text-sm text-gray-800 font-bold">{wage.totalPay}</td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleAction('view', wage)}
                                                        className="px-3 py-1 bg-cyan-50 text-cyan-700 border border-cyan-100 rounded hover:bg-cyan-100 transition-all text-xs font-bold"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile List - Wages */}
                            <div className="md:hidden space-y-4">
                                {wages.map((wage, index) => (
                                    <div key={index} className="crm-card !p-4 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{wage.name}</h3>
                                                <p className="text-xs text-gray-600">{wage.hours} Hours @ {wage.rate}</p>
                                            </div>
                                            <span className="font-bold text-gray-800">{wage.totalPay}</span>
                                        </div>
                                        <button
                                            onClick={() => handleAction('view', wage)}
                                            className="w-full mt-2 py-2 text-cyan-600 bg-cyan-50 rounded-lg text-sm font-medium"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'tariffs' && (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Service Tariffs</h2>
                                <button
                                    onClick={() => handleAction('add', null)}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    <FaPlus /> Add Tariff
                                </button>
                            </div>

                            {/* Desktop Table - Tariffs */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service Type</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rate per Hour</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Holiday Rate</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Weekend Rate</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {tariffs.map((tariff, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-800">{tariff.service}</td>
                                                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{tariff.rate}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{tariff.holiday}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{tariff.weekend}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleAction('edit', tariff)} className="p-2 text-green-600 hover:bg-green-50 rounded"><FaEdit /></button>
                                                        <button onClick={() => handleAction('delete', tariff)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile List - Tariffs */}
                            <div className="md:hidden space-y-4">
                                {tariffs.map((tariff, index) => (
                                    <div key={index} className="crm-card !p-4 mb-4">
                                        <div className="mb-2">
                                            <h3 className="font-semibold text-gray-800">{tariff.service}</h3>
                                            <p className="text-sm font-medium text-cyan-600">{tariff.rate}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                                            <div className="bg-gray-50 p-2 rounded">Holiday: {tariff.holiday}</div>
                                            <div className="bg-gray-50 p-2 rounded">Weekend: {tariff.weekend}</div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleAction('edit', tariff)} className="p-2 text-green-600 bg-green-50 rounded-lg"><FaEdit /></button>
                                            <button onClick={() => handleAction('delete', tariff)} className="p-2 text-red-600 bg-red-50 rounded-lg"><FaTrash /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'funders' && (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Funders</h2>
                                <button
                                    onClick={() => handleAction('add', null)}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    <FaPlus /> Add Funder
                                </button>
                            </div>

                            {/* Desktop Table - Funders */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Funder ID</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Funder Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment Terms</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Assigned Clients</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {funders.map((funder) => (
                                            <tr key={funder.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{funder.id}</td>
                                                <td className="px-4 py-3 text-sm text-gray-800">{funder.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{funder.paymentTerms}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{funder.clients}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleAction('view', funder)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FaEye /></button>
                                                        <button onClick={() => handleAction('edit', funder)} className="p-2 text-green-600 hover:bg-green-50 rounded"><FaEdit /></button>
                                                        <button onClick={() => handleAction('delete', funder)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile List - Funders */}
                            <div className="md:hidden space-y-4">
                                {funders.map((funder) => (
                                    <div key={funder.id} className="crm-card !p-4 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs text-gray-500">{funder.id}</p>
                                                <h3 className="font-semibold text-gray-800">{funder.name}</h3>
                                            </div>
                                            <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">{funder.clients} Clients</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{funder.paymentTerms}</p>
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleAction('view', funder)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><FaEye /></button>
                                            <button onClick={() => handleAction('edit', funder)} className="p-2 text-green-600 bg-green-50 rounded-lg"><FaEdit /></button>
                                            <button onClick={() => handleAction('delete', funder)} className="p-2 text-red-600 bg-red-50 rounded-lg"><FaTrash /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Finance Settings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FaCog className="text-cyan-600" /> Invoice Configuration</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Prefix</label>
                                            <input type="text" defaultValue="INV-2024-" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                                            <input type="number" defaultValue="20" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FaMoneyBillWave className="text-teal-600" /> Wage Settings</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Pay Frequency</label>
                                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none">
                                                <option>Monthly</option>
                                                <option>Weekly</option>
                                                <option>Fortnightly</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mileage Rate (per mile)</label>
                                            <input type="text" defaultValue="£0.45" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bank-holiday' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Bank Holidays (2024)</h2>
                                <button
                                    onClick={() => handleAction('add', null)}
                                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg shadow-md font-bold"
                                >
                                    + Add Holiday
                                </button>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { date: '2024-01-01', name: "New Year's Day" },
                                    { date: '2024-03-29', name: "Good Friday" },
                                    { date: '2024-04-01', name: "Easter Monday" },
                                    { date: '2024-05-06', name: "Early May Bank Holiday" },
                                    { date: '2024-05-27', name: "Spring Bank Holiday" },
                                    { date: '2024-08-26', name: "Summer Bank Holiday" },
                                    { date: '2024-12-25', name: "Christmas Day" },
                                    { date: '2024-12-26', name: "Boxing Day" },
                                ].map((h, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-cyan-50 rounded-lg flex flex-col items-center justify-center text-cyan-700">
                                                <span className="text-[10px] font-bold uppercase">{new Date(h.date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-lg font-bold leading-none">{new Date(h.date).getDate()}</span>
                                            </div>
                                            <span className="font-bold text-gray-800">{h.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-green-600 bg-green-50 rounded"><FaEdit /></button>
                                            <button className="p-2 text-red-600 bg-red-50 rounded"><FaTrash /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'holiday-report' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">Finance Holiday Report</h2>
                                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <FaCalendarAlt /> Generate Report
                                </button>
                            </div>
                            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-20 text-center">
                                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-600">
                                    <FaCalendarAlt className="text-2xl" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Ready to compile report</h3>
                                <p className="text-gray-500 max-w-md mx-auto">This report calculates total holiday pay accruals and payments across all staff members for the current financial year.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {activeTab === 'invoicing' ? 'Create New Invoice' :
                                    activeTab === 'wage' ? 'Generate New Payslips' :
                                        activeTab === 'tariffs' ? 'Add Service Tariff' : 'Add New Funder'}
                            </h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6 overflow-x-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeTab === 'invoicing' ? (
                                    <>
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
                                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none">
                                                <option>Select Client</option>
                                                <option>James Peterson</option>
                                                <option>Mary Collins</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                                            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
                                            <input type="number" placeholder="45.5" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                    </>
                                ) : activeTab === 'tariffs' ? (
                                    <>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                                            <input type="text" placeholder="e.g. Specialized Nursing" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Base Rate (£)</label>
                                            <input type="number" placeholder="25.00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Rate (£)</label>
                                            <input type="number" placeholder="37.50" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name / Title</label>
                                            <input type="text" placeholder="Enter name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type / Frequency</label>
                                            <input type="text" placeholder="Enter type" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">Cancel</button>
                                <button onClick={() => { executeAction.mutate('save_changes'); setShowAddModal(false); }} disabled={executeAction.isPending} className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-bold disabled:opacity-50">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-6 text-white text-center relative">
                            <button onClick={() => setShowViewModal(false)} className="absolute right-4 top-4 text-white/80 hover:text-white"><FaTimes /></button>
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                {activeTab === 'invoicing' ? <FaFileInvoice className="text-3xl" /> : activeTab === 'funders' ? <FaShieldAlt className="text-3xl" /> : <FaMoneyBillWave className="text-3xl" />}
                            </div>
                            <h2 className="text-2xl font-bold">{activeTab === 'invoicing' ? 'Invoice Summary' : 'Details View'}</h2>
                        </div>
                        <div className="p-8">
                            <div className="space-y-6">
                                {Object.entries(selectedItem).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0">
                                        <span className="text-gray-500 text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span className={`text-gray-900 font-bold ${key === 'status' ? 'px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs' : ''}`}>
                                            {String(value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setShowViewModal(false)} className="w-full mt-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all">Close Details</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal (Simulated same as Add but with default values) */}
            {showEditModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Edit {activeTab === 'invoicing' ? 'Invoice' : activeTab === 'wage' ? 'Wage' : 'Entry'}</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700"><FaTimes className="text-xl" /></button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(selectedItem).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                                        <input type="text" defaultValue={value} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setShowEditModal(false)} className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">Cancel</button>
                                <button onClick={() => { executeAction.mutate('update_item'); setShowEditModal(false); }} disabled={executeAction.isPending} className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-bold disabled:opacity-50">Update Item</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-300 mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
                        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaTrash className="text-4xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Are you sure?</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            You are about to delete <span className="font-bold text-gray-900">{selectedItem.name || selectedItem.id || selectedItem.client || selectedItem.service}</span>.
                            This action is permanent and cannot be reversed.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">No, Cancel</button>
                            <button onClick={() => { executeAction.mutate('delete_item'); setShowDeleteModal(false); }} disabled={executeAction.isPending} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminInvoicing


