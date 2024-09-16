import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  getFirestore, collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, getDoc, deleteDoc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import {
  Button, TextField, Card, CardContent, Typography, IconButton, Box, Snackbar, Alert
} from '@mui/material';
import {
  ThumbUp, ThumbDown, Reply, Edit, Delete, Image, VideoCall, Gif
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

const PhilatelistForum = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [error, setError] = useState(null);
  const quillRef = useRef(null);
  const db = getFirestore();
  const auth = getAuth();
  const storage = getStorage();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !mediaFile) {
      setError("Post content or media is required");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'userDetails', auth.currentUser.uid));
      const userName = userDoc.data().name;

      let mediaUrl = '';
      if (mediaFile) {
        const storageRef = ref(storage, `post-media/${Date.now()}_${mediaFile.name}`);
        await uploadBytes(storageRef, mediaFile);
        mediaUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'posts'), {
        content: newPost,
        mediaUrl,
        mediaType: mediaFile ? mediaFile.type.split('/')[0] : null,
        createdAt: new Date(),
        userId: auth.currentUser.uid,
        userName: userName,
        likes: [],
        dislikes: [],
        replies: []
      });
      setNewPost('');
      setMediaFile(null);
    } catch (error) {
      setError('Error adding post: ' + error.message);
    }
  };

  const handleReply = async (postId) => {
    if (!replyContent.trim()) {
      setError("Reply content is required");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'userDetails', auth.currentUser.uid));
      const userName = userDoc.data().name;

      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      const currentReplies = postSnap.data().replies || [];

      await updateDoc(postRef, {
        replies: [...currentReplies, {
          content: replyContent,
          createdAt: new Date(),
          userId: auth.currentUser.uid,
          userName: userName
        }]
      });

      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      setError('Error adding reply: ' + error.message);
    }
  };

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

  const handleEdit = async (postId) => {
    if (!editContent.trim()) {
      setError("Edit content is required");
      return;
    }

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        content: editContent
      });
      setEditingPost(null);
      setEditContent('');
    } catch (error) {
      setError('Error editing post: ' + error.message);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      setError('Error deleting post: ' + error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2, backgroundColor: 'background.default' }}>
        <Typography variant="h4" gutterBottom color="primary">Philatelist Forum</Typography>
        <Card sx={{ marginBottom: 2, backgroundColor: 'background.paper' }}>
          <CardContent>
            <ReactQuill theme="snow" value={newPost} onChange={setNewPost} ref={quillRef} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Box>
                <input
                  accept="image/*,video/*,image/gif"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={(e) => setMediaFile(e.target.files[0])}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="contained" component="span" startIcon={<Image />}>
                    Image
                  </Button>
                </label>
                <Button variant="contained" component="span" startIcon={<VideoCall />} sx={{ marginLeft: 1 }}>
                  Video
                </Button>
                <Button variant="contained" component="span" startIcon={<Gif />} sx={{ marginLeft: 1 }}>
                  GIF
                </Button>
              </Box>
              <Button variant="contained" onClick={handleSubmit} color="secondary">Post</Button>
            </Box>
            {mediaFile && <Typography variant="body2">{mediaFile.name}</Typography>}
          </CardContent>
        </Card>
        <Box sx={{ marginTop: 4 }}>
          {posts.map((post) => (
            <Card key={post.id} sx={{ marginBottom: 2, backgroundColor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" color="primary">{post.userName}</Typography>
                {editingPost === post.id ? (
                  <>
                    <ReactQuill theme="snow" value={editContent} onChange={setEditContent} />
                    <Button onClick={() => handleEdit(post.id)} color="secondary">Save</Button>
                    <Button onClick={() => setEditingPost(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
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
                      <IconButton onClick={() => setReplyingTo(post.id)}>
                        <Reply />
                      </IconButton>
                      {post.userId === auth.currentUser.uid && (
                        <>
                          <IconButton onClick={() => {
                            setEditingPost(post.id);
                            setEditContent(post.content);
                          }}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(post.id)}>
                            <Delete />
                          </IconButton>
                        </>
                      )}
                    </Box>
                    {replyingTo === post.id && (
                      <Box sx={{ marginTop: 2 }}>
                        <ReactQuill theme="snow" value={replyContent} onChange={setReplyContent} />
                        <Button onClick={() => handleReply(post.id)} color="secondary">Reply</Button>
                      </Box>
                    )}
                    {post.replies && post.replies.map((reply, index) => (
                      <Box key={index} sx={{ marginTop: 2, padding: 1, backgroundColor: 'background.default' }}>
                        <Typography variant="body2" color="primary">{reply.userName}:</Typography>
                        <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                      </Box>
                    ))}
                  </>
                )}
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

export default PhilatelistForum;
