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
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [sortStatus, setSortStatus] = useState({ columnAccessor: 'client_full_name', direction: 'asc' });

    const PAGE_SIZES = [25, 50, 100, 1000];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    // Saved Reports / Templates State
    const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
    const [savedReportsLoading, setSavedReportsLoading] = useState<boolean>(false);
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
    const [reportNameInput, setReportNameInput] = useState<string>("");
    const [savedReportSearch, setSavedReportSearch] = useState<string>("");
    const [savingReport, setSavingReport] = useState<boolean>(false);
    const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Fetch All Clients List
    const fetchClients = async () => {
        try {
            const response = await api.get("/get-all-clients");
            if (response.data.success) {
                setClients(response.data.data);
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

                // Initially deselect all fields by default as requested
                setSelectedFieldsList([]);
            }
        } catch (error) {
            console.error("Error fetching forms list:", error);
        } finally {
            setFormsLoading(false);
        }
    };

    useEffect(() => {
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

    // Handle Form selection change
    const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFormKey = e.target.value;
        setSelectedFormKey(newFormKey);
        setSelectedTable("ALL");
        setSelectedField("ALL");
        // Deselect all fields when switching forms
        setSelectedFieldsList([]);
        setSelectedReportId(null);
    };

    // Handle Table dropdown change
    const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTable = e.target.value;
        setSelectedTable(newTable);
        setSelectedField("ALL");
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

    // Fetch report data
    const fetchData = useCallback(async (
        page = 1, 
        formKey = selectedFormKey, 
        tableFilter = selectedTable,
        fieldsToFetch = selectedFieldsList, 
        searchQuery = search, 
        clientIdFilter = selectedClientId, 
        limit = pageSize
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
                    client_id: clientIdFilter,
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
    }, [selectedFormKey, selectedFieldsList, search, selectedClientId, pageSize, sortStatus]);

    useEffect(() => {
        if (forms.length > 0 && selectedFormKey) {
            fetchData(1, selectedFormKey, selectedTable, selectedFieldsList, search, selectedClientId, pageSize);
        }
    }, [selectedFormKey, selectedTable, selectedFieldsList, selectedClientId, pageSize]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearch(query);
        fetchData(1, selectedFormKey, selectedTable, selectedFieldsList, query, selectedClientId, pageSize);
    };

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        setSelectedClientId(clientId);
        fetchData(1, selectedFormKey, selectedTable, selectedFieldsList, search, clientId, pageSize);
    };

    const handleRecordsPerPageChange = (size: number) => {
        setPageSize(size);
        fetchData(1, selectedFormKey, selectedTable, selectedFieldsList, search, selectedClientId, size);
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
        const tableKeys = fieldsForSelectedTable.map(f => f.key);
        const updated = Array.from(new Set([...selectedFieldsList, ...tableKeys]));
        setSelectedFieldsList(updated);
    };

    const handleDeselectAllTableFields = () => {
        const tableKeys = fieldsForSelectedTable.map(f => f.key);
        const updated = selectedFieldsList.filter(k => !tableKeys.includes(k));
        setSelectedFieldsList(updated);
    };

    // Load a saved report template and restore its configuration
    const handleLoadReport = (report: SavedReport) => {
        setSelectedReportId(report.id);
        setReportNameInput(report.name);
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
        fetchData(1, report.form_key, report.table_name || "ALL", loadedFields, search, loadedClientId, pageSize);

        setStatusFeedback({
            type: "success",
            message: `Loaded template "${report.name}" (${loadedFields.length} fields). You can modify fields, select another client, or export.`
        });
        setTimeout(() => setStatusFeedback(null), 5000);
    };

    // Clear currently loaded template to start fresh
    const handleClearTemplate = () => {
        setSelectedReportId(null);
        setReportNameInput("");
        setStatusFeedback(null);
    };

    // Save or Update Report Template
    const handleSaveReport = async (saveAsNew = false) => {
        const trimmedName = reportNameInput.trim();
        if (!trimmedName) {
            alert("Please enter a report name before saving.");
            return;
        }

        if (selectedFieldsList.length === 0) {
            alert("Please select at least one field before saving the report.");
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
            };

            if (!saveAsNew && selectedReportId) {
                payload.id = selectedReportId;
            }

            const response = await api.post("/full-form-report/saved-reports", payload);
            if (response.data.success) {
                const savedItem: SavedReport = response.data.data;
                setSelectedReportId(savedItem.id);
                setReportNameInput(savedItem.name);
                await fetchSavedReports();
                setStatusFeedback({
                    type: "success",
                    message: saveAsNew || !selectedReportId 
                        ? `Report "${savedItem.name}" saved successfully!` 
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
                }
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
                    client_id: selectedClientId
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
        <div className="p-6">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                   <Image src="/assets/images/BHC LOGO_SMALL.png" alt="Company Logo" width={150} height={60} className="h-auto w-auto" priority />
                   <h1 className="text-2xl font-bold mt-2 text-heading">Full Form Report</h1>
                </div>
                <div className="w-full md:w-[70%] flex flex-col md:flex-row gap-4 justify-end">
                    <button 
                        onClick={handleExport}
                        className="btn-primary flex items-center justify-center gap-2 rounded-md px-4 py-2 text-white font-medium whitespace-nowrap shrink-0 shadow-sm"
                        disabled={selectedFieldsList.length === 0}
                    >
                        <IconDownload /> Export CSV
                    </button>
                    <div className="relative w-full md:w-1/3">
                        <select 
                            className="form-select w-full"
                            value={selectedClientId}
                            onChange={handleClientChange}
                        >
                            <option value="">All Clients</option>
                            {clients.map((c: any, index: number) => (
                                <option key={index} value={c.userid}>
                                    {c.name} {c.lastname}
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
                            onChange={handleSearchChange}
                        />
                        {loading && (
                            <div className="absolute right-3 top-2.5">
                                <span className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-primary rounded-full" role="status" aria-label="loading"></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Saved Reports / Templates Management Bar */}
            <div className="panel mb-6 border-0 shadow-3xl bg-white p-5 rounded-lg border-l-4 border-l-primary">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-gray-800">Saved Reports & Custom Templates</h2>
                            <span className="badge bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-semibold">
                                {savedReports.length} {savedReports.length === 1 ? 'Template' : 'Templates'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Search and select a saved report to auto-fill its configuration, or save your current selection as a template.
                        </p>
                    </div>

                    {selectedReportId && (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-semibold text-emerald-800">
                                Loaded: <span className="underline">{reportNameInput || 'Saved Report'}</span>
                            </span>
                            <button
                                type="button"
                                onClick={handleClearTemplate}
                                className="ml-2 text-xs font-bold text-gray-400 hover:text-red-500 px-1 py-0.5 rounded transition-colors"
                                title="Unload template and start fresh"
                            >
                                ✕ Clear
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                    {/* Section 1: Search & Load Saved Report */}
                    <div className="lg:col-span-6 flex flex-col sm:flex-row gap-3">
                        <div className="w-full sm:w-1/2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Search Saved Reports
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                    <IconSearch className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Filter by name, form, client..."
                                    value={savedReportSearch}
                                    onChange={(e) => setSavedReportSearch(e.target.value)}
                                    className="form-input text-sm pl-9 pr-7 py-2 rounded-md"
                                />
                                {savedReportSearch && (
                                    <button
                                        type="button"
                                        onClick={() => setSavedReportSearch("")}
                                        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600 text-xs"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="w-full sm:w-1/2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Select Saved Report
                            </label>
                            <select
                                className="form-select text-sm py-2 rounded-md font-medium text-gray-800"
                                value={selectedReportId ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (!val) {
                                        handleClearTemplate();
                                    } else {
                                        const rep = savedReports.find(r => r.id === Number(val));
                                        if (rep) handleLoadReport(rep);
                                    }
                                }}
                                disabled={savedReportsLoading}
                            >
                                <option value="">
                                    {savedReportsLoading ? "Loading reports..." : `-- Choose Report (${filteredSavedReports.length}) --`}
                                </option>
                                {filteredSavedReports.map(rep => {
                                    const clientMatch = rep.client_id ? clients.find(c => String(c.userid) === String(rep.client_id)) : null;
                                    const clientLabel = clientMatch ? `${clientMatch.name} ${clientMatch.lastname}` : (rep.client_id ? `Client #${rep.client_id}` : 'All Clients');
                                    const formMatch = forms.find(f => f.key === rep.form_key);
                                    const formLabel = formMatch ? formMatch.name.replace(/Form\s+[A-Za-z0-9\-]+\s*/i, '').trim() : rep.form_key;
                                    return (
                                        <option key={rep.id} value={rep.id}>
                                            {rep.name} [{formLabel} - {rep.selected_fields?.length || 0} cols - {clientLabel}]
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    {/* Section 2: Report Name & Save Actions */}
                    <div className="lg:col-span-6 flex flex-col sm:flex-row gap-3 items-end">
                        <div className="w-full sm:flex-1">
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Report Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. First Yearly Report"
                                value={reportNameInput}
                                onChange={(e) => setReportNameInput(e.target.value)}
                                className="form-input text-sm py-2 rounded-md"
                            />
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto shrink-0">
                            {selectedReportId ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleSaveReport(false)}
                                        disabled={savingReport || !reportNameInput.trim()}
                                        className="btn-primary text-xs sm:text-sm px-3.5 py-2 rounded-md flex items-center justify-center gap-1.5 font-medium whitespace-nowrap shadow-sm disabled:opacity-50"
                                        title="Update the currently active saved report"
                                    >
                                        <IconSave className="w-4 h-4" />
                                        <span>{savingReport ? 'Saving...' : 'Update Report'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSaveReport(true)}
                                        disabled={savingReport || !reportNameInput.trim()}
                                        className="btn btn-outline-primary text-xs sm:text-sm px-3 py-2 rounded-md flex items-center justify-center gap-1 font-medium whitespace-nowrap disabled:opacity-50"
                                        title="Save current configuration as a new separate report"
                                    >
                                        <IconPlus className="w-4 h-4" />
                                        <span>Save New</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const rep = savedReports.find(r => r.id === selectedReportId);
                                            if (rep) handleDeleteReport(rep.id, rep.name);
                                        }}
                                        className="btn btn-outline-danger text-xs sm:text-sm px-2.5 py-2 rounded-md flex items-center justify-center hover:bg-danger hover:text-white"
                                        title="Delete this saved report"
                                    >
                                        <IconTrash className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleSaveReport(false)}
                                    disabled={savingReport || !reportNameInput.trim() || selectedFieldsList.length === 0}
                                    className="btn-primary text-xs sm:text-sm px-4 py-2 rounded-md flex items-center justify-center gap-1.5 font-medium whitespace-nowrap shadow-sm disabled:opacity-50"
                                    title={selectedFieldsList.length === 0 ? "Select at least one field first" : "Save this report configuration"}
                                >
                                    <IconSave className="w-4 h-4" />
                                    <span>{savingReport ? 'Saving...' : 'Save Report'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Feedback banner */}
                {statusFeedback && (
                    <div className={`mt-3 px-3 py-2 rounded-md text-xs font-medium flex items-center justify-between transition-all ${
                        statusFeedback.type === 'success' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                        <span>{statusFeedback.message}</span>
                        <button type="button" onClick={() => setStatusFeedback(null)} className="text-gray-400 hover:text-gray-700 font-bold ml-2">
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {/* Form & Table & Field Controls */}
            <div className="panel mb-6 border-0 shadow-3xl bg-white p-5 rounded-lg">
                {/* 3 Cascading Dropdowns: 1) Select Form, 2) Filter by Table, 3) Filter by Field */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b">
                    {/* Dropdown 1: Select Form */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Select Form
                        </label>
                        <select 
                            className="form-select w-full border-gray-300 rounded px-3 py-2 text-sm font-semibold text-primary"
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

                    {/* Dropdown 2: Filter by Table */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Filter by Table
                        </label>
                        <select 
                            className="form-select w-full border-gray-300 rounded px-3 py-2 text-sm font-semibold text-gray-800"
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

                    {/* Dropdown 3: Filter by Field */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Filter by Field
                        </label>
                        <select 
                            className="form-select w-full border-gray-300 rounded px-3 py-2 text-sm font-semibold text-gray-800"
                            value={selectedField}
                            onChange={handleSingleFieldSelect}
                        >
                            <option value="ALL">All Fields ({fieldsForSelectedTable.length})</option>
                            {fieldsForSelectedTable.map(f => (
                                <option key={f.key} value={f.key}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table Fields Checkboxes selection panel */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-800">
                                Table Fields ({selectedTable === 'ALL' ? 'All Tables' : selectedTable}):
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {fieldsForSelectedTable.filter(f => selectedFieldsList.includes(f.key)).length} / {fieldsForSelectedTable.length} selected
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                type="button"
                                onClick={handleSelectAllTableFields}
                                className="btn btn-xs btn-outline-primary text-xs py-1 px-2.5 rounded font-medium"
                            >
                                Select Table Fields
                            </button>
                            <button 
                                type="button"
                                onClick={handleDeselectAllTableFields}
                                className="btn btn-xs btn-outline-secondary text-xs py-1 px-2.5 rounded font-medium"
                            >
                                Deselect Table Fields
                            </button>
                        </div>
                    </div>

                    {/* Field Pill Checkboxes */}
                    <div className="flex flex-wrap gap-2">
                        {fieldsForSelectedTable.map(field => {
                            const isChecked = selectedFieldsList.includes(field.key);
                            return (
                                <label 
                                    key={field.key} 
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border ${
                                        isChecked 
                                            ? 'bg-primary/10 text-primary border-primary shadow-xs' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    <input 
                                        type="checkbox"
                                        className="form-checkbox text-primary rounded focus:ring-0"
                                        checked={isChecked}
                                        onChange={() => toggleFieldCheckbox(field.key)}
                                    />
                                    <span>{field.label}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Data Table Panel */}
            <div className="panel border-0 shadow-3xl">
                <div className="mb-5 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-bold text-gray-500">
                            Total Participants: <span className="text-primary">{listData.total}</span>
                        </div>
                        <div className="text-sm font-bold text-gray-500 ml-4">
                            Active Table Columns: <span className="text-primary">{dynamicColumns.length}</span>
                        </div>
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
                    columnData={dynamicColumns} 
                    onPageChange={(p) => fetchData(p, selectedFormKey, selectedTable, selectedFieldsList, search, selectedClientId, pageSize)} 
                    sortStatus={sortStatus}
                    onSortStatusChange={handleSortStatusChange}
                />
            </div>
        </div>
    );
};

export default ParticipantsFullFormReport;
