import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/auth/login"
import { page_routes } from "./utils/page_routes"
import ForgotPasswordPage from "./pages/auth/forgot_password";
import AuthLayout from "./layouts/auth";
import ResetPasswordPage from "./pages/auth/reset_password";
import DashboardLayout from "./layouts/dashboard";
import DashboardPage from "./pages/dashboard";
import { Suspense } from "react";
import PageLoader from "./components/PageLoader";
import PageNotFound from "./pages/pageNotFound";
import UserProvider from "./contexts/userProvider";
import AxiosProvider from "./contexts/axiosProvider";
import PersistLayout from "./layouts/persist/persistLayout";
import ProtectedLayout from "./layouts/protected/protectedLayout";
import GuestLayout from "./layouts/guest/guestLayout";
import UsersPage from "./pages/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QueryClientOptions } from "./utils/constant";

// Create a client
const queryClient = new QueryClient(QueryClientOptions);

function App() {

  return (
    <>
      <UserProvider>
        <BrowserRouter basename={page_routes.dashboard}>
          <AxiosProvider>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route element={<PersistLayout />}>
                  <Route element={<ProtectedLayout />}>
                    <Route element={<DashboardLayout />}>
                      <Route path={page_routes.dashboard} element={<DashboardPage />} />
                      <Route path={page_routes.users} element={<UsersPage />} />
                    </Route>
                  </Route>

                  <Route element={<GuestLayout />}>
                    <Route element={<AuthLayout />}>
                      <Route path={page_routes.auth.login} element={<LoginPage />} /> {/* 👈 Renders Login Screen at /login */}
                      <Route path={page_routes.auth.forgot_password} element={<ForgotPasswordPage />} /> {/* 👈 Renders Login Screen at /login */}
                      <Route path={page_routes.auth.reset_password} element={<ResetPasswordPage />} /> {/* 👈 Renders Login Screen at /login */}
                    </Route>
                  </Route>
                </Route>
                
                <Route element={<Suspense fallback={<PageLoader />}>
                    <Outlet />  
                  </Suspense>}>
                  <Route path="*" element={<PageNotFound />} /> {/* 👈 Renders Page Not Found Screen */}
                </Route>
              </Routes>
            </QueryClientProvider>
          </AxiosProvider>
        </BrowserRouter>
      </UserProvider>
    </>
  )
}

export default App
