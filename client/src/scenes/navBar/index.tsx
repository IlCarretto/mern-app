import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Autocomplete,
  CircularProgress,
  TextField
} from "@mui/material";
import {Search, Message, DarkMode, LightMode, Notifications, Help, Menu, Close} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout } from '../../state';
import { Form, useNavigate } from 'react-router-dom';
import FlexBetween from '../../components/FlexBetween';
import { RootState } from '../..';
import { Options } from 'type';

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px");

  const theme = useTheme(); 
  const neutralLight = theme.palette.info.light;
  const neutralDark = theme.palette.info.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.paper;

  const fullName = `${user?.firstName} ${user?.lastName}`;
  const token = useSelector((state: RootState) => state.token);

  const [searchOptions, setSearchOptions] = useState<Options>({
    inputValue: '',
    options: [],
    loading: false
  })

  const handleSearch = async () => {
    setSearchOptions((prev) => ({
      ...prev,
      loading: true
    }));
    try {
      const resp = await fetch(`http://localhost:3001/users/search?user=${encodeURIComponent(searchOptions.inputValue)}`, {
      method: 'GET',
      headers: {Authorization: `Bearer ${token}`},
      });
      if (!resp.ok) {
        throw new Error('HTTP error');
      }
      const data = await resp.json();
      setSearchOptions((prev) => ({
        ...prev,
        options: data,
        loading: false
      }));
    } catch (err) {
      console.error(err);
      setSearchOptions((prev) => ({
        ...prev,
        loading: false
      }))
    }
    
  };

  useEffect(() => {
    if (searchOptions.inputValue !== '') {
      handleSearch();
    } else {
      setSearchOptions((prev) => ({
        ...prev,
        options: []
      }))
    }
  }, [searchOptions.inputValue]);

  return (
    <FlexBetween padding="1rem 6%" bgcolor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography fontWeight="bold"
         fontSize="clamp(1rem, 2rem, 2.25rem)"
         color="primary"
         onClick={() => navigate("/home")}
         sx={{
          "&:hover": {
            color: primaryLight,
            cursor: "pointer"
          }
         }}>
          Sociopedia
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween bgcolor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
            <Autocomplete
              sx={{ width: '200px'}}
              id="autocomplete-search"
              options={searchOptions.options}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              onChange={(event, newValue) => {
                if (newValue) {
                  navigate(`/profile/${newValue._id}`);
                }
              }}
              isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
              onInputChange={(e, newInputValue) => {
                setSearchOptions((prev) => ({
                  ...prev,
                  inputValue: newInputValue
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search"
                  variant='filled'
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                      { searchOptions.loading ? 
                      (<CircularProgress color='inherit' size={20}/>) :
                      (params.InputProps.endAdornment)
                      }
                      </>
                    )
                  }}
                />
              )}
              />
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
      <FlexBetween gap="2rem">
        <IconButton onClick={() => dispatch(setMode())}>
          {theme.palette.mode === 'dark' ? (
            <DarkMode sx={{fontSize: "25px"}}/>
          ) : (
            <LightMode sx={{ color: neutralDark, fontSize: "25px"}}/>
          )}
        </IconButton>
        <Message sx={{fontSize: "25px"}}/>
        <Notifications sx={{fontSize: "25px"}}/>
        <Help sx={{fontSize: "25px"}}/>
        <FormControl variant='standard'>
          <Select value={fullName}
          sx={{backgroundColor: neutralLight,
          width: "150px",
          borderRadius: "0.25rem",
          p: "0.25rem 1rem",
          "& .MuiSvgIcon-root": {
            pr: "0.25rem",
            width: "3rem"
          },
          "& .MuiSelect-select:focus": {
            backgroundColor: neutralLight
          }
          }}
          input={<InputBase/>}>
            <MenuItem value={fullName}>
              <Typography>
                {fullName}
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
          </Select>
        </FormControl>
      </FlexBetween>
      ) : (
      <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
        <Menu/>
      </IconButton>
      )}
      
      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
      <Box position="fixed" right="0" bottom="0" height="100%" zIndex="10" maxWidth="500px" minWidth="300px" bgcolor={background}>
        {/* CLOSE ICON */}
        <Box display="flex" justifyContent="flex-end" p="1rem">
          <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
            <Close/>
          </IconButton>
        </Box>

          {/* MENU ITEMS */}
          <FlexBetween display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="3rem">
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === 'dark' ? (
                <DarkMode sx={{fontSize: "25px"}}/>
              ) : (
                <LightMode sx={{ color: neutralDark, fontSize: "25px"}}/>
              )}
            </IconButton>
            <Message sx={{fontSize: "25px"}}/>
            <Notifications sx={{fontSize: "25px"}}/>
            <Help sx={{fontSize: "25px"}}/>
            <FormControl variant='standard'>
              <Select value={fullName}
              sx={{backgroundColor: neutralLight,
              width: "150px",
              borderRadius: "0.25rem",
              p: "0.25rem 1rem",
              "& .MuiSvgIcon-root": {
                pr: "0.25rem",
                width: "3rem"
              },
              "& .MuiSelect-select:focus": {
                backgroundColor: neutralLight
              }
              }}
              input={<InputBase/>}>
                <MenuItem value={fullName}>
                  <Typography>
                    {fullName}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  )
}

export default Navbar