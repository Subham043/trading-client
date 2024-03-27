import { useContext } from "react";
import { UserContext } from "../contexts/userProvider";

export const useUser = () => useContext(UserContext);