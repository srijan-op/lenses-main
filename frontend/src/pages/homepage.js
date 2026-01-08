import React, { useEffect } from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Signup from "../component/Authentication/signup";
import Login from "../component/Authentication/login";
import Lottie from "react-lottie";
import animationData from "../animation/is-Chating.json";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) {
      navigate("/chats");
    }
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        justifyItems: "center",
        alignSelf: "center",
        height: "100vh",
        width: "100%",
        marginLeft: "7%",
        marginRight: "7%",
        gap: "10%",
      }}
    >
      <div>
        <Text fontFamily={"work sans"} textAlign={"center"} fontSize={"4xl"}>
          Lensechat
        </Text>
        <Lottie
          options={defaultOptions}
          width={400}
          style={{ marginLeft: 0, marginBottom: 10 }}
        />
      </div>

      <Box
        p={"3"}
        boxShadow={"2px 2px 5px #2E4057"}
        borderRadius={"md"}
        w="60%"
      >
        <Tabs variant="enclosed">
          <TabList mb="1em">
            <Tab width="50%" border={"none"}>
              Login
            </Tab>
            <Tab width="50%" border={"none"}>
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </div>
  );
};

export default Homepage;
