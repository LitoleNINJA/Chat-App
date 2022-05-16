import { Box } from '@mui/material';

import SingleChat from './SingleChat';
import { ChatState } from '../context/ChatProvider';

export default function Chat() {

  const {selectedChat} = ChatState();

  return (
    <Box sx={{
      height: '100%',
      backgroundColor: '#161819',
      display: {sm:'flex', xs: selectedChat ? 'flex' : 'none'},
      flexDirection: 'column',
      flexGrow: 2,
    }}>
      <SingleChat />
    </Box>
  );
}
