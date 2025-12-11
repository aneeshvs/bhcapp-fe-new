export interface ScheduleOfSupportsFormData {
  form_status: string;
  submit_final: number;
  sil_section_flag: number;
  staff_id: number;
  uuid: string;
  completion_percentage: number;
  client_name: string;
  participant_name: string;
  creation_date: string;
  funding_review_date: string;
  support_on_public_holiday: number;
  transport: FundedSupportsFormData[];
  unfunded_support: UnfundedSupportsFormData[];
  agreement_signature: AgreementSignatures;
}


export interface FundedSupportsFormData {
  id?: number;
  schedule_of_support_id?: number;
  support_name?: string;
  description?: string;
  price?: number | null;
  unit?: number | null;
  payment_information?: string;
  invoicing_details?: string;
  delivery_details?: string;
  grand_total?: number | null;
  goal_key?: string;
  status_id?: number;
  owner_id?: number | null;
  owner_type?: string | null;
  created_at?: string;
  deleted_at?: string | null;
  updated_at?: string;
  uuid?: string;
}

export interface UnfundedSupportsFormData {
  id?: number;
  schedule_of_support_id?: number;
  unfunded_support_name?: string;
  unfunded_description?: string;
  unfunded_price_information?: string;
  unfunded_unit?: number | null;
  unfunded_delivery_details?: string;
  unfunded_price?: number | null;
  unfunded_grand_total?: number | null;
  goal_key?: string;
  status_id?: number;
  owner_id?: number | null;
  owner_type?: string | null;
  created_at?: string;
  deleted_at?: string | null;
  updated_at?: string;
  uuid?: string;
}

interface AgreementSignatures {
  participant_signature?: string; // base64 string
  agreement_participant_name?: string;
  participant_date?: string;
  representative_signature?: string; // base64 string
  representative_name?: string;
  representative_date?: string;
}