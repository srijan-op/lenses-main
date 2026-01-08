import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router";
const chatContext = createContext(null);

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) {
      setUser(JSON.parse(data));
    } else {
      // navigate("/");
      console.log("no user");
    }
  }, []);

  return (
    <chatContext.Provider
      value={{
        user,
        setUser,
        setSelectedChat,
        selectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(chatContext);
};

export default ChatProvider;
