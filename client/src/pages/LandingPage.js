import React, { useState } from 'react';

import '../styles/LandingPage.css';
import Login from '../components/Login';
import Register from '../components/Register';

export default function LandingPage() {

    const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      { isLogin ? 
        <Login setIsLogin={setIsLogin} /> : 
        <Register setIsLogin={setIsLogin}  />
      }
    </div>
  )
}
