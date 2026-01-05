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
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ProfileDetail", { id: item._id })}
        >
            <Image source={{ uri: item.photos?.[0] }} style={styles.image} />

            <View style={styles.cardBody}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.location}>{item.location}</Text>

                <View style={styles.tags}>
                    <Text style={styles.tag}>{item.employmentType || "N/A"}</Text>
                    <Text style={styles.tag}>
                        {item.dob
                            ? `${new Date().getFullYear() -
                            new Date(item.dob).getFullYear()} yrs`
                            : "N/A"}
                    </Text>
                    <Text style={styles.tag}>{item.occupation || "N/A"}</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.chatBtn}>
                        <Text style={styles.chatText}>Chat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={sentRequests.includes(item.userId)}
                        onPress={() => handleSendInterest(item.userId)}
                        style={[
                            styles.interestBtn,
                            sentRequests.includes(item.userId) && styles.disabledBtn,
                        ]}
                    >
                        <Text style={styles.interestText}>
                            {sentRequests.includes(item.userId)
                                ? "Interest Sent"
                                : "Send Interest"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );





    return (
        <View style={{ flex: 1 }}>
            <Header  title="Find Partner" />

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
                    data={profiles}
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

    const SelectInput = ({ label, value, options, onSelect }) => {
        const [open, setOpen] = React.useState(false);

        return (
            <View style={{ marginBottom: 14 }}>
                <Text style={sheet.label}>{label}</Text>

                {/* INPUT */}
                <TouchableOpacity
                    style={sheet.selectInput}
                    onPress={() => setOpen(!open)}
                >
                    <Text style={{ color: value ? "#000" : "#999" }}>
                        {value || "Select"}
                    </Text>
                    <Text style={sheet.arrow}>▼</Text>
                </TouchableOpacity>

                {/* OPTIONS */}
                {open && (
                    <View style={sheet.optionList}>
                        {options.length === 0 ? (
                            <Text style={sheet.empty}>No options</Text>
                        ) : (
                            options.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={sheet.option}
                                    onPress={() => {
                                        onSelect(item);
                                        setOpen(false);
                                    }}
                                >
                                    <Text>{item}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={sheet.overlay}>
            <ScrollView style={sheet.container} showsVerticalScrollIndicator={false}>
                <Text style={sheet.title}>Filters</Text>

                <Text style={sheet.label}>Looking for</Text>
                <View style={sheet.row}>
                    {["male", "female"].map((g) => (
                        <TouchableOpacity
                            key={g}
                            style={[
                                sheet.option,
                                filters.gender === g && sheet.active,
                            ]}
                            onPress={() => setFilters({ ...filters, gender: g })}
                        >
                            <Text style={filters.gender === g && { color: "#fff" }}>
                                {g === "male" ? "Men" : "Women"}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>


                <SelectInput
                    label="Age"
                    value={filters.age}
                    options={["18-25", "26-30", "31-35", "36-40", "41-50", "50+"]}
                    onSelect={(v) => setFilters({ ...filters, age: v })}
                />



                <SelectInput
                    label="Religion"
                    value={filters.religion}
                    options={filterOptions.religions}
                    onSelect={(v) => setFilters({ ...filters, religion: v })}
                />

                <SelectInput
                    label="Location"
                    value={filters.location}
                    options={filterOptions.locations}
                    onSelect={(v) => setFilters({ ...filters, location: v })}
                />

                <SelectInput
                    label="Education"
                    value={filters.education}
                    options={filterOptions.educations}
                    onSelect={(v) => setFilters({ ...filters, education: v })}
                />

                <SelectInput
                    label="Profession"
                    value={filters.profession}
                    options={filterOptions.professions}
                    onSelect={(v) => setFilters({ ...filters, profession: v })}
                />


                <View style={sheet.actionRow}>
                    <TouchableOpacity
                        onPress={() => {
                            setFilters({
                                gender: "",
                                age: "",
                                religion: "",
                                location: "",
                                education: "",
                                profession: "",
                                search: "",
                            });

                            onClose();
                        }}
                    >
                        <Text style={sheet.clear}>Clear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={sheet.applyBtn} onPress={onClose}>
                        <Text style={sheet.applyText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
