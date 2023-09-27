import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import { Post, User } from '../type';
import { ThemeMode } from '../theme';

export type AppState = {
    mode: ThemeMode;
    user: User | null;
    token: string | null;
    posts: Post[] | null;
}

const initialState: AppState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setLogin: (state, action) => {
            const {payload} = action;
            state.user = payload.user;
            state.token = payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.error("setting friendlist failed");
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const {payload} = action;
            if (state.posts) {
                const updatedPosts = state.posts.map((post) => {
                    if (post._id === payload.post._id) return payload.post;
                    return post;
                })
                state.posts = updatedPosts;
            }
        }
    },
})

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;