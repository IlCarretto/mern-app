import React, {useState} from 'react'
import { Box, Modal } from '@mui/material';
import MyPostWidget from './MyPostWidget';
import { useSelector } from 'react-redux';
import { RootState } from 'index';

interface IProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    postId: string;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    width: 500,
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2
};

const SharedModal = ({isOpen, setIsOpen, postId}: IProps) => {

    const user = useSelector((state: RootState) => state.user);

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={style}>
            <MyPostWidget picturePath={user?.picturePath ?? ''} isShared={{[postId]: true}}/>
        </Box>
    </Modal>
  )
}

export default SharedModal