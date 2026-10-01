import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";


export function userLogin(payload: { email: string; password: string }) {
  return apiClient("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function userLogout() {
  return apiClient("/auth/logout", {
    method: "POST",
  });

};

export function getMe() {
 return apiClient("/auth/me");

};

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
   
  });
}


export function googleOAuth(payload: { idToken: string }) {
  return apiClient("/auth/google", { method: "POST", body: payload });
};