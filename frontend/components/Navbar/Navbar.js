import React, { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "../../contexts/AuthContext";
import { Auth } from "aws-amplify";
import router from "next/router";
import LoaderButton from "../LoaderButton";

export default function Navbar() {
  const { isAuthenticated, userHasAuthenticated } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await Auth.signOut();
    setIsLoading(false);
    userHasAuthenticated(false);
    router.push("/login");
  }

  return (
    <div>
      <h1>Scratch</h1>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <Link href="/new">
                <a>Create Note</a>
              </Link>
            </li>
            <LoaderButton onClick={handleLogout} isLoading={isLoading}>
              Logout
            </LoaderButton>
          </>
        ) : (
          <>
            <li>
              <Link href="/signup">
                <a>Signup</a>
              </Link>
            </li>
            <li>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
