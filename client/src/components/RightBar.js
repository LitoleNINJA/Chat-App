import React, { useEffect, useState } from 'react';
import { Avatar, Box, Typography } from "@mui/material";
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import axios from 'axios';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Input from '@mui/material/Input';
import Divider from '@mui/material/Divider';

import { ChatState } from '../context/ChatProvider';
import ChatLoading from './ChatLoading';

export default function RightBar() {

    const { selectedChat, user } = ChatState();
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);

    const getMembers = async () => {
        if (!selectedChat) return;
        try {
            const userToken = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };
            const { data } = await axios.get(`/group/${selectedChat}`, config);
            findMembers(data.members);
        } catch (err) {
            console.log(err);
        }
    }

    const findMembers = async (m) => {
        if (!m)
            return;
        try {
            const mem = [];
            for (let i = 0; i < m.length; i++) {
                const id = m[i];
                const userToken = user.token;
                const config = {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                };
                const { data } = await axios.get(`/user/${id}`, config);
                mem.push(data.user);
            }
            setMembers(mem);
        } catch (err) {
            console.log(err);
        }
    }

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

    const handleUserSelect = async (userData) => {
        if(userData._id  === user._id)
            return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post(`/group/${selectedChat}`, {
                userId: userData._id,
            }, config);
            setMembers([...members, userData]);
            setDrawerOpen(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getMembers();
    }, [selectedChat]);

    const memberCount = members.length;

    return (
        <Box sx={{
            width: '25%',
            height: '100%',
            backgroundColor: '#272728',
            display: {lg: 'flex', md: 'none', sm: 'none', xs: 'none'},
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {/* Heading */}
            <Box sx={{
                margin: '2rem 0',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <ChatRoundedIcon sx={{
                    color: '#fff',
                    fontSize: '2.5rem',
                    mr: '3rem',
                }} />
                <Typography variant="h4" sx={{ color: '#fff' }}>
                    Chat Details
                </Typography>
            </Box>
            
            {/* Members */}
            <Box sx={{
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                        <Typography variant="body1" sx={{ color: '#fff' }} fontSize="1.2rem" >
                            Members </Typography>
                        <Typography variant="h6" sx={{ color: '#fff' }} style={{
                            marginLeft: '1rem',
                        }}>{memberCount}</Typography>
                    </Box>
                    <AddIcon
                        onClick={() => { setDrawerOpen(true) }}
                        sx={{
                            ":hover": {
                                cursor: 'pointer',
                            },
                            color: '#fff',
                            fontSize: '2rem',
                        }} />
                </Box>

                <SwipeableDrawer
                    anchor='right'
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
                                    <Avatar src={userData.user_avatar} sx={{
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

                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}>
                    {members && members.map((member, index) => {
                        return (
                            <Box
                                key={index}
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    margin: '1rem 0',
                                }}>
                                <Avatar src={member.user_avatar} style={{
                                    width: '2rem',
                                    height: '2rem',
                                    marginRight: '1rem',
                                }} />
                                <Typography variant="body1" sx={{ color: '#fff' }} fontSize="1.2rem" >
                                    {member.username} </Typography>
                                <ChatBubbleOutlineRoundedIcon sx={{
                                    color: '#fff',
                                    fontSize: '2rem',
                                    marginLeft: 'auto',
                                }} />
                            </Box>
                        )
                    })}
                </Box>
            </Box>
        </Box>
    );
}