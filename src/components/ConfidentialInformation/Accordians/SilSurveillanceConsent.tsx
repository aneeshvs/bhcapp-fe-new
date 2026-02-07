import React from 'react';

const SilSurveillanceConsent = () => {
    return (
        <div className="mb-4 border border-gray-300 rounded shadow">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
                <h4 className="text-lg font-semibold mb-4 text-heading uppercase">
                    SIL SURVEILLANCE CONSENT (WHERE APPLICABLE)
                </h4>
            </div>
            <div className="p-4 bg-white">
                <div className="grid grid-cols-1 gap-6">
                    <div className="border-b pb-4">
                        <div className="mt-4 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
                            <div className="text-gray-700 space-y-3 w-full">
                                <p>
                                    Best of Homecare uses video surveillance in shared and common areas of our homes to support the safety and wellbeing of all participants. Surveillance is not used in private areas such as bedrooms or bathrooms.
                                </p>
                                <p>
                                    All video surveillance is conducted in accordance with Victorian legislation, including the Surveillance Devices Act 1999 (VIC) and the Privacy and Data Protection Act 2014 (VIC), as well as the Privacy Act 1988 (Cth) where applicable. Signage is displayed in areas under surveillance to ensure that all individuals entering the premises are aware that video monitoring is in operation.
                                </p>
                                <p>
                                    Participants may request access to any video recordings that include them. Requests can be made by speaking with a team member or the SIL Coordinator.
                                </p>
                                <p>
                                    Video recordings are retained for 30 days, unless the footage relates to an incident, complaint, or other reportable matter. In such cases, footage may be stored for up to seven years, consistent with NDIS and legislative record-keeping requirements.
                                </p>
                                <p>
                                    All footage is stored securely, is password protected, and can only be accessed by authorised management staff for the purposes of incident review, complaint investigation, or safety oversight.
                                </p>
                                <p>
                                    By signing the consent section below, you acknowledge and agree that Best of Homecare has discussed video surveillance and agree that BHC may use video surveillance in shared areas of the home and store footage in accordance with Victorian legislation and NDIS requirements.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SilSurveillanceConsent;
