export interface SilStaScheduleOfSupport {
    id?: number;
    sil_sta_service_agreement_id?: number;
    support_services: string;
    ndis_funded_support: string;
    how_support_provided: string;
    non_funded_support: string;
    travel: string;
    program_of_supports: string;
    support_times: string;
    total: string;
}

export interface SilStaServiceAgreementData {
    uuid: string;
    user_id: string;
    client_type: string;
    form_status?: string;
    submit_final?: number;

    ndis_plan_start_date: string;
    ndis_plan_end_date: string;
    service_agreement_start_date: string;
    service_agreement_end_date: string;

    client_name: string;
    client_address: string;
    client_email: string;
    client_phone: string;
    client_ndis_number: string;
    client_funding_type: string;

    rep_name: string;
    rep_address: string;
    rep_legal_authority: string;
    rep_email: string;
    rep_phone: string;

    board_and_lodging_contributions: string;
    payment_terms: string;

    provider_signature_name: string;
    provider_signature: string;
    provider_signature_date: string;

    client_signature_name: string;
    client_signature: string;
    client_signature_date: string;

    witness_name: string;
    witness_signature: string;
    witness_signature_date: string;

    schedule_of_supports: SilStaScheduleOfSupport[];
    parties?: {
        provider_name?: string;
        abn?: string;
        address?: string;
        email?: string;
        phone?: string;
    };
}

export interface SectionProps {
    formData: SilStaServiceAgreementData;
    handleChange: (e: any) => void;
    handleScheduleChange?: (index: number, field: keyof SilStaScheduleOfSupport, value: string) => void;
    addScheduleRow?: () => void;
    removeScheduleRow?: (index: number) => void;
    uuid?: string;
}
