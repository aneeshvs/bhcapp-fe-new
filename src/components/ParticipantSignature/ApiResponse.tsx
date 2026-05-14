export interface ParticipantSignature {
    form_status: string;
    submit_final: number;
    staff_id: number;
    uuid: string;
    completion_percentage: number;
    client_name: string;
    participant_name: string;
    creation_date: string;
    participant_signature?: string; // Can be binary data URL or base64 string
    date_signed?: string;
    verbal_consent?: {
        verbal_consent_staff_name?: string;
        verbal_consent_staff_position?: string;
        verbal_consent_staff_signature?: string;
        verbal_consent_date?: string;
        verbal_consent_notes?: string;
    };
   
}