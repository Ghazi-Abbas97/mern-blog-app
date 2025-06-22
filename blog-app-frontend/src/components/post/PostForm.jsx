import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAxios from '../api/Axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../loader/Loader';


const PostForm = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      metaDesc: '',
      category: '',
      createdBy: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      content: Yup.string().required('Content is required'),
      metaDesc: Yup.string().required('Meta description is required'),
      category: Yup.string().required('Category is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true)
      let savedUser = JSON.parse(localStorage.getItem("user"));
      console.log(savedUser, "savedUser")
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content);
        formData.append('metaDesc', values.metaDesc);
        formData.append('category', values.category);

        formData.append('createdBy', user?._id ? user?._id : savedUser._id);

        if (imageFile) {
          formData.append('image', imageFile);
        }

        let callApi;
        const dynamicUrl = id ? `/update-post/${id}` : "/add/post";

        if (id) {
          callApi = api.put(dynamicUrl, formData);
        } else {
          callApi = api.post(dynamicUrl, formData);
        }

        callApi
          .then((res) => {
            setLoading(false)
            if (id) {
              navigate("/")
            } else {

              setSnackOpen(true);
              setDialogOpen(true);
            }
            console.log(res);
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || "An error occurred");
            console.error(error);
          }).finally(() => {
            formik.resetForm();
          })
      } catch (error) {
        console.error('Post creation failed:', error);
      }
    },
  });

  const handleDialogClose = (goToDashboard) => {
    setDialogOpen(false);
    if (goToDashboard) {
      navigate('/dashboard');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    setLoading(true)
    if (id) {
      api.get(`/post/${id}`)
        .then((res) => {
          if (res.data) {
            formik.setValues({
              title: res.data.title,
              content: res.data.content,
              metaDesc: res.data.metaDesc,
              category: res.data.category,
              createdBy: res.data.createdBy,
            });
            if (res.data.image) {
              setImageURL(res.data.image);
            }
          }
        })
        .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load'));

    }
    setLoading(false)
  }, [id]);

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }} className='responsive'>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          {id ? "Edit Post" : "Create New Post"}
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Post Title"
            name="title"
            margin="normal"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          <TextField
            fullWidth
            label="Meta Description"
            name="metaDesc"
            margin="normal"
            value={formik.values.metaDesc}
            onChange={formik.handleChange}
            error={formik.touched.metaDesc && Boolean(formik.errors.metaDesc)}
            helperText={formik.touched.metaDesc && formik.errors.metaDesc}
          />

          <TextField
            fullWidth
            label="Category (type your own)"
            name="category"
            margin="normal"
            value={formik.values.category}
            onChange={formik.handleChange}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
          />

          <TextField
            fullWidth
            label="Content"
            name="content"
            margin="normal"
            multiline
            rows={8}
            value={formik.values.content}
            onChange={formik.handleChange}
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={formik.touched.content && formik.errors.content}
          />

          {id && imageURL && (
            <>
              <Typography fontSize={14}>Current Image</Typography>
              <Link to={imageURL} target="_blank" rel="noopener noreferrer" style={{ wordWrap: "break-word" }}>
                {imageURL}
              </Link>
            </>

          )}

          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 2, mb: 2 }}
            fullWidth
          >
            {id ? "Click to Update Image" : "Upload Image"}
            <input hidden type="file" accept="image/*" onChange={handleImageChange} />
          </Button>

          {imagePreview && (
            <Box mt={1} mb={2}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: '100%',
                  height: 180,
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
            </Box>
          )}

          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" sx={{ px: 4, py: 1 }}>
              {id ? "Update Post" : "Publish Post"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar Toast */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message={id ? "Post updated successfully" : "Post created successfully"}
      />

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => handleDialogClose(false)}>
        <DialogTitle>{id ? "Post Updated" : "Post Created"}</DialogTitle>
        <DialogContent>
          {id
            ? "Would you like to see the updated posts?"
            : "Would you like to see the latest posts?"}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)}>No</Button>
          <Button onClick={() => handleDialogClose(true)} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
      {loading ? <Loader /> : ""}
    </Container>
  );
};

export default PostForm;
