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
  Select,
  Input,
  useColorModeValue,
  Icon,
  Container,
  ListItem,
  UnorderedList,
  useToast,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiCheck,
} from "react-icons/fi";

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);

const countryList = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas (the)",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia (Plurinational State of)",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory (the)",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cayman Islands (the)",
  "Central African Republic (the)",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands (the)",
  "Colombia",
  "Comoros (the)",
  "Congo (the Democratic Republic of the)",
  "Congo (the)",
  "Cook Islands (the)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czechia",
  "Côte d'Ivoire",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic (the)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Falkland Islands (the) [Malvinas]",
  "Faroe Islands (the)",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories (the)",
  "Gabon",
  "Gambia (the)",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and McDonald Islands",
  "Holy See (the)",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran (Islamic Republic of)",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea (the Democratic People's Republic of)",
  "Korea (the Republic of)",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic (the)",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands (the)",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia (Federated States of)",
  "Moldova (the Republic of)",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands (the)",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger (the)",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands (the)",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine, State of",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines (the)",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Republic of North Macedonia",
  "Romania",
  "Russian Federation (the)",
  "Rwanda",
  "Réunion",
  "Saint Barthélemy",
  "Saint Helena, Ascension and Tristan da Cunha",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin (French part)",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten (Dutch part)",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan (the)",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands (the)",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates (the)",
  "United Kingdom of Great Britain and Northern Ireland (the)",
  "United States Minor Outlying Islands (the)",
  "United States of America (the)",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela (Bolivarian Republic of)",
  "Viet Nam",
  "Virgin Islands (British)",
  "Virgin Islands (U.S.)",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
  "Åland Islands",
];

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

// KYC Verification Page Component
const KYCVerificationPage = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedIdType, setSelectedIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const toast = useToast();

  // Color mode values
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBgColor = useColorModeValue("gray.50", "gray.750");
  const highlightBgColor = useColorModeValue(
    "brand.50",
    "rgba(0, 102, 204, 0.1)"
  );

  // Spring animation preset
  const spring = {
    type: "spring",
    stiffness: 300,
    damping: 20,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!selectedCountry || !selectedIdType || !idNumber || !idPhoto) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Verification Submitted",
        description:
          "Your verification request has been submitted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }, 3000);
  };


  return (
    <Container maxW="container.md" py={8}>
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        as={VStack}
        gap={8}
        alignItems="stretch"
        pb="70px" // Space for bottom navigation
      >
        {/* Header */}
        <MotionBox variants={itemVariants} textAlign="center">
          <Heading size="lg" mb={2}>
            KYC Verification
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Complete your identity verification to access all features
          </Text>
        </MotionBox>

        {/* Instructions Card */}
        <MotionCard
          variants={itemVariants}
          bg={highlightBgColor}
          borderRadius="xl"
          borderLeftWidth="4px"
          borderLeftColor="brand.500"
        >
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="sm">
                Please use a valid government-issued photo ID.
              </Heading>
              <Text fontSize="sm">
                A residence permit is also an acceptable form of identification.
              </Text>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  Examples of documents we do not accept include:
                </Text>
                <UnorderedList pl={4} spacing={1} fontSize="sm">
                  <ListItem>Birth certificate</ListItem>
                  <ListItem>Company ID</ListItem>
                  <ListItem>Credit card</ListItem>
                  <ListItem>International Driving Permit</ListItem>
                  <ListItem>Student ID</ListItem>
                  <ListItem>
                    Visa (except for student/work visas issued by the U.S. and
                    China)
                  </ListItem>
                </UnorderedList>
              </Box>
            </VStack>
          </CardBody>
        </MotionCard>

        {/* Form Section */}
        <MotionBox variants={itemVariants} as={VStack} gap={6}>
          {/* Country Selection */}
          <FormControl isRequired>
            <FormLabel fontWeight="medium">Issuing Country</FormLabel>
            <Select
              placeholder="Select a Country"
              borderRadius="lg"
              borderColor={borderColor}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              focusBorderColor="brand.500"
            >
              {
                /* Loop through the country list and create options */
                countryList.map((country, index) => (
                  <option key={index} value={country.toLowerCase()}>
                    {country}
                  </option>
                ))
              }
              {/* More countries would be added here */}
            </Select>
          </FormControl>

          {/* ID Type Selection */}
          <FormControl isRequired>
            <FormLabel fontWeight="medium">Identity Medium</FormLabel>
            <Select
              placeholder="Select an Identity Medium"
              borderRadius="lg"
              borderColor={borderColor}
              value={selectedIdType}
              onChange={(e) => setSelectedIdType(e.target.value)}
              focusBorderColor="brand.500"
            >
              <option value="drivers-license">Driver&apos;s License</option>
              <option value="passport">International Passport</option>
              <option value="national-id">National ID card</option>
            </Select>
          </FormControl>

          {/* ID Number */}
          <FormControl isRequired>
            <FormLabel fontWeight="medium">Identity Number</FormLabel>
            <Input
              placeholder="Enter your ID number"
              borderRadius="lg"
              borderColor={borderColor}
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              focusBorderColor="brand.500"
            />
          </FormControl>

          {/* ID Photo Upload */}
          <FormControl isRequired>
            <FormLabel fontWeight="medium">Identity Card Photo</FormLabel>
            <MotionBox
              as="label"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              borderWidth="2px"
              borderStyle="dashed"
              borderColor={idPhoto ? "brand.500" : borderColor}
              borderRadius="lg"
              p={6}
              cursor="pointer"
              bg={idPhoto ? "brand.50" : "transparent"}
              _hover={{ bg: idPhoto ? "brand.50" : cardBgColor }}
              transition={spring}
              whileHover={{ scale: 1.02 }}
            >
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                display="none"
              />
              <Icon
                as={idPhoto ? FiCheck : FiUpload}
                boxSize={8}
                color={idPhoto ? "brand.500" : "gray.500"}
                mb={3}
              />
              <Text color={idPhoto ? "brand.500" : "gray.500"}>
                {idPhoto ? idPhoto.name : "Upload your ID photo"}
              </Text>
              <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
                Make sure all text is clearly visible and the photo is high
                quality
              </Text>
            </MotionBox>
          </FormControl>
        </MotionBox>

        {/* Submit Button */}
        <MotionBox variants={itemVariants}>
          <Button
            width="full"
            size="lg"
            bg="brand.500"
            _hover={{ bg: "brand.600" }}
            color="white"
            borderRadius="lg"
            isLoading={isProcessing}
            loadingText="Processing..."
            onClick={handleSubmit}
            disabled={
              !selectedCountry || !selectedIdType || !idNumber || !idPhoto
            }
          >
            {isProcessing ? "Processing..." : "Submit"}
          </Button>
        </MotionBox>

        {/* Disclaimer */}
        <MotionBox variants={itemVariants}>
          <Text fontSize="xs" color="gray.500" textAlign="center" mt={2}>
            Your information is encrypted and securely stored. We adhere to
            strict privacy policies.
          </Text>
        </MotionBox>
      </MotionBox>
    </Container>
  );
};

export default KYCVerificationPage;
