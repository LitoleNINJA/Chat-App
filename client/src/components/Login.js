import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { Typography } from '@mui/material';
import axios from 'axios';
import SvgIcon from '@mui/material/SvgIcon';
import { GoogleLogin } from 'react-google-login';

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

    const onSuccessGoogle = async (response) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const { data } = await axios.post('/auth/google', {
                tokenId: response.tokenId
            }, config);
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            history.push('/chat');
        } catch (err) {
            console.log(err);
        }
    }

    const onFailureGoogle = (response) => {
        console.log("LOGIN Failed : ", response);
    }

    // FIXME: Hide this code
    const clientId = "510139941752-fkceqiokh2pogpmhg8gb13b40scpi3np.apps.googleusercontent.com";

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

            <Box className='overlay-left item-welcome active' sx={{
                width: { md: '50%', sm: '100%', xs: '100%' },
                height: { md: '100%', sm: '20rem', xs: '20rem' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Typography variant='h3' style={{
                    color: 'white',
                }}>Welcome to Chat App !</Typography>
                <Typography variant='h5' style={{ color: 'white', marginTop: '2rem' }}>Don't have an account ?</Typography>
                <Button
                    variant='outlined'
                    onClick={() => setIsLogin(false)}
                    style={{
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '2rem',
                        marginTop: '2rem'
                    }}>Sign Up</Button>
            </Box>


            <Box className='sign-in-form active' sx={{
                width: { md: '50%', sm: '100%', xs: '100%' },
                height: { sm: '30rem', xs: '30rem' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Typography variant='h2' style={{
                    margin: '2rem 0 1rem'
                }}>LOGIN</Typography>
                <Box sx={{
                    mb: '1rem',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center'
                }}>
                    <GoogleLogin
                        clientId={clientId}
                        plugin_name="chatApp-login"
                        buttonText='Continue with Google'
                        isSignedIn={true}
                        render={(renderProps) => (
                            <button
                                className='google-login'
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                            >
                                <SvgIcon viewBox="0 0 48 48" width="30px" height="30px">
                                    <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </SvgIcon>
                                <Typography variant='body1' style={{
                                    marginLeft: '1rem'
                                }}>Continue with Google</Typography>
                            </button>
                        )}
                        onSuccess={onSuccessGoogle}
                        onFailure={onFailureGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
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
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={6000}
                    onClose={() => setError(false)}>
                    <Alert
                        onClose={() => setError(false)}
                        variant='filled'
                        severity="error"
                        sx={{ width: '100%' }}>
                        Invalid Email or Password !
                    </Alert>
                </Snackbar>
            </Box>
        </Box >
    );
}
