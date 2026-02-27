import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
 
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = ["App Experience", "Profile Match", "Chat / Calls", "UI Design", "Other"];

export default function RateReviewScreen({ navigation }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [foundPartner, setFoundPartner] = useState(false);
  const [category, setCategory] = useState("Select Category");
  const [categoryModal, setCategoryModal] = useState(false);

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const onSubmit = () => {
    // ✅ yaha API call / AsyncStorage / backend integrate kar sakte ho
    // Filhaal demo:
    console.log({
      rating,
      review,
      foundPartner,
      category,
    });

    // simple UI feedback
    alert("Thanks! Review submitted ✅");
    setReview("");
    setFoundPartner(false);
    setCategory("Select Category");
    setRating(5);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDECF2" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate & Review Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Pink card */}
        <View style={styles.card}>
          <Text style={styles.subText}>Your blessings help Dhakad families unite.</Text>

          {/* Stars */}
          <View style={styles.starsRow}>
            {stars.map((s) => (
              <TouchableOpacity
                key={s}
                activeOpacity={0.8}
                onPress={() => setRating(s)}
                style={styles.starBtn}
              >
                <Text style={[styles.star, rating >= s ? styles.starActive : styles.starInactive]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.thankText}>Thank you for your love 💍</Text>

          {/* Write Review */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Write Your Review</Text>

            <View style={styles.inputBoxWrap}>
              <TextInput
                value={review}
                onChangeText={setReview}
                placeholder="Share your experience with Dhakad Matrimony..."
                placeholderTextColor="#B9A6AE"
                multiline
                style={styles.textArea}
              />
            </View>

            {/* checkbox */}
            <Pressable style={styles.checkRow} onPress={() => setFoundPartner((p) => !p)}>
              <View style={[styles.checkbox, foundPartner && styles.checkboxActive]}>
                <Text style={[styles.checkMark, foundPartner && { opacity: 1 }]}>✓</Text>
              </View>
              <Text style={styles.checkLabel}>I found my life partner here 💍</Text>
            </Pressable>

            {/* Category dropdown */}
            <Pressable style={styles.dropdown} onPress={() => setCategoryModal(true)}>
              <Text style={[styles.dropdownText, category !== "Select Category" && styles.dropdownTextSelected]}>
                {category}
              </Text>
              <Text style={styles.dropdownArrow}>▾</Text>
            </Pressable>

            {/* Submit */}
            <TouchableOpacity activeOpacity={0.9} onPress={onSubmit} style={styles.submitBtn}>
              <Text style={styles.submitText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* bottom padding */}
        <View style={{ height: 18 }} />
      </ScrollView>

      {/* Category Modal */}
      <Modal visible={categoryModal} transparent animationType="fade" onRequestClose={() => setCategoryModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setCategoryModal(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Select Category</Text>

            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => {
                  setCategory(c);
                  setCategoryModal(false);
                }}
                style={styles.modalItem}
              >
                <Text style={styles.modalItemText}>{c}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setCategoryModal(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FDECF2",
  },
  header: {
    height: 58,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FDECF2",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1,
    borderColor: "rgba(255, 180, 205, 0.55)",
  },
  backIcon: {
    fontSize: 28,
    color: "#B24D6A",
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#B24D6A",
  },

  container: {
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  card: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255, 180, 205, 0.45)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },

  subText: {
    textAlign: "center",
    color: "#9C6B7A",
    fontSize: 13,
    marginBottom: 12,
    fontWeight: "600",
  },

  starsRow: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 10,
  },
  starBtn: {
    paddingHorizontal: 4,
  },
  star: {
    fontSize: 34,
  },
  starActive: {
    color: "#F3B400",
    textShadowColor: "rgba(0,0,0,0.08)",
    textShadowRadius: 6,
  },
  starInactive: {
    color: "#E9D6DC",
  },

  thankText: {
    textAlign: "center",
    color: "#B24D6A",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 14,
  },

  section: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#7D3D52",
    marginBottom: 8,
  },
  inputBoxWrap: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 170, 200, 0.55)",
    padding: 10,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
    color: "#6E3B4A",
    fontSize: 13,
    fontWeight: "600",
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#C98A9E",
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: "#FF7DA6",
    borderColor: "#FF7DA6",
  },
  checkMark: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFF",
    opacity: 0,
    marginTop: -1,
  },
  checkLabel: {
    color: "#7D3D52",
    fontSize: 13,
    fontWeight: "700",
  },

  dropdown: {
    marginTop: 12,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 170, 200, 0.65)",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: "#B9A6AE",
    fontWeight: "700",
    fontSize: 13,
  },
  dropdownTextSelected: {
    color: "#6E3B4A",
  },
  dropdownArrow: {
    fontSize: 18,
    color: "#B24D6A",
    marginTop: -2,
  },

  submitBtn: {
    marginTop: 14,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6F9E",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 120, 170, 0.6)",
  },
  submitText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: "#FFF",
    padding: 14,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#7D3D52",
    marginBottom: 8,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E7EC",
  },
  modalItemText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6E3B4A",
  },
  modalCloseBtn: {
    marginTop: 10,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDECF2",
  },
  modalCloseText: {
    fontWeight: "900",
    color: "#B24D6A",
  },
});