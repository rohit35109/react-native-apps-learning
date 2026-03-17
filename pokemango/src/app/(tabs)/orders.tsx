import { View, StyleSheet, Text } from "react-native";


export default function OrderScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Orders</Text>
            <Text>You will see past toy orders here</Text>
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