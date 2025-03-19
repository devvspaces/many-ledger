// components/PageLoadingBar.tsx
'use client';

import { Box, useColorModeValue } from '@chakra-ui/react';
import { keyframes } from "styled-components";

// const progressKeyframes = keyframes`
//   0% { width: 0%; }
//   10% { width: 30%; }
//   40% { width: 60%; }
//   80% { width: 80%; }
//   90% { width: 85%; }
//   100% { width: 100%; }
// `;

// const fadeOutKeyframes = keyframes`
//   0% { opacity: 1; }
//   100% { opacity: 0; }
// `;

const progressKeyframes = keyframes({
  '0%': { width: '0%' },
  '10%': { width: '30%' },
  '40%': { width: '60%' },
  '80%': { width: '80%' },
  '90%': { width: '85%' },
  '100%': { width: '100%' },
})
const fadeOutKeyframes = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
})

export default function PageLoadingBar() {
  const progressAnimation = `${progressKeyframes} 2s ease-in-out`;
  const fadeOutAnimation = `${fadeOutKeyframes} 0.3s ease-out forwards`;
  
  const loaderColor = useColorModeValue('blue.500', 'blue.300');
  const loaderHeight = '3px';

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      height={loaderHeight}
      zIndex="9999"
      mt={"64px"} // Adjust based on your navbar height
      overflow="hidden"
      animation={fadeOutAnimation}
    >
      <Box
        height="100%"
        bg={loaderColor}
        animation={progressAnimation}
        width="0%"
      />
    </Box>
  );
}