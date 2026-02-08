import { Drawer } from "expo-router/drawer";

export default function MainDrawer() {
	return (
		<Drawer
			screenOptions={{
				headerShown: true,
				drawerStyle: { width: 400 },
			}}
		>
			<Drawer.Screen name="home" options={{ title: "Home" }} />
			<Drawer.Screen name="settings" options={{ title: "Settings" }} />
		</Drawer>
	);

}
