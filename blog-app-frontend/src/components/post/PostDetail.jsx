import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import useAxios from '../api/Axios';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';
import { toast } from 'react-toastify';
import Loader from '../loader/Loader';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useAxios();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    api.get(`/post/${id}`)
      .then((res) => {
        console.log(res, "asdasda")
        setPost(res.data)
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setLoading(true)
    api.delete(`/delete-post/${id}`)
      .then((res) => {
        toast.success(res.data.message);
        navigate('/');
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load')).finally(() => {
        setLoading(false)
      });
  };


  if (!post) return <Typography>No post found</Typography>;

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 4, mb: 4, p: 2 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        {post.image && (
          <CardMedia
            component="img"
            height="300"
            image={post.image}
            alt={post.title}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            {post.title}
          </Typography>
          <Stack direction="row" spacing={1} mb={2}>
            <Chip label={post.category} color="primary" size="small" />
            {/* <Chip label={post.status} variant="outlined" size="small" /> */}
          </Stack>
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            By {post.createdBy?.fullName || 'Unknown'} on {moment(post.createdAt).format('MMM D, YYYY')}
          </Typography>

          {/* {isAuthenticated && user?._id === post.createdBy?._id && ( */}
          <Stack direction="row" spacing={2} mt={3}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(`/post/edit/${post._id}`)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Stack>
          {/* )} */}
        </CardContent>
      </Card>
      {loading ? <Loader /> : ""}
    </Box>
  );
};

export default PostDetail;
