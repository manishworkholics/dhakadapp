import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
    const navigation = useNavigation();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        createdfor: "",
        password: ""
    });

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const onRegister = () => {
        if (!form.name || !form.email || !form.phone || !form.createdfor || !form.password) {
            Alert.alert("Missing Fields", "Please fill all fields!");
            return;
        }
        // Later we will integrate API call here
        navigation.navigate("Login");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Image
                    source={require("../assets/images/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <View style={styles.dropdownWrap}>
                    
                        <Picker
                            selectedValue={form.createdfor}
                            onValueChange={(v) => handleChange("createdfor", v)}
                        >
                            <Picker.Item label="Profile Created For" value="" />
                            <Picker.Item label="Self" value="self" />
                            <Picker.Item label="Son" value="son" />
                            <Picker.Item label="Daughter" value="daughter" />
                            <Picker.Item label="Brother" value="brother" />
                            <Picker.Item label="Sister" value="sister" />
                        </Picker>
                  

                </View>

                <TextInput
                    placeholder="Full Name"
                    style={styles.input}
                    value={form.name}
                    onChangeText={(t) => handleChange("name", t)}
                />

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={(t) => handleChange("email", t)}
                />

                <TextInput
                    placeholder="Phone Number"
                    keyboardType="number-pad"
                    style={styles.input}
                    value={form.phone}
                    onChangeText={(t) => handleChange("phone", t)}
                />

                

                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                    value={form.password}
                    onChangeText={(t) => handleChange("password", t)}
                />

                <TouchableOpacity style={styles.registerBtn} onPress={onRegister}>
                    <Text style={styles.registerBtnText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                    style={{ marginTop: 15 }}
                >
                    <Text style={styles.loginText}>
                        Already have an account? <Text style={styles.loginLink}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 30,
    },
    card: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 25,
        elevation: 5,
        alignItems: "center",
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 25,
    },
    input: {
        width: "100%",
        backgroundColor: "#f8f8f8",
        padding: 14,
        borderRadius: 10,
        marginVertical: 8,
        fontSize: 15,
    },
    dropdownWrap: {
        width: "100%",
        backgroundColor: "#f8f8f8",
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginVertical: 8,
    },
    dropdown: {
        fontSize: 15,
        color: "#444",
    },
    registerBtn: {
        backgroundColor: "#ff4e50",
        width: "100%",
        padding: 14,
        borderRadius: 10,
        marginTop: 18,
    },
    registerBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    loginText: {
        color: "#444",
    },
    loginLink: {
        color: "#ff4e50",
        fontWeight: "600",
    },
});
