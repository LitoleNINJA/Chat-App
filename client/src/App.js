import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';

import './App.css';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import ChatProvider from './context/ChatProvider';

function App() {
  axios.defaults.baseURL = 'http://localhost:5000/api';
  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: 'system-ui',
      },
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