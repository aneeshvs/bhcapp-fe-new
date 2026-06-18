"use client";
import React, { useState, useEffect, useCallback } from "react";
import ListComponents from "@/src/components/list-components";
import api from "@/src/utils/api";
import Image from "next/image";
import IconDownload from "@/src/components/icon/icon-download";

const ParticipantsFullReport = () => {
    const [listData, setListData] = useState({
        current_page: 1,
        data: [],
        total: 0,
        per_page: 20,
        first_page_url: "",
        from: null,
        last_page: null,
        last_page_url: "",
        links: [],
        next_page_url: null,
        to: null,
        page: 1
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [coordinators, setCoordinators] = useState<any[]>([]);
    const [selectedStaffId, setSelectedStaffId] = useState("");
    const [sortStatus, setSortStatus] = useState({ columnAccessor: 'name', direction: 'asc' });
    const [showExpiredOnly, setShowExpiredOnly] = useState(false);

    const PAGE_SIZES = [25, 50, 100, 1000]; // 1000 acts as 'All'
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const fetchCoordinators = async () => {
        try {
            const response = await api.get("/get-bhc-coordinators");
            if (response.data.success) {
                setCoordinators(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching BHC Coordinators:", error);
        }
    };

    useEffect(() => {
        fetchCoordinators();
    }, []);

    const fetchData = useCallback(async (page = 1, searchQuery = "", staffIdFilter = "", sortBy = sortStatus.columnAccessor, sortDir = sortStatus.direction, limit = pageSize, expiredOnly = showExpiredOnly) => {
        setLoading(true);
        try {
            const response = await api.get("/participants-full-report", {
                params: {
                    page: page,
                    limit: limit,
                    search: searchQuery,
                    staffid: staffIdFilter,
                    sort_by: sortBy,
                    sort_dir: sortDir,
                    show_expired_only: expiredOnly
                }
            });
            if (response.data.success) {
                const pagedData = response.data.data;
                
                // Optional client-side sorting for the current page if backend doesn't sort
                let sortedData = [...pagedData.data];
                if (sortBy) {
                    sortedData.sort((a, b) => {
                        const valA = a[sortBy];
                        const valB = b[sortBy];
                        if (valA === null || valA === undefined) return sortDir === 'asc' ? 1 : -1;
                        if (valB === null || valB === undefined) return sortDir === 'asc' ? -1 : 1;
                        if (typeof valA === 'string' && typeof valB === 'string') {
                            return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                        }
                        return sortDir === 'asc' ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
                    });
                }

                setListData({
                    ...pagedData,
                    data: sortedData,
                    page: pagedData.current_page
                });
            }
        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setLoading(false);
        }
    }, [listData.per_page]);

    useEffect(() => {
        fetchData(1, search, selectedStaffId, sortStatus.columnAccessor, sortStatus.direction, pageSize, showExpiredOnly);
    }, [fetchData]); // Only depends on fetchData

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        fetchData(1, e.target.value, selectedStaffId, sortStatus.columnAccessor, sortStatus.direction, pageSize, showExpiredOnly);
    };

    const handleCoordinatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStaffId(e.target.value);
        fetchData(1, search, e.target.value, sortStatus.columnAccessor, sortStatus.direction, pageSize, showExpiredOnly);
    };

    const handleSortStatusChange = (status: any) => {
        setSortStatus(status);
        fetchData(listData.current_page, search, selectedStaffId, status.columnAccessor, status.direction, pageSize, showExpiredOnly);
    };

    const handleRecordsPerPageChange = (size: number) => {
        setPageSize(size);
        fetchData(1, search, selectedStaffId, sortStatus.columnAccessor, sortStatus.direction, size, showExpiredOnly);
    };

    const handleShowExpiredOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowExpiredOnly(e.target.checked);
        fetchData(1, search, selectedStaffId, sortStatus.columnAccessor, sortStatus.direction, pageSize, e.target.checked);
    };

    const handleExport = async () => {
        try {
            const response = await api.get("/export-participants-full-report", {
                params: {
                    search: search,
                    staffid: selectedStaffId,
                    show_expired_only: showExpiredOnly
                },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'participants_full_report.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting data:", error);
        }
    };

    const formatDate = (dateString: any) => {
        if (!dateString || dateString === 'NIL' || dateString === '' || dateString === '0000-00-00') return 'NIL';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'NIL';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    const renderDate = (dateString: any, checkExpiry: boolean = false) => {
        const formatted = formatDate(dateString);
        if (formatted === 'NIL') return formatted;
        
        if (checkExpiry) {
            const date = new Date(dateString);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date <= today) {
                return <span className="text-red-500 font-semibold">{formatted}</span>;
            }
        }
        return formatted;
    };

    const groups = [
        {
            id: 'participant',
            title: '',
            columns: [
                { 
                    accessor: 'name', 
                    title: 'Client Name', 
                    sortable: true,
                    render: (row: any) => (
                        <div className="font-semibold text-primary">
                            {row.name} {row.lastname}
                        </div>
                    )
                },
            ]
        },
        {
            id: 'sa01',
            title: 'SA-01 Service Agreement',
            columns: [
                { accessor: 'term_start_date', title: 'Service start date', sortable: true, render: (row: any) => renderDate(row.term_start_date) },
                { accessor: 'ndis_plan_start_date', title: 'NDIS Start Date', sortable: true, render: (row: any) => renderDate(row.ndis_plan_start_date) },
                { accessor: 'ndis_plan_end_date', title: 'NDIS End Date', sortable: true, render: (row: any) => renderDate(row.ndis_plan_end_date, true) },
                { accessor: 'sa_signed_date', title: 'service agreement signed date', sortable: true, render: (row: any) => renderDate(row.sa_signed_date) },
                { accessor: 'sa_completion_percentage', title: 'completion percentage', sortable: true, render: (row: any) => <span className="badge bg-primary">{row.sa_completion_percentage || 0}%</span> },
            ]
        },
        {
            id: 'scp01',
            title: 'SCP-01 Support Care Plan',
            columns: [
                { accessor: 'scp_start_date', title: 'support care plan start date', sortable: true, render: (row: any) => renderDate(row.scp_start_date) },
                { accessor: 'scp_review_date', title: 'support care plan review date', sortable: true, render: (row: any) => renderDate(row.scp_review_date, true) },
                { accessor: 'scp_completion_percentage', title: 'completion percentage', sortable: true, render: (row: any) => <span className="badge bg-primary">{row.scp_completion_percentage || 0}%</span> },
            ]
        },
        {
            id: 'f5a',
            title: 'F5a Individual Risk Assessment',
            columns: [
                { accessor: 'ira_assessment_date', title: 'Assessment Date', sortable: true, render: (row: any) => renderDate(row.ira_assessment_date) },
                { accessor: 'ira_review_date', title: 'Planned Review Date', sortable: true, render: (row: any) => renderDate(row.ira_review_date, true) },
                { accessor: 'ira_completion_percentage', title: 'completion percentage', sortable: true, render: (row: any) => <span className="badge bg-primary">{row.ira_completion_percentage || 0}%</span> },
            ]
        },
        {
            id: 'f5',
            title: 'F5 Home Safety Checklist Assessment',
            columns: [
                { 
                    accessor: 'hsca_review_date', 
                    title: 'Review Date', 
                    sortable: true,
                    render: (row: any) => renderDate(row.hsca_review_date, true)
                },
                { accessor: 'hsca_completion_percentage', title: 'completion percentage', sortable: true, render: (row: any) => <span className="badge bg-primary">{row.hsca_completion_percentage || 0}%</span> },
            ]
        }
    ];

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                   <Image src="/assets/images/BHC LOGO_SMALL.png" alt="Company Logo" width={150} height={60} priority />
                   <h1 className="text-2xl font-bold mt-2 text-heading">Participants Full Report</h1>
                </div>
                <div className="w-full md:w-[70%] flex flex-col md:flex-row gap-4 justify-end">
                    <button 
                        onClick={handleExport}
                        className="btn-primary flex items-center justify-center gap-2 rounded-md px-4 py-2 text-white font-medium whitespace-nowrap shrink-0 shadow-sm"
                    >
                        <IconDownload /> Export
                    </button>
                    <div className="relative w-full md:w-1/3">
                        <select 
                            className="form-select w-full"
                            value={selectedStaffId}
                            onChange={handleCoordinatorChange}
                        >
                            <option value="">All BHC Coordinators</option>
                            {coordinators.map((c: any, index: number) => (
                                <option key={index} value={c.staffid}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="relative w-full md:w-1/3">
                        <input 
                            type="text" 
                            placeholder="Search by name..." 
                            className="form-input"
                            value={search}
                            onChange={handleSearch}
                        />
                        {loading && (
                            <div className="absolute right-3 top-2.5">
                                <span className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-primary rounded-full" role="status" aria-label="loading"></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="panel border-0 shadow-3xl">
                <div className="mb-5 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-bold text-gray-500">
                            Total Participants: <span className="text-primary">{listData.total}</span>
                        </div>
                        <label className="flex items-center cursor-pointer mb-0">
                            <input 
                                type="checkbox" 
                                className="form-checkbox" 
                                checked={showExpiredOnly} 
                                onChange={handleShowExpiredOnlyChange}
                            />
                            <span className="ml-2 text-sm font-semibold text-gray-700">Show Expiry Date Only</span>
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-500 whitespace-nowrap">Rows per page:</span>
                        <select 
                            className="form-select form-select-sm w-24 py-1 px-2 rounded-md"
                            value={pageSize}
                            onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}
                        >
                            {PAGE_SIZES.map(size => (
                                <option key={size} value={size}>
                                    {size === 1000 ? 'All' : size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <ListComponents 
                    listData={listData} 
                    groups={groups} 
                    onPageChange={(p) => fetchData(p, search, selectedStaffId, sortStatus.columnAccessor, sortStatus.direction, pageSize, showExpiredOnly)} 
                    sortStatus={sortStatus}
                    onSortStatusChange={handleSortStatusChange}
                />
            </div>
        </div>
    );
};

export default ParticipantsFullReport;
