import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import { userService } from '../services/api';
import { useSnackbar } from 'notistack';

const ChangeAttributes = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      nationality: '',
      residence: '',
      address: '',
      postalCode: '',
      phonePrimary: '',
      phoneSecondary: '',
      taxId: '',
      dateOfBirth: '',
    },
    professionalInfo: {
      employer: '',
      jobTitle: '',
      employerTaxId: '',
    },
    identificationInfo: {
      citizenCard: '',
      citizenCardIssueDate: '',
      citizenCardValidity: '',
      citizenCardIssuePlace: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get the specific user data using the new endpoint
        const response = await userService.getUserById(userId);
        const user = response.data;

        setUserData(user);

        // Set form data from user data
        setFormData({
          personalInfo: {
            fullName: user.fullName || '',
            nationality: user.nationality || '',
            residence: user.residence || '',
            address: user.address || '',
            postalCode: user.postalCode || '',
            phonePrimary: user.phone || '',
            phoneSecondary: user.phoneSecondary || '',
            taxId: user.taxId || '',
            dateOfBirth: user.dateOfBirth || '',
          },
          professionalInfo: {
            employer: user.employer || '',
            jobTitle: user.jobTitle || '',
            employerTaxId: user.employerTaxId || '',
          },
          identificationInfo: {
            citizenCard: user.citizenCard || '',
            citizenCardIssueDate: user.citizenCardIssueDate || '',
            citizenCardValidity: user.citizenCardValidity || '',
            citizenCardIssuePlace: user.citizenCardIssuePlace || '',
          },
        });
      } catch (err) {
        console.log(err);
        setError('Falha ao carregar dados do utilizador.');
        enqueueSnackbar('Falha ao carregar dados do utilizador.', {
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, enqueueSnackbar]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Prepare attributes object and filter out empty values
      const allAttributes = {
        ...formData.personalInfo,
        ...formData.professionalInfo,
        ...formData.identificationInfo,
      };

      // Filter out empty strings and null values
      const atributos = Object.fromEntries(
        Object.entries(allAttributes).filter(
          ([key, value]) =>
            value !== null && value !== undefined && value !== ''
        )
      );

      await userService.changeAttributes({
        identificador: userId,
        atributos: atributos,
      });

      enqueueSnackbar('Atributos atualizados com sucesso!', {
        variant: 'success',
      });
      navigate('/dashboard/list-users');
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Erro ao atualizar atributos';
      setError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container>
        <Alert severity="error">Utilizador não encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            padding: 4,
            width: '100%',
            border: '1px solid #e0e0e0',
            boxShadow: '0px 10px 30px -5px rgba(0, 0, 0, 0.07)',
            borderRadius: (theme) => theme.shape.borderRadius,
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Alterar Atributos do Utilizador
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 3 }}>
            {userData.username} ({userData.email})
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Personal Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Informações Pessoais
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  name="personalInfo.fullName"
                  value={formData.personalInfo.fullName}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nacionalidade"
                  name="personalInfo.nationality"
                  value={formData.personalInfo.nationality}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Morada"
                  name="personalInfo.address"
                  value={formData.personalInfo.address}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Código Postal"
                  name="personalInfo.postalCode"
                  value={formData.personalInfo.postalCode}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone Principal"
                  name="personalInfo.phonePrimary"
                  value={formData.personalInfo.phonePrimary}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone Secundário"
                  name="personalInfo.phoneSecondary"
                  value={formData.personalInfo.phoneSecondary}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="NIF"
                  name="personalInfo.taxId"
                  value={formData.personalInfo.taxId}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Nascimento"
                  name="personalInfo.dateOfBirth"
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={handleChange}
                  disabled={submitting}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Localidade"
                  name="personalInfo.residence"
                  value={formData.personalInfo.residence}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
            </Grid>

            {/* Professional Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Informações Profissionais
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organização"
                  name="professionalInfo.employer"
                  value={formData.professionalInfo.employer}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cargo"
                  name="professionalInfo.jobTitle"
                  value={formData.professionalInfo.jobTitle}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="NIF da Organização"
                  name="professionalInfo.employerTaxId"
                  value={formData.professionalInfo.employerTaxId}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
            </Grid>

            {/* Identification Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Informações de Identificação
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cartão de Cidadão"
                  name="identificationInfo.citizenCard"
                  value={formData.identificationInfo.citizenCard}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Emissão do Cartão de Cidadão"
                  name="identificationInfo.citizenCardIssueDate"
                  type="date"
                  value={formData.identificationInfo.citizenCardIssueDate}
                  onChange={handleChange}
                  disabled={submitting}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Validade do Cartão de Cidadão"
                  name="identificationInfo.citizenCardValidity"
                  type="date"
                  value={formData.identificationInfo.citizenCardValidity}
                  onChange={handleChange}
                  disabled={submitting}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Local de Emissão do Cartão de Cidadão"
                  name="identificationInfo.citizenCardIssuePlace"
                  value={formData.identificationInfo.citizenCardIssuePlace}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : 'Atualizar'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/dashboard/list-users')}
                disabled={submitting}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ChangeAttributes;
