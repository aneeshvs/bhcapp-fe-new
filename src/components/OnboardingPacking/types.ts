interface OnboardingSuccess {
  success: true;
  data: {
    onboardingPackingSignoff: {
      uuid: string;
      id: number;
    };
  };
}

interface OnboardingError {
  success: false;
  data: Record<string, string>;
  message?: string;
  status?: number;
  alert?: boolean;
}

export interface AlternativeDecisionMakerFormData {
  type: string;
  first_name: string;
  surname: string;
  notes: string;
}


export type OnboardingSignoffResponse = OnboardingSuccess | OnboardingError;