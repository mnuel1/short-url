import type { ApiResponse } from "../models/models";
import { apiFetch } from "./api";
import { getAccessKey } from "./cookies";

// Define error codes as string literal union
export type GetMeError = "NO_TOKEN" | "SERVER_ERROR";

export const getMe = async (
  setLoading: (status: boolean) => void
): Promise<ApiResponse | { status: false; data: GetMeError; message: string }> => {
  try {
    setLoading(true);
    const token = getAccessKey();

    if (!token) {
      // no token found
      return { status: false, data: "NO_TOKEN", message: "No token found" };
    }

    const result = await apiFetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!result.status) {
      // server or backend returned error
      return { status: false, data: "SERVER_ERROR", message: result.message };
    }

    setLoading(false);
    return { status: true, data: result.data, message: result.message };
  } catch (error) {
    setLoading(false);
    // Catch unexpected errors
    return { status: false, data: "SERVER_ERROR", message: String(error) };
  }
};