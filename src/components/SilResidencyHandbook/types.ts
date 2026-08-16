export interface SilResidencyHandbookData {
  uuid?: string;
  user_id?: string | number;
  client_type?: string;
  support_provider?: string;
  tenancy_contact?: string;
  after_hours_support?: string;
  local_advocacy_contact?: string;
  acknowledgement?: string;
  signing_as?: string; // 'Participant' | 'Representative'
  participant_name?: string;
  relation_to_participant?: string;
  date?: string;
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

  submit_final?: number;
  completion_percentage?: number;
}
