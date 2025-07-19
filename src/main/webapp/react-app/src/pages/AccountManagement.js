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
} from '@mui/material';
import {
  Person as PersonIcon,
  Shield as ShieldIcon,
  Delete as DeleteIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { userService } from '../services/api';

const AccountManagement = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [accountStatus, setAccountStatus] = useState(null);

  // Query to get account status
  const { data: statusData, isLoading: statusLoading, refetch: refetchStatus } = useQuery(
    ['accountStatus', userId],
    () => userService.getAccountStatus({ identificador: userId }),
    {
      enabled: !!userId,
      onSuccess: (response) => {
        setAccountStatus(response.data.status);
      },
      onError: (error) => {
        enqueueSnackbar('Failed to fetch account status', { variant: 'error' });
      }
    }
  );

  // Mutations for different account operations
  const activateMutation = useMutation(
    (data) => userService.activateAccount(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Account activated successfully', { variant: 'success' });
        refetchStatus();
        setOpenDialog(false);
      },
      onError: (error) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to activate account', { variant: 'error' });
      }
    }
  );

  const deactivateMutation = useMutation(
    (data) => userService.deactivateAccount(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Account deactivated successfully', { variant: 'success' });
        refetchStatus();
        setOpenDialog(false);
      },
      onError: (error) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to deactivate account', { variant: 'error' });
      }
    }
  );

  const suspendMutation = useMutation(
    (data) => userService.suspendAccount(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Account suspended successfully', { variant: 'success' });
        refetchStatus();
        setOpenDialog(false);
      },
      onError: (error) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to suspend account', { variant: 'error' });
      }
    }
  );

  const requestRemovalMutation = useMutation(
    (data) => userService.requestAccountRemoval(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Account removal requested successfully', { variant: 'success' });
        refetchStatus();
        setOpenDialog(false);
      },
      onError: (error) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to request account removal', { variant: 'error' });
      }
    }
  );

  const handleAction = (action) => {
    setDialogAction(action);
    setOpenDialog(true);
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
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'default';
      case 'SUSPENDED':
        return 'warning';
      case 'PENDING_REMOVAL':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDialogContent = () => {
    switch (dialogAction) {
      case 'activate':
        return {
          title: 'Activate Account',
          content: 'Are you sure you want to activate this account? The user will be able to access the system.',
          icon: <PauseIcon color="success" />,
        };
      case 'deactivate':
        return {
          title: 'Deactivate Account',
          content: 'Are you sure you want to deactivate this account? The user will not be able to use it while deactivated.',
          icon: <ShieldIcon color="error" />,
        };
      case 'suspend':
        return {
          title: 'Suspend Account',
          content: 'Are you sure you want to suspend this account? The account cannot be used while suspended.',
          icon: <PauseIcon color="warning" />,
        };
      case 'requestRemoval':
        return {
          title: 'Request Account Removal',
          content: 'Are you sure you want to request the removal of this account? This action will mark the account for deletion.',
          icon: <DeleteIcon color="error" />,
        };
      default:
        return { title: '', content: '', icon: null };
    }
  };

  if (statusLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const dialogContent = getDialogContent();
  const isProcessing = activateMutation.isLoading || deactivateMutation.isLoading ||
                      suspendMutation.isLoading || requestRemovalMutation.isLoading;

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
              label={accountStatus}
              color={getStatusColor(accountStatus)}
              size="large"
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
        )}

        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Available Actions
        </Typography>

        <Grid container spacing={3}>
          {/* Activate Account */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PauseIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Activate Account</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Activate a registered account to allow the user to access the system.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleAction('activate')}
                  disabled={accountStatus === 'ACTIVE' || isProcessing}
                  startIcon={<PauseIcon />}
                >
                  Activate
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Deactivate Account */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ShieldIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6">Deactivate Account</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Deactivate the account to prevent access while keeping it in the system.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleAction('deactivate')}
                  disabled={accountStatus === 'INACTIVE' || isProcessing}
                  startIcon={<ShieldIcon />}
                >
                  Deactivate
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Suspend Account */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PauseIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Suspend Account</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Temporarily suspend the account. It cannot be used while suspended.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => handleAction('suspend')}
                  disabled={accountStatus === 'SUSPENDED' || isProcessing}
                  startIcon={<PauseIcon />}
                >
                  Suspend
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Request Removal */}
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
                  disabled={accountStatus === 'PENDING_REMOVAL' || isProcessing}
                  startIcon={<DeleteIcon />}
                >
                  Request Removal
                </Button>
              </CardActions>
            </Card>
          </Grid>
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
            <Typography variant="h6" sx={{ ml: 1 }}>{dialogContent.title}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContent.content}
          </DialogContentText>
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
    </Container>
  );
};

export default AccountManagement;
