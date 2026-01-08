import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useDisclosure } from "@chakra-ui/hooks";
import { useToast } from "@chakra-ui/react";
import ChatLoading from "../ChatLoading";
import axios from "axios";
import UserListItems from "../UserListItems";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge, { Effect } from "react-notification-badge";
import { useNavigate } from "react-router-dom";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchResults, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();

  const { user, setSelectedChat, notification, setNotification } = ChatState();
  const toast = useToast();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userId }, config);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Fetching The Chat",
        status: error.message,
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      console.log(data);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <div>
      <Box
        justifyContent={"space-between"}
        display={"flex"}
        alignItems={"center"}
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search user to Chat" hasArrow placement="bottom-end">
          <Button
            variant={"ghost"}
            boxShadow={"md"}
            bg={"white"}
            onClick={onOpen}
          >
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={"10px"}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"work sans"}>
          Lenses
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.Scale}
              />
              <BellIcon w={5} h={5} />
            </MenuButton>
            <MenuList>
              {!notification.length ? (
                <MenuItem>No Notifications</MenuItem>
              ) : (
                notification.map((item) => {
                  return (
                    <MenuItem
                      key={item._id}
                      onClick={() => {
                        setSelectedChat(item.chat);
                        setNotification(
                          notification.filter((noti) => noti !== item)
                        );
                      }}
                    >
                      <Text>
                        {item.chat.isGroupChat
                          ? `New Message in ${item.chat.chatName}`
                          : `New Message from ${getSender(
                              user,
                              item.chat.users
                            )}`}
                      </Text>
                    </MenuItem>
                  );
                })
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              p={1}
              as={Button}
              rightIcon={<ChevronDownIcon w={5} h={5} />}
            >
              <Avatar
                size="sm"
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search Users by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              <span>
                {searchResults.map((item) => {
                  return (
                    <UserListItems
                      key={item._id}
                      handleFunction={() => accessChat(item._id)}
                      user={item}
                    />
                  );
                })}
              </span>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
