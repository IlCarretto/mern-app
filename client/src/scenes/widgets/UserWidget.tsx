import React, {useEffect, useState} from 'react'
import { ManageAccountsOutlined, EditOutlined, LocationOnOutlined, WorkOutlineOutlined } from '@mui/icons-material';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import UserImage from 'components/UserImage';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'index';
import { User } from 'type';
import mongoose from 'mongoose';

const UserWidget = ({userId, picturePath}: { userId: mongoose.Types.ObjectId | string; picturePath: string;}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.token);
    const neutralDark = palette.info.dark;
    const medium = palette.secondary.main;
    const main = palette.info.main;

    const getUser = async () => {
        setIsLoading(true);
        const resp = await fetch(`http://localhost:3001/users/${userId}`,
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
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    const location = user?.location || '';
    const occupation = user?.occupation || '';
    const viewedProfile = user?.viewedProfile || 0;
    const impressions = user?.impressions || 0;
    const friends = user?.friends || [];

    return (
        <WidgetWrapper>
            {isLoading ? (
                <h1>Loading..</h1>
            ) : (
                <>
                    {/* first row */}
                    <FlexBetween gap="0.5rem" pb="1.1rem" onClick={() => navigate(`/profile/${userId}`)}>
                        <FlexBetween gap="1rem">
                            <UserImage image={picturePath} />
                            <Box>
                                <Typography variant='h4' color={neutralDark} fontWeight="500" sx={{
                                    "&:hover": {
                                        color: palette.primary.light,
                                        cursor: "pointer"
                                    }
                                }}>
                                    {firstName} {lastName}
                                </Typography>
                                <Typography color={medium}>{friends.length} friends</Typography>
                            </Box>
                        </FlexBetween>
                        <ManageAccountsOutlined />
                    </FlexBetween>

                    <Divider />

                    {/* second row */}
                    <Box p="1rem 0">
                        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                            <LocationOnOutlined fontSize='large' sx={{ color: main }} />
                            <Typography color={medium}>{location}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="1rem">
                            <WorkOutlineOutlined fontSize='large' sx={{ color: main }} />
                            <Typography color={medium}>{occupation}</Typography>
                        </Box>
                    </Box>

                    <Divider />

                    {/* third row */}
                    <Box p="1rem 0">
                        <FlexBetween mb="0.5rem">
                            <Typography color={medium}>Who's viewed your profile</Typography>
                            <Typography color={main} fontWeight="500">{viewedProfile}</Typography>
                        </FlexBetween>
                        <FlexBetween>
                            <Typography color={medium}>Impressions of your posts</Typography>
                            <Typography color={main} fontWeight="500">{impressions}</Typography>
                        </FlexBetween>
                    </Box>

                    <Divider />

                    {/* fourth row */}
                    <Box p="1rem 0">
                        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                            Social profiles
                        </Typography>
                        <FlexBetween gap="1rem" mb="0.5rem">
                            <FlexBetween gap="1rem">
                                <img src='../assets/twitter.png' alt='twitter' />
                                <Box>
                                    <Typography color={main} fontWeight="500">
                                        Twitter
                                    </Typography>
                                    <Typography color={medium}>
                                        Social Network
                                    </Typography>
                                </Box>
                            </FlexBetween>
                            <EditOutlined sx={{ color: main }} />
                        </FlexBetween>

                        <FlexBetween gap="1rem">
                            <FlexBetween gap="1rem">
                                <img src='../assets/linkedin.png' alt='linkedin' />
                                <Box>
                                    <Typography color={main} fontWeight="500">
                                        Linkedin
                                    </Typography>
                                    <Typography color={medium}>
                                        Network Platform
                                    </Typography>
                                </Box>
                            </FlexBetween>
                            <EditOutlined sx={{ color: main }} />
                        </FlexBetween>
                    </Box>
                </>
            )}
        </WidgetWrapper>
    );
}

export default UserWidget;