interface ConfidentialSuccess {
  success: true;
  data: {
    confidentialInformationForm: {
      uuid: string;
      id: number;
    };
  };
}

interface ConfidentialError {
  success: false;
  data: Record<string, string>;
  message?: string;
  status?: number;
  alert?: boolean;
}

export type ConfidentialResponse = ConfidentialSuccess | ConfidentialError;