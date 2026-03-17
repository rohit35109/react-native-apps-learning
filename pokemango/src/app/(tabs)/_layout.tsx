import { Tabs } from "expo-router";
import TabBar from "@/src/shared/components/tabBar";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
      <Tabs.Screen name="orders" options={{ title: "My Orders" }} />
    </Tabs>

    // OLD CODE
    // import { Ionicons } from "@expo/vector-icons";
    // tabBarIcon: ({color, size}) => (
    // <Ionicons name="list" color={color} size={size} />
    // ) ---- for Tab.screen
    //
    // Native tabs basics
    // import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
    // <NativeTabs labelStyle={{ color: TAB_BAR_ACTIVE }} tintColor={TAB_BAR_ACTIVE}>
    //     <NativeTabs.Trigger name="index">
    //         <Label>Home</Label>
    //         {/* <Ionicons name="home" color={TAB_BAR_ACTIVE} size={25} /> */}
    //         <Icon sf={{ default: "book", selected: "book.fill" }} />
    //     </NativeTabs.Trigger>
    //     <NativeTabs.Trigger name="cart">
    //         <Label>Cart</Label>
    //         <Ionicons name="cart" color={TAB_BAR_ACTIVE} size={25} />
    //     </NativeTabs.Trigger>
    //     <NativeTabs.Trigger name="orders">
    //         <Label>My Orders</Label>
    //         <Ionicons name="list" color={TAB_BAR_ACTIVE} size={25} />
    //     </NativeTabs.Trigger>
    // </NativeTabs>
  );
}
