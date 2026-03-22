import type { LoginCredentials, RegisterCredentials, ApiResponse} from "../models/models";
import { apiFetch } from "./api";
import { postAccessKey } from "./cookies";

export const login = async (
  c: LoginCredentials, 
  setLoading: (status: boolean) => void
): Promise<ApiResponse> => {

  try {
    setLoading(true)
    const result = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(c),
    });
    
    if (!result.status) {
      throw new Error(result.message)
    }

    const data = result.data
    const expires = new Date(result.data.expiresAt);
    postAccessKey(data.accessToken, expires)
    
    setLoading(false)
    return {status: true, data: result.data, message: result.message}
  } catch (error) {
    return {status: false, data: null, message: String(error)}
  }}
  
  
export const loginWithGoogle = async (
  setLoading: (status: boolean) => void
): Promise<ApiResponse> => {
  try {
    setLoading(true)
    const result = await apiFetch("/auth/google", {
      method: "POST",
    });
    
    if (!result.status) {
      throw new Error(result.message)
    }

    setLoading(false)
    return {status: true, data: result.data, message: result.message}
  } catch (error) {
    return {status: false, data: null, message: String(error)}
  }
};

export const register = async (
  c: RegisterCredentials ,
  setLoading: (status: boolean) => void 
): Promise<ApiResponse> => {
  try {
    setLoading(true)
    const result = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(c),
    });
    
    if (!result.status) {
      throw new Error(result.message)
    }

    setLoading(false)
    return {status: true, data: result.data, message: result.message}
  } catch (error) {
    return {status: false, data: null, message: String(error)}
  }
};