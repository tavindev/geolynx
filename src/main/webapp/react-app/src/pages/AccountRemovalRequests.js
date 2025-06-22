import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  DeleteForever,
  Cancel,
  Refresh,
  Delete,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { userService } from '../services/api';

const AccountRemovalRequests = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);

  // Query to get accounts for removal
  const { data: removalRequests, isLoading, refetch } = useQuery(
    'accountsForRemoval',
    () => userService.getAccountsForRemoval(),
    {
      onSuccess: (response) => {
        console.log('Removal requests fetched:', response.data);
      },
      onError: (error) => {
        enqueueSnackbar('Failed to fetch removal requests', { variant: 'error' });
      }
    }
  );

  // Mutation to remove account
  const removeAccountMutation = useMutation(
    (data) => userService.removeUser(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Account removed successfully', { variant: 'success' });
        refetch();
        handleCloseDialog();
      },
      onError: (error) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to remove account', { variant: 'error' });
      }
    }
  );

  // Mutation to cancel removal request (activate account back)
  const cancelRemovalMutation = useMutation(
    (data) => userService.activateAccount(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Removal request cancelled, account activated', { variant: 'success' });
        refetch();
        handleCloseDialog();
      },
      onError: (error) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to cancel removal request', { variant: 'error' });
      }
    }
  );

  const handleAction = (action, user) => {
    setSelectedUser(user);
    setDialogAction(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setDialogAction(null);
  };

  const confirmAction = () => {
    if (!selectedUser) return;

    const data = { identificador: selectedUser.email || selectedUser.username };

    switch (dialogAction) {
      case 'remove':
        removeAccountMutation.mutate(data);
        break;
      case 'cancel':
        cancelRemovalMutation.mutate(data);
        break;
      default:
        break;
    }
  };

  const getDialogContent = () => {
    switch (dialogAction) {
      case 'remove':
        return {
          title: 'Confirm Account Removal',
          content: `Are you sure you want to permanently remove the account for ${selectedUser?.email || selectedUser?.username}? This action cannot be undone.`,
          confirmText: 'Remove Account',
          confirmColor: 'error',
        };
      case 'cancel':
        return {
          title: 'Cancel Removal Request',
          content: `Are you sure you want to cancel the removal request for ${selectedUser?.email || selectedUser?.username}? The account will be reactivated.`,
          confirmText: 'Cancel Request',
          confirmColor: 'success',
        };
      default:
        return { title: '', content: '', confirmText: '', confirmColor: 'primary' };
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const dialogContent = getDialogContent();
  const isProcessing = removeAccountMutation.isLoading || cancelRemovalMutation.isLoading;
  const requests = removalRequests?.data || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <DeleteForever sx={{ fontSize: 40, mr: 2, color: 'error.main' }} />
            <Box>
              <Typography variant="h4" gutterBottom>
                Account Removal Requests
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage pending account removal requests
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </Box>

        {requests.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No pending removal requests at this time.
          </Alert>
        ) : (
          <>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                The following accounts have requested removal. Review each request carefully before taking action.
              </Typography>
            </Alert>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.personalInfo ? 
                          `${user.personalInfo.nome} ${user.personalInfo.apelido}` : 
                          'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <Chip label={user.role} size="small" color="primary" />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label="PENDING REMOVAL" 
                          size="small" 
                          color="error"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<Delete />}
                            onClick={() => handleAction('remove', user)}
                          >
                            Remove
                          </Button>
                          <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() => handleAction('cancel', user)}
                          >
                            Cancel Request
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

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
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{dialogContent.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContent.content}
          </DialogContentText>
          {dialogAction === 'remove' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Warning: This action is permanent and cannot be undone!
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={confirmAction} 
            variant="contained" 
            color={dialogContent.confirmColor}
            disabled={isProcessing}
            startIcon={isProcessing && <CircularProgress size={20} />}
          >
            {isProcessing ? 'Processing...' : dialogContent.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AccountRemovalRequests;
