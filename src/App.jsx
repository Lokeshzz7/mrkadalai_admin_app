import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminPermissionRoute from './components/AdminPermissionRoute.jsx'

// Auth pages
import SignIn from './pages/auth/SignIn.jsx';
import SignUp from './pages/auth/SignUp.jsx';

// Protected pages
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import ManualOrder from './pages/ManualOrder';
import Inventory from './pages/Inventory';
import Wallet from './pages/Wallet';
import Reports from './pages/Reports';
import OrderHistory from './pages/OrderHistory.jsx';
import Settings from './pages/Settings.jsx';
import AdminDashboard from './pages/main/AdminDashboard.jsx';
import Staff from './pages/Staff.jsx';
import Expenditure from './pages/Expenditure.jsx';
import Customer from './pages/Customer.jsx';
import Ticket from './pages/Ticket.jsx';
import AppManagement from './pages/AppManagement.jsx';
import StaffDetails from './pages/StaffDetails.jsx';
import ProductManagement from './pages/ProductManagement.jsx';
import AddStaff from './pages/staff/AddStaff.jsx';
import { Toaster } from 'react-hot-toast';
import AdminDetails from './pages/AdminDetails.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              fontSize: '20px',
              padding: '18px 28px',
              minWidth: '320px',
            },
          }}
        />

        <Routes>
          {/* Public routes - these should render without Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/admin-signup" element={<SignUp />} />

          {/* Home route - always accessible */}
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin details route */}
          <Route
            path="/admin/:id"
            element={
              <ProtectedRoute>
                <AdminDetails />
              </ProtectedRoute>
            }
          />

          {/* Regular dashboard */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Permission-protected routes */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="STAFF_MANAGEMENT">
                  <Layout>
                    <Staff />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/add"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="STAFF_MANAGEMENT">
                  <Layout>
                    <AddStaff />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/:id"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="STAFF_MANAGEMENT">
                  <Layout>
                    <StaffDetails />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="ORDER_MANAGEMENT">
                  <Layout>
                    <OrderHistory />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenditure"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="EXPENDITURE_MANAGEMENT">
                  <Layout>
                    <Expenditure />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="CUSTOMER_MANAGEMENT">
                  <Layout>
                    <Customer />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="TICKET_MANAGEMENT">
                  <Layout>
                    <Ticket />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="NOTIFICATIONS_MANAGEMENT">
                  <Layout>
                    <Notifications />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="APP_MANAGEMENT">
                  <Layout>
                    <AppManagement />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manual-order"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="ORDER_MANAGEMENT">
                  <Layout>
                    <ManualOrder />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="INVENTORY_MANAGEMENT">
                  <Layout>
                    <Inventory />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/product"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="PRODUCT_MANAGEMENT">
                  <Layout>
                    <ProductManagement />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="WALLET_MANAGEMENT">
                  <Layout>
                    <Wallet />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="REPORTS_ANALYTICS">
                  <Layout>
                    <Reports />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AdminPermissionRoute requiredPermission="SETTINGS">
                  <Layout>
                    <Settings />
                  </Layout>
                </AdminPermissionRoute>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;