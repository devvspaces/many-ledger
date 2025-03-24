"use client";
import React, { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Container,
  Flex,
  Icon,
  Checkbox,
  Link,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiLock, FiArrowRight } from "react-icons/fi";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

// Motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const toast = useToast();

  // Color mode values
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50, blue.50)",
    "linear(to-br, gray.900, blue.900, purple.900)"
  );
  const glassBg = useColorModeValue(
    "rgba(255, 255, 255, 0.9)",
    "rgba(26, 32, 44, 0.8)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = "brand.500";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Login successful",
        description: "Welcome back to your wallet!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient={bgGradient}
      p={4}
    >
      <Container maxW="container.sm">
        <MotionFlex
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          direction="column"
          align="center"
        >
          {/* Logo */}
          <MotionBox
            variants={logoVariants}
            mb={8}
            p={4}
            borderRadius="full"
            bg={glassBg}
            boxShadow="xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <Icon as={FiLock} boxSize={12} color={highlightColor} />
          </MotionBox>

          {/* Card */}
          <MotionBox
            variants={itemVariants}
            w="full"
            p={8}
            borderRadius="2xl"
            boxShadow="xl"
            bg={glassBg}
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor={borderColor}
            overflow="hidden"
            position="relative"
          >
            {/* Decorative elements */}
            <Box
              position="absolute"
              top="-100px"
              right="-100px"
              width="200px"
              height="200px"
              borderRadius="full"
              bg="brand.500"
              opacity="0.1"
              zIndex="0"
            />
            <Box
              position="absolute"
              bottom="-80px"
              left="-80px"
              width="160px"
              height="160px"
              borderRadius="full"
              bg="purple.500"
              opacity="0.1"
              zIndex="0"
            />

            <VStack spacing={6} position="relative" zIndex="1">
              <MotionBox variants={itemVariants} textAlign="center" w="full">
                <Heading
                  size="xl"
                  mb={2}
                  bgGradient="linear(to-r, #b3e0ff, #0066cc)"
                  bgClip="text"
                >
                  Welcome Back
                </Heading>
                <Text color="gray.500">Sign in to access your wallet</Text>
              </MotionBox>

              <MotionBox variants={itemVariants} w="full">
                <form onSubmit={handleLogin}>
                  <VStack spacing={5} align="flex-start">
                    <FormControl isRequired>
                      <FormLabel>Username</FormLabel>
                      <InputGroup>
                        <Input
                          type="text"
                          placeholder="Enter your username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          _hover={{ borderColor: "brand.400" }}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #0066CC",
                          }}
                          size="lg"
                          borderRadius="xl"
                          bg={useColorModeValue("white", "gray.700")}
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          _hover={{ borderColor: "brand.400" }}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #0066CC",
                          }}
                          size="lg"
                          borderRadius="xl"
                          bg={useColorModeValue("white", "gray.700")}
                        />
                        <InputRightElement height="full">
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

                    <Flex width="100%" justify="space-between" align="center">
                      <Checkbox
                        colorScheme="brand"
                        isChecked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      >
                        Remember me
                      </Checkbox>
                      <Link
                        as={NextLink}
                        href="/reset-password"
                        color="brand.500"
                        fontWeight="medium"
                      >
                        Forgot password?
                      </Link>
                    </Flex>

                    <Button
                      type="submit"
                      width="full"
                      size="lg"
                      bg="brand.500"
                      color="white"
                      _hover={{ bg: "brand.600" }}
                      _active={{ bg: "brand.700" }}
                      borderRadius="xl"
                      isLoading={loading}
                      loadingText="Signing in"
                      rightIcon={<FiArrowRight />}
                    >
                      Sign In
                    </Button>

                    <Flex width="100%" justify="center" pt={4}>
                      <Text>Don{"'"}t have an account?</Text>
                      <Link
                        as={NextLink}
                        href="/signup"
                        color="brand.500"
                        fontWeight="medium"
                        ml={2}
                      >
                        Sign up
                      </Link>
                    </Flex>
                  </VStack>
                </form>
              </MotionBox>
            </VStack>
          </MotionBox>
        </MotionFlex>
      </Container>
    </Box>
  );
};

export default LoginPage;
