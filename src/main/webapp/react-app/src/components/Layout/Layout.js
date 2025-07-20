import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Lock as LockIcon,
  Assignment as AssignmentIcon,
  Map as MapIcon,
  Logout as LogoutIcon,
  AccountCircle,
  Settings,
  DeleteSweep as DeleteSweepIcon,
  Description as DescriptionIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    // Public pages available to all authenticated users
    { text: 'Início', icon: <HomeIcon />, path: '/dashboard', roles: [] },
    { text: 'Mapa', icon: <MapIcon />, path: '/dashboard/map', roles: [] },

    { divider: true },

    // User Management Section - SYSADMIN and SYSBO have user management permissions
    {
      text: 'Gestão de Utilizadores',
      header: true,
      roles: ['SYSADMIN', 'SYSBO'], // Both have LIST_REGISTERED_USERS and related permissions
    },
    {
      text: 'Listar Utilizadores',
      icon: <PeopleIcon />,
      path: '/dashboard/list-users',
      roles: ['SYSADMIN', 'SYSBO'], // Both have LIST_REGISTERED_USERS, LIST_ACTIVE_USERS, etc.
    },
    {
      text: 'Pedidos de Remoção',
      icon: <DeleteSweepIcon />,
      path: '/dashboard/removal-requests',
      roles: ['SYSADMIN', 'SYSBO'], // Both have LIST_ACCOUNTS_FOR_REMOVAL
    },

    { divider: true },

    // Worksheet Management Section
    {
      text: 'Gestão de Folhas',
      header: true,
      roles: ['SYSADMIN', 'SMBO'], // Only SMBO has IMP_FO and REM_FO
    },
    {
      text: 'Gerir Folhas de Obra',
      icon: <AssignmentIcon />,
      path: '/dashboard/manage-worksheets',
      roles: ['SYSADMIN', 'SMBO'], // SMBO has IMP_FO (create/update) and REM_FO (remove)
    },

    { divider: true },

    // Worksheet Viewing Section
    {
      text: 'Visualização de Folhas',
      header: true,
      roles: ['SYSADMIN', 'SMBO', 'SGVBO', 'SDVBO'], // All have some viewing permissions
    },
    {
      text: 'Folhas de Obra',
      icon: <AssignmentIcon />,
      path: '/dashboard/worksheets',
      roles: ['SYSADMIN', 'SMBO', 'SGVBO', 'SDVBO'], // SMBO has VIEW_GEN_FO and VIEW_DET_FO, SGVBO has VIEW_GEN_FO, SDVBO has VIEW_DET_FO
    },

    { divider: true },

    // Dashboard Section
    {
      text: 'Dashboards',
      header: true,
      roles: ['SYSADMIN'], // Admin dashboard typically for SYSADMIN only
    },
    {
      text: 'Dashboard Admin',
      icon: <DashboardIcon />,
      path: '/dashboard/admin',
      roles: ['SYSADMIN'], // Administrative overview for SYSADMIN
    },

    { divider: true },

    // Personal Account Section - Available to all authenticated users
    { text: 'Minha Conta', header: true, roles: [] },
    {
      text: 'Meu Perfil',
      icon: <AccountCircle />,
      path: '/dashboard/my-profile',
      roles: [], // All roles have VIEW_ACCOUNT_PROFILE
    },
    {
      text: 'Alterar Password',
      icon: <LockIcon />,
      path: '/dashboard/change-password',
      roles: [], // All roles have CHANGE_OWN_ATTRIBUTES
    },
    {
      text: 'Pedir Remoção da Conta',
      icon: <DeleteSweepIcon />,
      path: '/dashboard/request-removal',
      roles: [
        'SYSADMIN',
        'SYSBO',
        'RU',
        'SMBO',
        'SGVBO',
        'SDVBO',
        'PRBO',
        'PO',
        'ADLU',
      ], // All except VU and SYSTEM have REQUEST_OWN_REMOVAL
    },
  ];

  const filterMenuItems = (items) => {
    return items.filter((item) => {
      if (user.role === 'SYSADMIN') return true;

      if (item.roles && item.roles.length > 0) {
        return item.roles.some((role) => user?.role === role);
      }
      return true;
    });
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontWeight: 'bold' }}
        >
          GeoLynx
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filterMenuItems(menuItems).map((item, index) => {
          if (item.divider) {
            return <Divider key={index} sx={{ my: 1 }} />;
          }
          if (item.header) {
            return (
              <ListItem key={index}>
                <Typography variant="overline" color="text.secondary">
                  {item.text}
                </Typography>
              </ListItem>
            );
          }
          return (
            <ListItemButton
              key={index}
              onClick={() => {
                navigate(item.path);
                if (isMobile) handleDrawerToggle();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: theme.palette.text.primary,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestão Territorial
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {user?.fullName || user?.email || 'Utilizador'}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem disabled>
                <Typography variant="caption">Role: {user?.role}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  navigate('/dashboard/my-profile');
                  handleProfileMenuClose();
                }}
              >
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Meu Perfil
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate('/dashboard/change-password');
                  handleProfileMenuClose();
                }}
              >
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Alterar Password
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Sair
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px', // Standard AppBar height
          overflow: 'auto',
          backgroundColor: theme.palette.background.default,
          height: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
