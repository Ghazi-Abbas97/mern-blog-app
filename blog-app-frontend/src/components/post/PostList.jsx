import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  CardMedia,
  Chip,
  Stack,
  Pagination, 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAxios from '../api/Axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../loader/Loader';

const PostList = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // ← Added

  useEffect(() => {
    setLoading(true);
    api.get(`/all/posts?page=${page}&limit=6`)
      .then(res => {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => toast.error(err?.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [api, page]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }} >
      <Box
        className="responsive"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}

      >
        <Typography variant="h4" fontWeight={600}>
          Latest Blog Posts
        </Typography>
        {isAuthenticated && (
          <Button variant="contained" onClick={() => navigate('/post/new')} className='btn-add-new'>
            + New Post
          </Button>
        )}
      </Box>

      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <Typography>No posts available.</Typography>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              // justifyContent: 'space-evenly',
              gap: 2,
            }}
            
          >
            {posts.map((post) => (
              <Box
              className='card-handler'
                key={post._id}
                style={{ flex: "0 0 30%" }}
                sx={{
                  // width: '30%',
                  // minWidth: '280px',
                  mb: 4,
                  flexGrow: 1,
                  cursor: "pointer"
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: 3,
                    boxShadow: 2,
                    overflow: 'hidden',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  {post.image ? (
                    <CardMedia
                      component="img"
                      height="180"
                      image={post.image}
                      alt={post.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 180,
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#aaa',
                        fontStyle: 'italic',
                      }}
                    >
                      No Image
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.metaDesc || post.content?.substring(0, 100) + '...'}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      {post.category && (
                        <Chip label={post.category} color="primary" size="small" />
                      )}
                      {/* {post.status && (
                        <Chip
                          label={post.status}
                          variant="outlined"
                          color={
                            post.status === 'published'
                              ? 'success'
                              : post.status === 'draft'
                                ? 'warning'
                                : 'default'
                          }
                          size="small"
                        />
                      )} */}
                    </Stack>
                  </CardContent>

                  <CardActions
                    sx={{
                      px: 2,
                      pb: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      By {post.createdBy?.fullName || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {moment(post.createdAt).format('MMM D, YYYY')}
                    </Typography>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default PostList;
