import Post from "../models/Post.js";
import User from "../models/User.js";

// CREATE
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
            sharedNum: 0
        })
        await newPost.save();
        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

export const sharePost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        console.log(userId);
        const user = await User.findById(userId);
        console.log(user, req.body);
        const postId = req.params.postId;
        const sharedPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
            sharedNum: 0,
            isShared: { [postId]: true }
        });
        await sharedPost.save();
        await Post.findByIdAndUpdate(postId, { $inc: { sharedNum: 1 } });
        res.status(201).json(sharedPost);
    } catch (err) {
        res.status(409).json({ message: `${err}, cannot share` });
    }
}

// READ
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: "error here" });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId });
        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: "error here" });
    }
}

export const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findOne({ _id: postId });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: 'cannot get post' });
    }
}

// UPDATE
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        )

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: "error here" });
    }
}

export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPost = await Post.findById(id);
        updatedPost.comments.push(req.body);
        await updatedPost.save();
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: 'could not add comment' });
    }
}

// DELETE
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.findByIdAndRemove(id);
        res.status(200).json(deletedPost);
    } catch (err) {
        res.status(404).json({ message: `${err}, cannot delete` });
    }
}