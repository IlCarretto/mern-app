import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import ProfilePage from './scenes/profilePage';
import { useSelector } from 'react-redux';
import {CssBaseline, ThemeProvider} from "@mui/material";
import {createTheme} from '@mui/material/styles';
import { themeSettings } from './theme';
import { RootState } from '.';

function App() {
  const mode = useSelector((state: RootState) => state.mode);
  const theme = createTheme(themeSettings(mode));
  const isAuth = Boolean(useSelector((state: RootState) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/home" element={isAuth ? <HomePage/> : <Navigate to="/"/>}/>
            <Route path="/profile/:userId" element={isAuth ? <ProfilePage/> : <Navigate to="/"/>}/>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
