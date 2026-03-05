// addLeadsService.ts
import axios from "axios";

export const addLeadsService = {
  async getVinInfo(vin: string) {
    if (!vin || vin.length !== 17) {
      console.warn("VIN must be 17 characters");
      return;
    }

    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`;

    const response = await axios.get(url);
    return response.data;
  },
};
