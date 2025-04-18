import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import { page_routes } from "./utils/page_routes"
import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QueryClientOptions } from "./utils/constant";
import UserProvider from "./contexts/userProvider";
import AxiosProvider from "./contexts/axiosProvider";
import PageLoader from "./components/PageLoader";
import PersistLayout from "./layouts/persist/persistLayout";
const AuthLayout = lazy(()=>import("./layouts/auth"));
const ProtectedLayout = lazy(()=>import("./layouts/protected/protectedLayout"));
const GuestLayout = lazy(()=>import("./layouts/guest/guestLayout"));
const DashboardLayout = lazy(()=>import("./layouts/dashboard"));
const LoginPage = lazy(()=>import("./pages/auth/login"));
const ForgotPasswordPage = lazy(()=>import("./pages/auth/forgot_password"));
const ResetPasswordPage = lazy(()=>import("./pages/auth/reset_password"));
const DashboardPage = lazy(()=>import("./pages/dashboard"));
const PageNotFound = lazy(()=>import("./pages/pageNotFound"));
const UsersPage = lazy(()=>import("./pages/users"));
const CompanyMastersPage = lazy(()=>import("./pages/companyMasters/list"));
const CompanyMastersDetailPage = lazy(()=>import("./pages/companyMasters/detail"));
const NameChangeMastersMainPage = lazy(()=>import("./pages/nameChangeMasters/main"));
const RegistrarMastersPage = lazy(()=>import("./pages/registrarMasters/list"));
const RegistrarMastersDetailPage = lazy(()=>import("./pages/registrarMasters/detail"));
const ShareHolderDetailsListPage = lazy(()=>import("./pages/shareHolderDetails/list"));
const LegalHeirDetailsListPage = lazy(()=>import("./pages/legalHeirDetails/list"));
const ShareCertificateMastersListPage = lazy(()=>import("./pages/shareCertificateMasters/list"));
const ShareCertificateMastersDetailPage = lazy(()=>import("./pages/shareCertificateMasters/detail"));
const FoliosDetailPage = lazy(()=>import("./pages/folios/detail"));
const ProjectsListPage = lazy(()=>import("./pages/projects/list"));
const ProjectsDetailPage = lazy(()=>import("./pages/projects/detail"));
const SecurityTypeMastersListPage = lazy(()=>import("./pages/securityTypeMasters/list"));
const FailedExcelsPage = lazy(()=>import("./pages/failedExcels/list"));
const PincodesPage = lazy(()=>import("./pages/pincodes"));
const StageNamesPage = lazy(()=>import("./pages/stageNames"));
const NameChangeMastersListPage = lazy(()=>import("./pages/nameChangeMasters/list"));
const CorporateMastersListPage = lazy(()=>import("./pages/corporateMasters/list"));
const DividendMastersListPage = lazy(()=>import("./pages/dividendMasters/list"));
const PaymentTrackersListPage = lazy(()=>import("./pages/paymentTrackers/list"));
const PaymentTrackersDetailPage = lazy(()=>import("./pages/paymentTrackers/detail"));
const StageTrackersListPage = lazy(()=>import("./pages/stageTrackers/list"));
const CommunicationTrackersListPage = lazy(()=>import("./pages/communicationTrackers/list"));
const IepfTrackersListPage = lazy(()=>import("./pages/iepfTrackers/list"));
const SuretysListPage = lazy(()=>import("./pages/suretys/list"));
const NominationsListPage = lazy(()=>import("./pages/nominations/list"));

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
                      <Route path={page_routes.pincodes} element={<PincodesPage />} />
                      <Route path={page_routes.stageNames} element={<StageNamesPage />} />
                      <Route path={page_routes.companyMasters.list} element={<CompanyMastersPage />} />
                      <Route path={`${page_routes.companyMasters.view}`} element={<CompanyMastersDetailPage />} />
                      <Route element={<CompanyMastersDetailPage />}>
                        <Route path={page_routes.companyMasters.nameChangeMaster} element={<NameChangeMastersListPage />} />
                        <Route path={page_routes.companyMasters.corporateMaster} element={<CorporateMastersListPage />} />
                        <Route path={page_routes.companyMasters.dividendMaster} element={<DividendMastersListPage />} />
                      </Route>
                      <Route path={page_routes.nameChangeMasters.main} element={<NameChangeMastersMainPage />} />
                      <Route path={page_routes.registrarMasters.list} element={<RegistrarMastersPage />} />
                      <Route path={page_routes.registrarMasters.view} element={<RegistrarMastersDetailPage />} />
                      <Route path={page_routes.securityTypeMasters.list} element={<SecurityTypeMastersListPage />} />
                      <Route path={page_routes.projects.list} element={<ProjectsListPage />} />
                      <Route path={page_routes.projects.view} element={<ProjectsDetailPage />} />
                      <Route element={<ProjectsDetailPage />}>
                        <Route path={page_routes.projects.shareCertificateMaster} element={<ShareCertificateMastersListPage />} />
                        <Route path={page_routes.projects.shareHolderDetails} element={<ShareHolderDetailsListPage />} />
                        <Route path={page_routes.projects.legalHeirDetails} element={<LegalHeirDetailsListPage />} />
                        <Route path={page_routes.projects.paymentTrackers} element={<PaymentTrackersListPage />} />
                        <Route path={page_routes.projects.stageTrackers} element={<StageTrackersListPage />} />
                        <Route path={page_routes.projects.communicationTrackers} element={<CommunicationTrackersListPage />} />
                        <Route path={page_routes.projects.iepfTrackers} element={<IepfTrackersListPage />} />
                        <Route path={page_routes.projects.suretys} element={<SuretysListPage />} />
                        <Route path={page_routes.projects.nominations} element={<NominationsListPage />} />
                      </Route>
                      <Route path={page_routes.folios.view} element={<FoliosDetailPage />} />
                      <Route path={page_routes.shareCertificateMasters.view} element={<ShareCertificateMastersDetailPage />} />
                      <Route path={page_routes.paymentTrackers.view} element={<PaymentTrackersDetailPage />} />
                      <Route path={page_routes.failed_excel} element={<FailedExcelsPage />} />
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
