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