import { Drawer } from "expo-router/drawer";

export default function MainDrawer(){
    return (
        <Drawer
        screenOptions={{
            headerShown: true,
            drawerStyle: {width: 400},
        }}
        >
        <Drawer.Screen name="Home" options={{ title: "Home" }} />
        <Drawer.Screen name="Settings" options={{ title: "Settings" }} />
        <Drawer.Screen name="About" options={{ title: "About" }} />
        <Drawer.Screen name="Help" options={{ title: "Help" }} />
        <Drawer.Screen name="Faq" options={{ title: "FAQ" }} />

        </Drawer>
    );

}
