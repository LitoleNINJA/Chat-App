import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Snackbar, Typography } from '@mui/material';

import { ChatState } from '../context/ChatProvider';

export default function Register(props) {

    const history = useHistory();
    const { setUser } = ChatState();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState('');

    const submitRegister = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const user = {
                username,
                email,
                password
            };
            const res = await axios.post('/auth/register', user, config);
            const newres = await axios.post('/auth/login', {
                email: email,
                password: password
            }, config);
            sessionStorage.setItem('userInfo', JSON.stringify(newres.data));
            setUser(newres.data);
            history.push('/chat');
        }
        catch (err) {
            setIsError(true);
            setError(err.response.data.message);
        }
    };

    const setIsLogin = props.setIsLogin;

    return (
        <Box className='container' sx={{
            width: '80%',
            height: { md: '70vh', sm: '100%', xs: '100%' },
            margin: { md: '5rem auto', sm: '3rem auto', xs: '3rem auto' },
            boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
            display: 'flex',
            flexDirection: { md: 'row', sm: 'column', xs: 'column' },
            alignItems: 'center'
        }}>
            <Box className='overlay-right item-welcome' sx={{
                width: { md: '50%', sm: '100%', xs: '100%' },
                height: { md: '100%', sm: '20rem', xs: '20rem' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Typography variant='h3' style={{ color: 'white' }}>Welcome to Chat App !</Typography>
                <Typography variant='h5' style={{
                    color: 'white',
                    marginTop: '1rem',
                    fontWeight: '200'
                }}>Already have an account ?</Typography>
                <Button
                    variant='outlined'
                    onClick={() => setIsLogin(true)}
                    style={{
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '2rem',
                        marginTop: '1rem'
                    }}>Sign In</Button>
            </Box>

            <Box className='sign-up-form' sx={{
                width: { md: '50%', sm: '100%', xs: '100%' },
                height: { sm: '30rem', xs: '30rem' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Typography variant='h2' style={{
                    margin: '2rem 0 1rem'
                }}>SIGN UP</Typography>
                <Box sx={{
                    mb: '1rem',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center'
                }}>
                    <TextField
                        required
                        label='Username'
                        variant='outlined'
                        margin='normal'
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: '80%',
                        }} />
                    <TextField
                        required
                        label='Email'
                        variant='outlined'
                        type='email'
                        margin='normal'
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: '80%',
                        }} />
                    <TextField
                        required
                        label='Password'
                        variant='outlined'
                        type='password'
                        margin='normal'
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '80%',
                        }} />
                    <Button variant='contained' onClick={submitRegister} style={{
                        margin: '2rem 0',
                    }}>SIGN UP</Button>

                    
                    <Snackbar
                        open={isError}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        autoHideDuration={6000}
                        onClose={() => { 
                            setError(false)
                            setIsError(false)
                        }}>
                        <Alert
                            onClose={() => { 
                                setError(false)
                                setIsError(false)
                            }}
                            variant='filled'
                            severity="error"
                            sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>
        </Box>
    );
}
