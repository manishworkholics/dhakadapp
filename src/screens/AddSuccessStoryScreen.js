// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Platform,
//   KeyboardAvoidingView,
//   ActivityIndicator,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Icon from "react-native-vector-icons/FontAwesome5";
// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "react-native-image-picker";

// const API_URL = "http://143.110.244.163:5000/api";

// export default function AddSuccessStoryScreen({ navigation }) {
//   const navigationHook = useNavigation();

//   const [title, setTitle] = useState("");
//   const [name, setName] = useState("");
//   const [partnerName, setPartnerName] = useState("");
//   const [story, setStory] = useState("");
//   const [image, setImage] = useState("");

//   const [uploading, setUploading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibrary({
//       mediaType: "photo",
//       quality: 0.7,
//     });

//     if (!result?.assets?.[0]?.uri) return;

//     try {
//       setUploading(true);
//       const token = await AsyncStorage.getItem("token");

//       const formData = new FormData();
//       formData.append("image", {
//         uri: result.assets[0].uri,
//         name: "photo.jpg",
//         type: "image/jpeg",
//       });

//       const res = await axios.post(`${API_URL}/upload-image`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setImage(res.data.url);
//     } catch {
//       alert("Image upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!title || !name || !partnerName || !story) {
//       alert("Please fill all fields");
//       return;
//     }

//     if (!image) {
//       alert("Please upload image");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const token = await AsyncStorage.getItem("token");

//       await axios.post(
//         `${API_URL}/success`,
//         { title, name, partnerName, story, image },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Story submitted successfully!");
//       setTitle("");
//       setName("");
//       setPartnerName("");
//       setStory("");
//       setImage("");
//     } catch {
//       alert("Submission failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleBack = () => {
//     navigation ? navigation.navigate("Home") : navigationHook.navigate("Home");
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView contentContainerStyle={styles.container}>
          
//           <View style={styles.header}>
//             <TouchableOpacity onPress={handleBack}>
//               <Text style={styles.backText}>← Back</Text>
//             </TouchableOpacity>
//             <Text style={styles.title}>Share Your Success Story</Text>
//           </View>

//           <View style={styles.card}>

//             <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
//               {uploading ? (
//                 <ActivityIndicator color="#d4af37" />
//               ) : image ? (
//                 <Image source={{ uri: image }} style={styles.image} />
//               ) : (
//                 <>
//                   <Icon name="camera" size={26} color="#d4af37" />
//                   <Text style={styles.imageText}>Add Photo</Text>
//                 </>
//               )}
//             </TouchableOpacity>

//             <TextInput placeholderTextColor={"black"} style={styles.input} placeholder="Story Title" value={title} onChangeText={setTitle} />
//             <TextInput placeholderTextColor={"black"} style={styles.input} placeholder="Your Name" value={name} onChangeText={setName} />
//             <TextInput placeholderTextColor={"black"} style={styles.input} placeholder="Partner Name" value={partnerName} onChangeText={setPartnerName} />
//             <TextInput
//               style={[styles.input, { height: 110 }]}
//               placeholder="Your Story"
//               value={story}
//               placeholderTextColor={"black"}
//               onChangeText={setStory}
//               multiline
//             />

//             <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//               {submitting ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.buttonText}>Submit Story</Text>
//               )}
//             </TouchableOpacity>

//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },

//   container: {
//     padding: 20,
//   },

//   header: {
//     marginBottom: 20,
//   },

//   backText: {
//     color: "#d4af37",
//     fontSize: 16,
//     marginBottom: 10,
//   },

//   title: {
//     fontSize: 24,
//     fontWeight: "700",
//     textAlign: "center",
//     color: "#222",
//   },

//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 24,
//     padding: 20,
//     elevation: 6,
//   },

//   imagePicker: {
//     alignSelf: "center",
//     width: 130,
//     height: 130,
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: "#d4af37",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//     backgroundColor: "#faf8f2",
//   },

//   image: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 20,
//   },

//   imageText: {
//     marginTop: 6,
//     color: "#d4af37",
//     fontWeight: "600",
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#eee",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 14,
//     backgroundColor: "#fafafa",
//   },

//   button: {
//     backgroundColor: "#d4af37",
//     padding: 16,
//     borderRadius: 30,
//     marginTop: 10,
//   },

//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "700",
//     fontSize: 16,
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "react-native-image-picker";

const API_URL = "http://143.110.244.163:5000/api";

export default function AddSuccessStoryScreen({ navigation }) {
  const navigationHook = useNavigation();

  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [story, setStory] = useState("");
  const [image, setImage] = useState("");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
      quality: 0.7,
    });

    if (!result?.assets?.[0]?.uri) return;

    try {
      setUploading(true);
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("image", {
        uri: result.assets[0].uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      const res = await axios.post(`${API_URL}/upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setImage(res.data.url);
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !name || !partnerName || !story) {
      alert("Please fill all fields");
      return;
    }

    if (!image) {
      alert("Please upload image");
      return;
    }

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem("token");

      await axios.post(
        `${API_URL}/success`,
        { title, name, partnerName, story, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Story submitted successfully!");
      setTitle("");
      setName("");
      setPartnerName("");
      setStory("");
      setImage("");
    } catch {
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigation ? navigation.navigate("Home") : navigationHook.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>

          {/* HEADER */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Icon name="arrow-left" size={18} color="#d4af37" />
            </TouchableOpacity>

            <Text style={styles.screenTitle}>
              Share Your Success Story
            </Text>

            <View style={{ width: 36 }} />
          </View>

          {/* 🔥 IMAGE ADDED HERE */}
          <Image
            source={require("../assets/images/couple 1.png")}
            style={styles.topImage}
          />

          {/* FORM CARD */}
          <View style={styles.card}>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {uploading ? (
                <ActivityIndicator color="#d4af37" />
              ) : image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <>
                  <Icon name="camera" size={26} color="#d4af37" />
                  <Text style={styles.imageText}>Add Photo</Text>
                </>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Story Title"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Partner Name"
              value={partnerName}
              onChangeText={setPartnerName}
            />

            <TextInput
              style={[styles.input, { height: 110 }]}
              placeholder="Your Story"
              value={story}
              onChangeText={setStory}
              multiline
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit Story</Text>
              )}
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f7f6f3",
  },

  container: {
    paddingBottom: 30,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
  },

  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },

  /* 🔥 IMAGE STYLE */
  topImage: {
    width: "90%",
    height: 180,
    alignSelf: "center",
    resizeMode: "contain",
    marginVertical: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    elevation: 6,
  },

  imagePicker: {
    alignSelf: "center",
    width: 110,
    height: 110,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#d4af37",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },

  imageText: {
    marginTop: 6,
    color: "#d4af37",
  },

  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },

  button: {
    backgroundColor: "#e86a6a",
    padding: 15,
    borderRadius: 25,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});