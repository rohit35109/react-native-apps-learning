import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const TAB_BAR_PRIMARY = "#7619ec";
const TAB_BAR_INACTIVITY = "#fff";
const TAB_ICON_SIZE = 24;
const TAB_TEXT_SIZE = 16;

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <AnimatedTouchableOpacity
            key={route.name}
            layout={LinearTransition.springify()}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.items, { backgroundColor: isFocused ? 'white' : 'transparent' }]}
          >
            { getIconByRouteName(route.name, isFocused ? TAB_BAR_PRIMARY : TAB_BAR_INACTIVITY) }
            {
                isFocused && 
                <Animated.Text entering={FadeIn} exiting={FadeOut} style={[styles.text, { color: isFocused ? TAB_BAR_PRIMARY : TAB_BAR_INACTIVITY }]}>
                    {label as string}
                </Animated.Text>
            }
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );

  function getIconByRouteName(routeName: string, color: string) {
    switch (routeName) {
        case 'index':
            return <Feather name="home" size={TAB_ICON_SIZE} color={color} />;
        case 'cart':
            return <Feather name="shopping-cart" size={TAB_ICON_SIZE} color={color} />;
        case 'orders':
            return <Feather name="list" size={TAB_ICON_SIZE} color={color} />;
        default:
            return <Feather name="home" size={TAB_ICON_SIZE} color={color} />;
    }
  }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: TAB_BAR_PRIMARY,
        width: "70%",
        alignSelf: 'center',
        bottom: 40,
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 50,
        overflow: 'hidden'
    },
    items: {
        flexDirection: 'row',
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        // marginHorizontal: 8,
        borderRadius: 50,
    },
    text: {
        color: TAB_BAR_PRIMARY,
        fontSize: TAB_TEXT_SIZE,
        marginHorizontal: 8,
        fontWeight: '500'
    }
})
