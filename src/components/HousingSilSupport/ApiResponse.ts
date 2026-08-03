import { HousingSilSupportData } from "./types";

export interface HousingSilSupportResponse extends HousingSilSupportData {
  housingSilSupport?: {
    uuid?: string;
  };
}

