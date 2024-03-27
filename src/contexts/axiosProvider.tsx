import React, { createContext, useEffect } from "react";
import { AxiosInstance } from "axios";
// import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { ChildrenType } from "../utils/types";
import { useUser } from "../hooks/useUser";
// import { page_routes } from "../utils/page_routes";

/*
  * Axios Context Type
*/
type AxiosContextType = {
    axios: AxiosInstance;
}

/*
  * Axios Context Default Value
*/
const axiosDefaultValues: AxiosContextType = {
  axios: api
};

/*
  * Axios Context
*/
export const AxiosContext = createContext<AxiosContextType>(axiosDefaultValues);

/*
  * Axios Provider
*/
const AxiosProvider: React.FC<ChildrenType> = ({ children }) => {
  const {user, isAuthenticated, removeUser} = useUser();
  // const navigate = useNavigate();
  

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      config => {
          if(!config.headers['authorization'] && user!==null){
            config.headers['authorization'] = `Bearer ${user.access_token}`;
          }
          return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
        response => response,
        async (error) => {
          if(error?.response?.status === 401){
            removeUser();
          }
          // if(error?.response?.status === 403){
          //   navigate(page_routes.insufficientPermission, {replace: true});
          // }
          return Promise.reject(error);
        }
    );

    return () => {
        api.interceptors.request.eject(requestInterceptor);
        api.interceptors.response.eject(responseInterceptor);
    }
  }, [isAuthenticated, removeUser, user])

  return (
    <AxiosContext.Provider
      value={{ axios: api }}
    >
      {children}
    </AxiosContext.Provider>
  );
};

export default AxiosProvider;