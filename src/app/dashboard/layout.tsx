"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { withAuth } from "@/hoc/withAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/features/auth";
import { KycStage } from "@/helpers/response";
import { countUnreadNotifications } from "@/store/thunks/notificationsThunk";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser)!;

  const navRoute = {
    home: "/dashboard",
    activity: "/dashboard/notifications",
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
  const [notificationCount, setNotificationCount] = useState(0);
  const pollNotification = useRef<number | null>(null);
  useEffect(() => {
    const fetchNotificationCount = () => {
      dispatch(countUnreadNotifications())
        .unwrap()
        .then((count) => {
          setNotificationCount(count);
        })
        .catch((error) => {
          console.error("Error fetching notification count:", error);
        });
    };

    fetchNotificationCount();

    // Polling for notification count every 5 seconds
    pollNotification.current = window.setInterval(() => {
      fetchNotificationCount();
    }, 5000);

    return () => {
      if (pollNotification.current) {
        clearInterval(pollNotification.current);
      }
    };
  }, [dispatch]);

  // KYC status
  const kycStatus: string = user.profile.kyc_stage; // 'pending', 'verified', 'incomplete'

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
            <Avatar size="sm" name={user.username} />
            <VStack spacing={0} alignItems="flex-start">
              <Text fontWeight="bold" fontSize="md">
                Welcome,{" "}
                <span
                  style={{
                    textTransform: "capitalize",
                  }}
                >
                  {user.username}
                </span>
              </Text>
              <Badge
                colorScheme={
                  kycStatus === KycStage.Verified ? "green" : "yellow"
                }
              >
                {kycStatus === KycStage.Verified
                  ? "Verified"
                  : "Verification Pending"}
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
              onClick={() => router.push("/dashboard/settings")}
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
              color={activeNavItem === "swap" ? primaryColor : mutedTextColor}
            />
            <Text
              fontSize="xs"
              fontWeight={activeNavItem === "swap" ? "bold" : "normal"}
              color={activeNavItem === "swap" ? primaryColor : mutedTextColor}
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

const AuthLayout = withAuth(Layout);

export default AuthLayout;
