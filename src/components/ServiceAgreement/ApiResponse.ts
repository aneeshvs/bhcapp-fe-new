export interface ServiceAgreementResponse {
    form_status: string;
    submit_final: number;
    staff_id: number;
    uuid: string;
    completion_percentage: number;
    participant_name: string;
    ndis_number: string;
    address: string;
    contact: string;
    email: string;
    dob: string;
    ndis_plan_start_date: string;
    ndis_plan_end_date: string;
    term_start_date: string;
    term_end_date: string;
    term_of_this_agreement: string;
    area_of_support: string;
    representative_name: string;
    representative_relationship: string;
    representative_contact: string;
    representative_email: string; 
    consent: ServiceAgreementConsent;
     
} 

export interface ServiceAgreementConsent {
    accepted_name: string;
    accepted_position: string;
    accepted_signature: string;
    accepted_date: string;
    consents_participant_name: string;
    participant_role: string;
    participant_signature: string;
    participant_date: string;
    witness_name: string;
    witness_signature: string;
    witness_date: string;
    verbal_staff_name: string;
    verbal_staff_signature: string;
    verbal_staff_position: string;
    verbal_date: string;
    other_notes: string;
    received_signed_copy: string;
    agreed_verbally: string;
    cms_comments_entered: string;
}
