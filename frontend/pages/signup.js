import React, { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { Auth } from "aws-amplify";
import { onError } from "../lib/errorLib";
import LoaderButton from "../components/LoaderButton";
import Navbar from "../components/Navbar/Navbar";

export default function Signup() {
  const router = useRouter();
  const { userHasAuthenticated } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const newUser = await Auth.signUp({
        username: email,
        password: password,
      });
      setNewUser(newUser);
    } catch (e) {
      if (e.name === "UsernameExistsException") {
        Auth.resendSignUp(email);
        setNewUser(true);
      }
    }
    setIsLoading(false);
  }

  async function handleConfirmSubmit(event) {
    event.preventDefault();
    try {
      setIsLoading(true);
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);
      userHasAuthenticated(true);
      router.push("/");
    } catch (e) {
      onError(e);
    }
    setIsLoading(false);
  }

  function validateForm() {
    return (
      email.length > 0 && password.length > 0 && confirmPassword === password
    );
  }

  function validateConfirm() {
    return confirmationCode.length > 0;
  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="Email">Email</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          value={email}
        />
        <br />
        <label htmlFor="Password">Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <br />
        <label htmlFor="Password">Confirm Password</label>
        <input
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        <br />
        <LoaderButton
          type="submit"
          disabled={!validateForm()}
          isLoading={isLoading}
        >
          Submit
        </LoaderButton>
      </form>
    );
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmSubmit}>
        <label>Confirmation Code</label>
        <input
          type="tel"
          autoFocus
          onChange={(e) => setConfirmationCode(e.target.value)}
          value={confirmationCode}
        />
        <br />
        <LoaderButton
          type="submit"
          disabled={!validateConfirm()}
          isLoading={isLoading}
        >
          Submit
        </LoaderButton>
      </form>
    );
  }

  return (
    <div>
      <Navbar />
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
