import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        likes: {
            type: Map,
            of: Boolean
        }, // MongoDB saves it as Map of type boolean, it checks if the userId exists, otherwise it returns false
        comments: {
            type: Array,
            default: []
        },
        sharedNum: Number,
        isShared: {
            type: Map,
            of: Boolean
        }
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;