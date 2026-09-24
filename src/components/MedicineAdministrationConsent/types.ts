export interface MedicineAdministrationConsentData {
    uuid: string;
    user_id: string;
    client_type: string;
    form_status?: string;
    completion_percentage?: number;
    signature_only?: number | boolean;
    submit_final?: number;

    participant_name: string;
    medication_support: boolean;
    medication_assistance: boolean;
    manage_medication_self: boolean;

    provider_signature_name: string;
    provider_signature: string;
    provider_signature_date: string;

    client_signer_type?: string;
    client_signature_name: string;
    representative_relation?: string;
    client_signature: string;
    client_signature_date: string;

    witness_name: string;
    witness_signature: string;
    witness_signature_date: string;
}

export interface SectionProps {
    formData: MedicineAdministrationConsentData;
    handleChange: (e: any) => void;
    uuid?: string;
}
