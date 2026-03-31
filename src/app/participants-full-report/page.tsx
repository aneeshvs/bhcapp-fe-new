"use client";
import React, { useState, useEffect, useCallback } from "react";
import ListComponents from "@/src/components/list-components";
import api from "@/src/utils/api";
import Image from "next/image";

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

    const fetchData = useCallback(async (page = 1, searchQuery = "") => {
        setLoading(true);
        try {
            const response = await api.get("/participants-full-report", {
                params: {
                    page: page,
                    limit: listData.per_page,
                    search: searchQuery
                }
            });
            if (response.data.success) {
                const pagedData = response.data.data;
                setListData({
                    ...pagedData,
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
        fetchData();
    }, [fetchData]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        fetchData(1, e.target.value);
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

    const groups = [
        {
            id: 'participant',
            title: '',
            columns: [
                { 
                    accessor: 'name', 
                    title: 'Client Name', 
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
                { accessor: 'term_start_date', title: 'Service start date', render: (row: any) => formatDate(row.term_start_date) },
                { accessor: 'ndis_plan_start_date', title: 'NDIS Start Date', render: (row: any) => formatDate(row.ndis_plan_start_date) },
                { accessor: 'ndis_plan_end_date', title: 'NDIS End Date', render: (row: any) => formatDate(row.ndis_plan_end_date) },
                { accessor: 'sa_signed_date', title: 'service agreement signed date', render: (row: any) => formatDate(row.sa_signed_date) },
                { accessor: 'sa_completion_percentage', title: 'completion percentage', render: (row: any) => <span className="badge bg-primary">{row.sa_completion_percentage || 0}%</span> },
            ]
        },
        {
            id: 'scp01',
            title: 'SCP-01 Support Care Plan',
            columns: [
                { accessor: 'scp_start_date', title: 'support care plan start date', render: (row: any) => formatDate(row.scp_start_date) },
                { accessor: 'scp_review_date', title: 'support care plan review date', render: (row: any) => formatDate(row.scp_review_date) },
                { accessor: 'scp_completion_percentage', title: 'completion percentage', render: (row: any) => <span className="badge bg-primary">{row.scp_completion_percentage || 0}%</span> },
            ]
        },
        {
            id: 'f5a',
            title: 'F5a Individual Risk Assessment',
            columns: [
                { accessor: 'ira_assessment_date', title: 'Assessment Date', render: (row: any) => formatDate(row.ira_assessment_date) },
                { accessor: 'ira_review_date', title: 'Planned Review Date', render: (row: any) => formatDate(row.ira_review_date) },
                { accessor: 'ira_completion_percentage', title: 'completion percentage', render: (row: any) => <span className="badge bg-primary">{row.ira_completion_percentage || 0}%</span> },
            ]
        },
        {
            id: 'f5',
            title: 'F5 Home Safety Checklist Assessment',
            columns: [
                { 
                    accessor: 'hsca_review_date', 
                    title: 'Review Date', 
                    render: (row: any) => formatDate(row.hsca_review_date)
                },
                { accessor: 'hsca_completion_percentage', title: 'completion percentage', render: (row: any) => <span className="badge bg-primary">{row.hsca_completion_percentage || 0}%</span> },
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
                <div className="w-full md:w-1/3">
                    <div className="relative">
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
                <div className="mb-5 text-sm font-bold text-gray-500">
                    Total Participants: <span className="text-primary">{listData.total}</span>
                </div>
                <ListComponents 
                    listData={listData} 
                    groups={groups} 
                    onPageChange={(p) => fetchData(p, search)} 
                />
            </div>
        </div>
    );
};

export default ParticipantsFullReport;
