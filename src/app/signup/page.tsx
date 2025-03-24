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
  Link,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Grid,
  GridItem,
  FormHelperText,
  Checkbox,
  InputLeftElement,
  Alert,
  AlertIcon,
  Progress,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiUser,
  FiArrowRight,
  FiMail,
  FiCheck,
  FiCopy,
  FiDownload,
  FiShield,
} from "react-icons/fi";
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

const phraseItemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  hover: {
    scale: 1.05,
    backgroundColor: "rgba(0, 102, 204, 0.1)",
    transition: { duration: 0.2 },
  },
};

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState<string[]>([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [phrasesCopied, setPhrasesCopied] = useState(false);
  const [phrasesVerified, setPhrasesVerified] = useState(false);

  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const bgGradient = useColorModeValue(
    "linear(to-br, purple.50, blue.50, teal.50)",
    "linear(to-br, gray.900, purple.900, blue.900)"
  );
  const glassBg = useColorModeValue(
    "rgba(255, 255, 255, 0.9)",
    "rgba(26, 32, 44, 0.8)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = "brand.500";
  const phraseBg = useColorModeValue("gray.50", "gray.700");
  const phraseBorder = useColorModeValue("gray.200", "gray.600");

  // Generate recovery phrase
  const generateRecoveryPhrase = () => {
    // In a real app, this would be generated securely on the server
    const wordList = [
      "apple",
      "banana",
      "orange",
      "grape",
      "cherry",
      "lemon",
      "wallet",
      "crypto",
      "secure",
      "token",
      "block",
      "chain",
      "digital",
      "asset",
      "market",
      "trade",
      "exchange",
      "ledger",
      "private",
      "public",
      "key",
      "value",
      "node",
      "hash",
      "contract",
      "smart",
      "mine",
      "coin",
      "byte",
      "code",
    ];

    // Randomly select 12 unique words
    const selected: string[] = [];
    while (selected.length < 12) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      const word = wordList[randomIndex];
      if (!selected.includes(word)) {
        selected.push(word);
      }
    }

    return selected;
  };

  // Check password strength
  const checkPasswordStrength = (value: string) => {
    let strength = 0;

    if (value.length >= 8) strength += 25;
    if (/[A-Z]/.test(value)) strength += 25;
    if (/[0-9]/.test(value)) strength += 25;
    if (/[^A-Za-z0-9]/.test(value)) strength += 25;

    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: { target: { value: unknown; }; }) => {
    const value = e.target.value;
    setPassword(value as string);
    checkPasswordStrength(value as string);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "red.500";
    if (passwordStrength <= 50) return "orange.500";
    if (passwordStrength <= 75) return "yellow.500";
    return "green.500";
  };

  const handleSignup = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Form validation
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (passwordStrength < 75) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "You must agree to the terms and conditions",
        status: "warning",
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

      // Generate recovery phrase
      const phrase = generateRecoveryPhrase();
      setRecoveryPhrase(phrase);

      // Open recovery phrase modal
      onOpen();
    }, 1500);
  };

  const handleCopyPhrase = () => {
    navigator.clipboard.writeText(recoveryPhrase.join(" "));
    setPhrasesCopied(true);
    toast({
      title: "Copied",
      description: "Recovery phrase copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  const handleDownloadPhrase = () => {
    const element = document.createElement("a");
    const file = new Blob([recoveryPhrase.join(" ")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "recovery-phrase.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Downloaded",
      description: "Recovery phrase downloaded successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  const handleConfirmPhrase = () => {
    setPhrasesVerified(true);
  };

  const finishSignup = () => {
    toast({
      title: "Account created",
      description: "Your wallet is ready to use!",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    onClose();
    router.push("/dashboard");
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
      <Container maxW="container.md">
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
            <Icon as={FiShield} boxSize={12} color={highlightColor} />
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
              bg="purple.500"
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
              bg="brand.500"
              opacity="0.1"
              zIndex="0"
            />

            <VStack spacing={6} position="relative" zIndex="1">
              <MotionBox variants={itemVariants} textAlign="center" w="full">
                <Heading
                  size="xl"
                  mb={2}
                  bgGradient="linear(to-r, purple.400, brand.600)"
                  bgClip="text"
                >
                  Create Your Wallet
                </Heading>
                <Text color="gray.500">
                  Sign up to start your crypto journey
                </Text>
              </MotionBox>

              <MotionBox variants={itemVariants} w="full">
                <form onSubmit={handleSignup}>
                  <VStack spacing={5} align="flex-start">
                    <FormControl isRequired>
                      <FormLabel>Username</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiUser} color="gray.500" />
                        </InputLeftElement>
                        <Input
                          type="text"
                          placeholder="Choose a username"
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
                      <FormLabel>Email</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiMail} color="gray.500" />
                        </InputLeftElement>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiLock} color="gray.500" />
                        </InputLeftElement>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={password}
                          onChange={handlePasswordChange}
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
                      {password && (
                        <Box mt={2}>
                          <Progress
                            value={passwordStrength}
                            size="sm"
                            colorScheme={
                              passwordStrength <= 25
                                ? "red"
                                : passwordStrength <= 50
                                ? "orange"
                                : passwordStrength <= 75
                                ? "yellow"
                                : "green"
                            }
                            borderRadius="full"
                          />
                          <Flex justify="space-between" mt={1}>
                            <Text
                              fontSize="xs"
                              color={getPasswordStrengthColor()}
                            >
                              {passwordStrength <= 25
                                ? "Weak"
                                : passwordStrength <= 50
                                ? "Fair"
                                : passwordStrength <= 75
                                ? "Good"
                                : "Strong"}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              Min. 8 characters with uppercase, number & symbol
                            </Text>
                          </Flex>
                        </Box>
                      )}
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Confirm Password</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiLock} color="gray.500" />
                        </InputLeftElement>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
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
                      {confirmPassword && password !== confirmPassword && (
                        <FormHelperText color="red.500">
                          Passwords do not match
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl>
                      <Checkbox
                        colorScheme="brand"
                        isChecked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        size="lg"
                      >
                        <Text fontSize="sm">
                          I agree to the{" "}
                          <Link color="brand.500" href="#" isExternal>
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link color="brand.500" href="#" isExternal>
                            Privacy Policy
                          </Link>
                        </Text>
                      </Checkbox>
                    </FormControl>

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
                      loadingText="Creating account"
                      rightIcon={<FiArrowRight />}
                    >
                      Create Account
                    </Button>

                    <Flex width="100%" justify="center" pt={4}>
                      <Text>Already have an account?</Text>
                      <Link
                        as={NextLink}
                        href="/login"
                        color="brand.500"
                        fontWeight="medium"
                        ml={2}
                      >
                        Sign in
                      </Link>
                    </Flex>
                  </VStack>
                </form>
              </MotionBox>
            </VStack>
          </MotionBox>
        </MotionFlex>
      </Container>

      {/* Recovery Phrase Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (phrasesVerified) {
            onClose();
          } else {
            // Prevent accidental closing
            toast({
              title: "Action required",
              description: "Please save your recovery phrase before proceeding",
              status: "warning",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
          }
        }}
        closeOnOverlayClick={phrasesVerified}
        size="lg"
        isCentered
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" bg={glassBg} p={2}>
          <ModalHeader>
            <Heading size="md" textAlign="center" color="brand.500">
              Your Recovery Phrase
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          {phrasesVerified && <ModalCloseButton />}

          <ModalBody>
            <VStack spacing={6}>
              <Alert
                status="warning"
                borderRadius="lg"
                bg="orange.50"
                color="orange.800"
              >
                <AlertIcon color="orange.500" />
                <Box>
                  <Text fontWeight="medium">
                    Important: Save this recovery phrase
                  </Text>
                  <Text fontSize="sm">
                    These 12 words are the only way to restore your wallet if
                    you lose access. Store them safely and never share them with
                    anyone.
                  </Text>
                </Box>
              </Alert>

              <Box
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={phraseBorder}
                bg={phraseBg}
                width="full"
              >
                <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                  {recoveryPhrase.map((word, index) => (
                    <GridItem key={index}>
                      <MotionBox
                        as={Flex}
                        variants={phraseItemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        p={2}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={phraseBorder}
                        bg={bgColor}
                        alignItems="center"
                      >
                        <Text
                          fontWeight="medium"
                          color="gray.500"
                          fontSize="xs"
                          mr={2}
                        >
                          {index + 1}
                        </Text>
                        <Text>{word}</Text>
                      </MotionBox>
                    </GridItem>
                  ))}
                </Grid>
              </Box>

              <Flex width="full" gap={4}>
                <Button
                  leftIcon={<FiCopy />}
                  onClick={handleCopyPhrase}
                  flex={1}
                  variant="outline"
                  colorScheme="brand"
                  isDisabled={phrasesCopied}
                >
                  {phrasesCopied ? "Copied" : "Copy"}
                </Button>
                <Button
                  leftIcon={<FiDownload />}
                  onClick={handleDownloadPhrase}
                  flex={1}
                  variant="outline"
                  colorScheme="brand"
                >
                  Download
                </Button>
              </Flex>

              {!phrasesVerified ? (
                <VStack width="full" spacing={4} pt={2}>
                  <Checkbox
                    colorScheme="brand"
                    size="lg"
                    onChange={(e) => setPhrasesCopied(e.target.checked)}
                  >
                    <Text fontSize="sm">
                      I have safely stored my recovery phrase
                    </Text>
                  </Checkbox>

                  <Button
                    onClick={handleConfirmPhrase}
                    width="full"
                    colorScheme="green"
                    size="lg"
                    isDisabled={!phrasesCopied}
                    leftIcon={<FiCheck />}
                  >
                    I&apos;ve Saved My Recovery Phrase
                  </Button>
                </VStack>
              ) : (
                <VStack width="full" spacing={5} pt={3}>
                  <Icon as={FiCheck} color="green.500" boxSize={12} />
                  <Text
                    textAlign="center"
                    fontWeight="medium"
                    color="green.500"
                  >
                    Recovery phrase verified!
                  </Text>
                  <Button
                    onClick={finishSignup}
                    width="full"
                    colorScheme="blue"
                    size="lg"
                    rightIcon={<FiArrowRight />}
                  >
                    Continue to Dashboard
                  </Button>
                </VStack>
              )}
            </VStack>
          </ModalBody>

          {phrasesVerified && (
            <ModalFooter>
              <Text
                fontSize="sm"
                color="gray.500"
                textAlign="center"
                width="full"
              >
                Remember: Never share your recovery phrase with anyone.
              </Text>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>

      {/* Reset Password Modal - To be used in reset password flow */}
      <Modal
        id="reset-password-modal"
        isOpen={false} /* This will be controlled in the reset password page */
        size="md"
        isCentered
        onClose={() => {}}
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" bg={glassBg} p={2}>
          <ModalHeader>
            <Heading size="md" textAlign="center" color="brand.500">
              Reset Your Password
            </Heading>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLock} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a new password"
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
                <Box mt={2}>
                  <Progress
                    value={passwordStrength}
                    size="sm"
                    colorScheme={
                      passwordStrength <= 25
                        ? "red"
                        : passwordStrength <= 50
                        ? "orange"
                        : passwordStrength <= 75
                        ? "yellow"
                        : "green"
                    }
                    borderRadius="full"
                  />
                </Box>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLock} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
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

              <Button
                width="full"
                size="lg"
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                _active={{ bg: "brand.700" }}
                borderRadius="xl"
                rightIcon={<FiCheck />}
              >
                Reset Password
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SignupPage;
