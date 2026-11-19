export interface HousingSilSupportData {
  uuid?: string;
  user_id?: string;
  client_type?: string;
  form_status?: string;
  completion_percentage?: number;
  signature_type?: string;
  paper_signed?: number | string;
  
  housing_separate?: string;
  change_sil_without_losing_home?: string;
  tenancy_separate?: string;
  explained_to_me?: string;
  
  participant_name?: string;
  date?: string;
  support_person?: string;
  participant_signature?: string;

  signer_type?: string;
  participant_date?: string;
  representative_name?: string;
  representative_relation?: string;
  representative_date?: string;
  representative_signature?: string;
  guardian_nominee_name?: string;
  guardian_nominee_date?: string;
  guardian_nominee_signature?: string;
  key_team_member_name?: string;
  key_team_member_date?: string;
  key_team_member_signature?: string;

  verbal_staff_name?: string;
  verbal_staff_position?: string;
  verbal_staff_signature?: string;
  verbal_date?: string;
  other_notes?: string;

  submit_final?: number;
}
