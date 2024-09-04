import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "flowbite-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button onClick={() => loginWithRedirect()}>Accedi</Button>;
};

export default LoginButton;
