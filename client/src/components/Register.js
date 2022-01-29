import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function Register(props) {

    const history = useHistory();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitRegister = async () => {
        try {
            const user = {
                username,
                email,
                password
            };
            console.log(user);
            const res = await axios.post('/auth/register', user);
            localStorage.setItem('user', res);
            localStorage.setItem('token', res.data.token);
            history.push('/chat');
        }
        catch (err) {
            console.log(err);
        }
    };

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
            <Box className='overlay-right item-welcome' sx={{
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
                <h3 style={{ color: 'white', marginTop: '1rem' }}>Already have an account ?</h3>
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
                }}>SIGN UP</h1>
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
                <h4>or use your email</h4>
                <TextField
                    required
                    label='Username'
                    variant='outlined'
                    margin='normal'
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        width: '80%',
                    }}></TextField>
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
                    style={{
                        width: '80%',
                    }}></TextField>
                <Button variant='contained' onClick={submitRegister} style={{
                    margin: '2rem 0',
                }}>SIGN UP</Button>
                {/* <Snackbar 
                open={isError} 
                anchorOrigin={{ vertical:'bottom' , horizontal: 'right' }}
                autoHideDuration={6000} 
                onClose={()=>setError(false)}>
                    <Alert 
                        onClose={()=>setError(false)} 
                        variant='filled'
                        severity="error" 
                        sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar> */}
            </Box>
        </Box>
    );
}
