import { gapi } from 'gapi-script'
import { useEffect, useState } from 'react';

import '../styles/LandingPage.css';
import Login from '../components/Login';
import Register from '../components/Register';

export default function LandingPage() {

  const [isLogin, setIsLogin] = useState(true);
  const clientId = "510139941752-fkceqiokh2pogpmhg8gb13b40scpi3np.apps.googleusercontent.com";

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
