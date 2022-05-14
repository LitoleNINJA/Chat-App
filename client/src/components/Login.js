import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';

import { ChatState } from '../context/ChatProvider';

export default function Login(props) {

    const history = useHistory();

    const { user, setUser } = ChatState();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const submitLogin = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const curUser = {
                email,
                password
            };
            const res = await axios.post('/auth/login', curUser, config);
            sessionStorage.setItem('userInfo', JSON.stringify(res.data));
            setUser(res.data);
            history.push('/chat');
        }
        catch (err) {
            setError(true);
        }
    }

    const setIsLogin = props.setIsLogin;

    return (
        <Box className='container' sx={{
            width: '70%',
            height: '70vh',
            position: 'relative',
            margin: '5rem auto',
            boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Box className='overlay-left item-welcome active' sx={{
                width: '50%',
                height: '100%',
                position: 'absolute',
                left: '0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <h1 style={{ color: 'white' }}>Welcome to Chat App !</h1>
                <h3 style={{ color: 'white', marginTop: '1rem' }}>Don't have an account ?</h3>
                <Button
                    variant='outlined'
                    onClick={() => setIsLogin(false)}
                    style={{
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '2rem',
                        marginTop: '1rem'
                    }}>Sign Up</Button>
            </Box>
            <Box className='sign-in-form active' sx={{
                width: '50%',
                position: 'absolute',
                right: '0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <h1 style={{
                    margin: '2rem 0 1rem'
                }}>LOGIN</h1>
                <Box sx={{
                    mb: '1rem',
                    width: '20%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center'
                }}>
                    <Button style={{
                        color: 'black',
                    }}><GoogleIcon /></Button>
                    <Button style={{
                        color: 'black',
                    }}><FacebookIcon /></Button>
                </Box>
                <h4>or use your account</h4>
                <TextField
                    required
                    label='Email'
                    variant='outlined'
                    type='email'
                    margin='normal'
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: '80%',
                    }}></TextField>
                <TextField
                    required
                    label='Password'
                    variant='outlined'
                    type='password'
                    margin='normal'
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            submitLogin();
                        }
                    }}
                    style={{
                        width: '80%',
                    }}></TextField>
                <h3 style={{
                    margin: '1rem 0 0'
                }}>Forgot your password?</h3>
                <Button variant='contained' onClick={submitLogin} style={{
                    margin: '2rem 0',
                }}>Sign In</Button>
                <Snackbar 
                open={error} 
                anchorOrigin={{ vertical:'bottom' , horizontal: 'right' }}
                autoHideDuration={6000} 
                onClose={()=>setError(false)}>
                    <Alert 
                        onClose={()=>setError(false)} 
                        variant='filled'
                        severity="error" 
                        sx={{ width: '100%' }}>
                        Invalid Email or Password !
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}
