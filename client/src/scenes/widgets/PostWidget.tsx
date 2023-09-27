import React, {useState} from 'react'
import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined, ReplyOutlined } from '@mui/icons-material';
import { Box, Divider, IconButton, Typography, useTheme, InputBase, Button} from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Friend from "components/Friend";
import WidgetWrapper from 'components/WidgetWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from 'state';
import { RootState } from 'index';
import SharedModal from './SharedModal';
import SharedPostWidget from './SharedPostWidget';
const PostWidget = ({
  postId, postUserId, name, description, location, picturePath, userPicturePath, likes, comments,
   isShared = { [""] : false}, sharedNum, origin
}: {postId: string, postUserId: string; name: string; description: string; location: string; picturePath: string; userPicturePath: string, likes: Record<string, boolean>, comments: string[], isShared?: Record<string, boolean>, sharedNum?: number, origin: string}) => {
  const [commentContent, setCommentContent] = useState("");
  const [isComments, setIsComments] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token);
  const loggedInUserId = useSelector((state: RootState) => state.user?._id);
  const isLiked = Boolean(likes[(loggedInUserId!)]);
  const likesCount = Object.keys(likes).length;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main; 

  const patchLike = async () => {
    const resp = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({userId: loggedInUserId}) // we give back to the be the user who liked to keep track
    });
    const updatedPost = await resp.json();
    dispatch(setPost({post: updatedPost}));
  }

  const postComment = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        body: commentContent
      });
      if (resp.ok) {
        const updatedPost = await resp.json();
        dispatch(setPost({ post: updatedPost }));
        setIsComments(true);
        setCommentContent(""); 
      } else {
        console.error("Failed to add comment:", resp.status, resp.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // MODAL
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <WidgetWrapper m="2rem 0">
        <Friend friendId={postUserId} name={name} subtitle={location} userPicturePath={userPicturePath}/>
        <Typography color={main} sx={{mt: "1rem"}}>
          {description}
        </Typography>
        {picturePath && (
          <img width="100%" height="auto" alt="post" style={{borderRadius: "0.75rem", marginTop: "0.75rem"}} src={`http://localhost:3001/assets/${picturePath}`}/>
          )}
          {Object.values(isShared)[0] === true && origin === 'posts' && (
            <Box>
              <SharedPostWidget postId={Object.keys(isShared)[0]}/>
            </Box>
          )}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
          {/* likes */}
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{color: primary}}/>
                  ) : (
                    <FavoriteBorderOutlined />
                    )}
              </IconButton>
              <Typography>{likesCount}</Typography>
            </FlexBetween>
          {/* comments */}
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined/>
              </IconButton>
              <Typography>
                {comments.length}
              </Typography>
            </FlexBetween>
            {/* shares */}
            <FlexBetween gap="0.3rem">
              <IconButton>
                <ReplyOutlined/>
              </IconButton>
              <Typography>
                {sharedNum ?? 0}
              </Typography>
            </FlexBetween>
          </FlexBetween>

          {origin === 'posts' && (
            <IconButton onClick={() => setIsOpen(true)}>
              <ShareOutlined/>
            </IconButton>
          )}

        </FlexBetween>
        {isComments && (
          <Box mt="0.5rem">
            {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider/>
                <Typography sx={{color: main, m: "0.5rem 0", pl: "1rem"}}>
                  {comment}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        <Divider/>
        {origin === 'posts' && (
          <>
            <FlexBetween>
              <InputBase
              placeholder='Add comment'
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              sx={{
                width: '100%',
                backgroundColor: palette.neutral.light,
                borderRadius: '1rem',
                padding: "0.75rem",
                marginTop: '1rem'
              }}
              />
            </FlexBetween>
            <Box display='flex' justifyContent='flex-end'
            alignItems='center' mt='0.5rem'>
              <Button 
              disabled={!commentContent} 
              onClick={postComment}
              sx={{
                color: palette.background.paper,
                backgroundColor: palette.primary.main,
                borderRadius: "3rem"
              }}>
                COMMENT
              </Button>
            </Box>
          </>
        )}
      </WidgetWrapper>
      {isOpen && <SharedModal postId={postId} isOpen={isOpen} setIsOpen={setIsOpen}/>}
    </>
  )
}

export default PostWidget