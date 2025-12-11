import { ScheduleOfSupportsFormData } from "./ApiResponse";

export function mapApiResponseToFormData(responseData: ScheduleOfSupportsFormData) {
    return {
        form_status: responseData.form_status || '',
        submit_final: responseData.submit_final ?? 0,
        sil_section_flag: responseData.sil_section_flag ?? 0,
        participant_name: responseData?.participant_name,
        creation_date: responseData?.creation_date,
        funding_review_date: responseData?.funding_review_date,
        support_on_public_holiday: responseData?.support_on_public_holiday,

        participant_signature: responseData.agreement_signature?.participant_signature || "",
        agreement_participant_name: responseData.agreement_signature?.agreement_participant_name || "",
        participant_date: responseData.agreement_signature?.participant_date || "",
        representative_signature: responseData.agreement_signature?.representative_signature || "",
        representative_name: responseData.agreement_signature?.representative_name || "",
        representative_date: responseData.agreement_signature?.representative_date || "",


    };
}