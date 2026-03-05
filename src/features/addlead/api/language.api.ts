import api from "@/shared/lib/apiClient";

export interface PreferredLanguage {
  _id: string;
  ID: number;
  LanguageName: string;
  LanguageCode: string;
}

export interface GetPreferredLanguagesResponse {
  Table: PreferredLanguage[];
}

export const getPreferredLanguages = async (): Promise<GetPreferredLanguagesResponse> => {
  const res = await api.get<GetPreferredLanguagesResponse>(
    "/api/LMGeneral/v1/GetPreferredLanguages"
  );

  return res.data;
};
