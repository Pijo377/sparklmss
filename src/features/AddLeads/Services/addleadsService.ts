import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Config } from '@/features/AddLeads/config/config';
//const API_URL = "https://lm-crm.designvault.info/api/";
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
const getHeaders = () => {
    const userInfoStr = sessionStorage.getItem("UserInfo");
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

    return {
        'Content-Type': 'application/json',
        'authorization': 'sparklms', // Must be lowercase 'a' in header key
        'UserId': userInfo?.UserId || '', // Match casing from Angular new service
        'SessionID': userInfo?.SessionID || ''
    };
};

export const addLeadsService = {
  // 1. Core Config & Data APIs
  getStates: async () => {
        const response = await axios.post(
            `${Config.host}api/getstatelist`, 
            {}, 
            { headers: getHeaders() }
        );
        // Angular New code: res.res.NewDataSet.Table
        return response.data;
    },

    // 2. Get Languages (New Path: api/getpreferredlanguages)
    getLanguages: async () => {
    const userInfo = JSON.parse(sessionStorage.getItem("UserInfo") || '{}');
    
    const headers = {
        'Content-Type': 'application/json',
        'authorization': 'sparklms',
        'UserId': userInfo.UserId || '',
        'SessionID': userInfo.SessionID || ''
    };

    // New Path: api/getpreferredlanguages
    const response = await axios.post(
        `${Config.host}api/getpreferredlanguages`, 
        {}, 
        { headers: headers }
    );

    // Angular logic checks res.res.NewDataSet.Table
    return response.data;
  },


    // 3. Check SSN (New Path: LMSGeneral/CheckSSN)
    checkSSN: async (ssn: string) => {
    const userInfo = JSON.parse(sessionStorage.getItem("UserInfo") || '{}');
    const headers = {
        'Content-Type': 'application/json',
        'authorization': 'sparklms',
        'UserId': userInfo.UserId || '',
        'SessionID': userInfo.SessionID || ''
    };

    // Clean the SSN exactly like Angular: ssn.replace(/-/g, "")
    const payload = { SSN: ssn.replace(/-/g, "") };

    const response = await axios.post(
        `${Config.host}LMSGeneral/CheckSSN`, 
        payload, 
        { headers }
    );
    return response.data;
  },

    // 4. Cities & Zips
   getCities: async (stateName: string) => {
    const userInfo = JSON.parse(sessionStorage.getItem("UserInfo") || '{}');
    
    // Exact mapping from your new Angular UserService.ts
    const payload = {
        cookie: userInfo.SessionID || '', // From login response
        contextKey: stateName,            // Full State Name (e.g. "Alabama")
        prefixText: ""
    };

    const response = await axios.post(
        `${Config.host}api/getCityInfo/`, // Matches Config.hosturl + getCityInfo/
        payload, 
        { headers: getHeaders() }
    );

    // Returns res.res.string which is an array of strings ["City1", "City2"]
    return response.data.res?.string || [];
  },

  getZips: async (query: string) => {
    const userInfo = JSON.parse(sessionStorage.getItem("UserInfo") || '{}');
    
    const headers = {
        'Content-Type': 'application/json',
        'authorization': 'sparklms',
        'UserId': userInfo.UserId || '',
        'SessionID': userInfo.SessionID || ''
    };

    const payload = {
        cookie: userInfo.SessionID || '', // Angular: let cookie = Config.getAuthSessionID()
        contextKey: query,                // Angular: "StateName,CityName"
        prefixText: ""
    };

    // Use the exact endpoint from your new Angular code: getzipInfo/
    const response = await axios.post(
        `${Config.host}api/getzipInfo/`, 
        payload, 
        { headers }
    );

    // Return the array of strings from res.res.string
    const data = response.data.res?.string || [];
    return Array.isArray(data) ? data : [data];
  }
,
  getIp: async () => {
    try {
      // Standard GET request to the public IP service
      const response = await axios.get("https://api.ipify.org?format=json");
      console.log("Public IP Fetched:", response.data.ip);
      return response.data.ip;
    } catch (e) {
      console.error("Failed to fetch IP address", e);
      return "127.0.0.1"; // Fallback IP
    }
  },

  // 3. Dynamic Geo-Location
 // getCities: async (state: string) => (await axios.get(`${API_URL}getCitylist?state=${state}`)).data,
  //getZips: async (city: string) => (await axios.get(`${API_URL}getZipCode?city=${city}`)).data,

  // 4. Banking & Underwriting Logic
  getCampaignConfig: async (payload: any) => {
        const userInfo = JSON.parse(sessionStorage.getItem("UserInfo") || '{}');
        const headers = {
            'Content-Type': 'application/json',
            'authorization': 'sparklms',
            'UserId': userInfo.UserId || '',
            'SessionID': userInfo.SessionID || ''
        };

        // Angular endpoint: LMSGeneral/spGetInsertLeadsconfig
        const response = await axios.post(
            `${Config.host}LMSGeneral/spGetInsertLeadsconfig`, 
            payload, 
            { headers }
        );
        return response.data;
    },
  checkHoliday: async (date: string) => {
    const payload = encrypt({ Paydate: date });
    return decrypt((await axios.post(`${Config.host}api/LMSGeneral/checkholiday`, payload)).data);
  },

  // 5. Vehicle & Collateral Decoders
   getVinInfo: async (vin: string) => {
    // Public API - No security headers needed
    const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`);
    return response.data.Results[0]; // Returns the first vehicle result
  },
  uploadLeadDocument: async (formData: FormData) => {
    const userInfoStr = sessionStorage.getItem("UserInfo");
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

    const headers = {
      'authorization': 'sparklms',
      'UserId': userInfo?.UserId || '',
      'SessionID': userInfo?.SessionID || '',
      // Note: Do NOT set 'Content-Type': 'multipart/form-data' manually.
      // Axios and the browser will automatically set the boundary for you.
    };

    // Angular Endpoint: LMSGeneral/checkUpload
    // We use Config.host to ensure it goes through the Vite Proxy
    const response = await axios.post(
      `${Config.host}LMSGeneral/checkUpload`, 
      formData, 
      { headers }
    );
    
    return response.data;
  },
  // 7. Final Submission
   postLead: async (leadsData: any) => {
    const userInfo = JSON.parse(sessionStorage.getItem("UserInfo") || '{}');
    const headers = {
        'Content-Type': 'application/json',
        'authorization': 'sparklms', 
        'UserId': userInfo?.UserId || '', 
        'SessionID': userInfo?.SessionID || ''
    };

    // FIX: Removed hardcoded https:// and /api/ to use the Vite Proxy
    const url = `${Config.host}LMSGeneral/postLead`;

    const response = await axios.post(url, leadsData, { headers });
    return response.data;
  },  checkAutoEmailStatus: async (type: string) => {
    const userInfo = JSON.parse(sessionStorage.getItem("UserInfo") || '{}');
    const headers = {
        'Content-Type': 'application/json',
        'authorization': 'sparklms',
        'UserId': userInfo.UserId || '',
        'SessionID': userInfo.SessionID || ''
    };

    // Path: LMSTransaction/GetIsAutoEmailTypeActive (No /api/ as per Angular Service)
    const response = await axios.post(
        `${Config.host}LMSTransaction/GetIsAutoEmailTypeActive`, 
        { AutoMailType: type, LeadStatusID: 0 }, 
        { headers }
    );
    return response.data;
  },

  // 2. Sends the actual email template to the customer
  sendLeadEmail: async (emailData: any) => {
    const userInfo = JSON.parse(sessionStorage.getItem("UserInfo") || '{}');
    const headers = {
        'Content-Type': 'application/json',
        'authorization': 'sparklms',
        'UserId': userInfo.UserId || '',
        'SessionID': userInfo.SessionID || ''
    };

    // Path: api/sendMailToCustomer (Uses /api/ as per standard SearchService)
    const response = await axios.post(
        `${Config.host}api/sendMailToCustomer`, 
        emailData, 
        { headers }
    );
    return response.data;
  },
  getLoanAmountOptions: (instance?: string): LoanAmountOption[] => {
    if (instance === 'CBL') return [{ label: "150.00", value: "150" }, { label: "200.00", value: "200" }];
    const array = [];
    for (let i = 100; i <= 5000; i += 100) array.push({ label: `${i}.00`, value: i.toString() });
    return array;
  }
};