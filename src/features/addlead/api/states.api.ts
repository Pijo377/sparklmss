import api from "@/shared/lib/apiClient";

export interface State {
  StateID: number;
  StateShortCode: string;
  StateName: string;
}

export interface LoadStatesResponse {
  Table: State[];
}


export const loadStates = async (): Promise<LoadStatesResponse> => {
  const res = await api.get<LoadStatesResponse>(
    "/api/LMGeneral/v1/LoadStates"
  );

  return res.data; // 👈 Table: State[]
};
