import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  getFirestore, collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc
} from 'firebase/firestore';
import {
  Box, Card, CardContent, Typography, IconButton, Snackbar, Alert
} from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { getAuth } from 'firebase/auth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Saddle Brown
    },
    secondary: {
      main: '#DAA520', // Goldenrod
    },
    background: {
      default: '#FDF5E6', // Old Lace
      paper: '#FAEBD7', // Antique White
    },
  },
});

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        likes: Array.isArray(doc.data().likes) ? doc.data().likes : [],
        dislikes: Array.isArray(doc.data().dislikes) ? doc.data().dislikes : [],
      }));
      setPosts(postsData);
    }, (error) => {
      setError("Error fetching posts: " + error.message);
    });

    return () => unsubscribe();
  }, [db]);

  const handleVote = async (postId, voteType) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      const currentLikes = postSnap.data().likes || [];
      const currentDislikes = postSnap.data().dislikes || [];

      if (postSnap.data().userId === auth.currentUser.uid) {
        setError("You can't vote on your own post");
        return;
      }

      let updatedLikes = [...currentLikes];
      let updatedDislikes = [...currentDislikes];

      if (voteType === 'like') {
        if (updatedLikes.includes(auth.currentUser.uid)) {
          updatedLikes = updatedLikes.filter(id => id !== auth.currentUser.uid);
        } else {
          updatedLikes.push(auth.currentUser.uid);
          updatedDislikes = updatedDislikes.filter(id => id !== auth.currentUser.uid);
        }
      } else {
        if (updatedDislikes.includes(auth.currentUser.uid)) {
          updatedDislikes = updatedDislikes.filter(id => id !== auth.currentUser.uid);
        } else {
          updatedDislikes.push(auth.currentUser.uid);
          updatedLikes = updatedLikes.filter(id => id !== auth.currentUser.uid);
        }
      }

      await updateDoc(postRef, {
        likes: updatedLikes,
        dislikes: updatedDislikes
      });
    } catch (error) {
      setError('Error updating vote: ' + error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2, backgroundColor: 'background.default' }}>
        <Typography variant="h4" gutterBottom color="primary">All Posts</Typography>
        <Box sx={{ marginTop: 4 }}>
          {posts.map((post) => (
            <Card key={post.id} sx={{ marginBottom: 2, backgroundColor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" color="primary">{post.userName}</Typography>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                {post.mediaUrl && (
                  post.mediaType === 'image' ? (
                    <img src={post.mediaUrl} alt="post media" style={{ maxWidth: '100%' }} />
                  ) : post.mediaType === 'video' ? (
                    <video controls src={post.mediaUrl} style={{ maxWidth: '100%' }} />
                  ) : (
                    <img src={post.mediaUrl} alt="post media" style={{ maxWidth: '100%' }} />
                  )
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                  <IconButton onClick={() => handleVote(post.id, 'like')} color={post.likes.includes(auth.currentUser.uid) ? 'primary' : 'default'}>
                    <ThumbUp />
                  </IconButton>
                  <Typography>{post.likes.length}</Typography>
                  <IconButton onClick={() => handleVote(post.id, 'dislike')} color={post.dislikes.includes(auth.currentUser.uid) ? 'secondary' : 'default'}>
                    <ThumbDown />
                  </IconButton>
                  <Typography>{post.dislikes.length}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error">{error}</Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default PostsPage;
