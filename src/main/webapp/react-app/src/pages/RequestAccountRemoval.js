import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Delete,
  Warning,
  CheckCircle,
  Cancel,
  Info,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { userService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const RequestAccountRemoval = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, logout } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const requestRemovalMutation = useMutation(
    () => userService.requestAccountRemoval({ identificador: user?.email || user?.username }),
    {
      onSuccess: () => {
        enqueueSnackbar('Account removal requested successfully', { variant: 'success' });
        setShowConfirmation(true);
        setOpenDialog(false);
        // Log out the user after successful request
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 5000);
      },
      onError: (error) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to request account removal', { variant: 'error' });
      }
    }
  );

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setConfirmText('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setConfirmText('');
  };

  const handleConfirmRemoval = () => {
    if (confirmText === 'DELETE MY ACCOUNT') {
      requestRemovalMutation.mutate();
    }
  };

  const isConfirmValid = confirmText === 'DELETE MY ACCOUNT';

  if (showConfirmation) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Account Removal Requested
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your account removal request has been submitted successfully. An administrator will review your request soon.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will be logged out in a few seconds...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Delete sx={{ fontSize: 40, mr: 2, color: 'error.main' }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              Request Account Removal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submit a request to permanently delete your account
            </Typography>
          </Box>
        </Box>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Warning:</strong> Requesting account removal is a serious action. Please read the following information carefully before proceeding.
          </Typography>
        </Alert>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          What happens when you request account removal?
        </Typography>

        <List sx={{ mb: 3 }}>
          <ListItem>
            <ListItemIcon>
              <Info color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Your request will be submitted for review"
              secondary="An administrator will need to approve your removal request"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Info color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Your account will be marked as pending removal"
              secondary="You may lose access to your account while the request is being processed"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Info color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="All your data will be permanently deleted"
              secondary="This includes your profile information, activities, and any associated data"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Warning color="warning" />
            </ListItemIcon>
            <ListItemText 
              primary="This action cannot be undone"
              secondary="Once approved, your account and data will be permanently removed from the system"
            />
          </ListItem>
        </List>

        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Important:</strong> If you're experiencing issues with your account, consider contacting support before requesting removal. 
            Many issues can be resolved without deleting your account.
          </Typography>
        </Alert>

        <Box display="flex" gap={2} justifyContent="center" mt={4}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dashboard')}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleOpenDialog}
            startIcon={<Delete />}
          >
            Request Account Removal
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
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Warning color="error" sx={{ mr: 1 }} />
            <Typography variant="h6">Confirm Account Removal Request</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Are you absolutely sure you want to request the removal of your account? This action will submit a request to permanently delete your account and all associated data.
          </DialogContentText>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              This action cannot be undone. All your data will be permanently deleted once the request is approved.
            </Typography>
          </Alert>
          <Typography variant="body2" gutterBottom>
            To confirm, please type <strong>DELETE MY ACCOUNT</strong> in the field below:
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE MY ACCOUNT"
            sx={{ mt: 2 }}
            autoComplete="off"
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            disabled={requestRemovalMutation.isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmRemoval} 
            variant="contained" 
            color="error"
            disabled={!isConfirmValid || requestRemovalMutation.isLoading}
            startIcon={requestRemovalMutation.isLoading ? <CircularProgress size={20} /> : <Delete />}
          >
            {requestRemovalMutation.isLoading ? 'Processing...' : 'Confirm Removal Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RequestAccountRemoval;
