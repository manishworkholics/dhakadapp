import React, { useEffect, useState } from "react";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Header from "../components/Header";
import Footer from '../components/Footer';

const API_URL = "http://143.110.244.163:5000/api";

export default function FindPartnerScreen({ navigation }) {

    const [filters, setFilters] = useState({
        gender: "",
        age: "",
        religion: "",
        location: "",
        education: "",
        profession: "",
        search: "",
    });


    const [filterOptions, setFilterOptions] = useState({
        religions: [],
        locations: [],
        educations: [],
        professions: [],
    });


    const fetchFilterOptions = async () => {
        try {
            const res = await axios.get(`${API_URL}/profile/filters`);

            console.log("FILTER OPTIONS 👉", res.data);

            if (res.data?.success) {
                setFilterOptions({
                    religions: res.data.filters.religions || [],
                    locations: res.data.filters.locations || [],
                    educations: res.data.filters.education || [],
                    professions: res.data.filters.occupations || [],
                });
            }
        } catch (err) {
            console.log("FILTER OPTIONS ERROR:", err.message);
        }
    };


    useEffect(() => {
        fetchFilterOptions();
    }, []);



    const [profiles, setProfiles] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [sentRequests, setSentRequests] = useState([]);
    const [showFilter, setShowFilter] = useState(false);

    /* 🔹 AGE MAP */
    const ageRangeToQuery = (ageRange) => {
        const map = {
            "18-25": { ageMin: 18, ageMax: 25 },
            "26-30": { ageMin: 26, ageMax: 30 },
            "31-35": { ageMin: 31, ageMax: 35 },
            "36-40": { ageMin: 36, ageMax: 40 },
            "41-50": { ageMin: 41, ageMax: 50 },
            "50+": { ageMin: 51, ageMax: 100 },
        };
        return map[ageRange] || {};
    };

    /* 🔹 FETCH PROFILES */
    const fetchProfiles = async () => {
        try {
            setLoading(true);

            const user = await AsyncStorage.getItem("user");
            const currentUser = user ? JSON.parse(user) : null;

            const params = new URLSearchParams();

            if (filters.gender) params.append("gender", filters.gender);
            if (filters.search) params.append("search", filters.search);
            if (filters.religion) params.append("religion", filters.religion);
            if (filters.location) params.append("location", filters.location);
            if (filters.education) params.append("education", filters.education);
            if (filters.profession) params.append("occupation", filters.profession);


            const ageObj = ageRangeToQuery(filters.age);
            if (ageObj.ageMin) params.append("ageMin", ageObj.ageMin);
            if (ageObj.ageMax) params.append("ageMax", ageObj.ageMax);

            if (currentUser?._id) params.append("userId", currentUser._id);

            params.append("page", page);
            params.append("limit", limit);

            const res = await axios.get(
                `${API_URL}/profile/profiles?${params.toString()}`
            );

            console.log("FIND PARTNER RESPONSE 👉", res.data);

            setProfiles(res.data?.profiles || []);
            setTotalPages(Math.ceil((res.data?.total || 0) / limit));
        } catch (err) {
            console.log("FIND PARTNER ERROR 👉", err?.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [filters, page]);

    /* 🔹 SEND INTEREST */
    const handleSendInterest = async (receiverId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return alert("Please login first");

            const res = await axios.post(
                `${API_URL}/interest/request/send`,
                { receiverId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setSentRequests((prev) => [...prev, receiverId]);
            }
        } catch (err) {
            alert(err?.response?.data?.message || "Error sending interest");
        }
    };

    /* 🔹 PROFILE CARD */
    const renderItem = ({ item }) => {
        const age = item.dob
            ? new Date().getFullYear() - new Date(item.dob).getFullYear()
            : "N/A";
        if (item.type === "vip-card") return <VipPromoCard />;
        if (item.type === "chat-card") return <ChatPromoCard />;
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={ui.card}
                onPress={() => navigation.navigate("ProfileDetail", { id: item._id })}
            >
                {/* IMAGE */}
                <View style={ui.imageWrapper}>
                    {/* BLURRED BACKGROUND */}
                    <Image
                        source={{ uri: item.photos?.[0] }}
                        style={ui.blurImage}
                        blurRadius={15}
                    />

                    {/* MAIN IMAGE */}
                    <Image
                        source={{ uri: item.photos?.[0] }}
                        style={ui.mainImage}
                        resizeMode="contain"
                    />
                </View>


                {/* JUST JOINED */}
                <View style={ui.joinedBadge}>
                    <Text style={ui.joinedText}>JUST JOINED</Text>
                </View>

                {/* IMAGE COUNT (optional) */}
                <View style={ui.imageCount}>
                    <Text style={ui.imageCountText}>📷 1</Text>
                </View>

                {/* BOTTOM OVERLAY */}
                <View style={ui.overlay}>
                    <Text style={ui.name}>{item.name}</Text>

                    <Text style={ui.meta}>
                        {age} yrs, {item.height || `5'`} · {item.occupation || "Nurse"}
                    </Text>

                    <Text style={ui.subMeta}>
                        {item.religion || "Hindu"}, {item.caste || "Brahmin"} · {item.location}
                    </Text>
                </View>

                {/* ACTION BAR */}
                <View style={ui.actionBar}>
                    <TouchableOpacity style={ui.upgradeBtn}>
                        <Text style={ui.crown}>👑</Text>
                        <Text style={ui.upgradeText}>Upgrade to Connect</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={ui.checkBtn}>
                        <Text style={ui.checkText}>✓</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const listData = [
        ...profiles,
        { type: "vip-card", id: "vip" },
        { type: "chat-card", id: "chat" },
    ];

    const VipPromoCard = () => {
        return (
            <View style={vip.card}>
                {/* BACKGROUND IMAGE */}
                <Image
                    source={require("../assets/images/vip-man.png")}
                    style={vip.bgImage}
                />

                {/* CONTENT OVER IMAGE */}
                <View style={vip.content}>
                    <Text style={vip.title}>💎 VIP SHAADI</Text>

                    <Text style={vip.heading}>For VIPs,</Text>
                    <Text style={vip.heading}>Recommended by VIPs</Text>

                    <View style={vip.list}>
                        <Text style={vip.point}>⭐ Trusted by 50k+ VIPs</Text>
                        <Text style={vip.point}>⭐ Top rated consultants</Text>
                        <Text style={vip.point}>⭐ 5x Success Rates</Text>
                    </View>

                    <TouchableOpacity style={vip.button} onPress={() => navigation.navigate("Premium")}>
                        <Text style={vip.buttonText}>Know More</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };



    const ChatPromoCard = () => {
        return (
            <View style={promo.chatCard}>
                <Image
                    source={require("../assets/images/chat-illustration.png")}
                    style={promo.chatImage}
                    resizeMode="contain"
                />

                <Text style={promo.chatText}>
                    Get 10 times better response by chat directly!
                </Text>

                <TouchableOpacity style={promo.chatBtn} onPress={() => navigation.navigate("Premium")}>
                    <Text style={promo.chatBtnText}>View Plans</Text>
                </TouchableOpacity>
            </View>
        );
    };




    return (
        <View style={{ flex: 1 }}>
            <Header title="Find Partner" />

            {/* 🔹 SEARCH + FILTER */}
            <View style={styles.topBar}>
                <TextInput
                    placeholder="Search"
                    value={filters.search}
                    onChangeText={(text) =>
                        setFilters((prev) => ({ ...prev, search: text }))
                    }
                    style={styles.searchInput}
                />

                <TouchableOpacity
                    style={styles.filterBtn}
                    onPress={() => setShowFilter(true)}
                >
                    <Text style={styles.filterText}>Filters</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 30 }} size="large" />
            ) : (
                <FlatList
                    data={listData}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: "center", marginTop: 40 }}>
                            No profiles found
                        </Text>
                    }
                />
            )}

            {/* 🔹 PAGINATION */}
            <View style={styles.pagination}>
                <TouchableOpacity
                    disabled={page === 1}
                    onPress={() => setPage((p) => p - 1)}
                >
                    <Text style={styles.pageBtn}>Previous</Text>
                </TouchableOpacity>

                <Text style={styles.pageText}>
                    Page {page} of {totalPages}
                </Text>

                <TouchableOpacity
                    disabled={page === totalPages}
                    onPress={() => setPage((p) => p + 1)}
                >
                    <Text style={styles.pageBtn}>Next</Text>
                </TouchableOpacity>
            </View>

            {/* 🔹 FILTER SHEET */}
            <FilterSheet
                visible={showFilter}
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
                onClose={() => setShowFilter(false)}
            />


            <Footer />
        </View>
    );
}

/* ================= FILTER SHEET ================= */

const FilterSheet = ({ visible, filters, setFilters, filterOptions, onClose }) => {
  if (!visible) return null;

  return (
    <View style={fs.overlay}>
      <View style={fs.sheet}>
        {/* HEADER */}
        <Text style={fs.title}>Filters</Text>

        {/* BODY */}
        <ScrollView
          style={fs.body}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Looking for */}
          <Text style={fs.label}>Looking for</Text>
          <View style={fs.genderRow}>
            {["male", "female"].map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  fs.genderBtn,
                  filters.gender === g && fs.genderActive,
                ]}
                onPress={() => setFilters({ ...filters, gender: g })}
              >
                <Text
                  style={[
                    fs.genderText,
                    filters.gender === g && { color: "#fff" },
                  ]}
                >
                  {g === "male" ? "Men" : "Women"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <SelectField
            label="Age"
            value={filters.age}
            options={["18-25", "26-30", "31-35", "36-40", "41-50", "50+"]}
            onSelect={(v) => setFilters({ ...filters, age: v })}
          />

          <SelectField
            label="Religion"
            value={filters.religion}
            options={filterOptions.religions}
            onSelect={(v) => setFilters({ ...filters, religion: v })}
          />

          <SelectField
            label="Location"
            value={filters.location}
            options={filterOptions.locations}
            onSelect={(v) => setFilters({ ...filters, location: v })}
          />

          <SelectField
            label="Education"
            value={filters.education}
            options={filterOptions.educations}
            onSelect={(v) => setFilters({ ...filters, education: v })}
          />

          <SelectField
            label="Profession"
            value={filters.profession}
            options={filterOptions.professions}
            onSelect={(v) => setFilters({ ...filters, profession: v })}
          />
        </ScrollView>

        {/* FOOTER */}
        <View style={fs.footer}>
          <TouchableOpacity onPress={() => {
            setFilters({
              gender: "",
              age: "",
              religion: "",
              location: "",
              education: "",
              profession: "",
              search: "",
            });
          }}>
            <Text style={fs.clear}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity style={fs.applyBtn} onPress={onClose}>
            <Text style={fs.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const SelectField = ({ label, value, options, onSelect }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={fs.label}>{label}</Text>

      <TouchableOpacity
        style={fs.input}
        onPress={() => setOpen(!open)}
      >
        <Text style={{ color: value ? "#000" : "#aaa" }}>
          {value || "Select"}
        </Text>
        <Text style={fs.arrow}>▼</Text>
      </TouchableOpacity>

      {open && (
        <View style={fs.dropdown}>
          <ScrollView nestedScrollEnabled>
            {options.map((item) => (
              <TouchableOpacity
                key={item}
                style={fs.option}
                onPress={() => {
                  onSelect(item);
                  setOpen(false);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};


/* ================= STYLES ================= */

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#fff",
        gap: 10,
    },

    searchInput: {
        flex: 1,
        backgroundColor: "#f1f1f1",
        borderRadius: 10,
        paddingHorizontal: 12,
    },

    filterBtn: {
        backgroundColor: "#ff4e50",
        paddingHorizontal: 14,
        justifyContent: "center",
        borderRadius: 10,
    },

    filterText: {
        color: "#fff",
        fontWeight: "700",
    },

    card: {
        backgroundColor: "#fff",
        margin: 12,
        borderRadius: 14,
        overflow: "hidden",
        elevation: 3,
    },

    image: {
        width: "100%",
        height: 220,
    },

    cardBody: {
        padding: 12,
    },

    name: {
        fontSize: 16,
        fontWeight: "700",
    },

    location: {
        color: "#666",
        marginVertical: 4,
    },

    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginVertical: 6,
    },

    tag: {
        backgroundColor: "#FFECAE",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        fontSize: 12,
    },

    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },

    chatBtn: {
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 18,
    },

    chatText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },

    interestBtn: {
        borderWidth: 1,
        borderRadius: 18,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },

    disabledBtn: {
        backgroundColor: "#eee",
    },

    interestText: {
        fontSize: 13,
    },

    pagination: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        backgroundColor: "#fff",
    },

    pageBtn: {
        fontWeight: "700",
        color: "#ff4e50",
    },

    pageText: {
        fontWeight: "600",
    },
});

const sheet = StyleSheet.create({
    overlay: {
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },

    container: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 16,
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },

    label: {
        fontWeight: "600",
        marginTop: 10,
    },

    row: {
        flexDirection: "row",
        gap: 10,
        marginVertical: 8,
    },

    option: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        marginTop: 6,
    },

    active: {
        backgroundColor: "#ff4e50",
        borderColor: "#ff4e50",
    },

    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },

    clear: {
        color: "#666",
        fontWeight: "600",
    },

    applyBtn: {
        backgroundColor: "#ff4e50",
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 24,
    },

    applyText: {
        color: "#fff",
        fontWeight: "700",
    },
    selectInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
    },

    arrow: {
        color: "#999",
        fontSize: 12,
    },

    optionList: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginTop: 6,
        backgroundColor: "#fff",
        maxHeight: 180,
    },

    option: {
        padding: 12,
        borderBottomWidth: 0.5,
        borderColor: "#eee",
    },

    empty: {
        padding: 12,
        color: "#999",
        textAlign: "center",
    },

});

const ui = StyleSheet.create({
    card: {
        marginHorizontal: 14,
        marginVertical: 10,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#f1f1f1",
        elevation: 4,
    },

    image: {
        width: "100%",
        height: 420,
    },

    /* BADGES */
    joinedBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },

    joinedText: {
        color: "#ff4e50",
        fontSize: 11,
        fontWeight: "700",
    },

    imageCount: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },

    imageCountText: {
        color: "#fff",
        fontSize: 11,
    },

    /* OVERLAY */
    overlay: {
        position: "absolute",
        bottom: 56,
        left: 0,
        right: 0,
        padding: 14,
        backgroundColor: "rgba(0,0,0,0.45)",
    },

    name: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },

    meta: {
        color: "#fff",
        fontSize: 13,
        marginTop: 4,
    },

    subMeta: {
        color: "#eaeaea",
        fontSize: 12,
        marginTop: 2,
    },

    /* ACTION BAR */
    actionBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
    },

    upgradeBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ff4e50",
        paddingVertical: 12,
        borderRadius: 30,
        marginRight: 10,
    },

    crown: {
        marginRight: 6,
        fontSize: 14,
    },

    upgradeText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 13,
    },

    checkBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#4CAF50",
        alignItems: "center",
        justifyContent: "center",
    },

    checkText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    imageWrapper: {
        width: "100%",
        height: 420,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
    },

    blurImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        transform: [{ scale: 1.2 }],
    },

    mainImage: {
        width: "100%",
        height: "100%",
    },

});

const vip = StyleSheet.create({
    card: {
        marginHorizontal: 14,
        marginVertical: 12,
        borderRadius: 22,
        overflow: "hidden",
        height: 240,
        backgroundColor: "#f5e27a",
    },

    bgImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    content: {
        flex: 1,
        padding: 18,
        justifyContent: "center",
    },

    title: {
        fontSize: 13,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 8,
    },

    heading: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
    },

    list: {
        marginTop: 10,
    },

    point: {
        fontSize: 12,
        color: "#fff",
        marginBottom: 4,
    },

    button: {
        marginTop: 14,
        backgroundColor: "#ff4e50",
        alignSelf: "flex-start",
        paddingHorizontal: 22,
        paddingVertical: 10,
        borderRadius: 24,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 13,
    },
});


const promo = StyleSheet.create({


    /* CHAT CARD */
    chatCard: {
        margin: 14,
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 16,
        alignItems: "center",
        elevation: 3,
    },

    chatImage: {
        width: 120,
        height: 80,
        marginBottom: 10,
    },

    chatText: {
        textAlign: "center",
        color: "#666",
        fontSize: 13,
        marginBottom: 12,
    },

    chatBtn: {
        backgroundColor: "#ff4e50",
        paddingHorizontal: 26,
        paddingVertical: 10,
        borderRadius: 24,
    },

    chatBtnText: {
        color: "#fff",
        fontWeight: "700",
    },
});

const fs = StyleSheet.create({
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    paddingBottom:65
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    padding: 16,
  },

  body: {
    paddingHorizontal: 16,
  },

  label: {
    fontWeight: "600",
    marginBottom: 6,
  },

  genderRow: {
    flexDirection: "row",
    marginBottom: 14,
    gap: 10,
  },

  genderBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },

  genderActive: {
    backgroundColor: "#ff4e50",
    borderColor: "#ff4e50",
  },

  genderText: {
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  arrow: {
    color: "#999",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 6,
    maxHeight: 180,
    backgroundColor: "#fff",
  },

  option: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  clear: {
    color: "#666",
    fontWeight: "600",
  },

  applyBtn: {
    backgroundColor: "#ff4e50",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },

  applyText: {
    color: "#fff",
    fontWeight: "700",
  },
});
