"use client";

import React, { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/src/utils/api";
import { IconCloudUpload, IconRobot, IconFileText, IconCheck, IconAlertTriangle, IconLoader, IconFileDownload } from "@tabler/icons-react";

export default function AIOnboardingPage() {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userid") || "";
    const clientType = searchParams.get("client_type") || "";

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [caseStudyId, setCaseStudyId] = useState<number | null>(null);
    const [rawText, setRawText] = useState<string | null>(null);
    const [showRaw, setShowRaw] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        setProgress(10);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("user_id", userId);
            formData.append("client_type", clientType);

            // Simulate progress for better UX
            const interval = setInterval(() => {
                setProgress((prev) => (prev < 90 ? prev + 10 : prev));
            }, 1500);

            const response = await api.post("/ai/analyze-document", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            clearInterval(interval);
            setProgress(100);

            if (response.data.success) {
                setExtractedData(response.data.data);
                setCaseStudyId(response.data.case_study_id);
                setRawText(response.data.raw_text);
            } else {
                setError(response.data.message || "AI Analysis failed.");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred during AI analysis.");
        } finally {
            setLoading(false);
        }
    };

    const handlePopulate = () => {
        alert("AI data has been saved to the client's profile. All forms will now use this data for pre-filling.");
        window.location.href = `http://localhost/bhcappdemo/participant-profile-view.php?userid=${userId}&client_type=${clientType}`;
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 p-8 font-sans selection:bg-blue-100">
            {/* Background Decorative Elements - Softened for White Theme */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50/50 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Client Onboarding
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Upload documents to automatically generate case studies and pre-fill forms.
                        </p>
                    </div>
                    {/* <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-600">
                            <IconRobot size={24} />
                        </div> 
                        <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">AI Powered by</div>
                            <div className="text-sm font-extrabold text-gray-800">GPT-4o Intelligence</div>
                        </div>
                    </div> */}
                </header>

                {(!extractedData && !rawText) ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Upload Section */}
                        <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                            
                            <div className="mb-8 text-center">
                                <div className="w-20 h-20 bg-blue-600/5 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <IconCloudUpload size={40} />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Upload Client Document</h2>
                                <p className="text-gray-400 text-sm">Support formats: PDF, maximum 10MB</p>
                            </div>

                            <label className="block w-full cursor-pointer">
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-blue-500/50 hover:bg-blue-50/30 transition-all group/upload">
                                    <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
                                    {file ? (
                                        <div className="flex items-center justify-center gap-3 text-blue-600">
                                            <IconFileText size={24} />
                                            <span className="font-semibold text-lg truncate max-w-[200px]">{file.name}</span>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 group-hover/upload:text-gray-500 transition-colors">
                                            <p className="text-lg font-semibold mb-1">Drag and drop or click to select</p>
                                            <p className="text-sm">NDIS Plans, Intake Forms, Case Notes...</p>
                                        </div>
                                    )}
                                </div>
                            </label>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                                    <IconAlertTriangle size={20} />
                                    <p className="text-sm font-bold">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={!file || loading}
                                className={`mt-8 w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                                    !file || loading 
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" 
                                    : "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1"
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <IconLoader className="animate-spin" size={24} />
                                        <span className="font-bold">Analyzing with AI... {progress}%</span>
                                    </>
                                ) : (
                                    <>
                                        <IconRobot size={24} />
                                        <span>Start Analysis</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Info/Features Section */}
                        <div className="space-y-6">
                            <FeatureCard 
                                icon={<IconCheck className="text-green-500" />} 
                                title="Auto-Fill Forms" 
                                color="text-blue-600"
                                description="AI extracts details for all 6 main forms, saving up to 45 minutes of manual data entry per client."
                            />
                            <FeatureCard 
                                icon={<IconCheck className="text-green-500" />} 
                                title="Case Study Generation" 
                                color="text-purple-600"
                                description="Generates a professional summary and case study highlighting client needs, risks, and goals."
                            />
                            <FeatureCard 
                                icon={<IconCheck className="text-green-500" />} 
                                title="Intelligence Mapping" 
                                color="text-blue-600"
                                description="Deep analysis of medical conditions, representative roles, and specific NDIS line items."
                            />
                        </div>
                    </div>
                ) : (
                    /* Results Section */
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Case Study Card */}
                        {caseStudyId && (
                            <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
                                        <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
                                        {extractedData ? "AI-Generated Case Study" : "Document Summary"}
                                    </h2>
                                    <a 
                                        href={`http://localhost:8000/api/ai/case-study/export-pdf/${caseStudyId}`}
                                        target="_blank"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                                    >
                                        <IconFileDownload size={20} />
                                        Download PDF
                                    </a>
                                </div>
                                <div className="text-gray-600 leading-relaxed text-lg italic bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    {extractedData ? extractedData.case_study_summary : "Document content has been successfully extracted. Download the PDF to view the full report."}
                                </div>
                            </div>
                        )}

                        {/* Raw Text Toggle Section */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                    <IconFileText className="text-blue-500" /> Raw Extracted Text
                                </h3>
                                <button 
                                    onClick={() => setShowRaw(!showRaw)}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-700 underline"
                                >
                                    {showRaw ? "Hide Raw Text" : "View Raw Text"}
                                </button>
                            </div>
                            {showRaw && (
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 font-mono text-sm text-gray-600 max-h-[400px] overflow-y-auto whitespace-pre-wrap animate-in fade-in zoom-in duration-300">
                                    {rawText || "No raw text available."}
                                </div>
                            )}
                        </div>

                        {/* Extracted Data Grid */}
                        {/* {extractedData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DataCard title="Client Details" color="text-blue-600" data={[
                                    { label: "Name", value: `${extractedData.participant_detail?.first_name} ${extractedData.participant_detail?.surname}` },
                                    { label: "DOB", value: extractedData.participant_detail?.date_of_birth },
                                    { label: "Gender", value: extractedData.participant_detail?.gender },
                                    { label: "NDIS #", value: extractedData.participant_detail?.ndis_number }
                                ]} />

                                <DataCard title="Contact Info" color="text-purple-600" data={[
                                    { label: "Phone", value: extractedData.contact_detail?.phone },
                                    { label: "Email", value: extractedData.contact_detail?.email },
                                    { label: "Address", value: extractedData.contact_detail?.address }
                                ]} />

                                <DataCard title="Representative" color="text-blue-600" data={[
                                    { label: "Name", value: extractedData.representative?.name },
                                    { label: "Relation", value: extractedData.representative?.relationship },
                                    { label: "Phone", value: extractedData.representative?.phone }
                                ]} />

                                <DataCard title="Medical Snapshot" color="text-red-600" data={[
                                    { label: "Diagnosis", value: extractedData.medical_info?.diagnosis },
                                    { label: "Allergies", value: extractedData.medical_info?.allergies }
                                ]} />
                            </div>
                        )} */}

                        <div className="flex justify-end gap-4 mt-8">
                            <button 
                                onClick={() => { setExtractedData(null); setRawText(null); setShowRaw(false); }}
                                className="px-8 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                            >
                                Start Over
                            </button>
                            {/* {extractedData && (
                                <button 
                                    onClick={handlePopulate}
                                    className="px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                                >
                                    Populate All Forms
                                </button>
                            )} */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description, color }: any) {
    return (
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all">
            <h3 className={`text-xl font-bold ${color} mb-2 flex items-center gap-2`}>
                {icon} {title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
}

function DataCard({ title, color, data }: any) {
    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className={`text-lg font-bold ${color} mb-4 border-b border-gray-50 pb-2`}>{title}</h3>
            <div className="space-y-3">
                {data.map((item: any, i: number) => (
                    <DataField key={i} label={item.label} value={item.value} />
                ))}
            </div>
        </div>
    );
}

function DataField({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center gap-4 py-1 border-b border-gray-50 last:border-0">
            <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">{label}</span>
            <span className="text-gray-800 text-right truncate font-bold">{value || "Not Found"}</span>
        </div>
    );
}
