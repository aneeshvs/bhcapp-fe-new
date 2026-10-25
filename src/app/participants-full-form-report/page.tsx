"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import ListComponents from "@/src/components/list-components";
import api from "@/src/utils/api";
import Image from "next/image";
import IconDownload from "@/src/components/icon/icon-download";
import IconSave from "@/src/components/icon/icon-save";
import IconPlus from "@/src/components/icon/icon-plus";
import IconTrash from "@/src/components/icon/icon-trash";
import IconSearch from "@/src/components/icon/icon-search";
import IconSettings from "@/src/components/icon/icon-settings";
import IconX from "@/src/components/icon/icon-x";

interface FormFieldItem {
    key: string;
    label: string;
}

interface TableOption {
    table_name: string;
    fields: FormFieldItem[];
}

interface FormOption {
    key: string;
    name: string;
    tables: TableOption[];
}

interface SavedReport {
    id: number;
    name: string;
    form_key: string;
    table_name?: string;
    client_id?: string | null;
    selected_fields: string[];
    description?: string | null;
    created_at?: string;
    updated_at?: string;
}

const ParticipantsFullFormReport = () => {
    const [forms, setForms] = useState<FormOption[]>([]);
    const [selectedFormKey, setSelectedFormKey] = useState<string>("onboarding");
    const [selectedTable, setSelectedTable] = useState<string>("ALL");
    const [selectedField, setSelectedField] = useState<string>("ALL");
    const [selectedFieldsList, setSelectedFieldsList] = useState<string[]>([]);

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
    const [formsLoading, setFormsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [coordinators, setCoordinators] = useState<any[]>([]);
    const [selectedStaffId, setSelectedStaffId] = useState("");
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [sortStatus, setSortStatus] = useState({ columnAccessor: 'client_full_name', direction: 'asc' });
    const [showFilters, setShowFilters] = useState<boolean>(true);

    // Field search filter state for Table Fields pills
    const [fieldSearch, setFieldSearch] = useState<string>("");

    const PAGE_SIZES = [25, 50, 100, 1000];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    // Saved Reports / Templates State
    const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
    const [savedReportsLoading, setSavedReportsLoading] = useState<boolean>(false);
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
    const [reportNameInput, setReportNameInput] = useState<string>("");
    const [reportDescription, setReportDescription] = useState<string>("");
    const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
    const [reportModalTab, setReportModalTab] = useState<'create' | 'list'>('create');
    const [savedReportSearch, setSavedReportSearch] = useState<string>("");
    const [savingReport, setSavingReport] = useState<boolean>(false);
    const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Fetch BHC Coordinators List
    const fetchCoordinators = async () => {
        try {
            const response = await api.get("/get-bhc-coordinators");
            if (response.data.success) {
                setCoordinators(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching BHC Coordinators:", error);
        }
    };

    // Fetch User Categories List
    const fetchCategories = async () => {
        try {
            const response = await api.get("/get-user-categories");
            if (response.data.success) {
                setCategories(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching User Categories:", error);
        }
    };

    // Fetch All Clients List (optionally filtered by coordinator and category)
    const fetchClients = async (staffIdFilter = "", categoryIdFilter = "") => {
        try {
            const response = await api.get("/get-all-clients", {
                params: {
                    staffid: staffIdFilter,
                    categoryid: categoryIdFilter,
                }
            });
            if (response.data.success) {
                setClients(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching Clients:", error);
        }
    };

    // Fetch Saved Reports
    const fetchSavedReports = useCallback(async () => {
        setSavedReportsLoading(true);
        try {
            const response = await api.get("/full-form-report/saved-reports");
            if (response.data.success) {
                setSavedReports(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching saved reports:", error);
        } finally {
            setSavedReportsLoading(false);
        }
    }, []);

    // Fetch Forms Registry & Tables/Fields Schema
    const fetchFormsList = async () => {
        setFormsLoading(true);
        try {
            const response = await api.get("/full-form-report/forms");
            if (response.data.success && response.data.data.length > 0) {
                const fetchedForms: FormOption[] = response.data.data;
                setForms(fetchedForms);
                
                const defaultForm = fetchedForms[0];
                setSelectedFormKey(defaultForm.key);
                setSelectedTable("ALL");
                setSelectedField("ALL");
                setSelectedFieldsList([]);
            }
        } catch (error) {
            console.error("Error fetching forms list:", error);
        } finally {
            setFormsLoading(false);
        }
    };

    useEffect(() => {
        setSelectedClientId("");
        fetchCoordinators();
        fetchCategories();
        fetchClients();
        fetchFormsList();
        fetchSavedReports();
    }, [fetchSavedReports]);

    // Filtered Saved Reports based on search input
    const filteredSavedReports = useMemo(() => {
        if (!savedReportSearch.trim()) return savedReports;
        const q = savedReportSearch.toLowerCase().trim();
        return savedReports.filter(rep => {
            const nameMatch = rep.name.toLowerCase().includes(q);
            const formObj = forms.find(f => f.key === rep.form_key);
            const formMatch = (formObj?.name || rep.form_key).toLowerCase().includes(q);
            let clientMatch = false;
            if (rep.client_id) {
                const client = clients.find(c => String(c.userid) === String(rep.client_id));
                if (client) {
                    clientMatch = `${client.name} ${client.lastname}`.toLowerCase().includes(q);
                }
            }
            return nameMatch || formMatch || clientMatch;
        });
    }, [savedReports, savedReportSearch, forms, clients]);

    // Get current active form object
    const currentFormObj = useMemo(() => {
        return forms.find(f => f.key === selectedFormKey);
    }, [forms, selectedFormKey]);

    // Get tables list for current form
    const currentTables = useMemo(() => {
        return currentFormObj ? currentFormObj.tables : [];
    }, [currentFormObj]);

    // Get all fields across all tables for current form
    const allFormFields = useMemo(() => {
        if (!currentFormObj) return [];
        const allF: (FormFieldItem & { tableName: string })[] = [];
        currentFormObj.tables.forEach(t => {
            t.fields.forEach(f => {
                if (!allF.some(existing => existing.key === f.key)) {
                    allF.push({ ...f, tableName: t.table_name });
                }
            });
        });
        return allF;
    }, [currentFormObj]);

    // Get fields belonging to currently selected Table (for field selection panel filter)
    const fieldsForSelectedTable = useMemo(() => {
        if (!currentFormObj) return [];
        if (selectedTable === 'ALL') {
            return allFormFields;
        }
        const foundTable = currentFormObj.tables.find(t => t.table_name === selectedTable);
        return foundTable ? foundTable.fields.map(f => ({ ...f, tableName: selectedTable })) : [];
    }, [currentFormObj, selectedTable, allFormFields]);

    // Filter fields by search query
    const filteredTableFields = useMemo(() => {
        if (!fieldSearch.trim()) return fieldsForSelectedTable;
        const q = fieldSearch.toLowerCase().trim();
        return fieldsForSelectedTable.filter(f => 
            f.label.toLowerCase().includes(q) || 
            f.key.toLowerCase().includes(q)
        );
    }, [fieldsForSelectedTable, fieldSearch]);

    // Handle Form selection change
    const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFormKey = e.target.value;
        setSelectedFormKey(newFormKey);
        setSelectedTable("ALL");
        setSelectedField("ALL");
        setSelectedFieldsList([]);
        setSelectedReportId(null);
        setReportNameInput("");
        setReportDescription("");
        setFieldSearch("");
    };

    // Handle Table dropdown change
    const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTable = e.target.value;
        setSelectedTable(newTable);
        setSelectedField("ALL");
        setFieldSearch("");
    };

    // Handle Field dropdown change
    const handleSingleFieldSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const fieldKey = e.target.value;
        setSelectedField(fieldKey);
        if (fieldKey === "ALL") {
            // Select all fields in the selected table view
            const tableFieldKeys = fieldsForSelectedTable.map(f => f.key);
            const updated = Array.from(new Set([...selectedFieldsList, ...tableFieldKeys]));
            setSelectedFieldsList(updated);
        } else {
            if (!selectedFieldsList.includes(fieldKey)) {
                setSelectedFieldsList([...selectedFieldsList, fieldKey]);
            }
        }
    };

    // Handle BHC Coordinator dropdown change
    const handleCoordinatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const staffId = e.target.value;
        setSelectedStaffId(staffId);
        setSelectedClientId("");
        fetchClients(staffId, selectedCategoryId);
        fetchData(1, selectedFormKey, selectedTable, selectedFieldsList, search, "", pageSize, staffId, selectedCategoryId);
    };

    // Handle User Category dropdown change
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const catId = e.target.value;
        setSelectedCategoryId(catId);
        setSelectedClientId("");
        fetchClients(selectedStaffId, catId);
        fetchData(1, selectedFormKey, selectedTable, selectedFieldsList, search, "", pageSize, selectedStaffId, catId);
    };

    // Fetch report data
    const fetchData = useCallback(async (
        page = 1, 
        formKey = selectedFormKey, 
        tableFilter = selectedTable,
        fieldsToFetch = selectedFieldsList, 
        searchQuery = search, 
        clientIdFilter = selectedClientId, 
        limit = pageSize,
        staffIdFilter = selectedStaffId,
        categoryIdFilter = selectedCategoryId
    ) => {
        if (!formKey) return;
        setLoading(true);
        try {
            const response = await api.get("/full-form-report/data", {
                params: {
                    page: page,
                    limit: limit,
                    form_key: formKey,
                    table: 'ALL', // Query all form tables to support multi-table field selection
                    fields: fieldsToFetch.join(','),
                    search: searchQuery,
                    client_id: selectedReportId ? (clientIdFilter || selectedClientId || "") : "",
                    staffid: staffIdFilter,
                    categoryid: categoryIdFilter,
                }
            });

            if (response.data.success) {
                const pagedData = response.data.data;
                let sortedData = [...pagedData.data];
                
                if (sortStatus.columnAccessor) {
                    const sortBy = sortStatus.columnAccessor;
                    const sortDir = sortStatus.direction;
                    sortedData.sort((a, b) => {
                        const valA = a[sortBy];
                        const valB = b[sortBy];
                        if (valA === null || valA === undefined || valA === 'NIL') return sortDir === 'asc' ? 1 : -1;
                        if (valB === null || valB === undefined || valB === 'NIL') return sortDir === 'asc' ? -1 : 1;
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
            console.error("Error fetching full form report data:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedFormKey, selectedFieldsList, search, selectedClientId, pageSize, sortStatus, selectedStaffId, selectedCategoryId]);

    useEffect(() => {
        if (forms.length > 0 && selectedFormKey) {
            fetchData(1, selectedFormKey, selectedTable, selectedFieldsList, search, selectedClientId, pageSize, selectedStaffId, selectedCategoryId);
        }
    }, [selectedFormKey, selectedTable, selectedFieldsList, selectedClientId, pageSize, selectedStaffId, selectedCategoryId]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearch(query);
        fetchData(1, selectedFormKey, selectedTable, selectedFieldsList, query, selectedClientId, pageSize, selectedStaffId, selectedCategoryId);
    };

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        setSelectedClientId(clientId);
        fetchData(1, selectedFormKey, selectedTable, selectedFieldsList, search, clientId, pageSize, selectedStaffId, selectedCategoryId);
    };

    const handleRecordsPerPageChange = (size: number) => {
        setPageSize(size);
        fetchData(1, selectedFormKey, selectedTable, selectedFieldsList, search, selectedClientId, size, selectedStaffId, selectedCategoryId);
    };

    const handleSortStatusChange = (status: any) => {
        setSortStatus(status);
    };

    const toggleFieldCheckbox = (fieldKey: string) => {
        let updated: string[];
        if (selectedFieldsList.includes(fieldKey)) {
            updated = selectedFieldsList.filter(k => k !== fieldKey);
        } else {
            updated = [...selectedFieldsList, fieldKey];
        }
        setSelectedFieldsList(updated);
    };

    const handleSelectAllTableFields = () => {
        const targetFields = fieldSearch.trim() ? filteredTableFields : fieldsForSelectedTable;
        const targetKeys = targetFields.map(f => f.key);
        const updated = Array.from(new Set([...selectedFieldsList, ...targetKeys]));
        setSelectedFieldsList(updated);
    };

    const handleDeselectAllTableFields = () => {
        const targetFields = fieldSearch.trim() ? filteredTableFields : fieldsForSelectedTable;
        const targetKeys = targetFields.map(f => f.key);
        const updated = selectedFieldsList.filter(k => !targetKeys.includes(k));
        setSelectedFieldsList(updated);
    };

    // Load a saved report template and restore its configuration
    const handleLoadReport = (report: SavedReport) => {
        setSelectedReportId(report.id);
        setReportNameInput(report.name);
        setReportDescription(report.description || "");
        setSelectedFormKey(report.form_key);
        setSelectedTable(report.table_name || "ALL");
        setSelectedField("ALL");
        const loadedClientId = report.client_id ? String(report.client_id) : "";
        setSelectedClientId(loadedClientId);
        
        let loadedFields: string[] = [];
        if (Array.isArray(report.selected_fields)) {
            loadedFields = report.selected_fields;
        } else if (typeof report.selected_fields === "string") {
            try {
                loadedFields = JSON.parse(report.selected_fields);
            } catch {
                loadedFields = [];
            }
        }
        setSelectedFieldsList(loadedFields);

        // Immediately trigger data fetch with restored configuration
        fetchData(1, report.form_key, report.table_name || "ALL", loadedFields, search, loadedClientId, pageSize, selectedStaffId, selectedCategoryId);

        setIsReportModalOpen(false);
        setStatusFeedback({
            type: "success",
            message: `Loaded template "${report.name}" (${loadedFields.length} columns active).`
        });
        setTimeout(() => setStatusFeedback(null), 4000);
    };

    // Clear currently loaded template to start fresh
    const handleClearTemplate = () => {
        setSelectedReportId(null);
        setReportNameInput("");
        setReportDescription("");
        setSelectedClientId("");
        setSelectedFieldsList([]);
        setStatusFeedback(null);
        fetchData(1, selectedFormKey, selectedTable, [], search, "", pageSize, selectedStaffId, selectedCategoryId);
    };

    // Save or Update Report Template
    const handleSaveReport = async (saveAsNew = false) => {
        const trimmedName = reportNameInput.trim();
        if (!trimmedName) {
            alert("Please enter a report name before saving.");
            return;
        }

        if (selectedFieldsList.length === 0) {
            alert("Please select at least one field/column before saving the report.");
            return;
        }

        setSavingReport(true);
        try {
            const payload: any = {
                name: trimmedName,
                form_key: selectedFormKey,
                table_name: selectedTable,
                client_id: selectedClientId || null,
                selected_fields: selectedFieldsList,
                description: reportDescription.trim() || null,
            };

            if (!saveAsNew && selectedReportId) {
                payload.id = selectedReportId;
            }

            const response = await api.post("/full-form-report/saved-reports", payload);
            if (response.data.success) {
                const savedItem: SavedReport = response.data.data;
                setSelectedReportId(savedItem.id);
                setReportNameInput(savedItem.name);
                setIsReportModalOpen(false);
                await fetchSavedReports();
                setStatusFeedback({
                    type: "success",
                    message: saveAsNew || !selectedReportId 
                        ? `Report "${savedItem.name}" created successfully!` 
                        : `Report "${savedItem.name}" updated successfully!`
                });
                setTimeout(() => setStatusFeedback(null), 4000);
            } else {
                alert(response.data.message || "Failed to save report.");
            }
        } catch (error: any) {
            console.error("Error saving report:", error);
            alert(error.response?.data?.message || "An error occurred while saving the report.");
        } finally {
            setSavingReport(false);
        }
    };

    // Delete Saved Report
    const handleDeleteReport = async (reportId: number, reportName: string) => {
        if (!window.confirm(`Are you sure you want to delete the saved report "${reportName}"?`)) {
            return;
        }

        try {
            const response = await api.delete(`/full-form-report/saved-reports/${reportId}`);
            if (response.data.success) {
                if (selectedReportId === reportId) {
                    setSelectedReportId(null);
                    setReportNameInput("");
                    setReportDescription("");
                }
                setIsReportModalOpen(false);
                await fetchSavedReports();
                setStatusFeedback({
                    type: "success",
                    message: `Report "${reportName}" deleted successfully.`
                });
                setTimeout(() => setStatusFeedback(null), 4000);
            } else {
                alert(response.data.message || "Failed to delete report.");
            }
        } catch (error: any) {
            console.error("Error deleting report:", error);
            alert(error.response?.data?.message || "An error occurred while deleting the report.");
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get("/export-full-form-report", {
                params: {
                    form_key: selectedFormKey,
                    table: 'ALL',
                    fields: selectedFieldsList.join(','),
                    search: search,
                    client_id: selectedClientId,
                    staffid: selectedStaffId,
                    categoryid: selectedCategoryId
                },
                responseType: 'blob'
            });
            const filename = reportNameInput.trim()
                ? `${reportNameInput.trim().replace(/[^a-zA-Z0-9_\-]/g, '_')}_report.csv`
                : `${selectedFormKey}_report.csv`;
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
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
        if (isNaN(date.getTime())) return String(dateString);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    const renderFieldValue = (value: any, fieldKey: string) => {
        if (value === null || value === undefined || value === '' || value === 'NIL') {
            return <span className="text-gray-400 font-normal">NIL</span>;
        }

        if (fieldKey === 'form_status') {
            const valStr = String(value).toLowerCase();
            if (valStr === 'completed') {
                return <span className="badge bg-success text-white px-2 py-1 rounded">Completed</span>;
            }
            return <span className="badge bg-warning text-dark px-2 py-1 rounded">{String(value)}</span>;
        }

        if (fieldKey === 'completion_percentage' || (typeof value === 'number' && fieldKey.includes('percentage'))) {
            const num = parseFloat(value);
            return <span className="badge bg-primary text-white px-2 py-1 rounded">{isNaN(num) ? value : `${num.toFixed(1)}%`}</span>;
        }

        if (fieldKey.includes('date')) {
            return formatDate(value);
        }

        return String(value);
    };

    // Construct Columns dynamically for ListComponents DataTable using all selected fields across all tables
    const dynamicColumns = useMemo(() => {
        const cols: any[] = [
            {
                accessor: 'client_full_name',
                title: 'Client Name',
                sortable: true,
                render: (row: any) => (
                    <div className="font-semibold text-primary">
                        {row.client_full_name || `${row.name || ''} ${row.lastname || ''}`}
                    </div>
                )
            }
        ];

        allFormFields
            .filter(f => selectedFieldsList.includes(f.key))
            .forEach(f => {
                cols.push({
                    accessor: f.key,
                    title: f.label,
                    sortable: true,
                    render: (row: any) => renderFieldValue(row[f.key], f.key)
                });
            });

        return cols;
    }, [allFormFields, selectedFieldsList]);

    return (
        <div className="p-4 sm:p-6 space-y-4">
            {/* 1. Top Header with Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-xs border border-gray-100">
                <div className="flex items-center gap-3">
                    <Image src="/assets/images/BHC LOGO_SMALL.png" alt="Company Logo" width={130} height={50} className="h-auto w-auto" priority />
                    <div className="border-l border-gray-200 pl-3">
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Full Form Report</h1>
                        <p className="text-xs text-gray-500 hidden sm:block">Participants cross-table reporting & custom templates</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-end">
                    {/* ONLY Create Report Button as requested */}
                    <button
                        type="button"
                        onClick={() => {
                            setReportModalTab('create');
                            if (!selectedReportId) {
                                setReportNameInput("");
                                setReportDescription("");
                                setSelectedFieldsList([]);
                            }
                            setIsReportModalOpen(true);
                        }}
                        className="btn-primary flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white font-semibold whitespace-nowrap shrink-0 shadow-xs text-xs hover:bg-primary-dark transition-all"
                        title="Create or manage custom report templates"
                    >
                        <IconPlus className="w-4 h-4" />
                        <span>{selectedReportId ? "Manage Report" : "Create Report"}</span>
                    </button>
                </div>
            </div>

            {/* 2. Feedback Notification Toast (if any) */}
            {statusFeedback && (
                <div className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs transition-all ${
                    statusFeedback.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                    <div className="flex items-center gap-2">
                        <span className="text-base">{statusFeedback.type === 'success' ? '✓' : '⚠'}</span>
                        <span>{statusFeedback.message}</span>
                    </div>
                    <button type="button" onClick={() => setStatusFeedback(null)} className="text-gray-400 hover:text-gray-700 font-bold ml-2">
                        ✕
                    </button>
                </div>
            )}

            {/* 3. Filter Controls & Participant Search Bar */}
            <div className="panel bg-white p-4 rounded-xl shadow-xs border border-gray-100 space-y-3.5">
                {/* Top Row: Hide/Show Filters button on left, Search Participant on right */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn btn-outline-primary btn-sm flex items-center gap-2 text-xs py-2 px-3.5 rounded-lg font-semibold w-fit transition-all shadow-xs"
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        <span>{showFilters ? 'Hide Filters ▲' : 'Show Filters ▼'}</span>
                        {(selectedReportId || selectedCategoryId || selectedStaffId) && (
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse ml-0.5"></span>
                        )}
                    </button>

                    {/* Participant Search */}
                    <div className="w-full sm:w-80">
                        <div className="relative flex items-center">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 z-10">
                                <IconSearch className="w-4 h-4 text-gray-400" />
                            </span>
                            <input 
                                type="text" 
                                placeholder="Search participant name..." 
                                className="form-input text-xs !pl-10 pr-8 py-2 rounded-lg border-gray-300 w-full focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white font-medium"
                                style={{ paddingLeft: '2.5rem' }}
                                value={search}
                                onChange={handleSearchChange}
                            />
                            {search && (
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setSearch("");
                                        fetchData(1, selectedFormKey, selectedTable, selectedFieldsList, "", selectedClientId, pageSize, selectedStaffId, selectedCategoryId);
                                    }}
                                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-700 text-xs font-bold z-10"
                                >
                                    ✕
                                </button>
                            )}
                            {loading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                                    <span className="animate-spin inline-block w-3.5 h-3.5 border-[2px] border-current border-t-transparent text-primary rounded-full" role="status" aria-label="loading"></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Collapsible Filter Dropdowns Row */}
                {showFilters && (
                    <div className="pt-3 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-end">
                            {/* Saved Report Filter */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                        Saved Report
                                    </label>
                                    {selectedReportId && (
                                        <button 
                                            type="button" 
                                            onClick={handleClearTemplate}
                                            className="text-[10px] text-primary hover:underline font-bold"
                                            title="Clear loaded template"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <select 
                                    className="form-select w-full border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                                    value={selectedReportId ?? ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (!val) {
                                            handleClearTemplate();
                                        } else {
                                            const rep = savedReports.find(r => String(r.id) === String(val));
                                            if (rep) handleLoadReport(rep);
                                        }
                                    }}
                                >
                                    <option value="">{savedReportsLoading ? "Loading..." : `-- Choose Saved Report (${savedReports.length}) --`}</option>
                                    {savedReports.map(rep => (
                                        <option key={rep.id} value={rep.id}>
                                            {rep.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                    Category
                                </label>
                                <select 
                                    className="form-select w-full border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                                    value={selectedCategoryId}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.category || cat.category_name || cat.name || `Category #${cat.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* BHC Coordinator Filter */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                    BHC Coordinator
                                </label>
                                <select 
                                    className="form-select w-full border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                                    value={selectedStaffId}
                                    onChange={handleCoordinatorChange}
                                >
                                    <option value="">All Coordinators</option>
                                    {coordinators.map((coord: any) => (
                                        <option key={coord.id || coord.staffid} value={coord.staffid || coord.id}>
                                            {coord.full_name || coord.name || `${coord.firstname || ''} ${coord.lastname || ''}`.trim() || `Staff #${coord.staffid || coord.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Data Table Panel (Immediate Focus on Open) */}
            <div className="panel border-0 shadow-xs bg-white rounded-xl p-5">
                <div className="mb-4 flex flex-wrap justify-between items-center gap-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Total Participants: <span className="text-primary font-extrabold text-sm">{listData.total}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Rows:</span>
                        <select 
                            className="form-select form-select-sm w-20 py-1 px-2 rounded-lg text-xs font-semibold"
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
                    columnData={dynamicColumns} 
                    onPageChange={(p) => fetchData(p, selectedFormKey, selectedTable, selectedFieldsList, search, selectedClientId, pageSize, selectedStaffId, selectedCategoryId)} 
                    sortStatus={sortStatus}
                    onSortStatusChange={handleSortStatusChange}
                />
            </div>

            {/* 5. Create / Manage Report Popup Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <div 
                        className="rounded-2xl shadow-2xl max-w-4xl lg:max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-300 relative z-10"
                        style={{ backgroundColor: '#ffffff' }}
                    >
                        {/* Modal Header */}
                        <div 
                            className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0"
                            style={{ backgroundColor: '#f8fafc' }}
                        >
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    {selectedReportId ? "Manage Report Template" : "Create Report"}
                                </h3>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    Configure report fields and save custom templates for one-click re-use.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsReportModalOpen(false)}
                                className="text-gray-500 hover:text-gray-800 rounded-lg p-1.5 hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                <IconX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Tabs */}
                        <div 
                            className="flex border-b border-gray-200 px-6 pt-2 shrink-0"
                            style={{ backgroundColor: '#f1f5f9' }}
                        >
                            <button
                                type="button"
                                onClick={() => setReportModalTab('create')}
                                className={`pb-2.5 text-xs font-bold border-b-2 mr-4 transition-colors cursor-pointer ${
                                    reportModalTab === 'create'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {selectedReportId ? "Report Configuration" : "Create Report"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setReportModalTab('list')}
                                className={`pb-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                                    reportModalTab === 'list'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <span>Saved Reports</span>
                                <span className="bg-gray-200 text-gray-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {savedReports.length}
                                </span>
                            </button>
                        </div>

                        {/* Modal Body with solid background */}
                        <div 
                            className="p-6 overflow-y-auto space-y-4 flex-1"
                            style={{ backgroundColor: '#f8fafc' }}
                        >
                            {reportModalTab === 'create' ? (
                                <div className="space-y-4">
                                    {/* Report Name & Form Select Card */}
                                    <div 
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-gray-300 shadow-xs"
                                        style={{ backgroundColor: '#ffffff' }}
                                    >
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                                Report Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Q4 SIL Support Care Review"
                                                value={reportNameInput}
                                                onChange={(e) => setReportNameInput(e.target.value)}
                                                className="form-input text-xs py-2.5 px-3 rounded-lg border border-gray-300 w-full font-medium text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary/20"
                                                style={{ backgroundColor: '#ffffff' }}
                                                autoFocus
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                                Select Form
                                            </label>
                                            <select 
                                                className="form-select w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs font-semibold text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary/20"
                                                style={{ backgroundColor: '#ffffff' }}
                                                value={selectedFormKey}
                                                onChange={handleFormChange}
                                                disabled={formsLoading}
                                            >
                                                {forms.map(f => (
                                                    <option key={f.key} value={f.key}>
                                                        {f.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Field Selection Section Card */}
                                    <div 
                                        className="border border-gray-300 rounded-xl p-4 shadow-xs space-y-4"
                                        style={{ backgroundColor: '#ffffff' }}
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                                                    Choose Fields & Columns
                                                </span>
                                                <span 
                                                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                                                    style={{ 
                                                        backgroundColor: selectedFieldsList.length > 0 ? '#e0e7ff' : '#f3f4f6',
                                                        color: selectedFieldsList.length > 0 ? '#4361ee' : '#374151',
                                                        borderColor: selectedFieldsList.length > 0 ? '#a5b4fc' : '#d1d5db'
                                                    }}
                                                >
                                                    {selectedFieldsList.length} Selected
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                <button 
                                                    type="button" 
                                                    onClick={handleSelectAllTableFields}
                                                    className="btn btn-xs btn-outline-primary text-xs py-1.5 px-3 rounded-md font-bold cursor-pointer hover:bg-primary/5 transition-colors border border-primary/50"
                                                    style={{ backgroundColor: '#ffffff' }}
                                                >
                                                    {fieldSearch ? `Select Filtered (${filteredTableFields.length})` : "Select All in Table"}
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={handleDeselectAllTableFields}
                                                    className="btn btn-xs btn-outline-secondary text-xs py-1.5 px-3 rounded-md font-bold cursor-pointer hover:bg-gray-100 transition-colors border border-gray-300 text-gray-700"
                                                    style={{ backgroundColor: '#ffffff' }}
                                                >
                                                    {fieldSearch ? "Deselect Filtered" : "Deselect All"}
                                                </button>
                                                {selectedFieldsList.length > 0 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setSelectedFieldsList([])}
                                                        className="btn btn-xs text-xs py-1.5 px-2.5 text-danger hover:bg-danger/10 font-bold cursor-pointer transition-colors border border-transparent"
                                                    >
                                                        Clear All
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Table Filter & Field Search with Solid Outlines and Clear Labels */}
                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
                                            <div className="sm:col-span-5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                                    Filter by Table
                                                </label>
                                                <select 
                                                    className="form-select text-xs py-2.5 px-3 rounded-lg border border-gray-300 font-semibold text-gray-800 w-full focus:border-primary focus:ring-1 focus:ring-primary/20"
                                                    style={{ backgroundColor: '#ffffff' }}
                                                    value={selectedTable}
                                                    onChange={handleTableChange}
                                                >
                                                    <option value="ALL">All Tables</option>
                                                    {currentTables.map(t => (
                                                        <option key={t.table_name} value={t.table_name}>
                                                            {t.table_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="sm:col-span-7">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                                    Search Fields
                                                </label>
                                                {/* Properly set search icon with guaranteed left padding */}
                                                <div className="relative flex items-center">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 z-10">
                                                        <IconSearch className="w-4 h-4 text-gray-400" />
                                                    </span>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search fields (e.g. name, date, email, phone)..." 
                                                        value={fieldSearch}
                                                        onChange={(e) => setFieldSearch(e.target.value)}
                                                        className="form-input text-xs !pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 w-full font-medium text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary/20"
                                                        style={{ backgroundColor: '#ffffff', paddingLeft: '2.5rem' }}
                                                    />
                                                    {fieldSearch && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setFieldSearch("")}
                                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700 text-xs font-bold cursor-pointer z-10"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Field Pills Scrollable Container with solid, crisp borders and background */}
                                        {filteredTableFields.length === 0 ? (
                                            <div 
                                                className="text-center py-6 text-xs text-gray-500 rounded-xl border border-dashed border-gray-300"
                                                style={{ backgroundColor: '#f8fafc' }}
                                            >
                                                No fields match &quot;<strong>{fieldSearch}</strong>&quot;.
                                                <button 
                                                    type="button" 
                                                    onClick={() => setFieldSearch("")}
                                                    className="text-primary underline ml-1 font-semibold cursor-pointer"
                                                >
                                                    Clear search
                                                </button>
                                            </div>
                                        ) : (
                                            <div 
                                                className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-1 p-3.5 rounded-xl border border-gray-300"
                                                style={{ backgroundColor: '#f1f5f9' }}
                                            >
                                                {filteredTableFields.map(field => {
                                                    const isChecked = selectedFieldsList.includes(field.key);
                                                    return (
                                                        <label 
                                                            key={field.key} 
                                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all select-none ${
                                                                isChecked 
                                                                    ? 'border-2 shadow-xs' 
                                                                    : 'border hover:bg-gray-100 hover:border-gray-400'
                                                            }`}
                                                            style={{ 
                                                                backgroundColor: isChecked ? '#e0e7ff' : '#ffffff',
                                                                borderColor: isChecked ? '#4361ee' : '#d1d5db'
                                                            }}
                                                        >
                                                            <input 
                                                                type="checkbox"
                                                                className="form-checkbox text-primary rounded focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                                                                checked={isChecked}
                                                                onChange={() => toggleFieldCheckbox(field.key)}
                                                            />
                                                            <span 
                                                                className="text-[12px] font-bold"
                                                                style={{ color: isChecked ? '#1e1b4b' : '#334155' }}
                                                            >
                                                                {field.label}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {selectedFieldsList.length === 0 && (
                                        <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-300 font-medium">
                                            ⚠ Please select at least one field/column before saving.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                /* Tab 2: Saved Reports List */
                                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                            Search Saved Reports
                                        </label>
                                        <div className="relative mb-3 flex items-center">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 z-10">
                                                <IconSearch className="w-4 h-4 text-gray-400" />
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Search saved reports by name or form..."
                                                value={savedReportSearch}
                                                onChange={(e) => setSavedReportSearch(e.target.value)}
                                                className="form-input text-xs !pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 w-full font-medium text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary/20"
                                                style={{ backgroundColor: '#ffffff', paddingLeft: '2.5rem' }}
                                            />
                                            {savedReportSearch && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSavedReportSearch("")}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700 text-xs font-bold cursor-pointer z-10"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {filteredSavedReports.length === 0 ? (
                                        <div 
                                            className="text-center py-8 text-xs text-gray-500 rounded-xl border border-dashed border-gray-300"
                                            style={{ backgroundColor: '#ffffff' }}
                                        >
                                            {savedReportSearch ? `No reports match "${savedReportSearch}"` : "No saved reports yet. Create your first report from the Create Report tab!"}
                                        </div>
                                    ) : (
                                        filteredSavedReports.map(rep => {
                                            const isCurrent = rep.id === selectedReportId;
                                            const formMatch = forms.find(f => f.key === rep.form_key);
                                            const formName = formMatch?.name || rep.form_key;
                                            const colsCount = Array.isArray(rep.selected_fields) ? rep.selected_fields.length : 0;
                                            return (
                                                <div 
                                                    key={rep.id} 
                                                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                                                        isCurrent ? 'bg-primary/5 border-primary shadow-xs' : 'border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                    style={{ backgroundColor: isCurrent ? undefined : '#ffffff' }}
                                                >
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-xs text-gray-900 truncate">
                                                                {rep.name}
                                                            </span>
                                                            {isCurrent && (
                                                                <span className="badge bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                                    Active
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-gray-600 mt-0.5 truncate">
                                                            {formName} • {colsCount} column{colsCount === 1 ? '' : 's'}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleLoadReport(rep)}
                                                            className="btn btn-xs btn-primary text-xs py-1.5 px-3 rounded-lg font-semibold cursor-pointer"
                                                        >
                                                            Load
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteReport(rep.id, rep.name)}
                                                            className="text-gray-400 hover:text-danger p-1.5 rounded transition-colors cursor-pointer"
                                                            title="Delete saved report"
                                                        >
                                                            <IconTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {reportModalTab === 'create' && (
                            <div 
                                className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-200 shrink-0"
                                style={{ backgroundColor: '#f8fafc' }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="btn btn-outline-secondary text-xs px-4 py-2 rounded-lg font-semibold cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    style={{ backgroundColor: '#ffffff' }}
                                >
                                    Cancel
                                </button>

                                {selectedReportId ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteReport(selectedReportId, reportNameInput)}
                                            className="btn btn-outline-danger text-xs px-3 py-2 rounded-lg font-semibold mr-auto cursor-pointer"
                                            title="Delete this report"
                                        >
                                            <IconTrash className="w-4 h-4 inline mr-1" />
                                            <span>Delete</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSaveReport(true)}
                                            disabled={savingReport || !reportNameInput.trim() || selectedFieldsList.length === 0}
                                            className="btn btn-outline-primary text-xs px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Save as New
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSaveReport(false)}
                                            disabled={savingReport || !reportNameInput.trim() || selectedFieldsList.length === 0}
                                            className="btn-primary text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <IconSave className="w-4 h-4" />
                                            <span>{savingReport ? 'Updating...' : 'Update Report'}</span>
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleSaveReport(false)}
                                        disabled={savingReport || !reportNameInput.trim() || selectedFieldsList.length === 0}
                                        className="btn-primary text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <IconPlus className="w-4 h-4" />
                                        <span>{savingReport ? 'Saving...' : 'Create Report'}</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipantsFullFormReport;
