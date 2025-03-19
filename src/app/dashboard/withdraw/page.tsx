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
  Select,
  FormHelperText,
  useColorModeValue,
  HStack,
  Icon,
  Flex,
  Container,
  Divider,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Checkbox,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  Tooltip,
  Alert,
  AlertIcon,
  AlertDescription,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiSend,
  FiHelpCircle,
  FiLock,
} from "react-icons/fi";

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

// Sample fiat balances
const fiatBalances = [
  { currency: "USD", amount: 1250.75, symbol: "$" },
  { currency: "EUR", amount: 860.2, symbol: "€" },
  { currency: "GBP", amount: 542.35, symbol: "£" },
];

// Withdrawal steps
const steps = [
  { title: "Request", description: "Withdraw request submission" },
  { title: "Verification", description: "Admin verification (1-3 days)" },
  { title: "Processing", description: "Bank processing" },
  { title: "Complete", description: "Funds received" },
];

// Bank types
const bankTypes = [
  { value: "ach", label: "ACH Transfer (US)" },
  { value: "wire", label: "Wire Transfer" },
  { value: "sepa", label: "SEPA Transfer (EU)" },
  { value: "swift", label: "SWIFT Transfer" },
];

type BankType = "ach" | "wire" | "sepa" | "swift";

const WithdrawalPage = () => {
  // State for form data
  const [activeCurrency, setActiveCurrency] = useState("USD");
  const [activeStep, setActiveStep] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState("500");
  const [bankType, setBankType] = useState<BankType>("ach");
  const [saveDetails, setSaveDetails] = useState(true);
  const [formData, setFormData] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    swiftCode: "",
    ibanNumber: "",
    bankAddress: "",
    bankCountry: "United States",
    reference: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get the currently selected currency details
  const currentCurrency = fiatBalances.find(
    (bal) => bal.currency === activeCurrency
  );

  // Modal controls
  const confirmModal = useDisclosure();
  const successModal = useDisclosure();
  const { activeStep: activeIndex } = useSteps({
    index: activeStep,
    count: steps.length,
  });

  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentBgColor = useColorModeValue("brand.50", "brand.900");
  const highlightBgColor = useColorModeValue(
    "brand.50",
    "rgba(0, 102, 204, 0.2)"
  );
  const cardBgColor = useColorModeValue("white", "gray.750");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const iconBgColor = useColorModeValue("brand.50", "rgba(0, 102, 204, 0.2)");

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle withdrawal request submit
  const handleSubmit = () => {
    // Validate the form
    const requiredFields = getBankFields(bankType).filter(
      (field) => field.required
    );
    const missingFields = requiredFields.filter(
      (field) => !formData[field.name as keyof typeof formData] || formData[field.name as keyof typeof formData].trim() === ""
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields: ${missingFields
          .map((f) => f.label)
          .join(", ")}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (parseFloat(withdrawalAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!currentCurrency) {
      toast({
        title: "Currency not found",
        description: "Please select a valid currency to withdraw",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (parseFloat(withdrawalAmount) > currentCurrency.amount) {
      toast({
        title: "Insufficient balance",
        description: `Your ${currentCurrency.currency} balance is not enough for this withdrawal`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    // Open confirmation modal
    confirmModal.onOpen();
  };

  // Handle withdrawal confirmation
  const handleConfirmWithdrawal = () => {
    setIsLoading(true);

    // Simulate processing (API call would go here)
    setTimeout(() => {
      setIsLoading(false);
      confirmModal.onClose();

      // Show success modal
      successModal.onOpen();

      // Reset form
      setWithdrawalAmount("0");
      setActiveStep(1); // Move to verification step

      toast({
        title: "Withdrawal requested",
        description: `Your ${
          currentCurrency!.symbol
        }${withdrawalAmount} withdrawal request has been submitted successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }, 2000);
  };

  // Get the required fields based on bank type
  const getBankFields = (type: "ach" | "wire" | "sepa" | "swift") => {
    const baseFields = [
      { name: "accountHolder", label: "Account Holder Name", required: true },
      { name: "bankName", label: "Bank Name", required: true },
    ];

    const specificFields = {
      ach: [
        { name: "accountNumber", label: "Account Number", required: true },
        { name: "routingNumber", label: "Routing Number", required: true },
      ],
      wire: [
        { name: "accountNumber", label: "Account Number", required: true },
        { name: "routingNumber", label: "Routing Number", required: true },
        { name: "swiftCode", label: "SWIFT Code", required: true },
        { name: "bankAddress", label: "Bank Address", required: true },
      ],
      sepa: [
        { name: "ibanNumber", label: "IBAN Number", required: true },
        { name: "swiftCode", label: "BIC/SWIFT Code", required: true },
      ],
      swift: [
        { name: "accountNumber", label: "Account Number", required: true },
        { name: "swiftCode", label: "SWIFT Code", required: true },
        { name: "bankAddress", label: "Bank Address", required: true },
      ],
    };

    return [...baseFields, ...(specificFields[type] || [])];
  };

  // Calculate fees (example: 1% fee with $5 minimum)
  const calculateFee = (amount: string) => {
    const fee = Math.max(parseFloat(amount) * 0.01, 5);
    return fee.toFixed(2);
  };

  // Calculate total amount with fees
  const getTotalWithFees = () => {
    const amount = parseFloat(withdrawalAmount) || 0;
    const fee = parseFloat(calculateFee(amount.toString()));
    return (amount - fee).toFixed(2);
  };

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
            Withdraw Funds
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Withdraw your fiat balances to your bank account
          </Text>
        </MotionBox>

        {/* Balance Cards */}
        <MotionBox variants={itemVariants}>
          <Text fontWeight="medium" mb={3}>
            Available Balances
          </Text>
          <HStack spacing={4} overflowX="auto" pb={2} w="100%">
            {fiatBalances.map((balance) => (
              <MotionBox
                key={balance.currency}
                borderWidth="1px"
                borderColor={
                  activeCurrency === balance.currency
                    ? "brand.500"
                    : borderColor
                }
                borderRadius="xl"
                p={4}
                cursor="pointer"
                onClick={() => setActiveCurrency(balance.currency)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
                bg={
                  activeCurrency === balance.currency
                    ? highlightBgColor
                    : cardBgColor
                }
                minW="180px"
                boxShadow={activeCurrency === balance.currency ? "md" : "none"}
              >
                <HStack spacing={3}>
                  <Flex
                    p={2}
                    borderRadius="lg"
                    bg={iconBgColor}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiDollarSign} boxSize={5} color="brand.500" />
                  </Flex>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      {balance.currency}
                    </Text>
                    <Text fontWeight="bold" fontSize="xl">
                      {balance.symbol}
                      {balance.amount.toLocaleString()}
                    </Text>
                  </Box>
                </HStack>
              </MotionBox>
            ))}
          </HStack>
        </MotionBox>

        {/* Current Status */}
        {activeStep > 0 && (
          <MotionBox variants={itemVariants}>
            <Box
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              p={5}
              bg={cardBgColor}
            >
              <Text fontWeight="medium" mb={4}>
                Current Withdrawal Status
              </Text>
              <Stepper size="sm" index={activeIndex} colorScheme="brand">
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>
                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>

              {activeStep === 1 && (
                <Alert status="info" mt={4} borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>
                    Your withdrawal request is pending admin verification. This
                    typically takes 1-3 business days.
                  </AlertDescription>
                </Alert>
              )}
            </Box>
          </MotionBox>
        )}

        {/* Withdrawal Form */}
        {activeStep === 0 && (
          <MotionBox variants={itemVariants}>
            <VStack
              spacing={6}
              align="stretch"
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              p={6}
              bg={cardBgColor}
            >
              <Text fontWeight="medium" fontSize="lg">
                Withdrawal Details
              </Text>

              {/* Amount Section */}
              <FormControl>
                <FormLabel>
                  Withdrawal Amount ({currentCurrency?.currency})
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Text color="gray.500">{currentCurrency?.symbol}</Text>
                  </InputLeftElement>
                  <NumberInput
                    min={0}
                    max={currentCurrency?.amount}
                    value={withdrawalAmount}
                    onChange={(value) => setWithdrawalAmount(value)}
                    w="full"
                  >
                    <NumberInputField
                      pl={8}
                      borderRadius="lg"
                      _focus={{
                        borderColor: "brand.500",
                      }}
                    />
                  </NumberInput>
                </InputGroup>
                <FormHelperText>
                  Available: {currentCurrency?.symbol}
                  {currentCurrency?.amount.toLocaleString()}
                </FormHelperText>
              </FormControl>

              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="sm" color={secondaryTextColor}>
                  Withdrawal Fee (1%):
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {currentCurrency?.symbol}
                  {calculateFee(withdrawalAmount)}
                </Text>
              </Flex>

              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="md" fontWeight="medium">
                  Amount You&apos;ll Receive:
                </Text>
                <Text fontSize="md" fontWeight="bold" color="brand.500">
                  {currentCurrency?.symbol}
                  {getTotalWithFees()}
                </Text>
              </Flex>

              <Divider />

              {/* Bank Details Section */}
              <Box>
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Text fontWeight="medium" fontSize="lg">
                    Bank Account Details
                  </Text>
                  <Tooltip label="Your information is encrypted and secure">
                    <Flex alignItems="center">
                      <Icon as={FiLock} mr={1} color="brand.500" />
                      <Text fontSize="xs" color="brand.500">
                        Secure
                      </Text>
                    </Flex>
                  </Tooltip>
                </Flex>

                <FormControl mb={4}>
                  <FormLabel>Transfer Type</FormLabel>
                  <Select
                    value={bankType}
                    onChange={(e) => setBankType(e.target.value as BankType)}
                    borderRadius="lg"
                    focusBorderColor="brand.500"
                  >
                    {bankTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <VStack spacing={4} align="stretch">
                  {getBankFields(bankType).map((field) => (
                    <FormControl key={field.name} isRequired={field.required}>
                      <FormLabel>{field.label}</FormLabel>
                      <Input
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleInputChange}
                        borderRadius="lg"
                        focusBorderColor="brand.500"
                      />
                    </FormControl>
                  ))}

                  <FormControl>
                    <FormLabel>Reference (Optional)</FormLabel>
                    <Input
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      placeholder="Add a reference for this transfer"
                      borderRadius="lg"
                      focusBorderColor="brand.500"
                    />
                  </FormControl>

                  <Checkbox
                    colorScheme="brand"
                    isChecked={saveDetails}
                    onChange={() => setSaveDetails(!saveDetails)}
                    mt={2}
                  >
                    Save these details for future withdrawals
                  </Checkbox>
                </VStack>
              </Box>

              <Button
                mt={6}
                size="lg"
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                rightIcon={<FiArrowRight />}
                onClick={handleSubmit}
                isDisabled={
                  !withdrawalAmount || parseFloat(withdrawalAmount) <= 0
                }
                borderRadius="lg"
                fontWeight="medium"
              >
                Proceed with Withdrawal
              </Button>

              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <AlertDescription>
                  Withdrawal requests are processed within 1-3 business days
                  after verification.
                </AlertDescription>
              </Alert>
            </VStack>
          </MotionBox>
        )}

        {/* Confirmation Modal */}
        <Modal
          isOpen={confirmModal.isOpen}
          onClose={confirmModal.onClose}
          isCentered
        >
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent borderRadius="xl" bg={bgColor}>
            <ModalHeader>Confirm Withdrawal</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={5} align="stretch">
                <Box
                  p={4}
                  borderRadius="lg"
                  bg={accentBgColor}
                  borderLeft="4px solid"
                  borderLeftColor="brand.500"
                >
                  <Text fontWeight="medium" mb={1}>
                    Withdrawal Details
                  </Text>
                  <Flex justify="space-between" mb={1}>
                    <Text fontSize="sm">Amount:</Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {currentCurrency?.symbol}
                      {withdrawalAmount}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" mb={1}>
                    <Text fontSize="sm">Fee:</Text>
                    <Text fontSize="sm">
                      {currentCurrency?.symbol}
                      {calculateFee(withdrawalAmount)}
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text fontSize="sm">You&apos;ll receive:</Text>
                    <Text fontSize="sm" fontWeight="bold">
                      {currentCurrency?.symbol}
                      {getTotalWithFees()}
                    </Text>
                  </Flex>
                </Box>

                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Bank Account
                  </Text>
                  <Text fontSize="sm">
                    {formData.bankName} •{" "}
                    {bankTypes.find((t) => t.value === bankType)?.label}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Account ending in{" "}
                    {formData.accountNumber?.slice(-4) || "****"}
                  </Text>
                </Box>

                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription fontSize="sm">
                    After clicking &quot;Confirm&quot;, your withdrawal request will be
                    sent for admin verification. This process typically takes
                    1-3 business days.
                  </AlertDescription>
                </Alert>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={confirmModal.onClose}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={handleConfirmWithdrawal}
                leftIcon={<FiSend />}
                isLoading={isLoading}
                loadingText="Processing..."
              >
                Confirm Withdrawal
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
            <ModalBody pt={10} pb={10}>
              <VStack spacing={6}>
                <MotionBox
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Flex
                    w="80px"
                    h="80px"
                    borderRadius="full"
                    bg="green.100"
                    color="green.500"
                    justify="center"
                    align="center"
                  >
                    <Icon as={FiCheck} boxSize={10} />
                  </Flex>
                </MotionBox>

                <Heading size="md" textAlign="center">
                  Withdrawal Request Submitted
                </Heading>

                <Text textAlign="center">
                  Your withdrawal request for {currentCurrency?.symbol}
                  {withdrawalAmount} has been submitted successfully. We&apos;ll
                  notify you once it&apos;s verified.
                </Text>

                <Box
                  p={4}
                  borderRadius="lg"
                  bg={accentBgColor}
                  w="full"
                  textAlign="center"
                >
                  <HStack justify="center" spacing={3}>
                    <Icon as={FiClock} color="brand.500" />
                    <Text fontWeight="medium">
                      Estimated processing time: 1-3 business days
                    </Text>
                  </HStack>
                </Box>

                <Accordion allowToggle width="full">
                  <AccordionItem border="none">
                    <h2>
                      <AccordionButton _hover={{ bg: "transparent" }} px={0}>
                        <Box
                          as="span"
                          flex="1"
                          textAlign="left"
                          color="brand.500"
                          fontWeight="medium"
                        >
                          View Withdrawal Details
                        </Box>
                        <AccordionIcon color="brand.500" />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel py={4} px={0}>
                      <VStack spacing={3} align="stretch">
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">
                            Reference ID
                          </Text>
                          <Text fontSize="sm">
                            WD-{Math.floor(Math.random() * 10000000)}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">
                            Transfer Type
                          </Text>
                          <Text fontSize="sm">
                            {bankTypes.find((t) => t.value === bankType)?.label}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">
                            Currency
                          </Text>
                          <Text fontSize="sm">{currentCurrency?.currency}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">
                            Amount
                          </Text>
                          <Text fontSize="sm">
                            {currentCurrency?.symbol}
                            {withdrawalAmount}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">
                            Fee
                          </Text>
                          <Text fontSize="sm">
                            {currentCurrency?.symbol}
                            {calculateFee(withdrawalAmount)}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">
                            You&apos;ll Receive
                          </Text>
                          <Text fontSize="sm" fontWeight="bold">
                            {currentCurrency?.symbol}
                            {getTotalWithFees()}
                          </Text>
                        </Flex>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </VStack>
            </ModalBody>

            <ModalFooter
              borderTop="1px solid"
              borderColor={borderColor}
              justifyContent="center"
            >
              <Button
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={successModal.onClose}
                minW="200px"
              >
                Done
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* FAQs Section */}
        <MotionBox variants={itemVariants}>
          <Flex alignItems="center" mb={4}>
            <Icon as={FiHelpCircle} mr={2} color="brand.500" />
            <Heading size="md">Frequently Asked Questions</Heading>
          </Flex>
          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton py={4}>
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    How long do withdrawals take?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                After your withdrawal request is submitted, it goes through an
                admin verification process which typically takes 1-3 business
                days. Once verified, bank processing times vary by transfer
                type: ACH (1-3 business days), SEPA (1-2 business days),
                Wire/SWIFT (2-5 business days).
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton py={4}>
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    What are the withdrawal fees?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                We charge a flat 1% fee on all withdrawals with a minimum fee of
                $5. Additional fees may be charged by your bank or intermediary
                banks, especially for international transfers.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton py={4}>
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    Can I cancel my withdrawal request?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                You can cancel a pending withdrawal request by contacting our
                support team before it&apos;s verified by the admin. Once a
                withdrawal has been verified and processing has begun, it cannot
                be canceled.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton py={4}>
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    What information do I need for international transfers?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                For international transfers, you typically need your bank&apos;s
                SWIFT code, your full account number or IBAN, your bank&apos;s
                complete address, and sometimes an intermediary bank.
                Requirements vary by country, so check with your bank if unsure.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </MotionBox>
      </MotionVStack>
    </Container>
  );
};

export default WithdrawalPage;
