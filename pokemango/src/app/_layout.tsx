import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{
        headerShown: false
      }} />
      {/* <Stack.Screen name="index" options={{ title: "Home" }} /> */}
      <Stack.Screen
        name="details"
        options={{
          title: "Details",
          headerBackButtonDisplayMode: "minimal",
          presentation: "formSheet",
          sheetAllowedDetents: [0.8, 0.9, 1],
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
