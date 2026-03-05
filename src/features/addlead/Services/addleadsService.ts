import api from '@/shared/lib/apiClient';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_URL = "https://lm-crm.designvault.info/api/";
const SECRET_KEY = "RPhNkT1eXouaSYfbWRDhfyiGK7Ryap6wABenCPXN08T1tcUiNWc467d0IAQRgHPsZx81HiJQZX3/PkSKb2HzRbEd1R4by+NdnmLk+pdEbh4=";

export interface LoanAmountOption { label: string; value: string; }

const encrypt = (data: any) => {
  const auth = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  return { Enc_Str: auth };
};

const decrypt = (encryptedData: any) => {
  if (typeof encryptedData !== 'string') return encryptedData;
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const addLeadsService = {
  // 1. Core Config & Data APIs
  getStates: async () => decrypt((await axios.post(`${API_URL}LMSSearchWEB/GetStateList`, {})).data),
  getLanguages: async () => decrypt((await axios.post(`${API_URL}LMSGeneralWEB/getpreferredlanguages`, {})).data),
  getIp: async () => (await axios.get("https://api.ipify.org?format=json")).data.ip,

  // 2. Search & Auto-Fill (SSN Check)
  checkSSN: async (ssn: string) => {
    const payload = encrypt({ SSN: ssn.replace(/-/g, "") });
    return decrypt((await axios.post(`${API_URL}LMSDashboardWEB/CheckSSN`, payload)).data);
  },

  // 3. Dynamic Geo-Location
  getCities: async (state: string) => (await axios.get(`${API_URL}getCitylist?state=${state}`)).data,
  getZips: async (city: string) => (await axios.get(`${API_URL}getZipCode?city=${city}`)).data,

  // 4. Banking & Underwriting Logic
  getCampaign: async (loanType: string, isAutoTitle: string) => {
    const payload = encrypt({ Type: loanType, isAutoTitle, LeadFrom: "Add", LoanID: 0 });
    return decrypt((await axios.post(`${API_URL}LMSSearchWEB/GetCampaignDetailsForInternalLeads`, payload)).data);
  },
  checkHoliday: async (date: string) => {
    const payload = encrypt({ Paydate: date });
    return decrypt((await axios.post(`${API_URL}LMSGeneral/checkholiday`, payload)).data);
  },

  // 5. Vehicle & Collateral Decoders
  getVinInfo: async (vin: string) => (await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`)).data,

  // 6. Documents & Files
  uploadFile: async (file: File, path: string, type: string) => {
    const formData = new FormData();
    formData.append("document", file, path + type + "_" + file.name);
    return axios.post(`${API_URL}LMSGeneral/checkUpload`, formData);
  },

  // 7. Final Submission
  postLead: async (xmlData: string): Promise<any> => {
    const response = await api.post(
      `/api/LMLeads/v1/PostLead`,
      xmlData,
      {
        headers: {
          "Content-Type": "application/xml",
        },
      }
    );
    return response.data;
  },
  checkAutoEmail: async () => decrypt((await axios.post(`${API_URL}GetIsAutoEmailTypeActive`, { type: 'IBVPending' })).data),

  getLoanAmountOptions: (instance?: string): LoanAmountOption[] => {
    if (instance === 'CBL') return [{ label: "150.00", value: "150" }, { label: "200.00", value: "200" }];
    const array = [];
    for (let i = 100; i <= 5000; i += 100) array.push({ label: `${i}.00`, value: i.toString() });
    return array;
  }
};


export const getCampaignType = (loanType: string) => {
  switch (loanType) {
    case "Auto Title":
      return "A";
    case "Line of Credit":
      return "L";
    case "Installment":
      return "I";
    case "Pay Day":
      return "P";
    case "CAB/CSO":
      return "C";
    default:
      return "I"; // safe fallback
  }
};
