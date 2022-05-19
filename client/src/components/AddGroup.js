import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';

import { ChatState } from '../context/ChatProvider';

const AddGroup = React.forwardRef((props, ref) => {

    const { user, chats, setChats, setSelectedChat } = ChatState();

    const [groupName, setGroupName] = useState('');
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);

    const userSearch = (e) => {
        setSearch(e);
    }

    useEffect(async () => {
        if (!search) {
            setResult([]);
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/user?search=${search}`, config);
            setResult(data.users);
        } catch (err) {
            console.log(err);
        }
    }, [search]);

    const addGroup = async () => {
        if (!groupName || !userList) {
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/group`, {
                name: groupName,
                members: userList,
                isPersonal: false,
            }, config);
            setChats([...chats, data]);
            setSelectedChat(data._id);
        } catch (err) {
            console.log(err);
        }
    }

    const addToGroup = async (user) => {
        if (!userList.includes(user)) {
            setUserList([...userList, user]);
        }
        else {
            console.log('User already in group');
        }
    }

    return (
        <Box ref={ref} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flax-start',
            alignItems: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '25%',
            height: '60%',
            color: '#fff',
            backgroundColor: '#3e3d3d',
        }}>
            <Typography variant="h4" style={{
                marginTop: '1rem',
                marginBottom: '1rem',
            }}>
                Create Group
            </Typography>
            <TextField
                variant='outlined'
                label='Group Name'
                size='small'
                onChange={(e) => { setGroupName(e.target.value) }}
                style={{
                    width: '80%',
                    backgroundColor: '#161819',
                    borderRadius: '1rem',
                }}
                InputProps={{
                    style: {
                        color: '#fff',
                    }
                }}
                InputLabelProps={{
                    style: {
                        color: 'rgba(255, 255, 255, 0.5)',
                    }
                }}>
            </TextField>
            <TextField
                variant='outlined'
                label='Add Users'
                size='small'
                onChange={(e) => { userSearch(e.target.value) }}
                style={{
                    width: '80%',
                    margin: '1rem 0',
                    backgroundColor: '#161819',
                    borderRadius: '1rem',
                }}
                InputProps={{
                    style: {
                        color: '#fff',
                    }
                }}
                InputLabelProps={{
                    style: {
                        color: 'rgba(255, 255, 255, 0.5)',
                    }
                }}>
            </TextField>

            {loading ? (
                <Box>Loading</Box>
            ) : (
                <Box sx={{
                    height: '100%',
                    width: '100%',
                    overflowY: 'scroll',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        margin: '0 1rem',
                    }}>
                        {userList && userList.map((user) => (
                            <Badge
                                key={user._id}
                                sx={{
                                    width: '3.5rem',
                                    padding: '0 0.5rem',
                                    borderRadius: '2rem',
                                    background: 'linear-gradient(90deg, rgb(62, 25, 113),rgb(72, 105, 206))'
                                }}
                            // onClick={handleFunction}
                            >
                                <Typography variant='body1'>
                                    {user.username}
                                </Typography>
                                <CloseIcon
                                    sx={{
                                        width: '1.5rem',
                                        height: '1.5rem',
                                    }}
                                    onClick={() => { setUserList(userList.filter((u) => u.username !== user.username)) }}
                                />
                            </Badge>
                        ))}
                    </Box>
                    {result && result.map((user) => (
                        <Box key={user._id}
                            onClick={() => { addToGroup(user) }}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '70%',
                                margin: '0.5rem auto',
                                padding: '0.5rem',
                                ":hover": {
                                    cursor: 'pointer',
                                    background: 'linear-gradient(to right, #373b44, #4286f4)'
                                }
                            }}>
                            <Avatar sx={{
                                width: '2.5rem',
                                height: '2.5rem',
                            }} />
                            <Box
                                onClick={() => { addToGroup(user) }}
                                cursor='pointer'
                                width='100%'
                                display='flex'
                                flexDirection='column'
                                alignItems='center'
                            >
                                <Typography variant='body1'>{user.username}</Typography>
                                <Typography variant='body2'><b>Email : </b>{user.email}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
            <Button onClick={addGroup}>
                Submit
            </Button>
        </Box>
    )
})

export default AddGroup;
