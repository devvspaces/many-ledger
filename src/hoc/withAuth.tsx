"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/features/auth";
import { useEffect } from "react";
import { Center, Spinner, useToast, VStack } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const user = useAppSelector(selectUser);
    const toast = useToast();

    useEffect(() => {
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to view this content",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
          icon: <InfoIcon />,
        });
        router.push("/");
      }
    }, [user, router, toast]);

    // Show loading state while checking auth
    if (!user) {
      return (
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size={"xl"} />
          </VStack>
        </Center>
      );
    }

    // Only render the protected component if authenticated
    return user ? <WrappedComponent {...props} /> : null;
  };
}
