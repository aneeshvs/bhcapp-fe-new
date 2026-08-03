import { HousingSilSupportData } from "./types";

export interface HousingSilSupportResponse {
  success: boolean;
  message?: string;
  data: HousingSilSupportData;
}
