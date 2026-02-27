// src/screens/CreateProfile/CreateProfileScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import Step1Basic from "./Step1Basic";
import Step2Location from "./Step2Location";
import Step3Religion from "./Step3Religion";
import Step4EduJob from "./Step4EduJob";
import Step5AboutPhotos from "./Step5AboutPhotos";
import { useProfile } from "../../context/ProfileContext";
import AppModal from "../../components/AppModal";




const API_URL = "http://143.110.244.163:5000/api";

export default function CreateProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [authUser, setAuthUser] = useState(null);

  const { fetchProfile } = useProfile();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const showModal = (msg, type = "success") => {
    setModalMessage(msg);
    setModalType(type);
    setModalVisible(true);
  };


  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setAuthUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);



  const existingProfile = route.params?.profile || null;
  const [step, setStep] = useState(1);

  const [profileData, setProfileData] = useState({
    name: existingProfile?.name || authUser?.name || "",
    email: existingProfile?.email || authUser?.email || "",
    phone: existingProfile?.phone || authUser?.phone || "",

    dob: existingProfile?.dob || "",
    gender: existingProfile?.gender || "",
    motherTongue: existingProfile?.motherTongue || "",
    location: existingProfile?.location || "",

    height: existingProfile?.height || "",
    physicalStatus: existingProfile?.physicalStatus || "Normal",
    maritalStatus: existingProfile?.maritalStatus || "Never married",

    religion: existingProfile?.religion || "",
    caste: existingProfile?.caste || "",
    subCaste: existingProfile?.subCaste || "",
    gotra: existingProfile?.gotra || "",

    education: existingProfile?.educationDetails || "",
    employmentType: existingProfile?.employmentType || "",
    occupation: existingProfile?.occupation || "",
    annualIncome: existingProfile?.annualIncome || "",

    familyStatus: existingProfile?.familyStatus || "Middle class",
    diet: existingProfile?.diet || "Veg",
    aboutYourself: existingProfile?.aboutYourself || "",
    hobbies: existingProfile?.hobbies || "",

    photos: existingProfile?.photos || [],
  });


  useEffect(() => {
    if (!existingProfile && authUser?.name) {
      setProfileData((prev) => ({
        ...prev,
        name: authUser.name,
      }));
    }
  }, [authUser]);


  const next = () => setStep((s) => Math.min(5, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  /* 🔹 AUTO JUMP TO INCOMPLETE STEP (EDIT MODE) */
  useEffect(() => {
    if (!existingProfile) return;

    if (!profileData.name || !profileData.gender || !profileData.dob)
      setStep(1);
    else if (!profileData.location)
      setStep(2);
    else if (!profileData.religion || !profileData.caste)
      setStep(3);
    else if (!profileData.occupation || !profileData.annualIncome)
      setStep(4);
    else
      setStep(5);
  }, []);

  /* 🔹 FINAL SUBMIT */

  const submitForm = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const payload = {
        name: profileData.name,
        dob: profileData.dob,
        motherTongue: profileData.motherTongue,
        gender: profileData.gender,
        location: profileData.location,

        height: profileData.height,
        physicalStatus: profileData.physicalStatus,
        maritalStatus: profileData.maritalStatus,
        religion: profileData.religion,
        caste: profileData.caste,
        subCaste: profileData.subCaste,
        gotra: profileData.gotra,

        educationDetails: profileData.education,
        employmentType: profileData.employmentType,
        occupation: profileData.occupation,
        annualIncome: profileData.annualIncome,

        familyStatus: profileData.familyStatus,
        diet: profileData.diet,
        aboutYourself: profileData.aboutYourself,
        hobbies: profileData.hobbies,

        photos: profileData.photos,
      };

      await axios.post(`${API_URL}/profile/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await AsyncStorage.removeItem("ownProfile");

      // ✅ pehle modal show karo
      showModal("Profile Updated Successfully! ✅ ❤️", "success");

      // ✅ profile refresh (safe)
      fetchProfile();


    } catch (err) {
      console.log(err.response?.data || err.message);
      showModal("Failed to update profile", "error");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {step === 1 && <Step1Basic profile={profileData} setProfile={setProfileData} />}
      {step === 2 && <Step2Location profile={profileData} setProfile={setProfileData} />}
      {step === 3 && <Step3Religion profile={profileData} setProfile={setProfileData} />}
      {step === 4 && <Step4EduJob profile={profileData} setProfile={setProfileData} />}
      {step === 5 && (
        <Step5AboutPhotos
          profile={profileData}
          setProfile={setProfileData}
          submit={submitForm}
        />
      )}

      {/* FOOTER */}

      <View style={styles.bottomBar}>
        {step > 1 ? (
          <TouchableOpacity onPress={prev} style={styles.backAction}>
            <Text style={styles.backActionText}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {step < 5 ? (
          <TouchableOpacity style={styles.continueBtn} onPress={next}>
            <Text style={styles.continueText}>Continue →</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1.3 }} />
        )}
      </View>

      <AppModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => {
          setModalVisible(false);


          if (modalType === "success") {
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          }
        }}
      />


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
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 40,
    elevation: 4,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e9e9e9",
    flexDirection: "row",
    gap: 12,
  },

  backAction: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF4D4D",
    paddingVertical: 12,
    borderRadius: 26,
    alignItems: "center",
  },
  backActionText: {
    color: "#FF4D4D",
    fontWeight: "800",
  },

  continueBtn: {
    flex: 1.3,
    backgroundColor: "#FF4D4D",
    paddingVertical: 12,
    borderRadius: 26,
    alignItems: "center",
    elevation: 3,
  },
  continueText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
});