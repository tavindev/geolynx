import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Person as PersonIcon,
  Shield as ShieldIcon,
  Delete as DeleteIcon,
  Pause as PauseIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { userService, corporationService } from '../services/api';

const AccountManagement = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [accountStatus, setAccountStatus] = useState(null);
  const [openCorporationDialog, setOpenCorporationDialog] = useState(false);
  const [selectedCorporation, setSelectedCorporation] = useState('');
  const [userData, setUserData] = useState(null);

  // Query to get account status
  const {
    data: statusData,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = useQuery(
    ['accountStatus', userId],
    () => userService.getAccountStatus({ identificador: userId }),
    {
      enabled: !!userId,
      onSuccess: (response) => {
        setAccountStatus(response.data.status);
      },
      onError: (error) => {
        enqueueSnackbar('Failed to fetch account status', { variant: 'error' });
      },
    }
  );

  // Query to get user data
  const {
    isLoading: userLoading,
  } = useQuery(
    ['userData', userId],
    () => userService.getUserById(userId),
    {
      enabled: !!userId,
      onSuccess: (response) => {
        setUserData(response.data);
      },
      onError: (error) => {
        enqueueSnackbar('Failed to fetch user data', { variant: 'error' });
      },
    }
  );

  // Query to get all corporations
  const {
    data: corporationsData,
    isLoading: corporationsLoading,
  } = useQuery(
    ['corporations'],
    () => corporationService.getAll(),
    {
      onError: (error) => {
        enqueueSnackbar('Failed to fetch corporations', { variant: 'error' });
      },
    }
  );

  // Mutations for different account operations
  const activateMutation = useMutation(
    (data) => userService.activateAccount(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Account activated successfully', {
          variant: 'success',
        });
        refetchStatus();
        setOpenDialog(false);
      },
      onError: (error) => {
        enqueueSnackbar(
          error.response?.data?.message || 'Failed to activate account',
          { variant: 'error' }
        );
      },
    }
  );

  const deactivateMutation = useMutation(
    (data) => userService.deactivateAccount(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Account deactivated successfully', {
          variant: 'success',
        });
        refetchStatus();
        setOpenDialog(false);
      },
      onError: (error) => {
        enqueueSnackbar(
          error.response?.data?.message || 'Failed to deactivate account',
          { variant: 'error' }
        );
      },
    }
  );

  const suspendMutation = useMutation(
    (data) => userService.suspendAccount(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Account suspended successfully', {
          variant: 'success',
        });
        refetchStatus();
        setOpenDialog(false);
      },
      onError: (error) => {
        enqueueSnackbar(
          error.response?.data?.message || 'Failed to suspend account',
          { variant: 'error' }
        );
      },
    }
  );

  const requestRemovalMutation = useMutation(
    (data) => userService.requestAccountRemoval(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Account removal requested successfully', {
          variant: 'success',
        });
        refetchStatus();
        setOpenDialog(false);
      },
      onError: (error) => {
        enqueueSnackbar(
          error.response?.data?.message || 'Failed to request account removal',
          { variant: 'error' }
        );
      },
    }
  );

  const assignCorporationMutation = useMutation(
    (data) => userService.assignCorporation(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Corporation assigned successfully', {
          variant: 'success',
        });
        setOpenCorporationDialog(false);
        setSelectedCorporation('');
      },
      onError: (error) => {
        enqueueSnackbar(
          error.response?.data?.message || 'Failed to assign corporation',
          { variant: 'error' }
        );
      },
    }
  );

  const handleAction = (action) => {
    setDialogAction(action);
    setOpenDialog(true);
  };

  const handleCorporationAssignment = () => {
    setOpenCorporationDialog(true);
  };

  const confirmCorporationAssignment = () => {
    if (selectedCorporation) {
      assignCorporationMutation.mutate({
        identificador: userId,
        corporationId: selectedCorporation,
      });
    }
  };

  const confirmAction = () => {
    const data = { identificador: userId };

    switch (dialogAction) {
      case 'activate':
        activateMutation.mutate(data);
        break;
      case 'deactivate':
        deactivateMutation.mutate(data);
        break;
      case 'suspend':
        suspendMutation.mutate(data);
        break;
      case 'requestRemoval':
        requestRemovalMutation.mutate(data);
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ATIVADA':
        return 'success';
      case 'DESATIVADA':
        return 'default';
      case 'SUSPENSA':
        return 'warning';
      case 'A_REMOVER':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      ATIVADA: 'Ativa',
      DESATIVADA: 'Desativada',
      SUSPENSA: 'Suspensa',
      A_REMOVER: 'Remoção Pendente'
    };
    return labels[status] || status;
  };

  const shouldShowCorporationAssignment = () => {
    // Show corporation assignment for PRBO and PO users only
    return userData && (userData.role === 'PRBO' || userData.role === 'PO');
  };

  const getCurrentCorporationName = () => {
    if (!userData?.corporationId || !corporationsData) return null;
    const corporation = corporationsData.data?.find(corp => corp.id === userData.corporationId);
    return corporation?.name || 'Unknown Corporation';
  };

  const getDialogContent = () => {
    switch (dialogAction) {
      case 'activate':
        return {
          title: 'Activate Account',
          content:
            'Are you sure you want to activate this account? The user will be able to access the system.',
          icon: <PauseIcon color="success" />,
        };
      case 'deactivate':
        return {
          title: 'Deactivate Account',
          content:
            'Are you sure you want to deactivate this account? The user will not be able to use it while deactivated.',
          icon: <ShieldIcon color="error" />,
        };
      case 'suspend':
        return {
          title: 'Suspend Account',
          content:
            'Are you sure you want to suspend this account? The account cannot be used while suspended.',
          icon: <PauseIcon color="warning" />,
        };
      case 'requestRemoval':
        return {
          title: 'Request Account Removal',
          content:
            'Are you sure you want to request the removal of this account? This action will mark the account for deletion.',
          icon: <DeleteIcon color="error" />,
        };
      default:
        return { title: '', content: '', icon: null };
    }
  };

  if (statusLoading || userLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const dialogContent = getDialogContent();
  const isProcessing =
    activateMutation.isLoading ||
    deactivateMutation.isLoading ||
    suspendMutation.isLoading ||
    requestRemovalMutation.isLoading;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <PersonIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              Account Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage account status and permissions for user: {userId}
            </Typography>
          </Box>
        </Box>

        {accountStatus && (
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Current Status
            </Typography>
            <Chip
              label={getStatusLabel(accountStatus)}
              color={getStatusColor(accountStatus)}
              size="large"
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
        )}

        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Available Actions
        </Typography>

        {accountStatus === 'A_REMOVER' ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            This account is marked for removal. No further actions can be taken.
          </Alert>
        ) : null}

        <Grid container spacing={3}>
          {/* Activate Account */}
          {accountStatus !== 'ATIVADA' && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PauseIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Activate Account</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Activate a registered account to allow the user to access the
                    system.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAction('activate')}
                    disabled={isProcessing}
                    startIcon={<PauseIcon />}
                  >
                    Activate
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}

          {/* Deactivate Account */}
          {accountStatus !== 'DESATIVADA' && accountStatus !== 'A_REMOVER' && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <ShieldIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6">Deactivate Account</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Deactivate the account to prevent access while keeping it in
                    the system.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleAction('deactivate')}
                    disabled={isProcessing}
                    startIcon={<ShieldIcon />}
                  >
                    Deactivate
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}

          {/* Suspend Account */}
          {accountStatus !== 'SUSPENSA' && accountStatus !== 'A_REMOVER' && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PauseIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6">Suspend Account</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Temporarily suspend the account. It cannot be used while
                    suspended.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleAction('suspend')}
                    disabled={isProcessing}
                    startIcon={<PauseIcon />}
                  >
                    Suspend
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}

          {/* Request Removal */}
          {accountStatus !== 'A_REMOVER' && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <DeleteIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6">Request Account Removal</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Request the removal of this account from the system.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleAction('requestRemoval')}
                    disabled={isProcessing}
                    startIcon={<DeleteIcon />}
                  >
                    Request Removal
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}

          {/* Assign Corporation */}
          {shouldShowCorporationAssignment() && accountStatus !== 'A_REMOVER' && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <BusinessIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Assign Corporation</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Associate this user with a service provider (corporation).
                  </Typography>
                  {getCurrentCorporationName() && (
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'medium' }}>
                      Current: {getCurrentCorporationName()}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCorporationAssignment}
                    disabled={assignCorporationMutation.isLoading}
                    startIcon={<BusinessIcon />}
                  >
                    Assign Corporation
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}
        </Grid>

        <Box mt={4}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard/list-users')}
          >
            Back to User List
          </Button>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            {dialogContent.icon}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {dialogContent.title}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContent.content}</DialogContentText>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              This action will affect the user's ability to access the system.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            variant="contained"
            color="primary"
            disabled={isProcessing}
            startIcon={isProcessing && <CircularProgress size={20} />}
          >
            {isProcessing ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Corporation Assignment Dialog */}
      <Dialog
        open={openCorporationDialog}
        onClose={() => setOpenCorporationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <BusinessIcon color="primary" />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Assign Corporation
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Select a corporation to associate with this {userData?.role === 'PRBO' ? 'representative' : 'operator'}.
          </DialogContentText>
          
          {getCurrentCorporationName() && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Current assignment: {getCurrentCorporationName()}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="corporation-select-label">Corporation</InputLabel>
            <Select
              labelId="corporation-select-label"
              value={selectedCorporation}
              label="Corporation"
              onChange={(e) => setSelectedCorporation(e.target.value)}
              disabled={!corporationsData?.data}
            >
              {corporationsData?.data?.map((corporation) => (
                <MenuItem key={corporation.id} value={corporation.id}>
                  {corporation.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenCorporationDialog(false);
              setSelectedCorporation('');
            }} 
            disabled={assignCorporationMutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmCorporationAssignment}
            variant="contained"
            color="primary"
            disabled={!selectedCorporation || assignCorporationMutation.isLoading}
            startIcon={assignCorporationMutation.isLoading && <CircularProgress size={20} />}
          >
            {assignCorporationMutation.isLoading ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AccountManagement;
