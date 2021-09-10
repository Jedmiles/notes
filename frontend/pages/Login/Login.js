import { useAuthContext } from "../../contexts/AuthContext";
import { useState } from "react";
import { Auth } from "aws-amplify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { userHasAuthenticated } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Auth.signIn(email, password);
      console.log(userHasAuthenticated);
      userHasAuthenticated(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Email">Email</label>
        <input type="email" onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="Password">Password</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
