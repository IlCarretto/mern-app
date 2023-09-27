import React from 'react'
import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material' 
import {Box, IconButton, Typography, useTheme} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from 'state';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'index';
import mongoose from 'mongoose';

const Friend = ({friendId, name, subtitle, userPicturePath}: {friendId: string; name: string; subtitle: string; userPicturePath: string}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const {_id } = user!!;
  const token = useSelector((state: RootState) => state.token);
  const friends = useSelector((state: RootState) => state.user?.friends);
  
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.info.main;
  
  const isFriend = friends?.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const resp = await fetch(`http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    const data = await resp.json();
    dispatch(setFriends({friends: data}));
  }

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px"/>
        <Box onClick={() => {navigate(`/profile/${friendId}`); navigate(0)}}>
          <Typography color={main} variant='h5' fontWeight="500" sx={{"&:hover": {
            color: palette.primary.light,
            cursor: "pointer"
          }}}>
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {user?._id !== friendId &&
      <IconButton
      onClick={() => patchFriend()} sx={{backgroundColor: primaryLight, p: "0.6rem"}}>
        {isFriend ? (
          <PersonRemoveOutlined sx={{color: primaryDark}}/>
        ): (
          <PersonAddOutlined sx={{color: primaryDark}}/>
        )}
      </IconButton>
      }
    </FlexBetween>
  )
}

export default Friend;