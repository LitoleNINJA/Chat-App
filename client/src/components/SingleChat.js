import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import AddBoxIcon from '@mui/icons-material/AddBox';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import { LottieAnimation } from "react-lottie-tools";

import { ChatState } from '../context/ChatProvider';
import typingAnimation from '../animations/typingAnimation.json';
import io from 'socket.io-client';
var socket, chatCompare;

export default function SingleChat() {

  const { selectedChat, user, setUser } = ChatState();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [typing, setTyping] = useState(false);
  const [notification, setNotification] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const getGroup = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/group/${selectedChat}`, config);
      setGroupName(data.groupName);
    } catch (err) {
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
      socket.emit('join chat', selectedChat);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket = io(`http://localhost:5000`);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('not typing', () => setIsTyping(false));
  }, []);

  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  const sendMessage = async (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && newMessage) {
      socket.emit('stop typing', selectedChat);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const messagenInfo = {
          groupId: selectedChat,
          text: newMessage,
          isImage: false,
        }
        const res = await axios.post(`/message`, messagenInfo, config);
        setNewMessage('');
        setMessages([...messages, res.data]);
        scrollToBottom();
        const { data } = await axios.get(`/group/${selectedChat}`, config);
        socket.emit('send message', res.data, data);

      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    getGroup();
    getMessages();
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    setUser(userInfo);
    chatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message recieved', (message) => {
      console.log(message);
      if (!chatCompare || chatCompare !== message.groupId) {
        if (!notification.includes(message)) {
          setNotification([message, ...notification]);
        }
      }
      else {
        setMessages([...messages, message]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected)
      return;
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat);
    }
    var timerLength = 3000;
    setTimeout(() => {
      setTyping(false);
      socket.emit('not typing', selectedChat);
    }, timerLength);
  }

  const isSenderSame = (messages, m, i) => {
    return (
      (i > 0 &&
        messages[i - 1].sender.userId === m.sender.userId
      )
    );
  }

  const isSenderUser = (messages, i, userId) => {
    return (
      messages[i].sender.userId === userId
    );
  }

  const getTime = (m) => {
    const date = new Date(m.createdAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const hour = hours % 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour}:${minutesStr} ${ampm}`;
  }

  const isGap = (messages, i) => {
    if (i === 0)
      return true;
    const d1 = new Date(messages[i].createdAt).getTime();
    const d2 = new Date(messages[i - 1].createdAt).getTime();
    const diff = d1 - d2;
    if (diff > 60000)
      return true;
    return false;
  }

  const imageUpload = async (url) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const messagenInfo = {
        groupId: selectedChat,
        text: url,
        isImage: true,
      }
      const res = await axios.post(`/message`, messagenInfo, config);
      setNewMessage('');
      setMessages([...messages, res.data]);
      scrollToBottom();
      const { data } = await axios.get(`/group/${selectedChat}`, config);
      socket.emit('send message', res.data, data);
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
          imageUpload(url);
        }
        else {
          console.log(error);
        }
      },
    );
    widget.open();
  }

  return (
    <>
      {selectedChat ? (
        <>
          {/* Group Heading  */}
          <Box sx={{
            height: '4rem',
            px: '2rem',
            color: '#fff',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.5)',
            backgroundColor: '#52057B',
          }}>
            <Typography variant='h3' align='center'>{groupName}</Typography>
          </Box>

          {/* Chat Messages */}
          <Box sx={{
            height: 'calc(100% - 10rem)',
            width: '100%',
            display: 'flex',
            flexDirection: 'column-reverse',
            overflowY: 'scroll',
          }}>
            <Box>
              {messages && messages.map((m, i) => (
                <Box key={i} sx={{
                  display: 'flex',
                  alignItems: 'space-between',
                  flexDirection: isSenderUser(messages, i, user._id) ? 'row-reverse' : 'row',
                }}>
                  {(!isSenderSame(messages, m, i) && (
                    <Avatar alt={m.sender.username} sx={{
                      marginTop: '2rem',
                      width: '2rem',
                      height: '2rem',
                    }} />
                  ))}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isSenderUser(messages, i, user._id) ? 'flex-end' : 'flex-start',
                    width: '75%',
                    marginTop: isSenderSame(messages, m, i) ? '1rem' : '2rem',
                  }}>
                    {!isSenderSame(messages, m, i) && (
                      <Box sx={{
                        marginRight: isSenderSame(messages, m, i) ? '3rem' : '1rem',
                        marginLeft: isSenderSame(messages, m, i) ? '3rem' : '1rem',
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                        <Typography variant='body1' style={{
                          color: '#fff',
                        }}>{isSenderUser(messages, i, user._id) ? 'You' : m.sender.username}</Typography>
                        <Typography variant='body1' style={{
                          marginLeft: '0.5rem',
                          color: '#fff',
                        }}>{getTime(m)}</Typography>
                      </Box>
                    )}
                    {isSenderSame(messages, m, i) && isGap(messages, i) && (
                      <Box sx={{
                        marginRight: isSenderSame(messages, m, i) ? '3rem' : '1rem',
                        marginLeft: isSenderSame(messages, m, i) ? '3rem' : '1rem',
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                        <Typography variant='body1' style={{
                          marginLeft: '0.5rem',
                          color: '#fff',
                        }}>{getTime(m)}</Typography>
                      </Box>
                    )}
                    {m.isImage === false ? (
                    <Box sx={{
                      bgcolor: `${m.sender.userId === user._id ? '#2c82fa' : '#27292e'}`,
                      borderRadius: isSenderUser(messages, i, user._id) ? '10rem 0 10rem 10rem' : '0 10rem 10rem 10rem',
                      p: '0.3rem 0.8rem',
                      maxWidth: '50%',
                      marginRight: isSenderSame(messages, m, i) ? '3rem' : '1rem',
                      marginLeft: isSenderSame(messages, m, i) ? '3rem' : '1rem',
                    }}>
                      <Typography variant='body1' style={{
                        color: '#fff',
                      }}>{m.text}</Typography>
                    </Box>
                    ) : (
                      <Box sx={{
                        bgcolor: `${m.sender.userId === user._id ? '#2c82fa' : '#27292e'}`,
                        borderRadius: isSenderUser(messages, i, user._id) ? '1rem 0 1rem 1rem' : '0 1rem 1rem 1rem',
                        p: '0.3rem',
                        maxWidth: '50%',
                        marginRight: isSenderSame(messages, m, i) ? '3rem' : '1rem',
                        marginLeft: isSenderSame(messages, m, i) ? '3rem' : '1rem',
                      }}>
                        <CardMedia 
                        src={m.text}
                        image={m.text}
                        sx={{
                          borderRadius: '1rem',
                          width: '15rem',
                          height: '15rem',
                        }} />
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
              {isTyping && !typing && (
                <Box>
                  <LottieAnimation
                    animation={typingAnimation}
                    loop={true}
                    autoplay={true}
                    rendererSettings={{
                      preserveAspectRatio: 'xMidYMid slice',
                    }}
                    style={{ width: "150px", height: "50px" }}
                  />
                </Box>
              )}
              <Box ref={scrollRef} />
            </Box>
          </Box>

          {/* Chat Send */}
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
                }} />
              </IconButton>
              <Input
                placeholder="Type a message..."
                disableUnderline
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
                style={{
                  color: '#fff',
                  width: '85%',
                }} />
              <IconButton>
                <AddBoxIcon
                  onClick={openWidget}
                  style={{
                    color: '#fff',
                  }} />
              </IconButton>
              <IconButton aria-label='submit' onClick={sendMessage}>
                <SendIcon style={{
                  color: '#fff',
                }} />
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
