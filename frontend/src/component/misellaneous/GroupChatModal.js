import React from "react";
import {
  Box,
  FormControl,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItems from "../UserListItems";
import UserBadgeItem from "../UserBadgeItem";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSubmit = async () => {
    if (!groupChatName) {
      toast({
        title: "Error Occured!",
        description: "Please enter a group name",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    if (selectedUsers.length < 1) {
      toast({
        title: "Error Occured!",
        description: "Please select atleast one user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      console.log(data);
      setChats([...chats, data]);
      onClose();
      toast({
        title: "Success!",
        description: "Group Created Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Create Group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "Error Occured!",
        description: "User already added",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSearch = async (query) => {
    setSearchTerm(query);
    if (query === "") {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?search=${searchTerm}`,
        config
      );
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((item) => item._id !== user._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"work sans"}
            d="flex"
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users eg : deepesh,ravil,adarsh"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap={"wrap"}>
              {selectedUsers?.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    handleDelete(user);
                  }}
                />
              ))}
            </Box>
            {loading ? (
              <div>loading...</div>
            ) : (
              <div>
                {searchResults?.slice(0, 4).map((user) => (
                  <div>
                    <UserListItems
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  </div>
                ))}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
