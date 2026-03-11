import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FaFileExport, FaFilePdf, FaFileExcel, FaSearch, FaChevronRight, FaArrowLeft, FaFilter, FaPrint } from 'react-icons/fa'
import { useAdminActions } from '../../hooks/useCrmMutations'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { Loader } from 'lucide-react'

const AdminReports = () => {
    const location = useLocation()
    const [activeTab, setActiveTab] = useState('team')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedReport, setSelectedReport] = useState(null)
    const { downloadReport } = useAdminActions()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const tab = params.get('tab')
        if (tab && ['team', 'service', 'general'].includes(tab)) {
            setActiveTab(tab)
        }
    }, [location])

    const teamMemberReports = [
        "Availability Report", "Bradford Factor Report", "Handback Report", "Late / Early Report",
        "Live Hours Report", "Mileage Report", "Missed Report", "Note Report",
        "Requested Hours vs Live Hours Report", "Short Visit Report", "Task List",
        "Team Member DBS Report", "Team Member Report", "Template Hours Report", "Visit Location Report"
    ]

    const serviceUserReports = [
        "Active Medication Report", "Client Funder Report", "Continuity Report", "Legacy Medication Report",
        "Live Hours Report", "MARChart Report", "Medication Report", "Medications Unverified",
        "Notes Report", "Programs Of Care Report", "Service User Report", "Task List",
        "Task Outcome", "Template Hours Report", "Waterlow Report"
    ]

    const generalReports = [
        "Assessments Logs", "Birthday Report", "Communication Log Report", "CQC Contact List",
        "Holiday Report", "Incident List", "Manual Vs App Clocking Report", "Programs Of Care Report",
        "Qualification Report", "Read Assessments Report", "Reminder List", "Run Route Report",
        "Task List", "User Dates List", "Visit Note Report", "Welfare Check Report", "Working Hours Report"
    ]

    // Dummy data generation for report views
    const getReportColumns = () => {
        if (activeTab === 'team') {
            return ["Staff ID", "Name", "Date", "Details", "Metric Value", "Status"]
        } else if (activeTab === 'service') {
            return ["Client ID", "Client Name", "Date", "Service Type", "Funder", "Outcome"]
        } else {
            return ["ID", "Log Type", "Timestamp", "User/Actor", "Description", "Priority"]
        }
    }

    const { data: reportsResp, isLoading: isLoadingReport } = useQuery({
        queryKey: ['generated-report', activeTab, selectedReport],
        queryFn: async () => {
            if (!selectedReport) return { data: [] };
            const res = await api.get(`/admin/reports/generate?type=${activeTab}&reportName=${encodeURIComponent(selectedReport)}`);
            return res.data;
        },
        enabled: !!selectedReport
    });

    const reportDataArray = reportsResp?.data || [];


    const getActiveReports = () => {
        let reports = []
        if (activeTab === 'team') reports = teamMemberReports
        else if (activeTab === 'service') reports = serviceUserReports
        else reports = generalReports

        if (searchQuery) {
            return reports.filter(r => r.toLowerCase().includes(searchQuery.toLowerCase()))
        }
        return reports
    }

    const tabs = [
        { id: 'team', label: 'Team Member Reports' },
        { id: 'service', label: 'Service User Reports' },
        { id: 'general', label: 'General Reports' },
    ]

    const handleExportCSV = () => {
        const columns = getReportColumns()
        const rows = reportDataArray

        let csvContent = columns.join(",") + "\n"
        rows.forEach(row => {
            csvContent += `${row.c1},${row.c2},${row.c3},${row.c4},${row.c5},${row.c6}\n`
        })

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `${selectedReport.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleExportPDF = () => {
        alert("Preparing PDF report for download...")
        setTimeout(() => {
            window.print()
        }, 500)
    }

    const getTitle = () => {
        switch (activeTab) {
            case 'team': return 'Staff Reports'
            case 'service': return 'Service User Reports'
            case 'general': return 'General Operational Reports'
            default: return 'Reports Center'
        }
    }

    if (selectedReport) {
        return (
            <div className="p-4 md:p-6">
                <div className="mb-6 flex items-center gap-4 no-print">
                    <button
                        onClick={() => setSelectedReport(null)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-600"
                    >
                        <FaArrowLeft className="text-xl" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 uppercase tracking-tight">{selectedReport}</h1>
                        <p className="text-gray-600 text-sm md:text-base">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="crm-card !p-0 overflow-hidden printable-area">
                    {/* ... (rest of selectedReport view remains same) */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 no-print">
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm">
                                <FaFilter /> Filter
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm" onClick={() => window.print()}>
                                <FaPrint /> Print
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium text-sm"
                            >
                                <FaFilePdf /> PDF Report
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm"
                            >
                                <FaFileExcel /> Excel Export
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    {getReportColumns().map((col, idx) => (
                                        <th key={idx} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {isLoadingReport ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <Loader size={32} className="animate-spin text-cyan-600 mx-auto mb-4" />
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Querying Global Database Matrix...</p>
                                        </td>
                                    </tr>
                                ) : reportDataArray.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                                            No data found for this report configuration in the live dataset.
                                        </td>
                                    </tr>
                                ) : (
                                    reportDataArray.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-all">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.c1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.c2}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.c3}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.c4}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.c5}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                                    {row.c6}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {!isLoadingReport && reportDataArray.length > 0 && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-500 font-medium">
                            Showing {reportDataArray.length} generated results mapped to live MySQL arrays.
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 uppercase tracking-tight">{getTitle()}</h1>
                    <p className="text-gray-600 text-sm md:text-base">Access and generate detailed operational reports from the sidebar</p>
                </div>
                <div className="relative w-full md:w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm"
                    />
                </div>
            </div>

            <div className="crm-card !p-0 overflow-hidden min-h-[600px]">
                <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getActiveReports().map((report, index) => (
                            <div
                                key={index}
                                className="group p-4 border border-gray-100 rounded-xl hover:border-cyan-200 hover:bg-cyan-50/30 transition-all cursor-pointer flex justify-between items-center"
                                onClick={() => setSelectedReport(report)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                                        <FaFileExport />
                                    </div>
                                    <span className="font-medium text-gray-700 group-hover:text-cyan-800">{report}</span>
                                </div>
                                <FaChevronRight className="text-gray-300 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>

                    {getActiveReports().length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500">No reports found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Global Export Options */}
            <div className="mt-8 bg-cyan-900 rounded-[2rem] p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
                <div>
                    <h2 className="text-xl font-bold mb-2">Need a custom report?</h2>
                    <p className="text-cyan-100/70 text-sm">Export your current visible data directly to PDF or Excel format.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => downloadReport.mutate('pdf_all')}
                        disabled={downloadReport.isPending}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all font-medium disabled:opacity-50"
                    >
                        <FaFilePdf /> Export All as PDF
                    </button>
                    <button
                        onClick={() => downloadReport.mutate('csv_all')}
                        disabled={downloadReport.isPending}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-cyan-900 hover:bg-cyan-50 rounded-xl transition-all font-bold disabled:opacity-50"
                    >
                        <FaFileExcel /> Export All as CSV
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminReports



