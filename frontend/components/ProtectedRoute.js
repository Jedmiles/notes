import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, []);

  return <div>{isLoading ? <div>Loading...</div> : children}</div>;
}
