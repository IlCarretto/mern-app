import React, {useState, useEffect} from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import { FavoriteOutlined, FavoriteBorderOutlined, ChatBubbleOutlineOutlined, ReplyOutlined } from '@mui/icons-material';
import Friend from 'components/Friend';
import FlexBetween from 'components/FlexBetween';
import {useDispatch, useSelector} from 'react-redux';
import WidgetWrapper from 'components/WidgetWrapper';
import { RootState } from 'index';
import { User } from 'type';

const SharedPostWidget = ({postId}: {postId: string}) => {
    const dispatch = useDispatch();
    const posts = useSelector((state: RootState) => state.posts);
    const sharedPost = posts?.find((post) => post._id === postId);
    const token = useSelector((state: RootState) => state.token);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const {palette} = useTheme();
    const main = palette.neutral.main;

    const getUser = async () => {
      setIsLoading(true);
      const resp = await fetch(`http://localhost:3001/users/${sharedPost?.userId}`,
      {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`},
      });
      const data = await resp.json();
      setUser(data);
      setIsLoading(false);
    }

    useEffect(() => {
      getUser();
    }, [])

    if (!sharedPost) {
      return <h1>Loading..</h1>
    }

    if (!user) {
      return <h1>Loading..</h1>
    }

  return (
    <WidgetWrapper>
        <Friend friendId={sharedPost.userId} name={`${user.firstName} ${user.lastName}`} subtitle={user.location} userPicturePath={sharedPost.userPicturePath}/>
        <Typography color={main} sx={{mt: '1rem'}}>{sharedPost.description}</Typography>
        {
          sharedPost.picturePath && (
            <img width='100%' height='auto' alt='post' style={{borderRadius: '0.75rem', marginTop: '0.75rem'}} src={`http:localhost:3001/assets/${sharedPost.picturePath}`}/>
          )
        }
    </WidgetWrapper>
  )
}

export default SharedPostWidget