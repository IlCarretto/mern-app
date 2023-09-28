import React from 'react';
import {Box, Modal, Typography, Button, useTheme } from '@mui/material';
import { IModal } from 'type';
import {useDispatch, useSelector} from 'react-redux';
import { setDeletePost } from 'state';
import { RootState } from 'index';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    width: 500,
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    padding: 2,
    display: 'flex',
    flexDirection: 'column'
};

const DeleteModal = ({isOpen, setIsOpen, id}: IModal) => {
    const {palette} = useTheme();
    const medium = palette.info.main;
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.token);

    const handleDelete = async () => {
        try {
          const resp = await fetch(`http://localhost:3001/posts/${id}/delete`, {
            method: 'DELETE',
            headers: {Authorization: `Bearer ${token}`}
          });
          if (resp.ok) {
            const deletedPost = await resp.json();
            dispatch(setDeletePost({ post: deletedPost}));
          } else {
            console.error('Failed to fetch delete', resp.status);
          }
        } catch (err) {
          console.error(err);
        }
    } 

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={style}>
            <Typography color={medium} variant='h4'>Delete Post</Typography>
            <Typography mt='1rem'>Are you sure you want to delete this post?</Typography>
            <Box mt='1rem' display='flex' justifyContent='flex-end' gap='1rem'>
                <Button variant='contained' onClick={handleDelete}>CONFIRM</Button>
                <Button variant='outlined' onClick={() => setIsOpen(false)}>CANCEL</Button>
            </Box>
        </Box>
    </Modal>
  )
}

export default DeleteModal