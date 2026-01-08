import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../context/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <>
      {messages &&
        messages.map((m, i) => {
          return (
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    size="sm"
                    cursor={"pointer"}
                    name={m.sender.name}
                    src={m.sender.pic}
                    mt="7px"
                    mr={1}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#BEE3f8" : "#B9F5D0"
                  }`,
                  padding: "5px 15px",
                  marginLeft: `${isSameSenderMargin(messages, m, i, user._id)}`,
                  marginTop: `${isSameUser(messages, m, i) ? "3px" : "10px"}`,
                  borderRadius: "20px",
                  maxWidth: "75%",
                }}
              >
                {m.content}
              </span>
            </div>
          );
        })}
    </>
  );
};

export default ScrollableChat;
