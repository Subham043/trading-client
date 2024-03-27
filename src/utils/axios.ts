import axios, { AxiosInstance } from "axios";
import { env } from "./env";

/*
 * Main Axios Instance with base url
 */

const api: AxiosInstance = axios.create({
  baseURL: env.API_ENDPOINT,
  headers: {
    post: {
      Accept: "application/json",
    },
    get: {
      Accept: "application/json",
    },
  },
  withCredentials: true,
});

export default api;
