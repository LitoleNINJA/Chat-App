import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import CircleIcon from '@mui/icons-material/Circle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';

import '../styles/ChatPage.css';
import { ChatState } from '../context/ChatProvider';

export default function LeftBar() {

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const [open, setOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState();

  const getChats = async () => {
    try {
      const userToken = user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const { data } = await axios.get('/group', config);
      setChats(data);
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    getChats();
  }, []);

  return ( 
    <Box sx={{
        width: '25%',
        height: '100%',
        position: 'absolute',
        left: 0,
        backgroundColor: '#181b20',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }}>

        <TextField 
        variant='outlined'
        label='Search for Users'
        size='small'
        InputLabelProps={{
          style: {
            color: 'rgba(255, 255, 255, 0.5)',
          }
        }}
        style={{
            width: '80%',
            margin: '2rem 0',
            backgroundColor: '#161819',
            borderRadius: '1rem',
        }}
        ></TextField>

        <Box sx={{
          width: '80%',
          backgroundColor: '#27292e',
          height: '5rem',
          borderRadius: '1rem',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Avatar alt="ProfilePic" src="../../assets/profilepic1.svg" variant='rounded' style={{
            marginLeft: '1.5rem',
          }}/>
          <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            mx: '1.5rem',
            color: '#fff',
          }}>
            <h2>Ritwik</h2>
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
              }}/>
              <p style={{ marginLeft: '0.4rem' }}>Online</p>
            </Box>
          </Box>
          <MoreHorizIcon sx={{
            marginRight: '1.5rem',
            color: '#fff',
            fontSize: '1.5rem',
          }} />
        </Box>

        <Box sx={{
          mt: '2rem',
          width: '80%',
          height: 'max-content',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflowY: 'scroll',   
        }}>
          <ListItemButton 
          onClick={()=>setOpen(!open)}
          style={{
            justifyContent: 'space-between',
            width: '100%',
            fontSize: '4vmin',
            padding: '0',
          }}
          > My Chats
            <KeyboardArrowDown />
          </ListItemButton>
          {open && chats.map((item) => (
            <ListItemButton 
            key={item._id} 
            onClick={()=>setSelectedChat(item._id)} 
            selected={selectedChat === item._id}
            style={{
              width: '100%',
              cursor: 'pointer',
              paddingLeft: '0',
            }}>
              <ListItemIcon>{item.avatar}</ListItemIcon>
              <ListItemText primary={item.groupName} style={{
                color: '#fff',
              }} />
            </ListItemButton>
          ))}
        </Box>
    </Box>
  );
}
