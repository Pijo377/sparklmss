export class Config {
    static instanceTitle = "Lend Me"; 
    static instancename = "LVTL"; // or 'CBL'
   static host = "/api_proxy/"; 
    
    // This must match getcurrentUSer() from your JS file
    static authHeader = "sparklms"; 
    static defaultStoreId = "89";

    static setLoggedInToken(token: string, userInfo: any, sessionId: string) {
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("UserInfo", JSON.stringify(userInfo));
        sessionStorage.setItem("SessionID", sessionId);
    }

    static setStoreInfo(info: string) {
        sessionStorage.setItem("Storeinfo", info);
    }
}