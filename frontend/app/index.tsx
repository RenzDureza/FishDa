import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../utils/authContext";

export default function Index() {
  const authState = useContext(AuthContext);
  
  if (authState.isLoggedIn) {
    return <Redirect href="/(main)/home" />;
  } else {
    return <Redirect href="/(auth)/signin" />;
  }
}
