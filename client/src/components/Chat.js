import { Box } from '@mui/material';

import SingleChat from './SingleChat';
import { ChatState } from '../context/ChatProvider';

export default function Chat() {

  const {selectedChat} = ChatState();

  return (
    <Box sx={{
      width: '50%',
      height: '100%',
      backgroundColor: '#161819',
      position: 'absolute',
      left: '25%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <SingleChat />
    </Box>
  );
}
