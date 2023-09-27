import React, {useEffect, useState} from 'react'
import {Box, Divider, Typography, InputBase, useTheme, Button, IconButton, useMediaQuery} from '@mui/material';
import { EditOutlined, DeleteOutlined, AttachFileOutlined, GifBoxOutlined, ImageOutlined, MicOutlined, MoreHorizOutlined }from '@mui/icons-material';
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/FlexBetween';
import UserImage from 'components/UserImage';
import WidgetWrapper from 'components/WidgetWrapper';
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from 'state';
import { RootState } from 'index';
import PostWidget from './PostWidget';
import { Post } from 'type';

const MyPostWidget = ({picturePath, 
  isShared = { [""]: false}
}: {picturePath: string,
   isShared?: Record<string, boolean>}) => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState<any>(null);
    const [post, setPost] = useState("");
    const {palette} = useTheme();
    const user = useSelector((state: RootState) => state.user);
    const {_id} = user!!;
    const token = useSelector((state: RootState) => state.token);
    const mediumMain = palette.neutral.main;
    const medium = palette.info.main;

    const handlePost = async () => {
      const formData = new FormData();
      formData.append("userId", _id.toString());
      formData.append("description", post);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }
      let resp;
      if (Object.values(isShared)[0] !== true) {
        resp = await fetch(`http://localhost:3001/posts`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`},
          body: formData,
        });
        console.log("post normale");
      } 
      else {
        const postId = Object.keys(isShared)[0];
        resp = await fetch(`http://localhost:3001/posts/share/${postId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`},
        body: formData,
        });
        console.log(formData);
        console.log("post condiviso");

      }
      const posts = await resp.json();
      dispatch(setPosts({posts}));
      setImage(null);
      setPost("");
    };
    const [sharedPost, setSharedPost] = useState<Post | null>(null);
    const getPost = async () => {
      const postId = Object.keys(isShared)[0];
      const resp = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`}
      });
      const data = await resp.json();
      setSharedPost(data);
    }

    useEffect(() => {
      if (Object.values(isShared)[0] === true) {
        getPost();
      }
    }, [isShared])

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath}/>
        <InputBase
        placeholder="What's on your mind?"
        onChange={(e) => setPost(e.target.value)}
        value={post}
        sx={{
          width: "100%",
          backgroundColor: palette.neutral.light,
          borderRadius: "2rem",
          padding: "1rem 2rem"
        }}/>
      </FlexBetween>
      {isImage && (
        <Box borderRadius="5px" border={`1px solid ${medium}`} mt="1rem" p="1rem">
          <Dropzone
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}>
                {({getRootProps, getInputProps}) => (
                <FlexBetween>
                  <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p="1rem" sx={{"&:hover": { cursor: "pointer "}}}>
                    <input {...getInputProps()}/>
                    {!image ? (
                      <p>Add image here</p>
                      ) : (
                        <FlexBetween>
                      <Typography>{image.name}</Typography> 
                      <EditOutlined/>
                    </FlexBetween>
                    )}
                  </Box>
                  {image && (
                    <IconButton
                    onClick={() => setImage(null)}
                    sx={{
                      width: "15%"
                    }}>
                      <DeleteOutlined/>
                    </IconButton>
                  )}
                </FlexBetween>
              )}
          </Dropzone>
        </Box>
      )}
      <Divider sx={{margin: "1.25rem 0"}}/>

      {Object.values(isShared)[0] === true && sharedPost && (
        <Box>
          <PostWidget 
          isShared={{[sharedPost._id]: true}} origin="modal"
          postId={sharedPost._id} postUserId={sharedPost.userId} name={`${sharedPost.firstName} ${sharedPost.lastName}`} description={sharedPost.description} location={sharedPost.location} picturePath={sharedPost.picturePath} userPicturePath={sharedPost.userPicturePath} likes={sharedPost.likes} comments={sharedPost.comments}/>
        </Box>
      )}

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{color: mediumMain}}/>
          <Typography
          color={mediumMain}
          sx={{
            "&:hover": {
              cursor: "pointer",
              color: medium
            }
          }}>
            Image
          </Typography>
        </FlexBetween>
        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{color: mediumMain}}/>
              <Typography color={mediumMain}>
                Clip
              </Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{color: mediumMain}}/>
              <Typography color={mediumMain}>
                Attach
              </Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{color: mediumMain}}/>
              <Typography color={mediumMain}>
                Audio
              </Typography>
            </FlexBetween>
            
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }}/>
          </FlexBetween>
        )}
        <Button disabled={!post} onClick={handlePost} sx={{
          color: palette.background.paper,
          backgroundColor: palette.primary.main,
          borderRadius: "3rem"
        }}>
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  )
}

export default MyPostWidget