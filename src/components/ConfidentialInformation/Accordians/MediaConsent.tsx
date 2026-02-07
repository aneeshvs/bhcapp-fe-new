"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface MediaConsentProps {
    formData: {
        media_permission?: boolean;
        media_option_on_occasion?: boolean;
        media_permission_denied?: boolean;
        [key: string]: any;
    };
    handleChange: (
        event:
            | React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >
            | { target: { name: string; value: any } }
    ) => void;
    uuid?: string;
}

export default function MediaConsent({
    formData,
    handleChange,
    uuid,
}: MediaConsentProps) {
    const effectiveUuid = uuid || undefined;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedField, setSelectedField] = useState<string | null>(null);

    // Safe boolean conversion (handles "1", 1, true vs "0", 0, false)
    const getBool = (val: any) => val === true || val === "1" || val === 1;

    const handleCheckboxChange = (field: 'media_permission' | 'media_option_on_occasion' | 'media_permission_denied') => {
        // Just toggle the specific field. Do NOT uncheck others.
        const newValue = !getBool(formData[field]);

        handleChange({
            target: {
                name: field,
                value: newValue,
            },
        });
    };

    const handleViewLogs = (fieldName: string) => {
        setSelectedField(fieldName);
        setIsModalOpen(true);
    };

    return (
        <div className="mb-4 border border-gray-300 rounded shadow">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
                <h4 className="text-lg font-semibold mb-4 text-heading uppercase">
                    MEDIA CONSENT
                </h4>
                {effectiveUuid && (
                    <button
                        type="button"
                        onClick={() => handleViewLogs("all")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                    >
                        View Logs
                    </button>
                )}
            </div>
            <div className="p-4 bg-white">
                <div className="grid grid-cols-1 gap-6">
                    <div className="border-b pb-4">

                        <div className="mt-4 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
                            <div className="text-gray-700 space-y-3 w-full">
                                <p className="text-gray-600 mb-4">
                                    <b>MEDIA CONSENT</b>
                                </p>
                                <p>
                                    I understand that Best of Homecare is seeking my consent to utilise my image to use and retain images/ videos for advertising purposes including, Best of Homecare’s website, social media (Facebook, Instagram, Twitter, YouTube) and printed advertising material.
                                </p>
                                <p>
                                    I understand that my image will also be used on the BHC app.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 ml-6">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    checked={getBool(formData.media_permission)}
                                    onChange={() => handleCheckboxChange('media_permission')}
                                />
                                <span>I give permission to use my images as stated above</span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    checked={getBool(formData.media_option_on_occasion)}
                                    onChange={() => handleCheckboxChange('media_option_on_occasion')}
                                />
                                <span>I would like to be provided with the option of whether I give my permission on each and every occasion.</span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    checked={getBool(formData.media_permission_denied)}
                                    onChange={() => handleCheckboxChange('media_permission_denied')}
                                />
                                <span>I don’t give my permission to use my images as stated above.</span>
                            </label>
                        </div>

                        <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
                            <div className="text-gray-700 space-y-3 w-full">
                                <p>
                                    I understand that I may withdraw this consent at any time by advising Best of Homecare and my photo/video will be removed or destroyed at this time.
                                </p>
                                <p>
                                    I understand that by giving consent, Best of Homecare can use the image/ recordings to promote their activities. Best of Homecare may reproduce the image or video in any form, in whole or part and distribute by any medium including printed material, internet or multimedia.
                                </p>
                                <p>
                                    I understand that Best of Homecare:
                                </p>
                                <ul className="list-disc ml-6">
                                    <li>Will not pay me for giving consent or for the use of this image or recording.</li>
                                    <li>Will return or destroy images or recordings if I withdraw my consent.</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <FieldLogsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                uuid={effectiveUuid ?? ""}
                table="confidential_media_consent"
                field={selectedField}
                url="confidential-form/logs"
            />
        </div>
    );
}
