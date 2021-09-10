import { useContext, createContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthWrapper({ children }) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{isAuthenticated, userHasAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
