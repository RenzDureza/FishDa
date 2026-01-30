import { Stack } from "expo-router";
import { AuthProvider } from "@/src/context/AuthContext";
import { Drawer } from "expo-router/drawer";
import "./global.css";

export default function RootLayout() {
  // return <Drawer>
  //   <Drawer.Screen 
  //     name="index"
  //     options={{
  //       drawerLabel: "Home",
  //       title: "overview"
  //     }}
  //   />
  //   <Drawer.Screen
  //       name="user/[id]" // This is the name of the page and must match the url from root
  //       options={{
  //         drawerLabel: 'User',
  //         title: 'overview',
  //       }}
  //   />
  // </Drawer>


  return (
  <AuthProvider>
    <Stack
    >
      <Stack.Screen
        name="index"
        options={{
          
        }}
      />
    </Stack>
  </AuthProvider>
  )
}