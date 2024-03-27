import { FC } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { page_routes } from "../../utils/page_routes";
import { useUser } from "../../hooks/useUser";

/*
  * Layout to redirect the user to main screen if logged in else display auth or unprotected screen
*/
const GuestLayout:FC = () => {
    const { isAuthenticated } = useUser();

    return (
        !isAuthenticated
        ? <Outlet />
        : <Navigate to={page_routes.dashboard} />
    )
}

export default GuestLayout