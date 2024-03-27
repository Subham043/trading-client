import { FC, Suspense, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { api_routes } from "../../utils/api_routes";
import { UserType } from "../../utils/types";
import PageLoader from "../../components/PageLoader";
import { useUser } from "../../hooks/useUser";
import { useAxios } from "../../hooks/useAxios";

/*
  * Layout that checks auth token is valid or not. if valid then persist user data or token else invalidate existing auth token
*/
const PersistLayout:FC = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const { setUser, removeUser } = useUser();
    const { axios } = useAxios();

    
    useEffect(() => {
        
        let isMounted = true;
        const checkUserAuthenticated = async () => {
            try {
                const response = await axios.get<{data:UserType}>(api_routes.account.profile);
                setUser(response.data.data);
            } catch (error) {
                removeUser();
            } finally {
                isMounted && setLoading(false)
            }
        }
        
        isMounted ? checkUserAuthenticated() : setLoading(false)

        return () => {isMounted = false; checkUserAuthenticated()};

    }, [setUser, removeUser, axios])
    
    return (
        <>
            {
                loading ? <PageLoader /> : <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
            }
        </>
    )
}

export default PersistLayout