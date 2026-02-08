import { Drawer } from "expo-router/drawer";

export default function MainDrawer(){
    return (
        <Drawer
        screenOptions={{
            headerShown: true,
            headerStyle:{
                backgroundColor: "#8CCDEB",
                shadowColor: "transparent",
                elevation: 0,
                borderBottomWidth: 0,
            },
            drawerStyle: {
                width: 400,
            },
            drawerLabelStyle: {
                textTransform: "none",
            }
        }}
        >
        <Drawer.Screen name="index" options={{title: "Home"}} />
        <Drawer.Screen name="settings" options={{ title: "Settings" }} listeners={{drawerItemPress: (e) => {e.preventDefault();}}}/>
        <Drawer.Screen name="about" options={{ title: "About" }} listeners={{drawerItemPress: (e) => {e.preventDefault();}}}/>
        <Drawer.Screen name="help" options={{ title: "Help" }} listeners={{drawerItemPress: (e) => {e.preventDefault();}}}/>
        <Drawer.Screen name="faq" options={{ title: "FAQ" }} listeners={{drawerItemPress: (e) => {e.preventDefault();}}}/>

        </Drawer>
    );

}
