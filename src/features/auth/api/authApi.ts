// Auth API types and functions

export interface LoginResponse {
  id: string;
  email: string;
  name: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Add your auth API functions here
export const login = async (): Promise<LoginResponse> => {
  // Implement your login logic
  throw new Error("Login not implemented");
};

export const logout = async (): Promise<void> => {
  // Implement your logout logic
  throw new Error("Logout not implemented");
};
