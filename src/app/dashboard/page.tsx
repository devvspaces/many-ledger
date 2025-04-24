"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  useColorModeValue,
  VStack,
  HStack,
  Stat,
  StatArrow,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Select,
  FormControl,
  FormLabel,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Center,
  Spinner,
  Image,
  StackDivider,
  FormErrorMessage,
  PinInput,
  PinInputField,
  IconButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiArrowDown,
  FiArrowUp,
  FiDollarSign,
  FiArrowRight,
  FiPaperclip,
  FiLock,
  FiEdit,
  FiRefreshCcw,
} from "react-icons/fi";
import Link from "next/link";
import {
  DashboardResponse,
  KycStage,
  ReceivingAddress,
  Transaction,
} from "@/helpers/response";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getAddresses,
  getDashboard,
  sendCrypto,
} from "@/store/thunks/ledgerThunk";
import { CRYPTO_CURRENCY, FIAT_CURRENCY } from "@/helpers/constants";
import { selectUser } from "@/store/features/auth";
import { copyToClipboard } from "@/helpers/utils";
import { QRCodeSVG } from "qrcode.react";
import moment from "moment";
import { MiniChart } from "react-ts-tradingview-widgets";

const YoutubeEmbed = ({ videoId }: { videoId: string }) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
      }}
    >
      <iframe
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

function QrGenerator({ text }: { text: string }) {
  return (
    <Center my={4}>
      <QRCodeSVG
        value={text || " "} // Empty fallback to prevent errors
        size={256}
        level="H" // Error correction level
        fgColor="#000000" // QR color
        bgColor="#ffffff" // Background color
        marginSize={4}
      />
    </Center>
  );
}

const buyOptions: {
  name: string;
  videoId: string;
  link: string;
}[] = [
  {
    name: "Moon Pay",
    videoId: "3OyabwnS4Pg",
    link: "https://moonpay.com/buy",
  },
  {
    name: "Binance",
    videoId: "TudHqECFE5Q",
    link: "https://accounts.binance.com/en/register",
  },
  {
    name: "Trust Wallet",
    videoId: "ligSpdP9Gdc",
    link: "https://trustwallet.com/buy-crypto",
  },
  {
    name: "Coin Mama",
    videoId: "BJfgsOTOzp4",
    link: "https://coinmama.com",
  },
  {
    name: "Local Bitcoins",
    videoId: "oto0vXTE8_4",
    link: "https://localbitcoins.com",
  },
];

const CryptoWalletDashboard = () => {
  const {
    isOpen: isSendOpen,
    onOpen: onSendOpen,
    onClose: onSendClose,
  } = useDisclosure();
  const {
    isOpen: isChartOpen,
    onOpen: onChartOpen,
    onClose: onChartClose,
  } = useDisclosure();
  const {
    isOpen: isReceiveOpen,
    onOpen: onReceiveOpen,
    onClose: onReceiveClose,
  } = useDisclosure();
  const {
    isOpen: isBuyOpen,
    onOpen: onBuyOpen,
    onClose: onBuyClose,
  } = useDisclosure();
  const {
    isOpen: isKYCOpen,
    onOpen: onKYCOpen,
    onClose: onKYCClose,
  } = useDisclosure();

  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [selectedAsset, setSelectedAsset] = useState<string>("BTCUSD");
  const [addresses, setAddresses] = useState<ReceivingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceive, setSelectedReceive] = useState<number | null>(null);
  const [selectedSend, setSelectedSend] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [sendAmount, setSendAmount] = useState<number>(0);
  const [sendPIN, setSendPIN] = useState<string>("");
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser)!;

  // Handle transaction pin update
  const [sending, setSending] = useState(false);
  const [sendErrors, setSendErrors] = useState<Record<string, string>>({});
  const handleSendCrypto = () => {
    const errors: Record<string, string> = {};
    if (!selectedSend || selectedSend === "") {
      errors.selectedSend = "Please select a currency to send.";
    }
    if (!recipientAddress || recipientAddress === "") {
      errors.recipientAddress = "Please enter the recipient's address.";
    }
    if (sendAmount <= 0) {
      errors.sendAmount = "Please enter a valid amount to send.";
    }
    if (!sendPIN || sendPIN === "") {
      errors.sendPIN = "Please enter your transaction PIN.";
    }
    if (Object.keys(errors).length > 0) {
      setSendErrors(errors);
      return;
    }
    setSendErrors({});
    const loadingToast = toast({
      title: "Sending Crypto",
      description: "Please wait while we process your transaction...",
      status: "loading",
      duration: null,
      isClosable: false,
      position: "top",
    });
    setSending(true);
    dispatch(
      sendCrypto({
        currency: selectedSend,
        amount: sendAmount,
        to_address: recipientAddress,
        pin: sendPIN,
      })
    )
      .unwrap()
      .then(() => {
        toast({
          title: "Transaction Successful",
          description: `Your transaction of ${sendAmount} ${selectedSend} to ${recipientAddress} was successful and is being processed.`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setSendAmount(0);
        setRecipientAddress("");
        setSendPIN("");
        setSelectedSend("");
        onSendClose();
      })
      .catch((err) => {
        console.log(err);
        setSendErrors({
          selectedSend: err.data.currency,
          recipientAddress: err.data.to_address,
          sendAmount: err.data.amount,
          sendPIN: err.data.pin,
        });
        toast({
          title: "Transaction Failed",
          description: "An error occurred while processing your transaction.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      })
      .finally(() => {
        toast.close(loadingToast);
        setSending(false);
      });
  };

  const cryptoAssets = Object.entries(dashboardData?.currency_balance || {})
    .filter(([currency]) => CRYPTO_CURRENCY[currency] !== undefined)
    .map(([currency, balance]) => ({
      id: currency,
      name: CRYPTO_CURRENCY[currency].name,
      symbol: currency.toUpperCase(),
      balance: balance,
      actual_balance: dashboardData?.actual_balances[currency] ?? 0,
      value: (dashboardData?.crypto_rates[currency]?.price as number) || 0,
      change: parseFloat(
        (
          (dashboardData?.crypto_rates[currency]
            ?.percent_change_1h as number) || 0
        ).toFixed(2)
      ),
      logo: CRYPTO_CURRENCY[currency].logo,
    }));

  const fiatAssets = Object.entries(dashboardData?.currency_balance || {})
    .filter(([currency]) => FIAT_CURRENCY[currency] !== undefined)
    .map(([currency, balance]) => ({
      id: currency,
      name: FIAT_CURRENCY[currency].name,
      symbol: currency.toUpperCase(),
      balance: balance,
      actual_balance: dashboardData?.actual_balances[currency] ?? 0,
      value: dashboardData?.currency_price[currency] || 0,
      icon: FIAT_CURRENCY[currency].icon,
    }));

  // KYC status
  const kycStatus: string = user.profile.kyc_stage; // 'pending', 'verified', 'incomplete'

  // Dynamic colors based on theme
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBgColor = useColorModeValue("gray.50", "gray.700");
  const secondaryBgColor = useColorModeValue("gray.100", "gray.700");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const primaryColor = useColorModeValue("brand.600", "brand.500");

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const MotionBox = motion(Box);

  const toast = useToast();

  const fetchDashboard = useCallback(() => {
    return dispatch(getDashboard())
      .unwrap()
      .then((data) => {
        setDashboardData(data.data);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "An error occurred.",
          description: "Unable to fetch dashboard data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => setLoading(false));
  }, [dispatch, toast]);
  useEffect(() => {
    setLoading(true);
    dispatch(getAddresses())
      .unwrap()
      .then((data) => {
        setAddresses(data.data);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "An error occurred.",
          description: "Unable to fetch wallet addresses.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    fetchDashboard();
  }, [dispatch, toast, fetchDashboard]);

  const renderTransactions = (transactions: Transaction[]) => {
    if (transactions.length === 0) {
      return (
        <Text color={mutedTextColor} textAlign="center" py={4}>
          No transactions to display.
        </Text>
      );
    }
    function showSwap(tx: Transaction) {
      if (tx.swap_from_currency && tx.swap_to_currency) {
        return ` ${tx.swap_from_currency} → ${tx.swap_to_currency}`;
      }
    }
    return (
      <VStack spacing={3} align="stretch">
        {transactions.map((tx, index) => (
          <MotionBox
            key={tx.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            transition={{ delay: 0.05 * index }}
            bg={cardBgColor}
            p={4}
            borderRadius="xl"
            boxShadow="sm"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <HStack spacing={3}>
                <Flex
                  w={10}
                  h={10}
                  borderRadius="full"
                  bg={
                    tx.meta_type === "receive"
                      ? "green.100"
                      : tx.meta_type === "send"
                      ? "orange.100"
                      : tx.meta_type === "buy"
                      ? "blue.100"
                      : tx.meta_type === "swap"
                      ? "purple.100"
                      : "red.100"
                  }
                  color={
                    tx.meta_type === "receive"
                      ? "green.500"
                      : tx.meta_type === "send"
                      ? "orange.500"
                      : tx.meta_type === "buy"
                      ? "blue.500"
                      : tx.meta_type === "swap"
                      ? "purple.500"
                      : "red.500"
                  }
                  justifyContent="center"
                  alignItems="center"
                  fontSize="lg"
                >
                  {tx.meta_type === "receive" ? (
                    <FiArrowDown />
                  ) : tx.meta_type === "send" ? (
                    <FiArrowUp />
                  ) : tx.meta_type === "buy" ? (
                    <FiDollarSign />
                  ) : tx.meta_type === "swap" ? (
                    <FiArrowRight />
                  ) : (
                    <FiArrowUp />
                  )}
                </Flex>
                <VStack spacing={0} alignItems="flex-start">
                  <Text fontWeight="bold" textTransform="capitalize">
                    {tx.meta_type}
                    {showSwap(tx)}
                  </Text>
                  <Text fontSize="xs" color={mutedTextColor}>
                    {moment(tx.created).fromNow()}
                  </Text>
                </VStack>
              </HStack>

              <VStack spacing={0} alignItems="flex-end">
                <Text fontWeight="bold">
                  {tx.tx_type === "credit" ? "+" : "-"}
                  {tx.currency_type === "crypto"
                    ? parseFloat(parseFloat(tx.crypto_amount).toFixed(8))
                    : parseFloat(
                        parseFloat(tx.fiat_amount).toFixed(2)
                      ).toLocaleString()}{" "}
                  {tx.currency}
                </Text>
                <Badge
                  colorScheme={
                    tx.status === "completed"
                      ? "green"
                      : tx.status === "pending"
                      ? "yellow"
                      : "red"
                  }
                  fontSize="xs"
                >
                  {tx.status}
                </Badge>
              </VStack>
            </Flex>
          </MotionBox>
        ))}
      </VStack>
    );
  };

  const [reloading, setReloading] = useState(false);
  const reload = async () => {
    setReloading(true);
    await fetchDashboard();
    setReloading(false);
  };

  return (
    <>
      {loading && (
        <Center hidden={!loading} h={"80vh"}>
          <Spinner size="lg" />
        </Center>
      )}
      {dashboardData && (
        <>
          {/* Main Content Area */}
          <>
            {/* Balance Overview Card */}
            <MotionBox
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              mt={4}
              bg={primaryColor}
              borderRadius="2xl"
              p={6}
              color="white"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="-30px"
                right="-20px"
                w="180px"
                h="180px"
                borderRadius="full"
                bg="rgba(255,255,255,0.1)"
              />
              <Box
                position="absolute"
                bottom="-50px"
                left="-30px"
                w="150px"
                h="150px"
                borderRadius="full"
                bg="rgba(255,255,255,0.05)"
              />

              <Text fontSize="sm" fontWeight="medium" mb={1}>
                Total Balance
              </Text>
              <Heading as="h2" size="xl" fontWeight="bold" mb={2}>
                $
                {dashboardData.total_balance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Heading>

              <HStack
                wrap={"wrap"}
                mt={6}
                justifyContent={{
                  base: "center",
                  md: "space-between",
                }}
              >
                <Button
                  leftIcon={<FiArrowUp />}
                  colorScheme="whiteAlpha"
                  size="md"
                  borderRadius="lg"
                  fontWeight="medium"
                  onClick={onSendOpen}
                >
                  Send
                </Button>
                <Button
                  leftIcon={<FiArrowDown />}
                  colorScheme="whiteAlpha"
                  size="md"
                  borderRadius="lg"
                  fontWeight="medium"
                  onClick={onReceiveOpen}
                >
                  Receive
                </Button>
                <Button
                  leftIcon={<FiDollarSign />}
                  colorScheme="whiteAlpha"
                  size="md"
                  borderRadius="lg"
                  fontWeight="medium"
                  onClick={onBuyOpen}
                >
                  Buy
                </Button>
                <Button
                  leftIcon={<FiPaperclip />}
                  colorScheme="whiteAlpha"
                  size="md"
                  borderRadius="lg"
                  fontWeight="medium"
                  onClick={onKYCOpen}
                >
                  KYC
                </Button>
              </HStack>
            </MotionBox>

            {/* Assets Section */}
            <VStack align="stretch" mt={6} spacing={4}>
              <Flex justifyContent="space-between" alignItems="center">
                <Heading as="h3" size="md" fontWeight="bold">
                  Your Assets
                </Heading>
                <IconButton
                  isLoading={reloading}
                  onClick={reload}
                  size={"sm"}
                  variant={"ghost"}
                  rounded={"full"}
                  icon={<FiRefreshCcw />}
                  aria-label=""
                />
              </Flex>

              {cryptoAssets.map((asset, index) => (
                <MotionBox
                  key={asset.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  transition={{ delay: 0.1 * index }}
                  bg={cardBgColor}
                  p={4}
                  borderRadius="xl"
                  boxShadow="sm"
                >
                  <Flex
                    onClick={() => {
                      setSelectedAsset(`${asset.id}USD`);
                      onChartOpen();
                    }}
                    cursor={"pointer"}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <HStack spacing={3}>
                      <Flex
                        w={10}
                        h={10}
                        borderRadius="full"
                        bg={`${asset.id}.50`}
                        color={`${asset.id}.500`}
                        justifyContent="center"
                        alignItems="center"
                        fontSize="xl"
                        fontWeight="bold"
                      >
                        <Image src={asset.logo} w={6} h={6} alt={asset.name} />
                      </Flex>
                      <VStack spacing={0} alignItems="flex-start">
                        <Text fontWeight="bold">{asset.name}</Text>
                        <Text fontSize="sm" color={mutedTextColor}>
                          {asset.symbol}
                        </Text>
                      </VStack>
                    </HStack>

                    <VStack spacing={0} alignItems="flex-end">
                      <Text fontWeight="bold">
                        ${parseFloat(asset.value.toFixed(2)).toLocaleString()}
                      </Text>
                      <HStack>
                        <Text fontSize="sm" color={mutedTextColor}>
                          {asset.actual_balance} {asset.symbol}
                        </Text>
                        <Badge
                          colorScheme={asset.change > 0 ? "green" : "red"}
                          variant="subtle"
                          fontSize="xs"
                        >
                          <Stat>
                            <StatArrow
                              type={asset.change > 0 ? "increase" : "decrease"}
                            />
                          </Stat>
                          {Math.abs(asset.change)}%
                        </Badge>
                      </HStack>
                    </VStack>
                  </Flex>
                </MotionBox>
              ))}

              {fiatAssets.map((asset, index) => (
                <MotionBox
                  key={asset.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  transition={{ delay: 0.1 * index }}
                  bg={cardBgColor}
                  p={4}
                  borderRadius="xl"
                  boxShadow="sm"
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <HStack spacing={3}>
                      <Flex
                        w={10}
                        h={10}
                        borderRadius="full"
                        bg={`${asset.id}.50`}
                        color={`${asset.id}.500`}
                        justifyContent="center"
                        alignItems="center"
                        fontSize="xl"
                        fontWeight="bold"
                      >
                        {asset.icon}
                      </Flex>
                      <VStack spacing={0} alignItems="flex-start">
                        <Text fontWeight="bold">{asset.name}</Text>
                        <Text fontSize="sm" color={mutedTextColor}>
                          {asset.symbol}
                        </Text>
                      </VStack>
                    </HStack>

                    <VStack spacing={0} alignItems="flex-end">
                      <Text fontWeight="bold">
                        ${parseFloat(asset.value.toFixed(2)).toLocaleString()}
                      </Text>
                      <HStack>
                        <Text fontSize="sm" color={mutedTextColor}>
                          {parseFloat(
                            asset.balance.toFixed(2)
                          ).toLocaleString()}{" "}
                          {asset.symbol}
                        </Text>
                      </HStack>
                    </VStack>
                  </Flex>
                </MotionBox>
              ))}
            </VStack>

            {/* Recent Transactions */}
            <VStack align="stretch" mt={8} spacing={4}>
              <Flex justifyContent="space-between" alignItems="center">
                <Heading as="h3" size="md" fontWeight="bold">
                  Your Transactions
                </Heading>
              </Flex>

              <Tabs variant="soft-rounded" colorScheme="brand" size="sm">
                <TabList>
                  <Tab>All</Tab>
                  <Tab>Sent</Tab>
                  <Tab>Received</Tab>
                  <Tab>Buy</Tab>
                  <Tab>Swap</Tab>
                  <Tab>Withdraw</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0}>
                    {renderTransactions(dashboardData.transactions)}
                  </TabPanel>
                  <TabPanel px={0}>
                    {renderTransactions(
                      dashboardData.transactions.filter(
                        (tx) => tx.meta_type === "send"
                      )
                    )}
                  </TabPanel>
                  <TabPanel px={0}>
                    {renderTransactions(
                      dashboardData.transactions.filter(
                        (tx) => tx.meta_type === "receive"
                      )
                    )}
                  </TabPanel>
                  <TabPanel px={0}>
                    {renderTransactions(
                      dashboardData.transactions.filter(
                        (tx) => tx.meta_type === "buy"
                      )
                    )}
                  </TabPanel>
                  <TabPanel px={0}>
                    {renderTransactions(
                      dashboardData.transactions.filter(
                        (tx) => tx.meta_type === "swap"
                      )
                    )}
                  </TabPanel>
                  <TabPanel px={0}>
                    {renderTransactions(
                      dashboardData.transactions.filter(
                        (tx) => tx.meta_type === "withdraw"
                      )
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </>

          {/* Single Chart UI */}
          <Modal
            size={"xl"}
            isOpen={isChartOpen}
            onClose={onChartClose}
            isCentered
          >
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent borderRadius="xl" bg={bgColor}>
              <ModalHeader>Real-Time Chart</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <MiniChart symbol={selectedAsset} colorTheme="dark" width="100%"></MiniChart>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Send Modal */}
          <Modal isOpen={isSendOpen} onClose={onSendClose} isCentered>
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent borderRadius="xl" bg={bgColor}>
              <ModalHeader>Send Crypto</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!sendErrors.selectedSend}>
                    <FormLabel>Select Asset</FormLabel>
                    <Select
                      placeholder="Select asset"
                      isRequired
                      onChange={(e) => setSelectedSend(e.target.value)}
                      value={selectedSend}
                    >
                      {cryptoAssets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name} ({asset.symbol}) -{" "}
                          {parseFloat(asset.actual_balance.toFixed(8))}{" "}
                          available
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>
                      {sendErrors.selectedSend}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!sendErrors.recipientAddress}>
                    <FormLabel>Recipient Address</FormLabel>
                    <Input
                      placeholder="Enter wallet address"
                      isRequired
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      value={recipientAddress}
                    />
                    <FormErrorMessage>
                      {sendErrors.recipientAddress}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!sendErrors.sendAmount}>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      placeholder="0.00"
                      type="number"
                      isRequired
                      onChange={(e) =>
                        setSendAmount(parseFloat(e.target.value))
                      }
                      value={sendAmount}
                    />
                    <FormErrorMessage>{sendErrors.sendAmount}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!sendErrors.sendPIN}>
                    <FormLabel>PIN</FormLabel>
                    <HStack spacing={4}>
                      <PinInput
                        otp
                        size="lg"
                        value={sendPIN}
                        onChange={setSendPIN}
                        focusBorderColor="brand.500"
                        mask
                      >
                        <PinInputField borderRadius="lg" />
                        <PinInputField borderRadius="lg" />
                        <PinInputField borderRadius="lg" />
                        <PinInputField borderRadius="lg" />
                      </PinInput>
                    </HStack>
                    <FormErrorMessage>{sendErrors.sendPIN}</FormErrorMessage>
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    mt={2}
                    leftIcon={<FiLock />}
                    onClick={handleSendCrypto}
                    isLoading={sending}
                  >
                    Confirm Send
                  </Button>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Receive Modal */}
          <Modal isOpen={isReceiveOpen} onClose={onReceiveClose} isCentered>
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent borderRadius="xl" bg={bgColor}>
              <ModalHeader>Receive Crypto</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <VStack spacing={4} align="center">
                  <FormControl>
                    <FormLabel>Select Asset</FormLabel>
                    <Select
                      onChange={(e) => {
                        setSelectedReceive(parseInt(e.target.value));
                      }}
                      placeholder="Select asset"
                    >
                      {addresses.map((asset, idx) => (
                        <option key={asset.id} value={idx}>
                          {CRYPTO_CURRENCY[asset.coin].name} ({asset.coin})
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <Box
                    border="2px dashed"
                    borderColor={borderColor}
                    p={6}
                    borderRadius="xl"
                    width="full"
                    textAlign="center"
                  >
                    <Text>QR Code would appear here</Text>
                    {selectedReceive !== null &&
                      CRYPTO_CURRENCY[addresses[selectedReceive].coin] !==
                        undefined && (
                        <QrGenerator
                          text={addresses[selectedReceive].address}
                        />
                      )}
                    <Text fontSize="xs" mt={4} color={mutedTextColor}>
                      Scan to receive payment
                    </Text>
                  </Box>

                  {selectedReceive !== null &&
                    CRYPTO_CURRENCY[addresses[selectedReceive].coin] !==
                      undefined && (
                      <FormControl>
                        <FormLabel>Your Wallet Address</FormLabel>
                        <Flex>
                          <Input
                            value={addresses[selectedReceive].address}
                            isReadOnly
                          />
                          <Button
                            onClick={() => {
                              copyToClipboard(
                                addresses[selectedReceive].address
                              );
                              toast({
                                title: "Copied to clipboard",
                                status: "info",
                                duration: 2000,
                              });
                            }}
                            ml={2}
                          >
                            Copy
                          </Button>
                        </Flex>
                      </FormControl>
                    )}
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Buy Modal */}
          <Modal isOpen={isBuyOpen} onClose={onBuyClose} isCentered>
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent borderRadius="xl" bg={bgColor}>
              <ModalHeader>Buy Crypto</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <VStack spacing={8} divider={<StackDivider />}>
                  {buyOptions.map((option, index) => (
                    <VStack
                      key={index}
                      w={"full"}
                      spacing={4}
                      align="stretch"
                      // bg={secondaryBgColor}
                      // p={4}
                      rounded="lg"
                    >
                      <Heading size={"md"}>{option.name}</Heading>
                      <YoutubeEmbed videoId={option.videoId} />
                      <Button
                        target="_blank"
                        as={Link}
                        href={option.link}
                        size="sm"
                        colorScheme="blue"
                      >
                        Buy
                      </Button>
                    </VStack>
                  ))}
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* KYC Modal */}
          <Modal isOpen={isKYCOpen} onClose={onKYCClose} isCentered>
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent borderRadius="xl" bg={bgColor}>
              <ModalHeader>Identity Verification (KYC)</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <VStack spacing={4} align="stretch">
                  <Box
                    bg={secondaryBgColor}
                    p={4}
                    borderRadius="lg"
                    borderLeft="4px solid"
                    borderLeftColor={
                      kycStatus === KycStage.Verified
                        ? "green.500"
                        : "yellow.500"
                    }
                  >
                    <Heading size="sm" mb={1}>
                      {kycStatus === KycStage.Verified
                        ? "Verification Complete"
                        : kycStatus === KycStage.VerificationReview
                        ? "Verification Under Review"
                        : "Complete Verification"}
                    </Heading>
                    <Text fontSize="sm">
                      {kycStatus === KycStage.Verified
                        ? "Your identity has been verified. You have full access to all platform features."
                        : kycStatus === KycStage.VerificationReview
                        ? "Your documents are under review. This process typically takes 1-2 business days."
                        : "To access all features, please complete the verification process."}
                    </Text>
                  </Box>

                  {kycStatus !== "verified" && (
                    <>
                      <Divider />

                      <VStack spacing={4} align="stretch">
                        <Heading size="sm">Verification Steps</Heading>

                        <HStack>
                          <Flex
                            w={8}
                            h={8}
                            borderRadius="full"
                            bg={
                              kycStatus === KycStage.VerificationReview
                                ? "green.100"
                                : "gray.100"
                            }
                            color={
                              kycStatus === KycStage.VerificationReview
                                ? "green.500"
                                : "gray.500"
                            }
                            justifyContent="center"
                            alignItems="center"
                            fontWeight="bold"
                          >
                            1
                          </Flex>
                          <VStack spacing={0} align="flex-start">
                            <Text fontWeight="medium">
                              Personal Information
                            </Text>
                            <Text fontSize="xs" color={mutedTextColor}>
                              Basic details and contact information
                            </Text>
                          </VStack>
                          <Badge
                            colorScheme={
                              kycStatus === KycStage.PersonalInfo
                                ? "yellow"
                                : "green"
                            }
                            ml="auto"
                          >
                            {kycStatus === KycStage.PersonalInfo
                              ? "In Progress"
                              : "Completed"}
                          </Badge>
                        </HStack>

                        <HStack>
                          <Flex
                            w={8}
                            h={8}
                            borderRadius="full"
                            bg={
                              kycStatus === KycStage.VerificationReview
                                ? "green.100"
                                : "gray.100"
                            }
                            color={
                              kycStatus === KycStage.VerificationReview
                                ? "green.500"
                                : "gray.500"
                            }
                            justifyContent="center"
                            alignItems="center"
                            fontWeight="bold"
                          >
                            2
                          </Flex>
                          <VStack spacing={0} align="flex-start">
                            <Text fontWeight="medium">ID Verification</Text>
                            <Text fontSize="xs" color={mutedTextColor}>
                              Government-issued photo ID
                            </Text>
                          </VStack>
                          <Badge
                            colorScheme={
                              kycStatus === KycStage.VerificationReview
                                ? "green"
                                : "gray"
                            }
                            ml="auto"
                          >
                            {kycStatus === KycStage.VerificationReview
                              ? "Completed"
                              : "Not Started"}
                          </Badge>
                        </HStack>

                        <HStack>
                          <Flex
                            w={8}
                            h={8}
                            borderRadius="full"
                            bg={
                              kycStatus === KycStage.VerificationReview
                                ? "yellow.100"
                                : "gray.100"
                            }
                            color={
                              kycStatus === KycStage.VerificationReview
                                ? "yellow.500"
                                : "gray.500"
                            }
                            justifyContent="center"
                            alignItems="center"
                            fontWeight="bold"
                          >
                            3
                          </Flex>
                          <VStack spacing={0} align="flex-start">
                            <Text fontWeight="medium">Verification Review</Text>
                            <Text fontSize="xs" color={mutedTextColor}>
                              Admin approval process
                            </Text>
                          </VStack>
                          <Badge
                            colorScheme={
                              kycStatus === KycStage.VerificationReview
                                ? "yellow"
                                : "gray"
                            }
                            ml="auto"
                          >
                            {kycStatus === KycStage.VerificationReview
                              ? "In Progress"
                              : "Not Started"}
                          </Badge>
                        </HStack>
                      </VStack>

                      {kycStatus === KycStage.PersonalInfo && (
                        <Button
                          colorScheme="brand"
                          size="lg"
                          width="full"
                          mt={2}
                          leftIcon={<FiPaperclip />}
                          as={Link}
                          href="/dashboard/kyc"
                        >
                          Start Verification
                        </Button>
                      )}
                    </>
                  )}

                  <Button
                    size="md"
                    width="full"
                    mt={2}
                    leftIcon={<FiEdit />}
                    as={Link}
                    href="/dashboard/kyc"
                    hidden={
                      kycStatus === KycStage.Verified ||
                      kycStatus === KycStage.PersonalInfo
                    }
                  >
                    Update
                  </Button>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default CryptoWalletDashboard;
