import React, {useEffect} from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import WidgetWrapper from 'components/WidgetWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { setFriends } from 'state'
import { RootState } from 'index'
import Friend from 'components/Friend'

const FriendListWidget = ({userId}: {userId: string}) => {
    const dispatch = useDispatch();
    const {palette} = useTheme();
    const token = useSelector((state: RootState) => state.token);
    const friends = useSelector((state: RootState) => state.user?.friends);

    const getFriends = async () => {
        try {
            const resp = await fetch(`http://localhost:3001/users/${userId}/friends`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`}
            })
            const data = await resp.json();
            dispatch(setFriends({friends: data}));
        } catch (err) {
            console.error(err, 'Failed to fetch user friends');
        }
    }

    useEffect(() => {
        getFriends();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
        <Typography color={palette.neutral.dark} variant='h5' fontWeight='500' sx={{ mb: '1.5rem'}}>Friend List</Typography>
        <Box display='flex' flexDirection='column' gap='1.5rem'>
            {friends?.map((friend) => (
                <Friend 
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`} 
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}/>
            ))}
        </Box>
    </WidgetWrapper>
  )
}

export default FriendListWidget