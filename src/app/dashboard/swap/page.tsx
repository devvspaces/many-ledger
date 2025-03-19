"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  HStack,
  Icon,
  Flex,
  Container,
  Divider,
  Badge,
  useToast,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Card,
  CardBody,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiArrowDown,
  FiRefreshCw,
  FiArrowRight,
  FiRotateCw,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";

// Motion components
const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionCard = motion(Card);

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

// Sample crypto data
const cryptoOptions = [
  {
    value: "BTC",
    label: "Bitcoin (BTC)",
    icon: "₿",
    balance: 0.0245,
    price: 68251.32,
    change: 2.4,
  },
  {
    value: "ETH",
    label: "Ethereum (ETH)",
    icon: "Ξ",
    balance: 0.5612,
    price: 3480.12,
    change: -1.2,
  },
  {
    value: "SOL",
    label: "Solana (SOL)",
    icon: "◎",
    balance: 12.3521,
    price: 143.57,
    change: 5.7,
  },
  {
    value: "USDT",
    label: "Tether (USDT)",
    icon: "₮",
    balance: 520.4231,
    price: 1.0,
    change: 0.01,
  },
];
type CryptoOption = (typeof cryptoOptions)[number];

// Sample fiat options
const fiatOptions = [
  { value: "USD", label: "US Dollar (USD)", symbol: "$" },
  { value: "EUR", label: "Euro (EUR)", symbol: "€" },
  { value: "GBP", label: "British Pound (GBP)", symbol: "£" },
  { value: "JPY", label: "Japanese Yen (JPY)", symbol: "¥" },
];
type FiatOption = (typeof fiatOptions)[number];

const SwapPage = () => {
  const [fromType, setFromType] = useState("crypto");
  const [toType, setToType] = useState("crypto");
  const [fromAsset, setFromAsset] = useState(cryptoOptions[0].value);
  const [toAsset, setToAsset] = useState(cryptoOptions[1].value);
  const [fromAmount, setFromAmount] = useState("0.01");
  const [toAmount, setToAmount] = useState("0");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRate, setLoadingRate] = useState(false);
  const reviewModal = useDisclosure();
  const successModal = useDisclosure();

  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentBgColor = useColorModeValue("brand.50", "brand.900");
  const cardBgColor = useColorModeValue("white", "gray.750");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  // Mock function to calculate rates
  const calculateRate = () => {
    setLoadingRate(true);

    // Find the from and to assets
    const fromCrypto = cryptoOptions.find((c) => c.value === fromAsset);
    let toValue;

    if (toType === "crypto") {
      const toCrypto = cryptoOptions.find((c) => c.value === toAsset);
      toValue = toCrypto?.price || 0;
    } else {
      // Assume conversion to fiat is at market price
      toValue = 1; // For simplicity, we're using 1:1 for fiat conversions
    }

    // Calculate the exchange rate
    if (fromCrypto && toValue) {
      const rate = fromCrypto.price / toValue;

      // Apply a small fee (0.5%)
      const rateWithFee = rate * 0.995;

      setTimeout(() => {
        setExchangeRate(rateWithFee);
        setToAmount((parseFloat(fromAmount) * rateWithFee).toFixed(6));
        setLoadingRate(false);
      }, 800);
    }
  };

  // Handle asset selection
  interface HandleAssetChangeParams {
    direction: "from" | "to";
    value: string;
  }

  // Handle asset type toggle
  interface HandleTypeToggleParams {
    direction: "from" | "to";
    type: "crypto" | "fiat";
  }

  const handleTypeToggle = ({ direction, type }: HandleTypeToggleParams) => {
    if (direction === "from") {
      setFromType(type);
      // Reset selected asset
      setFromAsset(
        type === "crypto" ? cryptoOptions[0].value : fiatOptions[0].value
      );
    } else {
      setToType(type);
      // Reset selected asset
      setToAsset(
        type === "crypto" ? cryptoOptions[0].value : fiatOptions[0].value
      );
    }

    // Recalculate rate after a type change
    setTimeout(calculateRate, 100);
  };

  const handleAssetChange = ({ direction, value }: HandleAssetChangeParams) => {
    if (direction === "from") {
      setFromAsset(value);
    } else {
      setToAsset(value);
    }

    // Recalculate rate after an asset change
    setTimeout(calculateRate, 100);
  };

  // Handle amount input
  const handleAmountChange = (value: string) => {
    setFromAmount(value);
    if (exchangeRate > 0) {
      setToAmount((parseFloat(value) * exchangeRate).toFixed(6));
    }
  };

  // Swap direction
  const handleSwapDirection = () => {
    // Swap from/to types
    const tempType = fromType;
    setFromType(toType);
    setToType(tempType);

    // Swap from/to assets
    const tempAsset = fromAsset;
    setFromAsset(toAsset);
    setToAsset(tempAsset);

    // Swap amounts
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);

    // Recalculate rate
    setTimeout(calculateRate, 100);

    // Show animation with toast
    toast({
      title: "Direction swapped",
      description: "From and To values have been swapped",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  // Handle review confirmation
  const handleReviewSwap = () => {
    // Show review modal
    reviewModal.onOpen();
  };

  // Handle confirm swap
  const handleConfirmSwap = () => {
    setIsLoading(true);
    reviewModal.onClose();

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      successModal.onOpen();

      toast({
        title: "Swap initiated",
        description:
          "Your swap has been initiated and will be processed shortly",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }, 2000);
  };

  // Initialize exchange rate on component mount
  useEffect(() => {
    calculateRate();
  }, []);

  // Get current asset info
  const getAssetInfo = (type: string, asset: string) => {
    if (type === "crypto") {
      return cryptoOptions.find((c) => c.value === asset);
    } else {
      return fiatOptions.find((f) => f.value === asset);
    }
  };

  const fromAssetInfo = getAssetInfo(fromType, fromAsset);
  const toAssetInfo = getAssetInfo(toType, toAsset);

  // Render asset selector
  const AssetSelector = ({
    direction,
    type,
    selectedAsset,
  }: {
    direction: "from" | "to";
    type: "crypto" | "fiat";
    selectedAsset: string;
  }) => (
    <VStack align="stretch" spacing={2} width="100%">
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="medium" color={secondaryTextColor}>
          {direction === "from" ? "From" : "To"}
        </Text>
        <HStack spacing={2}>
          <Button
            size="xs"
            colorScheme={type === "crypto" ? "brand" : "gray"}
            variant={type === "crypto" ? "solid" : "outline"}
            onClick={() =>
              handleTypeToggle({
                direction,
                type: "crypto",
              })
            }
          >
            Crypto
          </Button>
          <Button
            size="xs"
            colorScheme={type === "fiat" ? "brand" : "gray"}
            variant={type === "fiat" ? "solid" : "outline"}
            onClick={() =>
              handleTypeToggle({
                direction,
                type: "fiat",
              })
            }
          >
            Fiat
          </Button>
        </HStack>
      </HStack>

      <FormControl>
        <Select
          value={selectedAsset}
          onChange={(e) =>
            handleAssetChange({
              direction,
              value: e.target.value,
            })
          }
          borderRadius="lg"
          focusBorderColor="brand.500"
          size="lg"
          bg={accentBgColor}
        >
          {type === "crypto"
            ? cryptoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - Balance: {option.balance}
                </option>
              ))
            : fiatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
        </Select>
      </FormControl>

      {direction === "from" ? (
        <FormControl mt={2}>
          <InputGroup size="lg">
            <InputLeftElement
              pointerEvents="none"
              color="gray.500"
              fontSize="lg"
            >
              {type === "crypto"
                ? (fromAssetInfo as CryptoOption)?.icon
                : (fromAssetInfo as FiatOption)?.symbol}
            </InputLeftElement>
            <NumberInput
              value={fromAmount}
              onChange={(valueString) => handleAmountChange(valueString)}
              min={0}
              precision={6}
              step={0.000001}
              width="100%"
            >
              <NumberInputField borderRadius="lg" pl={10} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => {
                  // Set max amount from balance
                  if (type === "crypto") {
                    const crypto = cryptoOptions.find(
                      (c) => c.value === selectedAsset
                    );
                    if (crypto) {
                      handleAmountChange(crypto.balance.toString());
                    }
                  }
                }}
              >
                Max
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      ) : (
        <FormControl mt={2}>
          <InputGroup size="lg">
            <InputLeftElement
              pointerEvents="none"
              color="gray.500"
              fontSize="lg"
            >
              {type === "crypto"
                ? (toAssetInfo as CryptoOption)?.icon
                : (toAssetInfo as FiatOption)?.symbol}
            </InputLeftElement>
            <Input
              value={toAmount}
              readOnly
              borderRadius="lg"
              pl={10}
              size="lg"
              bg={accentBgColor}
            />
          </InputGroup>
        </FormControl>
      )}

      {direction === "from" && type === "crypto" && (
        <Text fontSize="xs" color={secondaryTextColor}>
          Available balance: {(fromAssetInfo as CryptoOption)?.balance}{" "}
          {fromAssetInfo?.value}
        </Text>
      )}
    </VStack>
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
            Swap Assets
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Convert between cryptocurrencies or to fiat currencies
          </Text>
        </MotionBox>

        {/* Market Overview */}
        <MotionBox
          variants={itemVariants}
          overflowX="auto"
          css={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <HStack spacing={4} pb={2}>
            {cryptoOptions.map((crypto) => (
              <MotionCard
                key={crypto.value}
                minW="170px"
                bg={cardBgColor}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
                whileHover={{ scale: 1.05 }}
                transition={spring}
              >
                <CardBody p={4}>
                  <HStack mb={1}>
                    <Text fontWeight="bold">
                      {crypto.icon} {crypto.value}
                    </Text>
                    <Badge
                      colorScheme={crypto.change >= 0 ? "green" : "red"}
                      variant="subtle"
                      fontSize="xs"
                      ml="auto"
                    >
                      {crypto.change >= 0 ? "+" : ""}
                      {crypto.change}%
                    </Badge>
                  </HStack>
                  <Text fontSize="lg" fontWeight="medium">
                    ${crypto.price.toLocaleString()}
                  </Text>
                </CardBody>
              </MotionCard>
            ))}
          </HStack>
        </MotionBox>

        {/* Main Swap Card */}
        <MotionBox variants={itemVariants}>
          <Box
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="2xl"
            p={6}
            bg={bgColor}
            boxShadow="lg"
          >
            {/* From Section */}
            <AssetSelector
              direction="from"
              type={fromType as "crypto" | "fiat"}
              selectedAsset={fromAsset}
            />

            {/* Swap Button */}
            <Flex justify="center" my={6}>
              <MotionBox
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
              >
                <IconButton
                  aria-label="Swap direction"
                  icon={<FiArrowDown />}
                  onClick={handleSwapDirection}
                  colorScheme="brand"
                  size="lg"
                  isRound
                  shadow="md"
                />
              </MotionBox>
            </Flex>

            {/* To Section */}
            <AssetSelector
              direction="to"
              type={toType as "crypto" | "fiat"}
              selectedAsset={toAsset}
            />

            {/* Exchange Rate */}
            <Box mt={6} p={4} bg={accentBgColor} borderRadius="lg">
              <HStack justify="space-between">
                <Text fontSize="sm" color={secondaryTextColor}>
                  Exchange Rate
                </Text>
                {loadingRate ? (
                  <Skeleton height="20px" width="140px" />
                ) : (
                  <HStack>
                    <Text fontSize="sm">
                      1 {fromAssetInfo?.value} ≈ {exchangeRate.toFixed(6)}{" "}
                      {toAssetInfo?.value}
                    </Text>
                    <Icon
                      as={FiRefreshCw}
                      cursor="pointer"
                      onClick={calculateRate}
                      color="brand.500"
                    />
                  </HStack>
                )}
              </HStack>

              <Divider my={3} />

              <HStack justify="space-between">
                <Text fontSize="sm" color={secondaryTextColor}>
                  Fee
                </Text>
                <Text fontSize="sm">0.5%</Text>
              </HStack>
            </Box>

            {/* Action Button */}
            <Button
              mt={6}
              size="lg"
              width="100%"
              bg="brand.500"
              color="white"
              _hover={{ bg: "brand.600" }}
              leftIcon={<FiRotateCw />}
              onClick={handleReviewSwap}
              isDisabled={parseFloat(fromAmount) <= 0 || loadingRate}
              borderRadius="xl"
            >
              Review Swap
            </Button>
          </Box>
        </MotionBox>

        {/* Review Modal */}
        <Modal
          isOpen={reviewModal.isOpen}
          onClose={reviewModal.onClose}
          isCentered
          size="lg"
        >
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent borderRadius="xl" bg={bgColor}>
            <ModalHeader>Review Swap</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={6} align="stretch">
                <Box p={4} bg={accentBgColor} borderRadius="lg">
                  <HStack justify="space-between" mb={4}>
                    <VStack align="flex-start" spacing={0}>
                      <Text fontSize="sm" color={secondaryTextColor}>
                        From
                      </Text>
                      <HStack align="center">
                        <Text fontSize="xl" fontWeight="bold">
                          {fromAmount} {fromAssetInfo?.value}
                        </Text>
                      </HStack>
                    </VStack>
                    <Icon as={FiArrowRight} boxSize={6} color="gray.400" />
                    <VStack align="flex-end" spacing={0}>
                      <Text fontSize="sm" color={secondaryTextColor}>
                        To
                      </Text>
                      <Text fontSize="xl" fontWeight="bold">
                        {toAmount} {toAssetInfo?.value}
                      </Text>
                    </VStack>
                  </HStack>

                  <Divider />

                  <Box mt={4}>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color={secondaryTextColor}>
                        Exchange Rate
                      </Text>
                      <Text fontSize="sm">
                        1 {fromAssetInfo?.value} = {exchangeRate.toFixed(6)}{" "}
                        {toAssetInfo?.value}
                      </Text>
                    </HStack>

                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color={secondaryTextColor}>
                        Network Fee
                      </Text>
                      <Text fontSize="sm">0.5%</Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={secondaryTextColor}
                      >
                        You will receive
                      </Text>
                      <Text fontSize="sm" fontWeight="bold">
                        {toAmount} {toAssetInfo?.value}
                      </Text>
                    </HStack>
                  </Box>
                </Box>

                <Box
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="orange.300"
                  bg="orange.50"
                >
                  <HStack>
                    <Icon as={FiAlertCircle} color="orange.500" />
                    <Text fontSize="sm" color="orange.800">
                      This swap is irreversible. Please verify all details
                      before confirming.
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={reviewModal.onClose}>
                Cancel
              </Button>
              <Button
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={handleConfirmSwap}
                isLoading={isLoading}
                loadingText="Processing"
              >
                Confirm Swap
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Success Modal */}
        <Modal
          isOpen={successModal.isOpen}
          onClose={successModal.onClose}
          isCentered
        >
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent borderRadius="xl" bg={bgColor}>
            <ModalBody pt={12} pb={12}>
              <VStack spacing={6}>
                <Flex
                  bg="green.100"
                  p={4}
                  borderRadius="full"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Icon as={FiCheck} boxSize={8} color="green.500" />
                </Flex>

                <Heading size="md" textAlign="center">
                  Swap Successfully Initiated
                </Heading>

                <Text textAlign="center">
                  Your swap of {fromAmount} {fromAssetInfo?.value} to {toAmount}{" "}
                  {toAssetInfo?.value} has been initiated.
                </Text>

                <Box p={4} borderRadius="lg" bg={accentBgColor} width="full">
                  <Text fontSize="sm" textAlign="center">
                    You can check the status of your swap in the Transaction
                    History section.
                  </Text>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter justifyContent="center">
              <Button
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={successModal.onClose}
                size="lg"
                width="100%"
                maxW="200px"
              >
                Done
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </MotionVStack>
    </Container>
  );
};

export default SwapPage;
