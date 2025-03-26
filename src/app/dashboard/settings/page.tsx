"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
  HStack,
  Icon,
  Flex,
  Container,
  Switch,
  InputGroup,
  InputRightElement,
  PinInput,
  PinInputField,
  Avatar,
  useToast,
  IconButton,
  Badge,
  Tooltip,
  Alert,
  AlertIcon,
  AlertDescription,
  Center,
  Spinner,
  FormErrorMessage,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiBell,
  FiShield,
  FiChevronRight,
  FiMail,
  FiKey,
  FiLogOut,
  FiEye,
  FiEyeOff,
  FiShoppingCart,
  FiCopy,
  FiEdit,
  FiLock,
  FiEdit2,
} from "react-icons/fi";
import { Profile } from "@/helpers/response";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changeUsername,
  getProfile,
  updateProfile,
} from "@/store/thunks/settingsThunk";
import { selectUser } from "@/store/features/auth";

// Motion components
const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const spring = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};

// Settings Page Component
const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser)!;

  // State for notification settings
  // const [notifications, setNotifications] = useState({
  //   payments: true,
  //   signIn: true,
  //   security: true,
  // });

  // State for security settings
  const [accountDetails, setAccountDetails] = useState<Profile | null>(null);

  const twoFactorEnabled = accountDetails?.two_factor;
  const setTwoFactorEnabled = (val: boolean) => {
    if (accountDetails) {
      setAccountDetails({ ...accountDetails, two_factor: val });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [transactionPin, setTransactionPin] = useState("");

  // Fetch account details
  useEffect(() => {
    dispatch(getProfile())
      .unwrap()
      .then((data) => {
        setAccountDetails(data);
      })
      .catch((err) => console.error(err));
  }, [dispatch]);

  // Modal controls
  const profileModal = useDisclosure();
  const usernameModal = useDisclosure();
  const passwordModal = useDisclosure();
  const walletModal = useDisclosure();
  const pinModal = useDisclosure();
  const twoFAModal = useDisclosure();
  const logoutModal = useDisclosure();

  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sectionBgColor = useColorModeValue("gray.50", "gray.750");
  const modalBg = useColorModeValue("brand.50", "brand.700");
  const iconBgColor = useColorModeValue("brand.50", "rgba(0, 102, 204, 0.2)");

  // Handle profile update
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {}
  );
  const handleProfileUpdate = () => {
    // Simulate loading
    const loadingToast = toast({
      title: "Updating profile",
      description: "Please wait while we update your information...",
      status: "loading",
      duration: null,
      isClosable: false,
      position: "top",
    });

    setUpdatingProfile(true);
    dispatch(updateProfile(accountDetails!))
      .unwrap()
      .then(() => {
        toast.close(loadingToast);
        toast({
          title: "Profile updated",
          description:
            "Your profile information has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        profileModal.onClose();
        setProfileErrors({});
      })
      .catch((err) => {
        console.log(err);
        setProfileErrors(err.data);
        toast.close(loadingToast);
        toast({
          title: "Error updating profile",
          description: "An error occurred while updating your profile.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      })
      .finally(() => {
        setUpdatingProfile(false);
      });
  };

  // Handle email update
  const [username, setUsername] = useState("");
  const [usernamePassword, setUsernamePassword] = useState("");
  const [updatingUsername, setUpdatingUsername] = useState(false);
  const [usernameErrors, setUsernameErrors] = useState<Record<string, string>>(
    {}
  );
  const handleUsernameUpdate = () => {
    // Simulate loading
    const loadingToast = toast({
      title: "Updating username",
      description: "Please wait while we update your username...",
      status: "loading",
      duration: null,
      isClosable: false,
      position: "top",
    });
    setUpdatingUsername(true);
    dispatch(
      changeUsername({
        new_username: username,
        password: usernamePassword,
      })
    )
      .unwrap()
      .then(() => {
        toast.close(loadingToast);
        toast({
          title: "Username updated",
          description: "Your username has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        usernameModal.onClose();
        setUsernameErrors({});
      })
      .catch((err) => {
        setUsernameErrors(err.data);
        toast.close(loadingToast);
        toast({
          title: "Error updating username",
          description: "An error occurred while updating your username.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      })
      .finally(() => {
        setUpdatingUsername(false);
      });
  };

  // Handle password update
  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    // Simulate loading
    const loadingToast = toast({
      title: "Updating password",
      description: "Please wait while we update your password...",
      status: "loading",
      duration: null,
      isClosable: false,
      position: "top",
    });

    setTimeout(() => {
      toast.close(loadingToast);
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      passwordModal.onClose();
    }, 1500);
  };

  // Handle transaction pin update
  const handlePinUpdate = () => {
    if (transactionPin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a 4-digit PIN.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    // Simulate loading
    const loadingToast = toast({
      title: "Updating PIN",
      description: "Please wait while we update your transaction PIN...",
      status: "loading",
      duration: null,
      isClosable: false,
      position: "top",
    });

    setTimeout(() => {
      toast.close(loadingToast);
      toast({
        title: "PIN updated",
        description: "Your transaction PIN has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setTransactionPin("");
      pinModal.onClose();
    }, 1500);
  };

  // Handle 2FA toggle
  const handleToggle2FA = () => {
    // Simulate loading
    const loadingToast = toast({
      title: twoFactorEnabled ? "Disabling 2FA" : "Enabling 2FA",
      description: "Please wait while we update your security settings...",
      status: "loading",
      duration: null,
      isClosable: false,
      position: "top",
    });

    setTimeout(() => {
      toast.close(loadingToast);
      setTwoFactorEnabled(!twoFactorEnabled);
      toast({
        title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
        description: twoFactorEnabled
          ? "Two-factor authentication has been disabled."
          : "Two-factor authentication has been successfully enabled.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      twoFAModal.onClose();
    }, 1500);
  };

  // Handle notification toggle
  const notifications = {
    payments: accountDetails?.notify_payments,
    signIn: accountDetails?.notify_signin,
    security: accountDetails?.notify_security,
  };
  const setNotifications = (val: {
    payments?: boolean;
    signIn?: boolean;
    security?: boolean;
  }) => {
    if (accountDetails) {
      setAccountDetails({
        ...accountDetails,
        ...{
          notify_payments: val.payments ?? accountDetails.notify_payments,
          notify_signin: val.signIn ?? accountDetails.notify_signin,
          notify_security: val.security ?? accountDetails.notify_security,
        },
      });
    }
  };
  const [updatingPaymentNotifications, setUpdatingPaymentNotifications] =
    useState(false);
  const [updatingSecurityNotifications, setUpdatingSecurityNotifications] =
    useState(false);
  const [updatingSigninNotifications, setUpdatingSigninNotifications] =
    useState(false);
  const handleNotificationToggle = (type: keyof typeof notifications) => {
    const handleSuccess = () => {
      setNotifications({
        ...notifications,
        [type]: !notifications[type],
      });

      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${
          notifications[type] ? "disabled" : "enabled"
        }`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    };

    const handleError = (err: unknown) => {
      console.log(err);
      toast({
        title: "Error updating settings",
        description: "An error occurred while updating your settings.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    };

    switch (type) {
      case "payments":
        if (updatingPaymentNotifications) return;
        setUpdatingPaymentNotifications(true);
        dispatch(
          updateProfile({
            notify_payments: !notifications.payments,
          })
        )
          .unwrap()
          .then(handleSuccess)
          .catch(handleError)
          .finally(() => setUpdatingPaymentNotifications(false));
        break;
      case "security":
        if (updatingSecurityNotifications) return;
        setUpdatingSecurityNotifications(true);
        dispatch(
          updateProfile({
            notify_security: !notifications.security,
          })
        )
          .unwrap()
          .then(handleSuccess)
          .catch(handleError)
          .finally(() => setUpdatingSecurityNotifications(false));
        break;
      case "signIn":
        if (updatingSigninNotifications) return;
        setUpdatingSigninNotifications(true);
        dispatch(
          updateProfile({
            notify_signin: !notifications.signIn,
          })
        )
          .unwrap()
          .then(handleSuccess)
          .catch(handleError)
          .finally(() => setUpdatingSigninNotifications(false));
        break;
      default:
        break;
    }
  };

  // Handle account ID copy
  const handleCopyId = () => {
    navigator.clipboard.writeText(user.username);
    toast({
      title: "Account ID copied",
      description: "Account ID has been copied to clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  // Handle logout
  const handleLogout = () => {
    // Simulate loading
    const loadingToast = toast({
      title: "Logging out",
      description: "Please wait while we log you out...",
      status: "loading",
      duration: null,
      isClosable: false,
      position: "top",
    });

    setTimeout(() => {
      toast.close(loadingToast);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      logoutModal.onClose();
      // Here you would redirect to login page
    }, 1500);
  };

  // Create setting item component
  const SettingItem = ({
    icon,
    title,
    description,
    onClick,
    rightElement,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    onClick: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <MotionBox
      onClick={onClick}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={4}
      cursor="pointer"
      whileHover={{ scale: 1.02, backgroundColor: sectionBgColor }}
      transition={spring}
      w={"100%"}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <HStack spacing={4}>
          <Flex
            p={2}
            borderRadius="lg"
            bg={iconBgColor}
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={icon} boxSize={5} color="brand.500" />
          </Flex>
          <Box>
            <Text fontWeight="medium">{title}</Text>
            <Text fontSize="sm" color="gray.500">
              {description}
            </Text>
          </Box>
        </HStack>
        {rightElement || (
          <Icon as={FiChevronRight} boxSize={5} color="gray.400" />
        )}
      </Flex>
    </MotionBox>
  );

  return (
    <Container maxW="container.md" py={8}>
      <MotionVStack
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        spacing={8}
        align="stretch"
        pb="70px" // Space for bottom navigation
      >
        {/* Header */}
        <MotionBox variants={itemVariants} textAlign="center">
          <Heading size="lg" mb={2}>
            Settings
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Manage your account preferences and security
          </Text>
        </MotionBox>

        {/* Profile Section */}
        <MotionBox variants={itemVariants}>
          <Flex alignItems="center" mb={4}>
            <Icon as={FiUser} mr={2} color="brand.500" />
            <Heading size="md">Profile</Heading>
          </Flex>
          <VStack align={"flex-start"} spacing={3}>
            <SettingItem
              icon={FiUser}
              title="View Account ID"
              description="View your account details and ID"
              onClick={profileModal.onOpen}
            />
            <SettingItem
              icon={FiMail}
              title="Update Username"
              description="Change your registered username"
              onClick={usernameModal.onOpen}
            />
          </VStack>
        </MotionBox>

        {/* Notification Section */}
        <MotionBox variants={itemVariants}>
          <Flex alignItems="center" mb={4}>
            <Icon as={FiBell} mr={2} color="brand.500" />
            <Heading size="md">Notifications</Heading>
          </Flex>
          <VStack align={"flex-start"} spacing={3}>
            <SettingItem
              icon={FiShoppingCart}
              title="Payment Notifications"
              description="Receive alerts for payments and transactions"
              rightElement={
                <Switch
                  colorScheme="brand"
                  isChecked={notifications.payments}
                  onChange={() => handleNotificationToggle("payments")}
                />
              }
              onClick={() => handleNotificationToggle("payments")}
            />
            <SettingItem
              icon={FiKey}
              title="Sign-in Notifications"
              description="Get notified about new sign-ins to your account"
              rightElement={
                <Switch
                  colorScheme="brand"
                  isChecked={notifications.signIn}
                  onChange={() => handleNotificationToggle("signIn")}
                />
              }
              onClick={() => handleNotificationToggle("signIn")}
            />
            <SettingItem
              icon={FiShield}
              title="Security Notifications"
              description="Receive alerts about security-related activities"
              rightElement={
                <Switch
                  colorScheme="brand"
                  isChecked={notifications.security}
                  onChange={() => handleNotificationToggle("security")}
                />
              }
              onClick={() => handleNotificationToggle("security")}
            />
          </VStack>
        </MotionBox>

        {/* Security Section */}
        <MotionBox variants={itemVariants}>
          <Flex alignItems="center" mb={4}>
            <Icon as={FiShield} mr={2} color="brand.500" />
            <Heading size="md">Security</Heading>
          </Flex>
          <VStack align={"flex-start"} spacing={3}>
            <SettingItem
              icon={FiKey}
              title="Update Password"
              description="Change your account password"
              onClick={passwordModal.onOpen}
            />
            <SettingItem
              icon={FiLock}
              title="Wallet Phrase"
              description="View your wallet recovery phrase"
              onClick={walletModal.onOpen}
            />
            <SettingItem
              icon={FiLock}
              title="Transaction PIN"
              description="Set or update your transaction PIN"
              onClick={pinModal.onOpen}
            />
            <SettingItem
              icon={FiShield}
              title="Two-Factor Authentication"
              description={`${
                twoFactorEnabled ? "Disable" : "Enable"
              } additional security layer`}
              rightElement={
                <Badge
                  colorScheme={twoFactorEnabled ? "green" : "gray"}
                  borderRadius="full"
                  px={2}
                >
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              }
              onClick={twoFAModal.onOpen}
            />
            <SettingItem
              icon={FiLogOut}
              title="Logout"
              description="Sign out from your account"
              onClick={logoutModal.onOpen}
            />
          </VStack>
        </MotionBox>

        {/* Profile Modal */}
        <Modal
          isOpen={profileModal.isOpen}
          onClose={profileModal.onClose}
          isCentered
          size="lg"
        >
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent borderRadius="xl" bg={bgColor}>
            <ModalHeader>Account Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <>
                {accountDetails ? (
                  <>
                    <VStack spacing={5} align="center" mb={6}>
                      <Avatar
                        size="xl"
                        name={accountDetails.fullname}
                        bg="brand.500"
                      />
                      <HStack>
                        <Text fontWeight="medium" fontSize="sm">
                          Account ID: {user.username}
                        </Text>
                        <Tooltip label="Copy Account ID">
                          <IconButton
                            aria-label="Copy Account ID"
                            icon={<FiCopy />}
                            size="xs"
                            onClick={handleCopyId}
                            variant="ghost"
                          />
                        </Tooltip>
                      </HStack>
                    </VStack>

                    <VStack spacing={4}>
                      <FormControl isInvalid={!!profileErrors.fullname}>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                          value={accountDetails.fullname}
                          onChange={(e) =>
                            setAccountDetails({
                              ...accountDetails,
                              fullname: e.target.value,
                            })
                          }
                          focusBorderColor="brand.500"
                          borderRadius="lg"
                        />
                        <FormErrorMessage>
                          {profileErrors.fullname}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!profileErrors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          value={accountDetails.email}
                          onChange={(e) =>
                            setAccountDetails({
                              ...accountDetails,
                              email: e.target.value,
                            })
                          }
                          type="email"
                          focusBorderColor="brand.500"
                          borderRadius="lg"
                        />
                        <FormErrorMessage>
                          {profileErrors.email}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!profileErrors.phone}>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          value={accountDetails.phone}
                          onChange={(e) =>
                            setAccountDetails({
                              ...accountDetails,
                              phone: e.target.value,
                            })
                          }
                          focusBorderColor="brand.500"
                          borderRadius="lg"
                        />
                        <FormErrorMessage>
                          {profileErrors.phone}
                        </FormErrorMessage>
                      </FormControl>
                    </VStack>
                  </>
                ) : (
                  <Center>
                    <Spinner size="md" color="brand.500" />
                  </Center>
                )}
              </>
            </ModalBody>

            <ModalFooter hidden={!accountDetails}>
              <Button variant="ghost" mr={3} onClick={profileModal.onClose}>
                Cancel
              </Button>
              <Button
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={handleProfileUpdate}
                leftIcon={<FiEdit />}
                isLoading={updatingProfile}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Email Update Modal */}
        <Modal
          isOpen={usernameModal.isOpen}
          onClose={usernameModal.onClose}
          isCentered
        >
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent borderRadius="xl" bg={bgColor}>
            <ModalHeader>Update Email</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Current Username</FormLabel>
                  <Input
                    value={user.username}
                    isReadOnly
                    bg={sectionBgColor}
                    borderRadius="lg"
                  />
                </FormControl>

                <FormControl isInvalid={!!usernameErrors.new_username}>
                  <FormLabel>New Username</FormLabel>
                  <Input
                    placeholder="Enter new username"
                    focusBorderColor="brand.500"
                    borderRadius="lg"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <FormErrorMessage>
                    {usernameErrors.new_username}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!usernameErrors.password}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password to confirm"
                      focusBorderColor="brand.500"
                      borderRadius="lg"
                      value={usernamePassword}
                      onChange={(e) => setUsernamePassword(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        icon={showPassword ? <FiEyeOff /> : <FiEye />}
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{usernameErrors.password}</FormErrorMessage>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={usernameModal.onClose}>
                Cancel
              </Button>
              <Button
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={handleUsernameUpdate}
                leftIcon={<FiEdit2 />}
                isLoading={updatingUsername}
              >
                Update Username
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Password Update Modal */}
        <Modal
          isOpen={passwordModal.isOpen}
          onClose={passwordModal.onClose}
          isCentered
        >
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent borderRadius="xl" bg={bgColor}>
            <ModalHeader>Update Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Current Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      focusBorderColor="brand.500"
                      borderRadius="lg"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        icon={showPassword ? <FiEyeOff /> : <FiEye />}
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>New Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      focusBorderColor="brand.500"
                      borderRadius="lg"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Confirm New Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      focusBorderColor="brand.500"
                      borderRadius="lg"
                    />
                  </InputGroup>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={passwordModal.onClose}>
                Cancel
              </Button>
              <Button
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={handlePasswordUpdate}
                leftIcon={<FiKey />}
                isDisabled={!password || !newPassword || !confirmPassword}
              >
                Update Password
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Wallet phrase view Modal */}
        <Modal
          isOpen={walletModal.isOpen}
          onClose={walletModal.onClose}
          isCentered
        >
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent borderRadius="xl" bg={bgColor}>
            <ModalHeader>Wallet Phrase</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <AlertDescription>
                  Your wallet phrase is a secret recovery phrase that can be
                  used to restore your account in case you lose access.
                </AlertDescription>
              </Alert>

              <VStack mt={"2rem"} spacing={4} align="stretch">
                <Text fontWeight="medium">Your Wallet Phrase</Text>
                <Box
                  bg={modalBg}
                  p={4}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderLeftColor="brand.500"
                  width="full"
                >
                  <Text
                    fontSize="sm"
                    color={useColorModeValue("gray.700", "gray.300")}
                  >
                    Your wallet phrase will be displayed here. Make sure to keep
                    it safe and do not share it with anyone.
                  </Text>
                </Box>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Transaction PIN Modal */}
        <Modal isOpen={pinModal.isOpen} onClose={pinModal.onClose} isCentered>
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent borderRadius="xl" bg={bgColor}>
            <ModalHeader>Transaction PIN</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={5}>
                <Text>
                  Set a 4-digit PIN to authorize your transactions. This adds an
                  extra layer of security to your account.
                </Text>

                <Text fontWeight="medium">Enter New 4-Digit PIN</Text>
                <HStack spacing={4} justify="center">
                  <PinInput
                    otp
                    size="lg"
                    value={transactionPin}
                    onChange={setTransactionPin}
                    focusBorderColor="brand.500"
                    mask
                  >
                    <PinInputField borderRadius="lg" />
                    <PinInputField borderRadius="lg" />
                    <PinInputField borderRadius="lg" />
                    <PinInputField borderRadius="lg" />
                  </PinInput>
                </HStack>

                <Box
                  bg="brand.50"
                  p={4}
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderLeftColor="brand.500"
                  width="full"
                >
                  <Text fontSize="sm" color="gray.700">
                    Never share your PIN with anyone. We will never ask for your
                    PIN outside of the transaction process.
                  </Text>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={pinModal.onClose}>
                Cancel
              </Button>
              <Button
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={handlePinUpdate}
                leftIcon={<FiLock />}
                isDisabled={transactionPin.length !== 4}
              >
                Set PIN
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* 2FA Modal */}
        <Modal
          isOpen={twoFAModal.isOpen}
          onClose={twoFAModal.onClose}
          isCentered
        >
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent borderRadius="xl" bg={bgColor}>
            <ModalHeader>Two-Factor Authentication</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={5}>
                <Icon
                  as={FiShield}
                  boxSize={16}
                  color="brand.500"
                  bg={iconBgColor}
                  p={3}
                  borderRadius="full"
                />

                <Heading size="md" textAlign="center">
                  {twoFactorEnabled ? "Disable" : "Enable"} Two-Factor
                  Authentication
                </Heading>

                <Text textAlign="center">
                  {twoFactorEnabled
                    ? "Disabling 2FA will make your account less secure. Are you sure you want to continue?"
                    : "Two-factor authentication adds an extra layer of security to your account by requiring a transaction pin for critical actions."}
                </Text>

                {!twoFactorEnabled && (
                  <Box
                    bg={modalBg}
                    p={4}
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderLeftColor="brand.500"
                    width="full"
                  >
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      How it works:
                    </Text>
                    <Text fontSize="sm">
                      1. Set a 4-digit transaction PIN
                      <br />
                      2. When you want to perform a critical action, you will be
                      asked to enter your PIN
                      <br />
                      3. Enter the 4-digit pin to verify
                    </Text>
                  </Box>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={twoFAModal.onClose}>
                Cancel
              </Button>
              <Button
                bg={twoFactorEnabled ? "red.500" : "brand.500"}
                color="white"
                _hover={{ bg: twoFactorEnabled ? "red.600" : "brand.600" }}
                onClick={handleToggle2FA}
                leftIcon={twoFactorEnabled ? <FiEyeOff /> : <FiShield />}
              >
                {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Logout Confirmation Modal */}
        <Modal
          isOpen={logoutModal.isOpen}
          onClose={logoutModal.onClose}
          isCentered
        >
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent borderRadius="xl" bg={bgColor}>
            <ModalHeader>Logout Confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={5}>
                <Icon
                  as={FiLogOut}
                  boxSize={16}
                  color="red.500"
                  bg="red.50"
                  p={3}
                  borderRadius="full"
                />

                <Heading size="md" textAlign="center">
                  Are you sure you want to logout?
                </Heading>

                <Text textAlign="center">
                  You will need to sign in again to access your account.
                </Text>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={logoutModal.onClose}>
                Cancel
              </Button>
              <Button
                bg="red.500"
                color="white"
                _hover={{ bg: "red.600" }}
                onClick={handleLogout}
                leftIcon={<FiLogOut />}
              >
                Logout
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </MotionVStack>
    </Container>
  );
};

export default SettingsPage;
