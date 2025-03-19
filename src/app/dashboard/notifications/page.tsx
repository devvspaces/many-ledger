"use client";

import React from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  VStack,
  HStack,
  useColorModeValue,
  Avatar,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiBell } from "react-icons/fi";

// Motion Components
const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

// Notification Data
const notifications = [
  {
    id: 1,
    type: "success",
    title: "Transaction Completed",
    description: "Your transfer of 0.5 ETH to 0x3a2...9f4c was successful.",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Low Balance Alert",
    description: "Your BTC balance is below the recommended threshold.",
    timestamp: "5 hours ago",
    read: true,
  },
  {
    id: 3,
    type: "info",
    title: "New Feature Available",
    description: "Check out the new wallet connect feature in your dashboard.",
    timestamp: "Yesterday",
    read: true,
  },
  {
    id: 4,
    type: "error",
    title: "Failed Transaction",
    description: "Your transfer of 10 SOL failed due to insufficient gas fees.",
    timestamp: "2 days ago",
    read: false,
  },
];

// Main Component
const NotificationsPage = () => {
  // Dynamic colors based on theme
  const cardBgColor = useColorModeValue("gray.50", "gray.700");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

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
            You have {notifications.length} new notifications.
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
              notification.type === "success"
                ? "green.500"
                : notification.type === "warning"
                ? "yellow.500"
                : notification.type === "info"
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
                    notification.type === "success"
                      ? "green.100"
                      : notification.type === "warning"
                      ? "yellow.100"
                      : notification.type === "info"
                      ? "blue.100"
                      : "red.100"
                  }
                  color={
                    notification.type === "success"
                      ? "green.500"
                      : notification.type === "warning"
                      ? "yellow.500"
                      : notification.type === "info"
                      ? "blue.500"
                      : "red.500"
                  }
                />
                <VStack spacing={1} align="flex-start">
                  <Text fontWeight="bold">{notification.title}</Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    {notification.description}
                  </Text>
                  <Text fontSize="xs" color={mutedTextColor}>
                    {notification.timestamp}
                  </Text>
                </VStack>
              </HStack>
            </Flex>
          </MotionBox>
        ))}
      </MotionVStack>
    </Box>
  );
};

export default NotificationsPage;
