import { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Input from '@mui/material/Input';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import axios from 'axios';
import { useGoogleLogout } from 'react-google-login';

import '../styles/ChatPage.css';
import { ChatState } from '../context/ChatProvider';
import ChatLoading from './ChatLoading';
import AddGroup from './AddGroup';

export default function LeftBar() {

  const { signOut } = useGoogleLogout({});
  const { selectedChat, setSelectedChat, user, chats, setChats, notif, setNotif } = ChatState();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorSetEl, setAnchorSetEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openMenu = Boolean(anchorEl);
  const openSettings = Boolean(anchorSetEl);
  const ref = useRef(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleSettingClick = (event) => {
    setAnchorSetEl(event.currentTarget);
  };
  const handleSettingClose = () => {
    setAnchorSetEl(null);
  };

  const getChats = async () => {
    try {
      const userToken = user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const { data } = await axios.get('/group', config);
      for (let i = 0; i < data.length; i++) {
        if(data[i].isPersonal) {
          const names = data[i].groupName.split('_');
          const urls = data[i].groupAvatar.split('_');
          if(names[0] === user.username) {
            data[i].groupName = names[1];
            data[i].groupAvatar = urls[1];
          }
          else {
            data[i].groupName = names[0];
            data[i].groupAvatar = urls[0];
          }
        }
      }
      setChats(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getChats();
  }, []);

  useEffect(async () => {
    if (!search) {
      setResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/user?search=${search}`, config);
      setResult(data.users);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [search]);

  const deleteGroup = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const groupId = selectedChat;
      const userToken = user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      await axios.delete(`/group/${groupId}`, config);
      setSelectedChat(null);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  const openWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dkgydognh',
        uploadPreset: 'imgUpload',
      },
      (error, result) => {
        if (result.event === 'success') {
          const url = result.info.secure_url;
          handleChangeAvatar(url);
        }
        else {
          console.log(error);
        }
      },
    );
    widget.open();
  }

  const handleChangeAvatar = async (url) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(`/user`, { 
        username: user.username,
        user_avatar: url,
      }, config);
      user.user_avatar = data.updatedUser.user_avatar;
      handleMenuClose();
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleLogout = () => {
    signOut();
    sessionStorage.removeItem('userInfo');
    window.location.reload();
  }

  const handleUserSelect = async (userData) => {
    if (userData._id === user._id)
      return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const userList = [userData];
      const { data } = await axios.post(`/group`, {
        name: `${userData.username}_${user.username}`,
        members: userList,
        isPersonal: true,
        groupAvatar: `${userData.user_avatar}_${user.user_avatar}`,
      }, config);
      getChats();
      setDrawerOpen(false);
      setSelectedChat(data._id);
      setSearch('');
    } catch (err) {
      console.log(err);
    }
  }

  const getCount = (group) => {
    let count = 0;
    for (let i = 0; i < notif.length; i++) {
      if (notif[i].groupId === group._id) {
        count++;
      }
    }
    return count;
  }

  return (
    <Box sx={{
      width: { md: '25%', sm: '33%', xs: '100%' },
      height: '100%',
      backgroundColor: '#000000',
      display: { sm: 'flex', xs: selectedChat ? 'none' : 'flex' },
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      {/* Search for users  */}
      <TextField
        variant='outlined'
        label='Search for Users'
        size='small'
        disabled={true}
        onClick={() => setDrawerOpen(true)}
        InputLabelProps={{
          style: {
            color: '#BC6FF1',
          }
        }}
        style={{
          width: '80%',
          margin: '2rem 0',
          backgroundColor: '#161819',
          borderRadius: '1rem',
          border: '3px solid #08D9D6',
        }}
      ></TextField>

      <SwipeableDrawer
        anchor='left'
        variant='temporary'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
      >
        <Box sx={{
          backgroundColor: '#393E46',
          width: '100%',
          height: '100%',
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '2rem 4rem',
            color: '#fff',
          }}>
            <Typography variant='h4' style={{
              color: '#00ADB5',
              fontWeight: '600',
            }}>Search Users</Typography>
            <Input
              placeholder="Username or Email ..."
              autoFocus={true}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                marginTop: '1.5rem',
                color: '#fff',
                width: '100%',
              }}
            ></Input>
          </Box>
          <Divider variant="middle" sx={{
            width: '100%',
          }} />
          <Box>
            {loading ? <ChatLoading /> : (result.length > 0 ? result.map((userData) => (
              <Box key={userData._id}
                onClick={() => handleUserSelect(userData)}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '70%',
                  margin: '1rem auto',
                  padding: '0.5rem',
                  background: 'linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)',
                  borderRadius: '1rem',
                  ":hover": {
                    cursor: 'pointer',
                    border: '1px solid #fff',
                    background: 'linear-gradient(to right, #373b44, #4286f4)'
                  }
                }}>
                <Avatar src={userData.user_avatar} 
                sx={{
                  width: '2.5rem',
                  height: '2.5rem',
                }} />
                <Box
                  cursor='pointer'
                  width='100%'
                  display='flex'
                  flexDirection='column'
                  alignItems='center'
                >
                  <Typography variant='body1'>{userData.username}</Typography>
                  <Typography variant='body2'><b>Email : </b>{userData.email}</Typography>
                </Box>
              </Box>
            )) : <Typography variant='body1' align='center' style={{
              marginTop: '3rem',
              color: '#fff',
            }}>No users found !</Typography>)}
          </Box>
        </Box>
      </SwipeableDrawer>

      {/* User Profile */}
      <Box sx={{
        width: '80%',
        backgroundColor: '#52057B',
        height: '5rem',
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '2rem',
      }}>
        <Avatar src={user.user_avatar} variant='rounded' style={{
          marginLeft: '1.5rem',
        }} />
        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          mx: '1.5rem',
          color: '#fff',
        }}>
          <Typography variant='h6'>{user.username}</Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            mt: '0.3rem',
            width: '100%',
          }}>
            <CircleIcon sx={{
              color: '#62c554',
              fontSize: '1rem',
            }} />
            <p style={{ marginLeft: '0.4rem' }}>Online</p>
          </Box>
        </Box>
        <Button
          aria-controls={openMenu ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? 'true' : undefined}
          onClick={handleMenuClick}
        >
          <MoreHorizIcon sx={{
            marginRight: '1.5rem',
            color: '#fff',
            fontSize: '1.5rem',
          }} />
        </Button>

        <Menu
          open={openMenu}
          onClose={handleMenuClose}
          anchorEl={anchorEl}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={openWidget}>Change Avatar</MenuItem>
          {/* TODO: allow change username */}
          <MenuItem >Change Username</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>

      {/* Chats */}
      <Box sx={{
        mt: '4rem',
        width: '80%',
        height: 'max-content',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'scroll',
      }}>
        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <Typography variant='h6'> My Chats </Typography>
          <IconButton
            onClick={() => { setModalOpen(true) }}
            sx={{
              padding: '0',
            }}>
            <AddIcon sx={{
              color: '#fff',
              fontSize: '2rem',
            }} />
          </IconButton>
          <Modal
            onClose={() => { setModalOpen(false) }}
            open={modalOpen}
            width='100%'
          >
            <AddGroup ref={ref} />
          </Modal>
        </Box>
        {chats ? (
          chats.map((item) => (
            <Badge
              badgeContent={getCount(item)}
              key={item._id}
              color='success'
              max={99}
              sx={{
                marginTop: '1rem',
                width: '95%',
              }}
            >
              <ListItemButton
                onClick={() => {
                  setSelectedChat(item._id)
                  setNotif(notif.filter((n) => n.groupId !== item._id))
                }}
                sx={{
                  ":hover": {
                    cursor: 'pointer',
                    backgroundColor: '#892CDC',
                  },
                  backgroundColor: selectedChat === item._id ? '#5800FF' : '#000000',
                  width: '100%',
                  cursor: 'pointer',
                  paddingLeft: '0',
                  paddingRight: '0',
                  border: '2px solid',
                  borderImageSlice: '1',
                  borderImageSource: 'linear-gradient(220.94deg, #3D80FF 30%, #903BF5 70%)',
                }}>
                <Avatar src={item.groupAvatar} />
                <ListItemText primary={item.groupName} style={{
                  marginLeft: '1rem',
                  color: '#fff',
                }} />
                <SettingsIcon
                  aria-controls={openSettings ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openSettings ? 'true' : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSettingClick(e);
                  }}
                  sx={{
                    color: '#fff',
                    fontSize: '1.5rem',
                    marginRight: '1rem',
                  }} />
                <Menu
                  open={openSettings}
                  onClose={handleSettingClose}
                  anchorEl={anchorSetEl}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}>
                  <MenuItem>Rename</MenuItem>
                  <MenuItem
                    onClick={deleteGroup}
                  >Delete</MenuItem>
                </Menu>
              </ListItemButton>
            </Badge>
          ))) : (<ChatLoading />)
        }
      </Box>
    </Box>
  );
}
