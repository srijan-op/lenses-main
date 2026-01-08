import React, { useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Text } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModel from "./misellaneous/ProfileModel";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { Spinner } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./misellaneous/UpdateGroupChatModal";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animation/is-Typing.json";

const ENDPOINT = "https://lense-chat.onrender.com/";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState();
  const [socketConnection, setSocketConnection] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const toast = useToast();
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", { userId: user._id });
    socket.on("connected", () => {
      setSocketConnection(true);
    });

    socket.on("typing", () => {
      setIsTyping(true);
    });

    socket.on("stopTyping", () => {
      setIsTyping(false);
    });
  });

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("joinChat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);


  useEffect(() => {
    socket.on("messageReceived", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        if (!notification.includes(newMessage)) {
          setNotification([...notification, newMessage]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessages) {
      socket.emit("stopTyping", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const body = {
          content: newMessages,
          chatId: selectedChat._id,
        };
        setNewMessages("");
        const { data } = await axios.post(`/api/message/`, body, config);
        socket.emit("newMessage", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessages(e.target.value);

    if (!socketConnection) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var TYPING_TIMER_LENGTH = 2000;

    setTimeout(() => {
      var typingTimer = new Date().getTime();
      var timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= TYPING_TIMER_LENGTH && isTyping) {
        socket.emit("stopTyping", selectedChat._id);
        setIsTyping(false);
      }
    }, TYPING_TIMER_LENGTH);
  };
  // setNewMessages(e.target.value)

  return selectedChat ? (
    <>
      <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
      >
        <IconButton
          d={{ base: "flex", md: "none" }}
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat("")}
        />
        {!selectedChat.isGroupChat ? (
          <>
            {getSender(user, selectedChat.users)}
            <ProfileModel user={getSenderFull(user, selectedChat.users)} />
          </>
        ) : (
          <>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModal
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              fetchMessages={fetchMessages}
            />
          </>
        )}
      </Text>
      <Box
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        p={3}
        bg="#E8E8E8"
        w="100%"
        h="80vh"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loading ? (
          <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
        ) : (
          <div className="messages">
            <ScrollableChat messages={messages} />
          </div>
        )}

        <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
          {isTyping ? (
            <div>
              <Lottie
                options={defaultOptions}
                width={70}
                style={{ marginLeft: 0, marginBottom: 10 }}
              />
            </div>
          ) : (
            <></>
          )}
          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a message.."
            value={newMessages}
            onChange={typingHandler}
          />
        </FormControl>
      </Box>
    </>
  ) : (
    <Box display={"flex"} justifyContent={"center"} h="100%">
      <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
        Click on a user to start Chatting
      </Text>
    </Box>
  );
};

export default SingleChat;
