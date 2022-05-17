import { gapi } from 'gapi-script'
import { useEffect, useState } from 'react';

import '../styles/LandingPage.css';
import Login from '../components/Login';
import Register from '../components/Register';

export default function LandingPage() {

  const [isLogin, setIsLogin] = useState(true);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        client_id: clientId,
        scope: 'profile email'
      });
    });
  });

  return (
    <div>
      {isLogin ?
        <Login setIsLogin={setIsLogin} /> :
        <Register setIsLogin={setIsLogin} />
      }
    </div>
  )
}
