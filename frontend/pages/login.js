import { useState } from "react";
import { Auth, withSSRContext } from "aws-amplify";
import { useRouter } from "next/router";
import { useAuthContext } from "../contexts/AuthContext";
import { onError } from "../lib/errorLib";
import LoaderButton from "../components/LoaderButton";
import Navbar from "../components/Navbar/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { userHasAuthenticated } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await Auth.signIn(email, password);
      userHasAuthenticated(true);
      router.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(true);
    }
  };

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  return (
    <div>
      <Navbar/>
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
        <LoaderButton
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Submit
        </LoaderButton>
      </form>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const { Auth } = withSSRContext({ req });
  try {
    await Auth.currentAuthenticatedUser();
    res.writeHead(302, { Location: "/" });
    res.end();
  } catch (err) {
  }
  return { props: {} };
}

export default Login;
