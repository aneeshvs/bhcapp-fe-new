export interface ConfidentialInformation {
  form_status: string;
  submit_final: number;
  staff_id: number;
  uuid: string;
  completion_percentage: number;
  client_name: string;
  participant_name?: string;
  address?: string;
  post_code?: string;
  date_of_birth?: string;
  phone?: string;
  email?: string;
  mobile_no?: string;
  agencies?: ConfidentialAgency[];
  consent?: ConfidentialConsent;
  verbal?: VerbalConsent;
  pre_consent_disclosure?: PreConsentDisclosure;
  media_consent?: MediaConsent;
}

export interface MediaConsent {
  id?: number;
  confidential_information_form_id?: number;
  permission?: number | boolean;
  option_on_occasion?: number | boolean;
  permission_denied?: number | boolean;
}

export interface ConfidentialAgency {
  name?: string;
  role?: string;
  contact?: string;
  agency_name?: string;
  service_type?: string;
  information_shared?: string;
  goal_key?: string;
}


interface ConfidentialConsent {
  signature?: string; // Can be file path or base64 string
  signed_date?: string;
  signed_by?: string;
  name?: string;
  witnessed_by?: string;
}

interface VerbalConsent {
  verbal_signature?: string; // Can be file path or base64 string
  verbal_signed_date?: string;
  verbal_name?: string;
  position?: string;
}

interface PreConsentDisclosure {
  explain_collection_storage?: number;
  discuss_referral_services?: number;
  explain_release_agreement?: number;
  explain_share_without_consent?: number;
  provide_privacy_information?: number;
}