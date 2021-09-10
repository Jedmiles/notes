import React from "react";
import Link from "next/link";
import { useAuthContext } from "../../contexts/AuthContext";

export default function Navbar(props) {
  return (
    <div>
      <h1>Jot</h1>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/Login">
            <a>Login</a>
          </Link>
        </li>
        <li>
          <Link href="Signup">
            <a>Signup</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
