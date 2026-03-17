import { View, StyleSheet, Text } from "react-native";

export default function CartScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cart</Text>
            <Text>Your pokemon toys will show up here</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8
    }
})