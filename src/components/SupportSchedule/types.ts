export interface ScheduleOfSupportsFormData {
    staff_id: number;
    uuid: string;
    completion_percentage: number;
    client_name: string;
    participant_name: string;
    creation_date: string;
    funding_review_date: string;
    support_on_public_holiday: number;
}

interface ScheduleSuccess {
  success: true;
  data: {
    scheduleOfSupport: {
      uuid: string;
      id: number;
    };
  };
}

interface ScheduleError {
  success: false;
  data: Record<string, string>;
  message?: string;
  status?: number;
  alert?: boolean;
}


export interface FundedSupportsFormData {
  support_name: string;
  description: string;
  price: number | null;
  payment_information: string;
  invoicing_details: string;
  delivery_details: string;
  grand_total: number | null;
}

export interface UnfundedSupportsFormData {
  unfunded_support_name: string;
  unfunded_description: string;
  unfunded_price_information: string;
  unfunded_delivery_details: string;
  unfunded_price: number | null;
  unfunded_grand_total: number | null;
}

export interface AgreementSignatures {
  participant_signature?: string; // base64 string
  agreement_participant_name?: string;
  participant_date?: string;
  representative_signature?: string; // base64 string
  representative_name?: string;
  representative_date?: string;
}

export type ScheduleResponse = ScheduleSuccess | ScheduleError;