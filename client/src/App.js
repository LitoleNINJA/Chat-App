import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import './App.css';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';

function App() {
  axios.defaults.baseURL = 'http://localhost:5000/api';
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/chat">
          <ChatPage />
        </Route>
        {/* <Route path="/profile/:username">
          <Profile />
        </Route> */}
      </Switch>
    </Router>
  );
}

export default App;