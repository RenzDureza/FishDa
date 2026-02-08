import { Drawer } from "expo-router/drawer";

export default function MainDrawer(){
    return (
        <Drawer
        screenOptions={{
            headerShown: true,
            headerShadowVisible: false,
            headerStyle:{
                backgroundColor: "#8CCDEB",
            },
            drawerStyle: {
                width: 400,
            },
            drawerLabelStyle: {
                textTransform: "none",
            }
        }}>
        <Drawer.Screen name="home" options={{title: "Home"}} />
        <Drawer.Screen name="settings" options={{ title: "Settings" }}/>
        <Drawer.Screen name="about" options={{ title: "About" }}/>
        <Drawer.Screen name="help" options={{ title: "Help" }}/>
        <Drawer.Screen name="faq" options={{ title: "FAQ" }}/>

        </Drawer>
    );

}
