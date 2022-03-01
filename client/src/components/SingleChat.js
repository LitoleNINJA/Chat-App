import {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import AddBoxIcon from '@mui/icons-material/AddBox';
import axios from 'axios';
import ScrollableFeed from 'react-scrollable-feed';
import Avatar from '@mui/material/Avatar';

import { ChatState } from '../context/ChatProvider';

export default function SingleChat() {

  const { selectedChat, user, setUser } = ChatState();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [groupName, setGroupName] = useState('');

  const getGroup = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/group/${selectedChat}`, config);
      setGroupName(data.groupName);
    } catch(err) {
      console.log(err);
    }
  }

  const getMessages = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/message/${selectedChat}`, config);
      setMessages(data);
    } catch(err) {
      console.log(err);
    }
  };

  const sendMessage = async (e) => {
    if(e.key === 'Enter' && newMessage) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const messagenInfo = {
          groupId: selectedChat,
          text: newMessage,
        }
        const res = await axios.post(`/message`, messagenInfo, config);
        setNewMessage('');
        setMessages([...messages, res.data]);
      } catch(err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    getGroup();
    getMessages();
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    setUser(userInfo);
  }, [selectedChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  }

  const isSenderSame = (messages, m, i) => {
    return (
      (i > 0 &&
        messages[i - 1].sender.userId === m.sender.userId
      )
    );
  }

  const isSenderUser = (messages, i, userId) => {
    console.log(messages[i].sender.userId, user._id);
    return (
      messages[i].sender.userId === userId
    );
  }

  return (
    <>
    { selectedChat ? (
      <>
          <Box sx={{
            height: '3rem',
            px: '2rem',
            color: '#fff',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.5)',
          }}>
            <Typography variant='h6'>{groupName}</Typography>
          </Box>

          <Box sx={{
            height: 'calc(100% - 10rem)',
          }}>
            <ScrollableFeed className='scroll-div'>
              {messages && messages.map((m, i) => (
                <Box key={i} sx={{
                  display: 'flex',
                }}>
                  {(!isSenderSame(messages, m, i) && (
                      <Avatar alt={m.sender.username} sx={{
                        width: '1rem',
                        height: '1rem',
                      }} />
                  ))}
                  <Box sx={{
                    bgcolor: `${m.sender.userId === user._id ? '#27292e' : '#181b20'}`,
                    borderRadius: '10rem 0 10rem 10rem',
                    p: '0.5rem',
                    maxWidth: '50%',
                    marginLeft: isSenderUser(messages, i, user._id) ? 'auto' : '1rem',
                    marginTop: isSenderSame(messages, m, i) ? '1rem' : '4rem',
                  }}>
                    <Typography variant='body1' style={{
                      color: '#fff',
                    }}>{m.text}</Typography>
                  </Box>
                </Box>
              ))}
            </ScrollableFeed>
          </Box>

          <Box sx={{
            height: '3rem',
          }}>
            <Box sx={{
              height: '100%',
              m: '1rem 1rem',
              px: '0.5rem',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#27292e',
              borderRadius: '0.5rem',
            }}>
              <IconButton>
                  <EmojiEmotionsIcon style={{
                    color: '#fff',
                  }}/>
              </IconButton>
              <Input 
              placeholder="Type a message..." 
              disableUnderline 
              onChange={typingHandler}
              onKeyDown={sendMessage}
              style={{
                color: '#fff',
                width: '85%',
              }} />
              <IconButton>
                  <AddBoxIcon style={{
                    color: '#fff',
                  }}/>
              </IconButton>
              <IconButton aria-label='submit' onClick={sendMessage}>
                  <SendIcon style={{
                    color: '#fff',
                  }}/>
              </IconButton>

            </Box>
          </Box>
      </>
    ) : (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        mx: 'auto',
        height: '100%',
      }}>
        <Typography variant='h5' sx={{
          color: '#fff',
        }}>
          Select a chat to start messaging
        </Typography>
      </Box>
    )}
    </>
  );
}
