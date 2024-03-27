import React, { createContext, useCallback, useState } from "react";
import { ChildrenType, UserType } from "../utils/types";

/*
  * User Context Type
*/
type UserContextType = {
    isAuthenticated: boolean;
    user: UserType | null;
    setUser: (data:UserType) => void;
    removeUser: () => void
}

/*
  * User Context Default Value
*/
const userDefaultValues: UserContextType = {
    isAuthenticated: false,
    user: null,
    setUser: () => {},
    removeUser: () => {}
};

/*
  * User Context
*/
export const UserContext = createContext<UserContextType>(userDefaultValues);

/*
  * User Provider
*/
const UserProvider: React.FC<ChildrenType> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);

  /*
   * Function for setting user state
   */
  const userHandler = useCallback((data: UserType) => {
    setUser(data);
    setIsAuthenticated(true);
  }, []);

  const removeUser = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <UserContext.Provider
      value={{ 
        user, 
        setUser:userHandler,
        isAuthenticated, 
        removeUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;