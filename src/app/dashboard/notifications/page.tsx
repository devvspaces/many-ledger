"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  VStack,
  HStack,
  useColorModeValue,
  Avatar,
  useToast,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiBell } from "react-icons/fi";
import { Notification } from "@/helpers/response";
import { useAppDispatch } from "@/store/hooks";
import { getNotifications } from "@/store/thunks/notificationsThunk";
import moment from "moment";

// Motion Components
const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

// Main Component
const NotificationsPage = () => {
  // Dynamic colors based on theme
  const cardBgColor = useColorModeValue("gray.50", "gray.700");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  const dispatch = useAppDispatch();
  const toast = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getNotifications())
      .unwrap()
      .then((data) => {
        setNotifications(data);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch notifications.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => setLoading(false));
  }, [dispatch, toast]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Box p={6}>
      {/* Notification List */}
      <MotionVStack
        spacing={4}
        align="stretch"
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <MotionBox variants={itemVariants} textAlign="center">
          <Heading size="lg" mb={2}>
            Notifications
          </Heading>
          <Text color="gray.500" fontSize="sm">
            You have {notifications.length} notifications.
          </Text>
        </MotionBox>
        {notifications.map((notification, index) => (
          <MotionBox
            key={notification.id}
            variants={cardVariants}
            custom={index}
            transition={{ delay: 0.1 * index }}
            bg={cardBgColor}
            p={4}
            borderRadius="xl"
            boxShadow="sm"
            borderLeft="4px solid"
            borderLeftColor={
              notification.status === "success"
                ? "green.500"
                : notification.status === "warning"
                ? "yellow.500"
                : notification.status === "info"
                ? "blue.500"
                : "red.500"
            }
          >
            <Flex justifyContent="space-between" alignItems="flex-start">
              <HStack spacing={3} align="flex-start">
                <Avatar
                  size="sm"
                  icon={<FiBell />}
                  bg={
                    notification.status === "success"
                      ? "green.100"
                      : notification.status === "warning"
                      ? "yellow.100"
                      : notification.status === "info"
                      ? "blue.100"
                      : "red.100"
                  }
                  color={
                    notification.status === "success"
                      ? "green.500"
                      : notification.status === "warning"
                      ? "yellow.500"
                      : notification.status === "info"
                      ? "blue.500"
                      : "red.500"
                  }
                />
                <VStack spacing={1} align="flex-start">
                  <Text fontWeight="bold">{notification.title}</Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    {notification.message}
                  </Text>
                  <Text fontSize="xs" color={mutedTextColor}>
                    {moment(notification.created).fromNow()}
                  </Text>
                </VStack>
              </HStack>
            </Flex>
          </MotionBox>
        ))}
        {loading && (
          <Center h={"50vh"}>
            <Spinner size={"lg"} />
          </Center>
        )}
        {!loading && notifications.length === 0 && (
          <MotionBox
            variants={itemVariants}
            textAlign="center"
            p={4}
            borderRadius="xl"
            boxShadow="sm"
            bg={cardBgColor}
          >
            <Text>No new notifications.</Text>
          </MotionBox>
        )}
      </MotionVStack>
    </Box>
  );
};

export default NotificationsPage;
