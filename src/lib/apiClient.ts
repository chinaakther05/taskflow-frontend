//import { ofetch } from "ofetch";
//
//const BASE_URL = process.env.NEXT_PUBLIC_API_URL
//
//const apiClient = ofetch.create({
//    baseURL: BASE_URL,
//    credentials: "include"
//});
//
//export default apiClient;


import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",

  onRequest({ options }) {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${token}`);
      options.headers = headers;
    }
  },
});

export default apiClient;





