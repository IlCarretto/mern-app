import React, {useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from 'state';
import PostWidget from './PostWidget';
import { RootState } from 'index';
import mongoose from 'mongoose';

const PostsWidget = ({userId, isProfile = false}: {userId: mongoose.Types.ObjectId | string, isProfile?: boolean}) => {
    const dispatch = useDispatch();
    let posts = useSelector((state: RootState) => state.posts);
    const token = useSelector((state: RootState) => state.token);

    const getPosts = async () => {
        const resp = await fetch('http://localhost:3001/posts', {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`}
        });
        const data = await resp.json();
        dispatch(setPosts({posts: data}));
    }

    const getUserPosts = async () => {
        const resp = await fetch(`http://localhost:3001/posts/${userId}/posts`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`}
        });
        const data = await resp.json();
        dispatch(setPosts({posts: data}));
    }

    useEffect(() => {
        if(isProfile) {
            getUserPosts();
        } else {
            getPosts();
        }
    }, []); //eslint-disable-line react-hooks/exhaustive-deps

    if (posts && posts.length) {
      // Create a copy of the original array using the spread operator
      const sortedPosts = [...posts!]?.sort((a, b) => {
        if (!a?.createdAt && !b?.createdAt) {
          return 0; // Both are null, consider them equal
        } else if (!a?.createdAt) {
          return 1; // 'a' is null, place it after 'b'
        } else if (!b?.createdAt) {
          return -1; // 'b' is null, place it after 'a'
        }
      
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
      
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return dateB - dateA;
        }
      
        return 0; // Handle any other cases
      });
    
      posts = sortedPosts;
    }

  return (
    <>
    {!posts ? (
        <h1>Loading..</h1>
    ) : (
        <>
        {posts.map(
            ({_id, userId, firstName, lastName, description, location, picturePath, userPicturePath, likes, comments, sharedNum, isShared}) => (
                <PostWidget origin='posts' key={_id ? _id.toString() : 'defaultKey'} postId={_id} postUserId={userId} name={`${firstName} ${lastName}`} description={description} location={location} picturePath={picturePath} userPicturePath={userPicturePath} likes={likes} comments={comments} sharedNum={sharedNum} isShared={isShared}/>
            )
        )}
        </>
    )}
    </>
  )
}

export default PostsWidget