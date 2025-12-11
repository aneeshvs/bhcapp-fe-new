

interface ParticipantSuccess {
  success: true;
  data: {
    participantSignature: {
      uuid: string;
      id: number;
    };
  };
}

interface ParticipantError {
  success: false;
  data: Record<string, string>;
  message?: string;
  status?: number;
  alert?: boolean;
}




export type ParticipantResponse = ParticipantSuccess | ParticipantError;