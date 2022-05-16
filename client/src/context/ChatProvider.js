import { createContext, useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState();
    const [notif, setNotif] = useState([]);
    const [user, setUser] = useState(null);

    const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        setUser(userInfo);
        if(!userInfo) {
            history.push('/');
        }
        else
            history.push('/chat');
    }, [history]);

    return (
        <ChatContext.Provider value={{
            selectedChat,
            setSelectedChat,
            chats,
            setChats,
            notif,
            setNotif,
            user,
            setUser,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;