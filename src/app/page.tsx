"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Main App Component
const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/login")
  }, [])
};

export default Home;
