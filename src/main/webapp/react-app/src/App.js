import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Layout from './components/Layout/Layout';
import PublicLayout from './components/Layout/PublicLayout';
import PrivateRoute from './components/Layout/PrivateRoute';
import PublicRoute from './components/Layout/PublicRoute';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangeRole from './pages/ChangeRole';
import ListUsers from './pages/ListUsers';
import ChangeAttributes from './pages/ChangeAttributes';
import ChangePassword from './pages/ChangePassword';
import WorksheetCreate from './pages/WorksheetCreate';
import WorksheetUpdate from './pages/WorksheetUpdate';
import Map from './pages/Map';
import NotFound from './pages/NotFound';
import AccountManagement from './pages/AccountManagement';
import AccountRemovalRequests from './pages/AccountRemovalRequests';
import RequestAccountRemoval from './pages/RequestAccountRemoval';
import ExecutionSheets from './pages/ExecutionSheets';
import ExecutionSheetDetail from './pages/ExecutionSheetDetail';
import AdminDashboard from './pages/AdminDashboard';
import WorksheetDashboard from './pages/WorksheetDashboard';
import MyWorksheets from './pages/MyWorksheets';
import MyProfile from './pages/MyProfile';
import WorksheetDetail from './pages/WorksheetDetail';
import WorkSheets from './pages/WorkSheets';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4A7C59', // A softer, more natural forest green
      light: '#6B9B7A', // Lighter forest green for hover states
      dark: '#3A6B49', // Darker forest green for active states
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8C9B6E', // An earthy, complementary olive green
      light: '#A3B28A', // Lighter olive for hover states
      dark: '#7A8A5E', // Darker olive for active states
      contrastText: '#ffffff',
    },
    background: {
      default: '#FAFAF8', // A very light, natural off-white
      paper: '#ffffff',
    },
    text: {
      primary: '#1C1C1C',
      secondary: '#555555',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#FFA000',
    },
  },
  shape: {
    borderRadius: 8, // Slightly increased for consistency with home page
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 600,
      color: '#4A7C59', // Forest green for main headings
    },
    h5: {
      fontWeight: 500,
      color: '#4A7C59', // Forest green for secondary headings
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: '#6B9B7A', // Lighter forest green on hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(74, 124, 89, 0.08)', // Forest green with opacity for hover
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(74, 124, 89, 0.12)', // Forest green with opacity for selected
            '&:hover': {
              backgroundColor: 'rgba(74, 124, 89, 0.16)', // Slightly darker on hover when selected
            },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <PublicRoute>
                      <PublicLayout>
                        <Map />
                      </PublicLayout>
                    </PublicRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />

                {/* Private Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Layout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<Home />} />
                  <Route
                    path="admin"
                    element={
                      <PrivateRoute roles={['SYSADMIN', 'SMBO']}>
                        <AdminDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="worksheets"
                    element={
                      <PrivateRoute roles={['SMBO', 'SGVBO', 'PRBO']}>
                        <WorksheetDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="list-users"
                    element={
                      <PrivateRoute roles={['SYSADMIN', 'SMBO']}>
                        <ListUsers />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="manage-worksheets"
                    element={
                      <PrivateRoute roles={['SYSADMIN', 'SMBO']}>
                        <WorkSheets />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="change-attributes/:userId"
                    element={
                      <PrivateRoute roles={['SYSADMIN', 'SMBO']}>
                        <ChangeAttributes />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="change-role/:userId"
                    element={
                      <PrivateRoute roles={['SYSADMIN', 'SMBO']}>
                        <ChangeRole />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="change-password"
                    element={
                      <PrivateRoute>
                        <ChangePassword />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="my-profile"
                    element={
                      <PrivateRoute>
                        <MyProfile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="my-worksheets"
                    element={
                      <PrivateRoute roles={['PO', 'ADLU', 'PRBO', 'SMBO', 'SGVBO']}>
                        <MyWorksheets />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="account-management/:userId"
                    element={
                      <PrivateRoute roles={['SYSADMIN', 'SMBO']}>
                        <AccountManagement />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="removal-requests"
                    element={
                      <PrivateRoute roles={['SYSADMIN', 'SMBO']}>
                        <AccountRemovalRequests />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="request-removal"
                    element={
                      <PrivateRoute>
                        <RequestAccountRemoval />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="worksheet/create"
                    element={
                      <PrivateRoute roles={['PO', 'ADLU']}>
                        <WorksheetCreate />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="worksheet/:id"
                    element={
                      <PrivateRoute roles={['PO', 'ADLU', 'PRBO', 'SMBO', 'SGVBO']}>
                        <WorksheetDetail />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="worksheet-update/:worksheetId"
                    element={
                      <PrivateRoute roles={['PO', 'ADLU']}>
                        <WorksheetUpdate />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="execution-sheets"
                    element={
                      <PrivateRoute roles={['PRBO', 'PO', 'SDVBO', 'OPERATOR']}>
                        <ExecutionSheets />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="execution-sheets/:id"
                    element={
                      <PrivateRoute roles={['PRBO', 'PO', 'SDVBO', 'OPERATOR']}>
                        <ExecutionSheetDetail />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="map"
                    element={
                      <PrivateRoute>
                        <Map />
                      </PrivateRoute>
                    }
                  />
                </Route>

                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
