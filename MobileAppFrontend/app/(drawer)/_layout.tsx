import { Drawer } from "expo-router/drawer";
import { Text } from "react-native";


export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen name="home" options={{ title: "Recipes" }} />
     <Drawer.Screen
      name="profile"
      options={{
        title: "Profile",
        drawerLabel: () => <Text testID="drawer-profile">Profile</Text>,
      }}
    />
      <Drawer.Screen name="settings" options={{ title: "Settings" }} />
    </Drawer>
  );
}