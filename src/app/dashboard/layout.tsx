"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  useColorMode,
  useColorModeValue,
  IconButton,
  VStack,
  HStack,
  Avatar,
  Badge,
} from "@chakra-ui/react";
import {
  FiSun,
  FiMoon,
  FiHome,
  FiSettings,
  FiBell,
  FiLink,
  FiRefreshCw,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { PiHandWithdrawBold } from "react-icons/pi";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const navRoute = {
    home: "/dashboard",
    activity: "/dashboard/notifications",
    settings: "/dashboard/settings",
    connect: "/dashboard/wallet-connect",
    swap: "/dashboard/swap",
    withdraw: "/dashboard/withdraw",
  };

  // State for active navigation item
  const [activeNavItem, setActiveNavItem] =
    useState<keyof typeof navRoute>("home");

  const handleNavChange = (navItem: keyof typeof navRoute) => {
    setActiveNavItem(navItem);
    router.push(navRoute[navItem]);
  };

  // Color mode hook for dark/light theme
  const { colorMode, toggleColorMode } = useColorMode();

  // Notification count
  const notificationCount = 3;

  // KYC status
  const kycStatus: string = "pending"; // 'pending', 'verified', 'incomplete'

  // Dynamic colors based on theme
  const bgColor = useColorModeValue("white", "gray.800");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const primaryColor = useColorModeValue("brand.600", "brand.500");

  return (
    <Box minHeight="100vh" position="relative">
      {/* Top Navigation Bar */}
      <Flex
        position="fixed"
        top="0"
        width="100%"
        px={4}
        py={3}
        bg={bgColor}
        borderBottomWidth="1px"
        borderBottomColor={borderColor}
        zIndex="1000"
        justify={"center"}
      >
        <Flex
          maxW={"container.lg"}
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack spacing={2}>
            <Avatar size="sm" name="User" bg="brand.500" />
            <VStack spacing={0} alignItems="flex-start">
              <Text fontWeight="bold" fontSize="md">
                My Wallet
              </Text>
              <Badge
                colorScheme={kycStatus === "verified" ? "green" : "yellow"}
              >
                {kycStatus === "verified" ? "Verified" : "Verification Pending"}
              </Badge>
            </VStack>
          </HStack>

          <HStack spacing={4}>
            <Box position="relative">
              <IconButton
                onClick={() => handleNavChange("activity")}
                aria-label="Notifications"
                variant="ghost"
                icon={<FiBell />}
                fontSize="xl"
              />
              {notificationCount > 0 && (
                <Badge
                  position="absolute"
                  top="0"
                  right="0"
                  colorScheme="red"
                  borderRadius="full"
                  minW={4}
                  h={4}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Box>
            <IconButton
              aria-label="Settings"
              icon={<FiSettings />}
              onClick={() => router.push(navRoute.settings)}
              variant="ghost"
              fontSize="xl"
            />
            <IconButton
              aria-label={
                colorMode === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
              icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
              fontSize="xl"
            />
          </HStack>
        </Flex>
      </Flex>

      {/* Main Content Area */}
      <Box pt="70px" pb="80px" px={4} maxW={"container.lg"} mx="auto">
        {children}
      </Box>

      {/* Bottom Navigation */}
      <Flex
        position="fixed"
        bottom="0"
        width="100%"
        bg={bgColor}
        borderTopWidth="1px"
        borderTopColor={borderColor}
        py={2}
        px={4}
        justifyContent="center"
        zIndex="1000"
      >
        <Flex maxW={"container.lg"} width="100%" justify="space-around">
          <VStack
            spacing={1}
            opacity={activeNavItem === "home" ? 1 : 0.7}
            onClick={() => handleNavChange("home")}
            cursor="pointer"
          >
            <Icon
              as={FiHome}
              fontSize="xl"
              color={activeNavItem === "home" ? primaryColor : mutedTextColor}
            />
            <Text
              fontSize="xs"
              fontWeight={activeNavItem === "home" ? "bold" : "normal"}
              color={activeNavItem === "home" ? primaryColor : mutedTextColor}
            >
              Home
            </Text>
          </VStack>

          <VStack
            spacing={1}
            opacity={activeNavItem === "swap" ? 1 : 0.7}
            onClick={() => handleNavChange("swap")}
            cursor="pointer"
          >
            <Icon
              as={FiRefreshCw}
              fontSize="xl"
              color={
                activeNavItem === "swap" ? primaryColor : mutedTextColor
              }
            />
            <Text
              fontSize="xs"
              fontWeight={activeNavItem === "swap" ? "bold" : "normal"}
              color={
                activeNavItem === "swap" ? primaryColor : mutedTextColor
              }
            >
              Swap
            </Text>
          </VStack>

          <VStack
            spacing={1}
            opacity={activeNavItem === "withdraw" ? 1 : 0.7}
            onClick={() => handleNavChange("withdraw")}
            cursor="pointer"
          >
            <Icon
              as={PiHandWithdrawBold}
              fontSize="xl"
              color={
                activeNavItem === "withdraw" ? primaryColor : mutedTextColor
              }
            />
            <Text
              fontSize="xs"
              fontWeight={activeNavItem === "withdraw" ? "bold" : "normal"}
              color={
                activeNavItem === "withdraw" ? primaryColor : mutedTextColor
              }
            >
              Withdraw
            </Text>
          </VStack>

          <VStack
            spacing={1}
            opacity={activeNavItem === "settings" ? 1 : 0.7}
            onClick={() => handleNavChange("settings")}
            cursor="pointer"
          >
            <Icon
              as={FiSettings}
              fontSize="xl"
              color={
                activeNavItem === "settings" ? primaryColor : mutedTextColor
              }
            />
            <Text
              fontSize="xs"
              fontWeight={activeNavItem === "settings" ? "bold" : "normal"}
              color={
                activeNavItem === "settings" ? primaryColor : mutedTextColor
              }
            >
              Settings
            </Text>
          </VStack>

          <VStack
            spacing={1}
            opacity={activeNavItem === "connect" ? 1 : 0.7}
            onClick={() => handleNavChange("connect")}
            cursor="pointer"
          >
            <Icon
              as={FiLink}
              fontSize="xl"
              color={
                activeNavItem === "connect" ? primaryColor : mutedTextColor
              }
            />
            <Text
              fontSize="xs"
              fontWeight={activeNavItem === "connect" ? "bold" : "normal"}
              color={
                activeNavItem === "connect" ? primaryColor : mutedTextColor
              }
            >
              Connect
            </Text>
          </VStack>
        </Flex>
      </Flex>
    </Box>
  );
}
