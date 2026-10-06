import apiClient from "@/lib/apiClient";

export function getMyOrganizations() {
  return apiClient("/organizations");
}