import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage";

import NotFoundPage from "./pages/common/NotFoundPage";

import DashboardPage from "./pages/management/dashboard/DashboardPage";
import CustomerAccountsPage from "./pages/management/customer-accounts/CustomerAccountsPage";

import CustomerPortalProfilePage from "./pages/customer-portal/CustomerPortalProfilePage";
import CustomerPortalServiceRequestsPage from "./pages/customer-portal/CustomerPortalServiceRequestsPage";
import CustomerPortalServiceRequestDetailPage from "./pages/customer-portal/CustomerPortalServiceRequestDetailPage";

import CustomersPage from "./pages/management/customers/CustomersPage";
import CreateCustomerPage from "./pages/management/customers/CreateCustomerPage.jsx";
import EditCustomerPage from "./pages/management/customers/EditCustomerPage";
import PassiveCustomersPage from "./pages/management/customers/PassiveCustomersPage";

import ServiceRequestsPage from "./pages/management/service-requests/ServiceRequestsPage";
import CreateServiceRequestPage from "./pages/management/service-requests/CreateServiceRequestPage";
import ServiceRequestDetailPage from "./pages/management/service-requests/ServiceRequestDetailPage";
import EditServiceRequestPage from "./pages/management/service-requests/EditServiceRequestPage";

import ProtectedRoute from "./components/routing/ProtectedRoute";
import PublicRoute from "./components/routing/PublicRoute";
import DashboardLayout from "./components/layouts/DashboardLayout";
import CustomerPortalLayout from "./components/layouts/CustomerPortalLayout";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["Admin", "User"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/new" element={<CreateCustomerPage />} />
        <Route path="/customers/passive" element={<PassiveCustomersPage />} />
        <Route path="/customers/:id/edit" element={<EditCustomerPage />} />
        <Route
          path="/customer-accounts"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <CustomerAccountsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/service-requests" element={<ServiceRequestsPage />} />
        <Route
          path="/service-requests/:id"
          element={<ServiceRequestDetailPage />}
        />
        <Route
          path="/service-requests/new"
          element={<CreateServiceRequestPage />}
        />
        <Route
          path="/service-requests/:id/edit"
          element={<EditServiceRequestPage />}
        />
      </Route>
      <Route
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <CustomerPortalLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/customer-portal"
          element={<CustomerPortalProfilePage />}
        />

        <Route
          path="/customer-portal/service-requests"
          element={<CustomerPortalServiceRequestsPage />}
        />

        <Route
          path="/customer-portal/service-requests/:id"
          element={<CustomerPortalServiceRequestDetailPage />}
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
