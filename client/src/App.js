import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';

import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import ChatProvider from './context/ChatProvider';

function App() {
  axios.defaults.baseURL = process.env.REACT_APP_AXIOS_BASE_URL;

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        client_id: clientId,
        scope: 'profile email'
      });
    });
  });
  
  const theme = createTheme({
    typography: {
        fontFamily: `'Poppins','san-serif'`
    },
  });
  theme.typography.h2 = {
    [theme.breakpoints.up('md')]: {
      fontSize: '3.75vw',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '8.5vw',
    },
  };
  theme.typography.h3 = {
    [theme.breakpoints.up('md')]: {
      fontSize: '3vw',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '6vw',
    },
  };
  theme.typography.h5 = {
    [theme.breakpoints.up('md')]: {
      fontSize: '1.5vw',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '3vw',
    },
  };
  theme.typography.h6 = {
    [theme.breakpoints.up('md')]: {
      fontSize: '1.25rem',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '2.5vw',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '4vw',
    },
  };
  theme.typography.body1 = {
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '3vw',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ChatProvider>
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route path="/chat">
              <ChatPage />
            </Route>
          </Switch>
        </ChatProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;