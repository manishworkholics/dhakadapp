// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   ScrollView,
//   KeyboardAvoidingView,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import DateTimePicker from "@react-native-community/datetimepicker";

// export default function Step1Basic({ profile, setProfile }) {
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const onDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       const formattedDate = selectedDate.toISOString().split("T")[0];
//       setProfile({ ...profile, dob: formattedDate });
//     }
//   };

//   const isSelectedGender = (g) => (profile.gender || "").toLowerCase() === g;
//   const isSelectedTongue = (lang) => profile.motherTongue === lang;

//   return (
//     <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         {/* ✅ Fixed Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Basic Details</Text>
//           <Text style={styles.subTitle}>Fill your basic information</Text>
//         </View>

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.container}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* NAME (READ ONLY) */}
//           <Text style={styles.label}>Full Name</Text>
//           <TextInput
//             style={[styles.input, styles.disabled]}
//             value={profile.name}
//             editable={false}
//             placeholderTextColor="#777"
//           />

//           {/* GENDER SELECT */}
//           <Text style={styles.label}>Gender</Text>
//           <View style={styles.rowWrap}>
//             {["male", "female"].map((g) => (
//               <TouchableOpacity
//                 key={g}
//                 activeOpacity={0.9}
//                 style={[
//                   styles.segmentBtn,
//                   isSelectedGender(g) && styles.segmentBtnActive,
//                 ]}
//                 onPress={() => setProfile({ ...profile, gender: g })}
//               >
//                 <Text
//                   style={[
//                     styles.segmentText,
//                     isSelectedGender(g) && styles.segmentTextActive,
//                   ]}
//                 >
//                   {g === "male" ? "Male" : "Female"}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* DOB PICKER */}
//           <Text style={styles.label}>Date of Birth</Text>
//           <TouchableOpacity activeOpacity={0.9} onPress={() => setShowDatePicker(true)}>
//             <View style={styles.inputWithIcon}>
//               <TextInput
//                 style={[styles.input, { flex: 1, marginBottom: 0 }]}
//                 placeholder="YYYY-MM-DD"
//                 value={
//                   profile.dob
//                     ? new Date(profile.dob).toLocaleDateString("en-IN", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })
//                     : ""
//                 }
//                 editable={false}
//                 pointerEvents="none"
//               />
//               <Text style={styles.iconText}>📅</Text>
//             </View>
//           </TouchableOpacity>

//           {showDatePicker && (
//             <DateTimePicker
//               value={profile.dob ? new Date(profile.dob) : new Date(2000, 0, 1)}
//               mode="date"
//               display={Platform.OS === "ios" ? "spinner" : "calendar"}
//               maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
//               onChange={onDateChange}
//             />
//           )}

//           {/* EMAIL (READ ONLY) */}
//           <Text style={styles.label}>Email</Text>
//           <TextInput
//             style={[styles.input, styles.disabled]}
//             value={profile.email}
//             editable={false}
//             placeholder="Email"
//             placeholderTextColor="#777"
//           />

//           {/* MOTHER TONGUE */}
//           <Text style={styles.label}>Mother Tongue</Text>
//           <View style={styles.chipWrap}>
//             {["Hindi", "English", "Gujarati"].map((lang) => (
//               <TouchableOpacity
//                 key={lang}
//                 activeOpacity={0.9}
//                 style={[styles.chip, isSelectedTongue(lang) && styles.chipActive]}
//                 onPress={() => setProfile({ ...profile, motherTongue: lang })}
//               >
//                 <Text
//                   style={[styles.chipText, isSelectedTongue(lang) && styles.chipTextActive]}
//                 >
//                   {lang}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* bottom space for fixed Continue button from parent screen */}
//           <View style={{ height: 120 }} />
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "#f5f5f5" },

//   header: {
//     paddingHorizontal: 22,
//     paddingTop: 16,
//     paddingBottom: 12,
//     backgroundColor: "#f5f5f5",
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },

//   title: { fontSize: 22, fontWeight: "800", color: "#111" },
//   subTitle: { marginTop: 4, color: "#777", fontWeight: "600" },

//   container: {
//     paddingHorizontal: 22,
//     paddingTop: 14,
//     paddingBottom: 20,
//   },

//   label: { fontWeight: "800", marginBottom: 8, color: "#111", marginTop: 10 },

//   input: {
//     borderWidth: 1,
//     borderColor: "#e1e1e1",
//     borderRadius: 14,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     marginBottom: 8,
//     backgroundColor: "#fff",
//   },

//   inputWithIcon: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#e1e1e1",
//     borderRadius: 14,
//     backgroundColor: "#fff",
//     paddingRight: 12,
//   },

//   iconText: { fontSize: 16, marginLeft: 8 },

//   disabled: {
//     backgroundColor: "#f1f1f1",
//     color: "#666",
//   },

//   rowWrap: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 6,
//   },

//   segmentBtn: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#e1e1e1",
//     backgroundColor: "#fff",
//     alignItems: "center",
//   },

//   segmentBtnActive: {
//     backgroundColor: "#ff4e50",
//     borderColor: "#ff4e50",
//   },

//   segmentText: { fontWeight: "800", color: "#111" },
//   segmentTextActive: { color: "#fff" },

//   chipWrap: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 10,
//     marginTop: 2,
//   },

//   chip: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 22,
//     borderWidth: 1,
//     borderColor: "#e1e1e1",
//     backgroundColor: "#fff",
//   },

//   chipActive: {
//     backgroundColor: "#ff4e50",
//     borderColor: "#ff4e50",
//   },

//   chipText: { fontWeight: "800", color: "#111" },
//   chipTextActive: { color: "#fff" },
// });



import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Step1Basic({ profile, setProfile }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setProfile({ ...profile, dob: formattedDate });
    }
  };

  const isSelectedGender = (g) =>
    (profile.gender || "").toLowerCase() === g;

  const isSelectedTongue = (lang) =>
    profile.motherTongue === lang;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Basic Details</Text>
          <Text style={styles.subTitle}>
            Fill your basic information
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* NAME */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, styles.disabled]}
            value={profile.name}
            editable={false}
            placeholderTextColor="#777"
          />

          {/* 🔥 GENDER (LOCK AFTER SET) */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.rowWrap}>
            {["male", "female"].map((g) => (
              <TouchableOpacity
                key={g}
                activeOpacity={0.9}
                style={[
                  styles.segmentBtn,
                  isSelectedGender(g) && styles.segmentBtnActive,
                  profile.gender && { opacity: 0.5 }, // 👈 disabled look
                ]}
                onPress={() => {
                  if (!profile.gender) {
                    setProfile({ ...profile, gender: g });
                  }
                }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isSelectedGender(g) && styles.segmentTextActive,
                  ]}
                >
                  {g === "male" ? "Male" : "Female"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 🔥 DOB (LOCK AFTER SET) */}
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if (!profile.dob) {
                setShowDatePicker(true);
              }
            }}
            style={profile.dob && { opacity: 0.6 }} // 👈 disabled feel
          >
            <View style={styles.inputWithIcon}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="YYYY-MM-DD"
                value={
                  profile.dob
                    ? new Date(profile.dob).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : ""
                }
                editable={false}
              />
              <Text style={styles.iconText}>📅</Text>
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={
                profile.dob
                  ? new Date(profile.dob)
                  : new Date(2000, 0, 1)
              }
              mode="date"
              display={
                Platform.OS === "ios" ? "spinner" : "calendar"
              }
              maximumDate={
                new Date(
                  new Date().setFullYear(
                    new Date().getFullYear() - 18
                  )
                )
              }
              onChange={onDateChange}
            />
          )}

          {/* EMAIL */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabled]}
            value={profile.email}
            editable={false}
            placeholder="Email"
            placeholderTextColor="#777"
          />

          {/* MOTHER TONGUE */}
          {/* <Text style={styles.label}>Mother Tongue</Text>
          <View style={styles.chipWrap}>
            {["Hindi", "English", "Gujarati"].map((lang) => (
              <TouchableOpacity
                key={lang}
                activeOpacity={0.9}
                style={[
                  styles.chip,
                  isSelectedTongue(lang) && styles.chipActive,
                ]}
                onPress={() =>
                  setProfile({ ...profile, motherTongue: lang })
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelectedTongue(lang) &&
                      styles.chipTextActive,
                  ]}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View> */}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F2FA",
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
  },

  subTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  container: {
    paddingHorizontal: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 14,
    color: "#111827",
  },

  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    marginBottom: 6,
  },

  disabled: {
    backgroundColor: "#F3F4F6",
  },

  rowWrap: {
    flexDirection: "row",
    gap: 10,
  },

  segmentBtn: {
    flex: 1,
    height: 45,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  segmentBtnActive: {
    backgroundColor: "red",
    borderColor: "#FF4D4D",
  },

  segmentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  segmentTextActive: {
    color: "#fff",
  },

  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconText: {
    marginLeft: -35,
    fontSize: 18,
  },

  chipWrap: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },

  chipActive: {
    backgroundColor: "#FF4D4D",
    borderColor: "#FF4D4D",
  },

  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  chipTextActive: {
    color: "#fff",
  },
});