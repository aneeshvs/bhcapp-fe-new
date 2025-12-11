import {ServiceAgreementResponse} from "@/src/components/ServiceAgreement/ApiResponse";

export function mapApiResponseToFormData(responseData: ServiceAgreementResponse) {
  return {
    staff_id: responseData.staff_id,
    uuid: responseData.uuid,
    completion_percentage: responseData.completion_percentage,
    participant_name: responseData.participant_name,
    ndis_number: responseData.ndis_number,
    address: responseData.address,
    contact: responseData.contact,
    email: responseData.email,
    dob: responseData.dob,
    ndis_plan_start_date: responseData.ndis_plan_start_date,
    ndis_plan_end_date: responseData.ndis_plan_end_date,
    term_start_date: responseData.term_start_date,
    term_end_date: responseData.term_end_date,
    term_of_this_agreement: responseData.term_of_this_agreement,
    area_of_support: responseData.area_of_support,
    representative_name: responseData.representative_name,
    representative_relationship: responseData.representative_relationship,
    representative_contact: responseData.representative_contact,
    representative_email: responseData.representative_email,
    form_status: responseData.form_status || '',
    submit_final: responseData.submit_final ?? 0,


    accepted_name: responseData.consent?.accepted_name,
    accepted_position: responseData.consent?.accepted_position,
    accepted_signature: responseData.consent?.accepted_signature,
    accepted_date: responseData.consent?.accepted_date,
    consents_participant_name: responseData.consent?.consents_participant_name,
    participant_role: responseData.consent?.participant_role,
    participant_signature: responseData.consent?.participant_signature,
    participant_date: responseData.consent?.participant_date,
    witness_name: responseData.consent?.witness_name,
    witness_signature: responseData.consent?.witness_signature,
    witness_date: responseData.consent?.witness_date,
    verbal_staff_name: responseData.consent?.verbal_staff_name,
    verbal_staff_signature: responseData.consent?.verbal_staff_signature,
    verbal_staff_position: responseData.consent?.verbal_staff_position,
    verbal_date: responseData.consent?.verbal_date,
    other_notes: responseData.consent?.other_notes,
    received_signed_copy: responseData.consent?.received_signed_copy,
    agreed_verbally: responseData.consent?.agreed_verbally,
    cms_comments_entered: responseData.consent?.cms_comments_entered

    };
}