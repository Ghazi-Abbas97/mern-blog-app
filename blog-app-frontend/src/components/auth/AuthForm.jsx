import React, { useState } from 'react';
import { Box, Button, Container, Grid, TextField, Typography, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useAuth } from '../../context/AuthContext';
import * as Yup from 'yup';
import useAxios from '../api/Axios';
import { toast } from 'react-toastify';
import Loader from '../loader/Loader';

const AuthForm = ({ type = 'login' }) => {
  const [isLoader, setIsLoader] = useState(false);

  const navigate = useNavigate();
  const api = useAxios();
  const { login } = useAuth();
  const isLogin = type === 'login';

  const initialValues = {
    fullName: '',
    emailAddress: '',
    password: '',
  };

  const validationSchema = Yup.object({
    fullName: isLogin ? Yup.string() : Yup.string().required('Name is required'),
    emailAddress: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsLoader(true);
      let dynamicUrl = values.fullName ? "/auth/signup" : "/auth/login";

      api.post(dynamicUrl, values).then((res) => {
        console.log(res.data)
        const { session, user } = res.data;
        login(session, user);

        navigate('/dashboard');

      })
        .catch((error) => {
          console.log(error)
          toast.error(error?.response?.data?.message || "")
        })
        .finally(() => {
          formik.resetForm();
          setIsLoader(false);
        });

      console.log(`${isLogin ? 'Logging in' : 'Signing up'} with`, values);
    },
  });



  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',   // fill full viewport height
      }}
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 2 }}>
          {!isLogin && (
            <TextField
              label="Full Name"
              name="fullName"
              fullWidth
              margin="normal"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          )}

          <TextField
            label="Email Address"
            name="emailAddress"
            fullWidth
            margin="normal"
            required
            type="email"
            error={formik.touched.emailAddress && Boolean(formik.errors.emailAddress)}
            helperText={formik.touched.emailAddress && formik.errors.emailAddress}
            value={formik.values.emailAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </Box>

        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid item>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate(isLogin ? '/signup' : '/login')}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Log in'}
            </Link>
          </Grid>
        </Grid>
      </Paper>

      {isLoader && <Loader />}
    </Container>
  );
};

export default AuthForm;
