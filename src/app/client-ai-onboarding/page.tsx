"use client";

import React, { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/src/utils/api";
import ReactMarkdown from 'react-markdown';
import { IconCloudUpload, IconRobot, IconFileText, IconCheck, IconAlertTriangle, IconLoader, IconFileDownload } from "@tabler/icons-react";

export default function AIOnboardingPage() {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userid") || "";
    const clientType = searchParams.get("client_type") || "";

    const [files, setFiles] = useState<File[]>([]);
    const [instructions, setInstructions] = useState("");
    const [staffNotes, setStaffNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [caseStudyId, setCaseStudyId] = useState<number | null>(null);
    const [rawText, setRawText] = useState<string | null>(null);
    const [showRaw, setShowRaw] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
            setError(null);
        }
    };

    const removeFile = (indexToRemove: number) => {
        setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError("Please select at least one file first.");
            return;
        }

        setLoading(true);
        setProgress(10);
        setError(null);

        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files[]", file);
            });
            formData.append("user_id", userId);
            formData.append("client_type", clientType);
            if (instructions.trim()) {
                formData.append("instructions", instructions.trim());
            }
            if (staffNotes.trim()) {
                formData.append("staff_notes", staffNotes.trim());
            }

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
                                <h2 className="text-2xl font-bold mb-2">Upload Client Documents</h2>
                                <p className="text-gray-400 text-sm">Support formats: PDF, JPG, PNG, max 10MB per file</p>
                            </div>

                            <label className="block w-full cursor-pointer">
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-blue-500/50 hover:bg-blue-50/30 transition-all group/upload">
                                    <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" multiple />
                                    {files.length > 0 ? (
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            {files.map((f, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
                                                    <IconFileText size={20} />
                                                    <span className="font-semibold text-sm truncate max-w-[200px]">{f.name}</span>
                                                    <button type="button" onClick={(e) => { e.preventDefault(); removeFile(idx); }} className="text-red-500 ml-2 hover:text-red-700">X</button>
                                                </div>
                                            ))}
                                            <p className="text-gray-400 text-sm mt-2 font-medium hover:text-blue-500">Click to add more files</p>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 group-hover/upload:text-gray-500 transition-colors">
                                            <p className="text-lg font-semibold mb-1">Drag and drop or click to select</p>
                                            <p className="text-sm">NDIS Plans, Intake Forms, Case Notes...</p>
                                        </div>
                                    )}
                                </div>
                            </label>

                            {/* Prompt Heading (Optional) */}
                            <div className="mt-6 space-y-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Prompt Heading (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    disabled={loading}
                                    placeholder="e.g. Focus on medical history, NDIS goals, emergency contacts, dietary preferences..."
                                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 resize-none text-gray-800 transition-all"
                                />
                            </div>

                            {/* Additional Information (Optional) */}
                            <div className="mt-4 space-y-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Additional Information (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={staffNotes}
                                    onChange={(e) => setStaffNotes(e.target.value)}
                                    disabled={loading}
                                    placeholder="e.g. Participant prefers afternoon visits; check wheelchair mobility details..."
                                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 resize-none text-gray-800 transition-all"
                                />
                            </div>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                                    <IconAlertTriangle size={20} />
                                    <p className="text-sm font-bold">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={files.length === 0 || loading}
                                className={`mt-8 w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                                    files.length === 0 || loading 
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
                                        href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.bhcapp.com.au/api'}/ai/case-study/export-pdf/${caseStudyId}`}
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
                                    <IconFileText className="text-blue-500" /> Extracted Document Text
                                </h3>
                                <button 
                                    onClick={() => setShowRaw(!showRaw)}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-700 underline"
                                >
                                    {showRaw ? "Hide Raw Text" : "View Raw Text"}
                                </button>
                            </div>
                            
                            {/* Formatted Markdown (Default View) */}
                            {!showRaw && extractedData?.full_transcription && (
                                <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 text-gray-700 mb-6 prose max-w-none">
                                    <ReactMarkdown
                                        components={{
                                            h1: ({node: _node, ...props}) => <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900 border-b pb-2" {...props} />,
                                            h2: ({node: _node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-5 text-gray-800" {...props} />,
                                            h3: ({node: _node, ...props}) => <h3 className="text-lg font-bold mb-2 mt-4 text-gray-800" {...props} />,
                                            ul: ({node: _node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                                            ol: ({node: _node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                                            li: ({node: _node, ...props}) => <li className="text-gray-700" {...props} />,
                                            p: ({node: _node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                                            strong: ({node: _node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                                        }}
                                    >
                                        {extractedData.full_transcription}
                                    </ReactMarkdown>
                                </div>
                            )}

                            {/* Raw Debug Text */}
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

                        <div className="flex flex-wrap justify-end gap-4 mt-8">
                            <button 
                                onClick={() => { setExtractedData(null); setRawText(null); setShowRaw(false); }}
                                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-sm"
                            >
                                Upload Another Document
                            </button>
                            <a 
                                href={`/support-plan-form?userid=${userId}&client_type=${clientType}`}
                                className="px-6 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all font-bold text-sm shadow-md flex items-center gap-2"
                            >
                                <IconRobot size={18} />
                                Open Support Plan (AI Autofill)
                            </a>
                            <a 
                                href={`/support-care-plan-form?userid=${userId}&client_type=${clientType}`}
                                className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-bold text-sm shadow-md flex items-center gap-2"
                            >
                                <IconRobot size={18} />
                                Open Support Care Plan (AI Autofill)
                            </a>
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
