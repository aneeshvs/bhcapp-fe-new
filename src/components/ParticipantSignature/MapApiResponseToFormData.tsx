import {ParticipantSignature} from "./ApiResponse";

export function mapApiResponseToFormData(responseData: ParticipantSignature) {
    return {
        participant_signature: responseData?.participant_signature,
        date_signed: responseData?.date_signed,
        submit_final: responseData?.submit_final,
        form_status: responseData?.form_status,

        verbal_consent_staff_name: responseData.verbal_consent?.verbal_consent_staff_name || "",
        verbal_consent_staff_position: responseData.verbal_consent?.verbal_consent_staff_position || "",
        verbal_consent_staff_signature: responseData.verbal_consent?.verbal_consent_staff_signature || "",
        verbal_consent_date: responseData.verbal_consent?.verbal_consent_date || "",
        verbal_consent_notes: responseData.verbal_consent?.verbal_consent_notes || "",

    };
}
