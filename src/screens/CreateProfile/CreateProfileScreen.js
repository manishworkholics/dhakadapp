// src/screens/CreateProfile/CreateProfileScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Step1Basic from "./Step1Basic";
import Step2Location from "./Step2Location";
import Step3Religion from "./Step3Religion";
import Step4EduJob from "./Step4EduJob";
import Step5AboutPhotos from "./Step5AboutPhotos";
import { useNavigation } from "@react-navigation/native";

export default function CreateProfileScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);

  const [profileData, setProfileData] = useState({
    name: "",
    dob: "",
    gender: "",
    height: "",
    motherTongue: "",
    location: "",
    physicalStatus: "Normal",
    maritalStatus: "Never married",
    religion: "",
    cast: "",
    subCast: "",
    gotra: "",
    education: "",
    employmentType: "",
    occupation: "",
    annualIncome: "",
    familyStatus: "Middle class",
    diet: "Veg",
    aboutYourself: "",
    photos: [],
    introVideo: "",
  });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const submitForm = async () => {
    console.log("Profile Submitted:", profileData);
    alert("Profile Successfully Created!");
    navigation.replace("Home");
    // later — POST this to backend API
    // axios.post(`${API_URL}/profile/create`, profileData)
  };

  return (
    <View style={{ flex: 1 }}>
      {/* RENDER STEP */}
      {step === 1 && <Step1Basic profile={profileData} setProfile={setProfileData} />}
      {step === 2 && <Step2Location profile={profileData} setProfile={setProfileData} />}
      {step === 3 && <Step3Religion profile={profileData} setProfile={setProfileData} />}
      {step === 4 && <Step4EduJob profile={profileData} setProfile={setProfileData} />}
      {step === 5 && <Step5AboutPhotos profile={profileData} setProfile={setProfileData} submit={submitForm} />}

      {/* BOTTOM BUTTON AREA */}
      <View style={styles.bottomContainer}>
        {step > 1 && (
          <TouchableOpacity onPress={prev} style={styles.backBtn}>
            <Text style={{ fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>
        )}

        {step < 5 && (
          <TouchableOpacity style={styles.continueBtn} onPress={next}>
            <Text style={styles.btnText}>Continue →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
  },
  continueBtn: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 40,
    elevation: 4,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
