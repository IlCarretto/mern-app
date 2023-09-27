import express from 'express';
import { addComment, getFeedPosts, getPost, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// READ
router.get("/:postId", verifyToken, getPost); // get shared post
router.get("/", verifyToken, getFeedPosts); // grab the user feed in homepage (take every post in db)
router.get("/:userId/posts", verifyToken, getUserPosts); // personal friend profile's posts

// UPDATE
router.patch("/:id/like", verifyToken, likePost);
// POST
router.post("/:id/comment", verifyToken, addComment);

export default router;