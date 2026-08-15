import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import CreateCustomerPage from "./pages/CreateCustomerPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import EditCustomerPage from "./pages/EditCustomerPage";
import ServiceRequestsPage from "./pages/ServiceRequestsPage";
import CreateServiceRequestPage from "./pages/CreateServiceRequestPage";
import PassiveCustomersPage from "./pages/PassiveCustomersPage";
import ServiceRequestDetailPage from "./pages/ServiceRequestDetailPage";
import EditServiceRequestPage from "./pages/EditServiceRequestPage";
import CustomerAccountsPage from "./pages/CustomerAccountsPage";
import CustomerPortalLayout from "./components/CustomerPortalLayout";
import CustomerPortalProfilePage from "./pages/CustomerPortalProfilePage";
import CustomerPortalServiceRequestsPage from "./pages/CustomerPortalServiceRequestsPage";
import CustomerPortalServiceRequestDetailPage from "./pages/CustomerPortalServiceRequestDetailPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import PublicRoute from "./components/PublicRoute";
import HomePage from "./pages/HomePage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

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
    </Routes>
  );
}

export default App;
