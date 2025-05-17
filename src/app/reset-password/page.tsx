"use client";
import React, { useState, useEffect } from "react";
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
  ModalCloseButton,
  useDisclosure,
  Grid,
  GridItem,
  Progress,
  InputLeftElement,
  Alert,
  AlertIcon,
  FormErrorMessage,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { 
  FiEye, 
  FiEyeOff, 
  FiLock, 
  FiUser, 
  FiArrowRight, 
  FiCheck, 
  FiKey
} from "react-icons/fi";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { forgotPassword, resetPassword } from "@/store/thunks/authThunk";

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

const phraseInputVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 } 
  },
  focus: { 
    scale: 1.02,
    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
    borderColor: "brand.500",
    transition: { duration: 0.2 } 
  }
};

const ResetPasswordPage = () => {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState(1);
  const [verifying, setVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [phraseInputs, setPhraseInputs] = useState(Array(12).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resetComplete, setResetComplete] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const dispatch = useAppDispatch();
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const phraseInputRefs = Array(12).fill(0).map(() => React.createRef<HTMLInputElement>());

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

  const handlePhraseInputChange = (index: number, value: string) => {
    const newPhraseInputs = [...phraseInputs];

    const phrases = value.split(" ");
    if (phrases.length > 1) {
      phrases.forEach((phrase, i) => {
        if (i + index < 12) {
          newPhraseInputs[i + index] = phrase;
        }
      });
      setPhraseInputs(newPhraseInputs);
    } else {
      newPhraseInputs[index] = value;
      setPhraseInputs(newPhraseInputs);
    }

    // if (value && index < 11) {
    //   phraseInputRefs[index + 1].current.focus();
    // }
  };

  const goToNextPhraseInput = (index: number) => {
    if (index < 11) {
      phraseInputRefs[index + 1]?.current?.focus();
    }
  }

  const handleUsernameSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter your username",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    
    // Proceed to recovery phrase step
    setStep(2);
  };

  const handlePhraseSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    // Check if all phrases are entered
    if (phraseInputs.some(phrase => !phrase)) {
      toast({
        title: "Error",
        description: "Please enter all recovery phrase words",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    
    // Simulate verification
    setVerifying(true);
    const phrase = phraseInputs.join(" ");
    dispatch(
      forgotPassword({
        username,
        phrase,
      })
    )
      .unwrap()
      .then(() => {
        setVerificationSuccess(true);
  
        // Show success message and proceed
        toast({
          title: "Recovery Phrase Verified",
          description: "Your identity has been confirmed",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        
        // Open reset password modal
        onOpen();
      })
      .catch((err) => {
        console.log(err)
        toast({
          title: "Error",
          description: "Either the username or recovery phrase is incorrect",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      })
      .finally(() => {
        setVerifying(false);
      });
  };


  const [errors, setErrors] = useState<{
    password?: string[];
  }>({});
  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    // Validate passwords
    if (!password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please enter and confirm your new password",
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
    
    // Simulate password reset
    setResetLoading(true);

    dispatch(
      resetPassword({
        username,
        phrase: phraseInputs.join(" "),
        password,
      })
    )
      .unwrap()
      .then(() => {
        setResetComplete(true);
        onClose();
        toast({
          title: "Password Reset Complete",
          description: "Your password has been successfully updated",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        router.push("/login");
      })
      .catch((err) => {
        setErrors(err.data);
        toast({
          title: "Error",
          description: "An error occurred while updating your password",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      })
      .finally(() => {
        setResetLoading(false);
      });
    
    setTimeout(() => {
      setResetLoading(false);
      
    }, 1500);
  };

  // Animation effect when showing verification success
  useEffect(() => {
    if (verificationSuccess) {
      const confetti = () => {
        // This would be where you'd add a confetti animation if desired
        // For now we'll just handle the modal opening
      };
      confetti();
    }
  }, [verificationSuccess]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient={bgGradient}
      p={4}
    >
      <Container maxW="container.md" p={0}>
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
            <Icon
              as={FiKey}
              boxSize={12}
              color={highlightColor}
            />
          </MotionBox>

          {/* Card */}
          <MotionBox
            variants={itemVariants}
            w="full"
            p={{
              base: 4,
              md: 8
            }}
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
                <Heading size="xl" mb={2} bgGradient="linear(to-r, purple.400, brand.600)" bgClip="text">
                  Reset Password
                </Heading>
                <Text color="gray.500">
                  {step === 1 
                    ? "Enter your username to begin the recovery process" 
                    : "Enter your 12-word recovery phrase to verify your identity"}
                </Text>
              </MotionBox>

              {step === 1 ? (
                <MotionBox variants={itemVariants} w="full">
                  <form onSubmit={handleUsernameSubmit}>
                    <VStack spacing={5} align="flex-start">
                      <FormControl isRequired>
                        <FormLabel>Username</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FiUser} color="gray.500" />
                          </InputLeftElement>
                          <Input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            _hover={{ borderColor: "brand.400" }}
                            _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px #0066CC" }}
                            size="lg"
                            borderRadius="xl"
                            bg={bgColor}
                          />
                        </InputGroup>
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
                        rightIcon={<FiArrowRight />}
                      >
                        Continue
                      </Button>

                      <Flex width="100%" justify="center" pt={4}>
                        <Text>Remember your password?</Text>
                        <Link as={NextLink} href="/login" color="brand.500" fontWeight="medium" ml={2}>
                          Sign in
                        </Link>
                      </Flex>
                    </VStack>
                  </form>
                </MotionBox>
              ) : (
                <MotionBox variants={itemVariants} w="full">
                  <form onSubmit={handlePhraseSubmit}>
                    <VStack spacing={5} align="flex-start">
                      <Alert status="info" borderRadius="lg">
                        <AlertIcon />
                        <Box>
                          <Text fontWeight="medium">Enter your recovery phrase</Text>
                          <Text fontSize="sm">
                            This is the 12-word phrase you saved when creating your account
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
                        <Grid templateColumns={{
                          base: "repeat(2, 1fr)",
                          md: "repeat(3, 1fr)",
                        }} gap={3}>
                          {phraseInputs.map((word, index) => (
                            <GridItem key={index}>
                              <MotionBox
                                as={Flex}
                                variants={phraseInputVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="focus"
                                alignItems="center"
                              >
                                <InputGroup size="md">
                                  <InputLeftElement
                                    pointerEvents="none"
                                    color="gray.500"
                                    fontSize="sm"
                                  >
                                    {index + 1}.
                                  </InputLeftElement>
                                  <Input
                                    value={word}
                                    onChange={(e) => handlePhraseInputChange(index, e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === " ") {
                                        e.preventDefault();
                                        goToNextPhraseInput(index);
                                      }
                                      if (e.key === "Backspace" && !word && index > 0) {
                                        phraseInputRefs[index - 1]?.current?.focus();
                                      }
                                      if (e.key === "ArrowLeft" && index > 0) {
                                        phraseInputRefs[index - 1]?.current?.focus();
                                      }
                                      if (e.key === "ArrowRight" && index < 11) {
                                        phraseInputRefs[index + 1]?.current?.focus();
                                      }
                                    }}
                                    placeholder={`Word ${index + 1}`}
                                    ref={phraseInputRefs[index]}
                                    borderRadius="md"
                                    bg={bgColor}
                                  />
                                </InputGroup>
                              </MotionBox>
                            </GridItem>
                          ))}
                        </Grid>
                      </Box>

                      <Button
                        type="submit"
                        width="full"
                        size="lg"
                        bg="brand.500"
                        color="white"
                        _hover={{ bg: "brand.600" }}
                        _active={{ bg: "brand.700" }}
                        borderRadius="xl"
                        isLoading={verifying}
                        loadingText="Verifying"
                        rightIcon={<FiCheck />}
                      >
                        Verify Recovery Phrase
                      </Button>

                      <Flex width="100%" justify="center" pt={4}>
                        <Button
                          variant="link"
                          onClick={() => setStep(1)}
                          leftIcon={<FiArrowRight transform="rotate(180)" />}
                          color="gray.500"
                        >
                          Back to Username
                        </Button>
                      </Flex>
                    </VStack>
                  </form>
                </MotionBox>
              )}
            </VStack>
          </MotionBox>
        </MotionFlex>
      </Container>

      {/* Reset Password Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="lg"
        isCentered
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" bg={glassBg} p={2}>
          <ModalHeader>
            <Heading size="md" textAlign="center" color="brand.100">
              Create New Password
            </Heading>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={6}>
              {resetComplete ? (
                <VStack spacing={4} py={4}>
                  <Icon as={FiCheck} color="green.500" boxSize={16} />
                  <Heading size="md" color="green.500">Password Reset Successful!</Heading>
                  <Text textAlign="center">
                    Your password has been updated. You will be redirected to the login page.
                  </Text>
                </VStack>
              ) : (
                <form onSubmit={handleResetPassword} style={{ width: "100%" }}>
                  <VStack spacing={4}>
                    <FormControl isRequired isInvalid={!!errors.password}>
                      <FormLabel>New Password</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiLock} color="gray.500" />
                        </InputLeftElement>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a new password"
                          value={password}
                          onChange={handlePasswordChange}
                          _hover={{ borderColor: "brand.400" }}
                          _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px #0066CC" }}
                          size="lg"
                          borderRadius="xl"
                          bg={bgColor}
                        />
                        <InputRightElement height="full">
                          <IconButton
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            icon={showPassword ? <FiEyeOff /> : <FiEye />}
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        </InputRightElement>
                      </InputGroup>
                      {password && (
                        <Box mt={2}>
                          <Progress value={passwordStrength} size="sm" colorScheme={
                            passwordStrength <= 25 ? "red" : 
                            passwordStrength <= 50 ? "orange" : 
                            passwordStrength <= 75 ? "yellow" : "green"
                          } borderRadius="full" />
                          <Flex justify="space-between" mt={1}>
                            <Text fontSize="xs" color={getPasswordStrengthColor()}>
                              {passwordStrength <= 25 ? "Weak" : 
                               passwordStrength <= 50 ? "Fair" : 
                               passwordStrength <= 75 ? "Good" : "Strong"}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              Min. 8 characters with uppercase, number & symbol
                            </Text>
                          </Flex>
                        </Box>
                      )}
                      {
                        errors.password && errors.password.map((error, index) => (
                          <FormErrorMessage key={index}>{error}</FormErrorMessage>
                        ))
                      }
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
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          _hover={{ borderColor: "brand.400" }}
                          _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px #0066CC" }}
                          size="lg"
                          borderRadius="xl"
                          bg={bgColor}
                        />
                      </InputGroup>
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
                      mt={4}
                      isLoading={resetLoading}
                      loadingText="Updating"
                      rightIcon={<FiCheck />}
                    >
                      Reset Password
                    </Button>
                  </VStack>
                </form>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ResetPasswordPage;