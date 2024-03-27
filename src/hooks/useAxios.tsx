import { useContext } from "react";
import { AxiosContext } from "../contexts/axiosProvider";

export const useAxios = () => useContext(AxiosContext);