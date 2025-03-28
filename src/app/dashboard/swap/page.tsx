"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  Image,
  Center,
  Spinner,
  FormLabel,
  PinInput,
  PinInputField,
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
import { useAppDispatch } from "@/store/hooks";
import { getCryptoBalances, getFiatBalances, swapCrypto } from "@/store/thunks/ledgerThunk";
import { CRYPTO_CURRENCY, FIAT_CURRENCY } from "@/helpers/constants";

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

type CryptoOption = {
  value: string;
  label: string;
  logo: string;
  balance: number;
  price: number;
  change: number;
};

type FiatOption = {
  value: string;
  label: string;
  icon: string;
  balance: number;
  price: number;
};

const SwapPage = () => {
  const [loading, setLoading] = useState(false);
  const [loadingFiat, setLoadingFiat] = useState(false);
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);
  const [fiatOptions, setFiatOptions] = useState<FiatOption[]>([]);
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>({});
  const [fromType, setFromType] = useState("crypto");
  const [toType, setToType] = useState("fiat");
  const [fromAsset, setFromAsset] = useState<string | null>(null);
  const [toAsset, setToAsset] = useState<string | null>(null);
  const [fromAmount, setFromAmount] = useState("0.01");
  const [toAmount, setToAmount] = useState("0");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRate, setLoadingRate] = useState(false);
  const [pin, setPin] = useState("");
  const reviewModal = useDisclosure();
  const successModal = useDisclosure();

  const dispatch = useAppDispatch();
  const toast = useToast();

  const isFiat = useCallback((symbol: string) => {
    return FIAT_CURRENCY[symbol] !== undefined;
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(getCryptoBalances())
      .unwrap()
      .then((data) => {
        const cryptoAssets = Object.entries(data.data.currency_balance || {})
        .filter(([currency]) => CRYPTO_CURRENCY[currency] !== undefined)
        .map(([currency, balance]) => ({
          label: `${CRYPTO_CURRENCY[currency].name} (${currency})`,
          value: currency.toUpperCase(),
          balance: balance,
          price: (data.data.crypto_rates[currency]?.price as number) || 0,
          change: parseFloat(
            (
              (data.data.crypto_rates[currency]
                ?.percent_change_1h as number) || 0
            ).toFixed(2)
          ),
          logo: CRYPTO_CURRENCY[currency].logo,
        }));
        setCryptoOptions(cryptoAssets);
        setFromAsset(cryptoAssets[0].value);

        const cryptoRates = Object.entries(data.data.currency_balance || {})
        .filter(([currency]) => CRYPTO_CURRENCY[currency] !== undefined)
        .map(([currency]) => ({
          [currency]: data.data.currency_price[currency] || 0
        }));
        setCurrencyRates((prev) => ({
          ...prev,
          ...Object.assign({}, ...cryptoRates),
        }));
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error fetching data",
          description: "An error occurred while fetching data",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      })
      .finally(() => {
        setLoading(false);
      });
      
    setLoadingFiat(true);
    dispatch(getFiatBalances())
    .unwrap()
    .then((data) => {
      const fiatAssets = Object.entries(data.data.currency_balance || {})
      .filter(([currency]) => FIAT_CURRENCY[currency] !== undefined)
      .map(([currency, balance]) => ({
        label: `${FIAT_CURRENCY[currency].name} (${currency})`,
        value: currency.toUpperCase(),
        balance: balance,
        price: data.data.currency_price[currency] || 0,
        icon: FIAT_CURRENCY[currency].icon,
      }));
      setFiatOptions(fiatAssets);
      setToAsset(fiatAssets[0].value);

      const fiatRates = Object.entries(data.data.currency_balance || {})
      .filter(([currency]) => FIAT_CURRENCY[currency] !== undefined)
      .map(([currency]) => ({
        [currency]: data.data.currency_price[currency] || 0
      }));
      setCurrencyRates((prev) => ({
        ...prev,
        ...Object.assign({}, ...fiatRates),
      }));
    })
    .catch((err) => {
      console.log(err);
      toast({
        title: "Error fetching data",
        description: "An error occurred while fetching data",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    })
    .finally(() => {
      setLoadingFiat(false);
    });
  }, [dispatch, toast]);

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentBgColor = useColorModeValue("brand.50", "brand.900");
  const cardBgColor = useColorModeValue("white", "gray.750");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  const calculateRate = useCallback((from: string, to: string) => {
    setLoadingRate(true);
    setTimeout(() => {
      // Find the from and to assets
      const rate = (currencyRates[from] / currencyRates[to]);
      // Apply a small fee (0.5%)
      const rateWithFee = rate // * 0.995;
      setExchangeRate(rateWithFee);
      setToAmount((parseFloat(fromAmount) * rateWithFee).toFixed(isFiat(to) ? 2 : 6));
      setLoadingRate(false);
    }, 800);
  }, [currencyRates, fromAmount, isFiat]);

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
  };

  const handleAssetChange = ({ direction, value }: HandleAssetChangeParams) => {
    if (direction === "from") {
      setFromAsset(value);
      calculateRate(value, toAsset!);
    } else {
      setToAsset(value);
      calculateRate(fromAsset!, value);
    }
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
    dispatch(swapCrypto({
      from_currency: fromAsset!,
      to_currency: toAsset!,
      amount: parseFloat(fromAmount),
      pin,
    }))
      .unwrap()
      .then(() => {
        reviewModal.onClose();
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
      })
      .catch((err) => {
        console.log(err)
        if (err.data.pin) {
          toast({
            title: "Error processing swap",
            description: err.data.pin[0],
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        } else {
          reviewModal.onClose();
          toast({
            title: "Error processing swap",
            description: err.data.amount[0] ?? "An error occurred while processing your swap",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
    
  };

  // Initialize exchange rate on component mount
  useEffect(() => {
    if (!fromAsset || !toAsset) return;
    calculateRate(fromAsset, toAsset);
  }, [fromAsset, toAsset, calculateRate]);

  // Get current asset info
  const getAssetInfo = (type: string, asset: string | null) => {
    if (!asset) return;
    if (type === "crypto") {
      return cryptoOptions.find((c) => c.value === asset);
    }
    return fiatOptions.find((f) => f.value === asset)
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
            colorScheme={type === "crypto" ? "blue" : "gray"}
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
            colorScheme={type === "fiat" ? "blue" : "gray"}
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
                ? (
                  <Image src={(fromAssetInfo as CryptoOption)?.logo} w={6} h={6} alt={fromAssetInfo?.label} />
                )
                : (fromAssetInfo as FiatOption)?.icon}
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
                ? (
                  <Image src={(toAssetInfo as CryptoOption)?.logo} w={6} h={6} alt={toAssetInfo?.label} />
                )
                : (toAssetInfo as FiatOption)?.icon}
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
          <HStack spacing={4} pb={2} hidden={loading || loadingFiat}>
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
                    <HStack spacing={2}>
                      <Image src={crypto.logo} w={6} h={6} alt={crypto.label} />
                    <Text fontWeight="bold">
                      {crypto.value}
                    </Text>
                    </HStack>
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
            {fiatOptions.map((fiat) => (
              <MotionCard
                key={fiat.value}
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
                    {fiat.icon} {fiat.value}
                    </Text>
                  </HStack>
                  <Text fontSize="lg" fontWeight="medium">
                    ${fiat.price.toLocaleString()}
                  </Text>
                </CardBody>
              </MotionCard>
            ))}
          </HStack>
          <Center hidden={!loading && !loadingFiat}>
            <Spinner size={'md'} />
          </Center>
        </MotionBox>

        {/* Main Swap Card */}
        {
          fromAsset && toAsset && (
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
                  colorScheme="blue"
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
                      1 {fromAssetInfo?.value} ≈ {parseFloat(exchangeRate.toFixed(
                        isFiat(toAsset) ? 2 : 6
                      )).toLocaleString()}{" "}
                      {toAssetInfo?.value}
                    </Text>
                    <Icon
                      as={FiRefreshCw}
                      cursor="pointer"
                      onClick={() => calculateRate(fromAsset!, toAsset!)}
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
                <Text fontSize="sm">0%</Text>
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
          )
        }

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
                      <Text fontSize="sm">0%</Text>
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

                
                <FormControl isRequired>
                  <FormLabel>PIN</FormLabel>
                  <HStack spacing={4}>
                    <PinInput
                      otp
                      size="lg"
                      value={pin}
                      onChange={setPin}
                      focusBorderColor="brand.500"
                      mask
                    >
                      <PinInputField borderRadius="lg" />
                      <PinInputField borderRadius="lg" />
                      <PinInputField borderRadius="lg" />
                      <PinInputField borderRadius="lg" />
                    </PinInput>
                  </HStack>
                </FormControl>

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
                isDisabled={!pin || pin.length < 4}
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
