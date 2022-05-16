import { useState } from 'react';
import Box from '@mui/material/Box';

import LeftBar from '../components/LeftBar';
import '../styles/ChatPage.css';
import Chat from '../components/Chat';
import { ChatState } from '../context/ChatProvider';
import RightBar from '../components/RightBar';

export default function ChatPage() {

  const [getAgain, setGetAgain] = useState(false);
  const { user } = ChatState();

  return (
    <Box sx={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'row',
    }}>
        {user && <LeftBar getAgain={getAgain} />}
        {user && <Chat getAgain={getAgain} setGetAgain={setGetAgain} />}
        {user && <RightBar />}
    </Box>
  );
}
