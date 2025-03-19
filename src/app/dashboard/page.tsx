"use client";

import React from "react";
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
} from "react-icons/fi";
import Link from "next/link";

// Main App Component
const CryptoWalletDashboard = () => {
  // Modal states for different actions
  const {
    isOpen: isSendOpen,
    onOpen: onSendOpen,
    onClose: onSendClose,
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

  // Asset data (would normally come from API)
  const cryptoAssets = [
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      balance: 0.0875,
      value: 5425.32,
      change: 3.2,
      icon: "₿",
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      balance: 2.54,
      value: 4512.67,
      change: -1.5,
      icon: "Ξ",
    },
    {
      id: "sol",
      name: "Solana",
      symbol: "SOL",
      balance: 25.76,
      value: 1832.45,
      change: 5.8,
      icon: "S",
    },
    {
      id: "usdt",
      name: "Tether",
      symbol: "USDT",
      balance: 1500.0,
      value: 1500.0,
      change: 0.01,
      icon: "₮",
    },
  ];

  // Recent transactions (would normally come from API)
  const recentTransactions = [
    {
      id: 1,
      type: "receive",
      asset: "BTC",
      amount: 0.0125,
      from: "0x3a2...9f4c",
      date: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "send",
      asset: "ETH",
      amount: 0.5,
      to: "0xd82...7bae",
      date: "5 hours ago",
      status: "completed",
    },
    {
      id: 3,
      type: "buy",
      asset: "SOL",
      amount: 10.0,
      paymentMethod: "Credit Card",
      date: "Yesterday",
      status: "completed",
    },
    {
      id: 4,
      type: "convert",
      fromAsset: "BTC",
      toAsset: "USDT",
      amount: 0.005,
      date: "2 days ago",
      status: "completed",
    },
    {
      id: 5,
      type: "withdraw",
      asset: "USDT",
      amount: 500,
      to: "Bank Account",
      date: "3 days ago",
      status: "pending",
    },
  ];

  // KYC status
  const kycStatus: string = "pending"; // 'pending', 'verified', 'incomplete'

  // Dynamic colors based on theme
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBgColor = useColorModeValue("gray.50", "gray.700");
  const secondaryBgColor = useColorModeValue("gray.100", "gray.700");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const primaryColor = useColorModeValue("brand.600", "brand.500");

  // Total balance calculation
  const totalBalance = cryptoAssets.reduce(
    (sum, asset) => sum + asset.value,
    0
  );

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const MotionBox = motion(Box);

  return (
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
            {totalBalance.toLocaleString("en-US", {
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
            <Button
              size="sm"
              variant="ghost"
              rightIcon={<FiArrowRight />}
              color={mutedTextColor}
            >
              View All
            </Button>
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
                  <Text fontWeight="bold">${asset.value.toLocaleString()}</Text>
                  <HStack>
                    <Text fontSize="sm" color={mutedTextColor}>
                      {asset.balance} {asset.symbol}
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
        </VStack>

        {/* Recent Transactions */}
        <VStack align="stretch" mt={8} spacing={4}>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h3" size="md" fontWeight="bold">
              Recent Transactions
            </Heading>
            <Button
              size="sm"
              variant="ghost"
              rightIcon={<FiArrowRight />}
              color={mutedTextColor}
            >
              View All
            </Button>
          </Flex>

          <Tabs variant="soft-rounded" colorScheme="brand" size="sm">
            <TabList>
              <Tab>All</Tab>
              <Tab>Sent</Tab>
              <Tab>Received</Tab>
              <Tab>Trades</Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <VStack spacing={3} align="stretch">
                  {recentTransactions.map((tx, index) => (
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
                              tx.type === "receive"
                                ? "green.100"
                                : tx.type === "send"
                                ? "orange.100"
                                : tx.type === "buy"
                                ? "blue.100"
                                : tx.type === "convert"
                                ? "purple.100"
                                : "red.100"
                            }
                            color={
                              tx.type === "receive"
                                ? "green.500"
                                : tx.type === "send"
                                ? "orange.500"
                                : tx.type === "buy"
                                ? "blue.500"
                                : tx.type === "convert"
                                ? "purple.500"
                                : "red.500"
                            }
                            justifyContent="center"
                            alignItems="center"
                            fontSize="lg"
                          >
                            {tx.type === "receive" ? (
                              <FiArrowDown />
                            ) : tx.type === "send" ? (
                              <FiArrowUp />
                            ) : tx.type === "buy" ? (
                              <FiDollarSign />
                            ) : tx.type === "convert" ? (
                              <FiArrowRight />
                            ) : (
                              <FiArrowUp />
                            )}
                          </Flex>
                          <VStack spacing={0} alignItems="flex-start">
                            <Text fontWeight="bold" textTransform="capitalize">
                              {tx.type}
                            </Text>
                            <Text fontSize="xs" color={mutedTextColor}>
                              {tx.date}
                            </Text>
                          </VStack>
                        </HStack>

                        <VStack spacing={0} alignItems="flex-end">
                          <Text fontWeight="bold">
                            {tx.type === "receive" || tx.type === "buy"
                              ? "+"
                              : "-"}
                            {tx.amount} {tx.asset}
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
              </TabPanel>
              <TabPanel px={0}>
                <VStack spacing={3} align="stretch">
                  {recentTransactions
                    .filter((tx) => tx.type === "send")
                    .map((tx, index) => (
                      <MotionBox
                        key={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        bg={cardBgColor}
                        p={4}
                        borderRadius="xl"
                        boxShadow="sm"
                      >
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <HStack spacing={3}>
                            <Flex
                              w={10}
                              h={10}
                              borderRadius="full"
                              bg="orange.100"
                              color="orange.500"
                              justifyContent="center"
                              alignItems="center"
                              fontSize="lg"
                            >
                              <FiArrowUp />
                            </Flex>
                            <VStack spacing={0} alignItems="flex-start">
                              <Text fontWeight="bold">Send</Text>
                              <Text fontSize="xs" color={mutedTextColor}>
                                {tx.date}
                              </Text>
                            </VStack>
                          </HStack>

                          <VStack spacing={0} alignItems="flex-end">
                            <Text fontWeight="bold">
                              -{tx.amount} {tx.asset}
                            </Text>
                            <Badge
                              colorScheme={
                                tx.status === "completed" ? "green" : "yellow"
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
              </TabPanel>
              {/* Other TabPanels would contain filtered transactions */}
              <TabPanel px={0}>
                <Text color={mutedTextColor} textAlign="center" py={4}>
                  Filter functionality would be implemented here
                </Text>
              </TabPanel>
              <TabPanel px={0}>
                <Text color={mutedTextColor} textAlign="center" py={4}>
                  Filter functionality would be implemented here
                </Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </>

      {/* Send Modal */}
      <Modal isOpen={isSendOpen} onClose={onSendClose} isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="xl" bg={bgColor}>
          <ModalHeader>Send Crypto</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Select Asset</FormLabel>
                <Select placeholder="Select asset">
                  {cryptoAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.symbol}) - {asset.balance} available
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Recipient Address</FormLabel>
                <Input placeholder="Enter wallet address" />
              </FormControl>

              <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input placeholder="0.00" type="number" />
              </FormControl>

              <FormControl>
                <FormLabel>PIN</FormLabel>
                <Input placeholder="Enter your PIN" type="password" />
              </FormControl>

              <Button
                colorScheme="brand"
                size="lg"
                width="full"
                mt={2}
                leftIcon={<FiLock />}
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
                <Select placeholder="Select asset">
                  {cryptoAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.symbol})
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
                <Text fontSize="xs" mt={4} color={mutedTextColor}>
                  Scan to receive payment
                </Text>
              </Box>

              <FormControl>
                <FormLabel>Your Wallet Address</FormLabel>
                <Flex>
                  <Input
                    value="0x3a4b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b"
                    isReadOnly
                  />
                  <Button ml={2}>Copy</Button>
                </Flex>
              </FormControl>
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
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Select Asset</FormLabel>
                <Select placeholder="Select asset to buy">
                  {cryptoAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.symbol})
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input placeholder="0.00" type="number" />
              </FormControl>

              <FormControl>
                <FormLabel>Payment Method</FormLabel>
                <Select placeholder="Select payment method">
                  <option value="creditCard">Credit Card</option>
                  <option value="bankTransfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                </Select>
              </FormControl>

              <Divider />

              <HStack width="full" justifyContent="space-between">
                <Text>Estimated Price:</Text>
                <Text fontWeight="bold">$0.00</Text>
              </HStack>

              <HStack width="full" justifyContent="space-between">
                <Text>Fee:</Text>
                <Text>$0.00</Text>
              </HStack>

              <HStack width="full" justifyContent="space-between">
                <Text fontWeight="bold">Total:</Text>
                <Text fontWeight="bold">$0.00</Text>
              </HStack>

              <Button
                colorScheme="brand"
                size="lg"
                width="full"
                mt={2}
                leftIcon={<FiDollarSign />}
              >
                Buy Now
              </Button>
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
                  kycStatus === "verified"
                    ? "green.500"
                    : kycStatus === "pending"
                    ? "yellow.500"
                    : "blue.500"
                }
              >
                <Heading size="sm" mb={1}>
                  {kycStatus === "verified"
                    ? "Verification Complete"
                    : kycStatus === "pending"
                    ? "Verification Pending"
                    : "Complete Verification"}
                </Heading>
                <Text fontSize="sm">
                  {kycStatus === "verified"
                    ? "Your identity has been verified. You have full access to all platform features."
                    : kycStatus === "pending"
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
                        bg={kycStatus === "pending" ? "green.100" : "gray.100"}
                        color={
                          kycStatus === "pending" ? "green.500" : "gray.500"
                        }
                        justifyContent="center"
                        alignItems="center"
                        fontWeight="bold"
                      >
                        1
                      </Flex>
                      <VStack spacing={0} align="flex-start">
                        <Text fontWeight="medium">Personal Information</Text>
                        <Text fontSize="xs" color={mutedTextColor}>
                          Basic details and contact information
                        </Text>
                      </VStack>
                      {kycStatus === "pending" && (
                        <Badge colorScheme="green" ml="auto">
                          Completed
                        </Badge>
                      )}
                    </HStack>

                    <HStack>
                      <Flex
                        w={8}
                        h={8}
                        borderRadius="full"
                        bg={kycStatus === "pending" ? "green.100" : "gray.100"}
                        color={
                          kycStatus === "pending" ? "green.500" : "gray.500"
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
                      {kycStatus === "pending" && (
                        <Badge colorScheme="green" ml="auto">
                          Completed
                        </Badge>
                      )}
                    </HStack>

                    <HStack>
                      <Flex
                        w={8}
                        h={8}
                        borderRadius="full"
                        bg={kycStatus === "pending" ? "yellow.100" : "gray.100"}
                        color={
                          kycStatus === "pending" ? "yellow.500" : "gray.500"
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
                      {kycStatus === "pending" ? (
                        <Badge colorScheme="yellow" ml="auto">
                          In Progress
                        </Badge>
                      ) : (
                        <Badge colorScheme="gray" ml="auto">
                          Not Started
                        </Badge>
                      )}
                    </HStack>
                  </VStack>

                  {kycStatus !== "pending" && (
                    <Button
                      colorScheme="brand"
                      size="lg"
                      width="full"
                      mt={2}
                      leftIcon={<FiPaperclip />}
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
              >
                Update
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CryptoWalletDashboard;
