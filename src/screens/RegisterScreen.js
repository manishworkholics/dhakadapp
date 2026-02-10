



import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api/auth/register";

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    createdfor: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  /* ================= VALIDATION ================= */

  const isValidEmail = (email) => {
    const regex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const isValidPassword = (password) => {
    return (
      password.length >= 6 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password)
    );
  };

  /* ================= REGISTER ================= */

  const onRegister = async () => {
    const { name, email, phone, createdfor, password } = form;

    if (!name || !email || !phone || !createdfor || !password) {
      Alert.alert("Missing Fields", "Please fill all fields");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert("Invalid Phone Number", "Enter valid 10 digit number");
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert("Weak Password", "Password must be strong");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(API_URL, {
        name,
        email,
        phone,
        createdfor,
        password,
      });

      if (res.data.success && res.data.requiresVerification) {
        navigation.replace("EmailOtp", { email });
      }

    } catch (err) {
      Alert.alert(
        "Registration Failed",
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../assets/images/dhakadlogoapp.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* CREATED FOR */}
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
          autoCapitalize="none"
          value={form.email}
          onChangeText={(t) => handleChange("email", t)}
        />

        <TextInput
          placeholder="Phone Number "
          keyboardType="number-pad"
          style={styles.input}
          maxLength={10}
          value={form.phone}
          onChangeText={(t) => handleChange("phone", t.replace(/[^0-9]/g, ""))}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={form.password}
          onChangeText={(t) => handleChange("password", t)}
        />

        <TouchableOpacity
          style={styles.registerBtn}
          onPress={onRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerBtnText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
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
    width: 140,
    height: 130,
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
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 8,
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
