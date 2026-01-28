import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://143.110.244.163:5000/api";

export default function ChatScreen() {
  const navigation = useNavigation();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CHAT LIST ================= */
  const fetchChats = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${API_URL}/chat/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChats(res.data.chats || []);
    } catch (err) {
      console.log("CHAT LIST ERROR", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setChats([
      {
        _id: "1",
        participants: [
          {
            name: "Fatma",
            photo: "https://randomuser.me/api/portraits/women/44.jpg",
          },
        ],
        lastMessage: {
          message: "Hi Muskan, how are you",
          createdAt: new Date(),
        },
      },
      {
        _id: "2",
        participants: [
          {
            name: "Alice",
            photo: "https://randomuser.me/api/portraits/women/65.jpg",
          },
        ],
        lastMessage: {
          message: "Are you free tomorrow?",
          createdAt: new Date(),
        },
      },
      {
        _id: "3",
        participants: [
          {
            name: "Sarika Novotný",
            photo: "https://randomuser.me/api/portraits/women/68.jpg",
          },
        ],
        lastMessage: {
          message: "Let's talk later 🙂",
          createdAt: new Date(),
        },
      },
      {
        _id: "4",
        participants: [
          {
            name: "Alice Peres",
            photo: "https://randomuser.me/api/portraits/women/12.jpg",
          },
        ],
        lastMessage: {
          message: "Call me when you're free",
          createdAt: new Date(),
        },
      },
      {
        _id: "5",
        participants: [
          {
            name: "Olivia Ajroud",
            photo: "https://randomuser.me/api/portraits/women/22.jpg",
          },
        ],
        lastMessage: {
          message: "Good night 🌙",
          createdAt: new Date(),
        },
      },
      {
        _id: "6",
        participants: [
          {
            name: "Isla Jacobs",
            photo: "https://randomuser.me/api/portraits/women/55.jpg",
          },
        ],
        lastMessage: {
          message: "See you soon!",
          createdAt: new Date(),
        },
      },

      {
        _id: "6",
        participants: [
          {
            name: "Isla Jacobs",
            photo: "https://randomuser.me/api/portraits/women/55.jpg",
          },
        ],
        lastMessage: {
          message: "See you soon...!",
          createdAt: new Date(),
        },
      },
      {
        _id: "7",
        participants: [
          {
            name: "Toyin Lee",
            photo: "https://randomuser.me/api/portraits/women/78.jpg",
          },
        ],
        lastMessage: {
          message: "Thanks for the update",
          createdAt: new Date(),
        },
      },
    ]);

    setLoading(false);
  }, []);



  /* ================= RENDER CHAT ITEM ================= */
  const renderItem = ({ item }) => {
    const otherUser = item.participants?.[0];

    return (
      <TouchableOpacity
        style={styles.chatRow}
        onPress={() =>
          navigation.navigate("ChatDetail", { chatId: item._id })
        }
      >
        <Image
          source={{
            uri:
              otherUser?.photo ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }}
          style={styles.avatar}
        />

        <View style={styles.chatContent}>
          <View style={styles.topRow}>
            <Text style={styles.name} numberOfLines={1}>
              {otherUser?.name || "User"}
            </Text>

            <Text style={styles.time}>
              {item.lastMessage?.createdAt
                ? new Date(item.lastMessage.createdAt).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
                : ""}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage?.message || "Hi Muskan, how are you"}
            </Text>

            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>4</Text>
            </View>
          </View>

        </View>
      </TouchableOpacity>
    );
  };

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff4e50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Chat List" />
      

      {chats.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.card}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
              }}
              style={styles.emptyImage}
            />

            <Text style={styles.emptyTitle}>No Conversations Yet</Text>

            <Text style={styles.emptySubTitle}>
              When you connect with matches, your conversations will appear
              here.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Matches")}
            >
              <Text style={styles.buttonText}>Find Matches</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 90 }}
        />
      )}

      <Footer />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  /* SCREEN BACKGROUND (header ke niche ka area) */
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA", // 👈 light grey, header se alag
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* EMPTY STATE */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 18,
    paddingVertical: 30,
    paddingHorizontal: 22,
    alignItems: "center",
    elevation: 4,
  },

  emptyImage: {
    width: 110,
    height: 110,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },

  emptySubTitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#ff4e50",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  /* CHAT LIST ROW */
  chatRow: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF", // 👈 card white
    marginHorizontal: 12,       // 👈 left-right gap
    marginTop:5,              // 👈 header ke niche gap
    paddingVertical: 14,
    paddingHorizontal: 16,

    borderRadius: 14,           // 👈 card look
    elevation: 2,               // 👈 Android shadow
    shadowColor: "#000",        // 👈 iOS shadow
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginRight: 12,
  },

  chatContent: {
    flex: 1,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000000",
    maxWidth: "70%",
  },

  time: {
    fontSize: 12,
    color: "#666",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  lastMessage: {
    fontSize: 13,
    color: "#888",
    maxWidth: "75%",
  },

  unreadBadge: {
    backgroundColor: "#4CAF50",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  unreadText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
});




// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";

// const API_URL = "http://143.110.244.163:5000/api";

// export default function ChatScreen() {
//   const navigation = useNavigation();

//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH CHAT LIST ================= */
//   const fetchChats = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("token");

//       const res = await axios.get(`${API_URL}/chat/list`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setChats(res.data.chats || []);
//     } catch (err) {
//       console.log("CHAT LIST ERROR", err?.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchChats();
//   }, []);

//   /* ================= RENDER CHAT ITEM ================= */
//   const renderItem = ({ item }) => {
//     const otherUser = item.participants?.[0];

//     return (
//       <TouchableOpacity
//         style={styles.chatRow}
//         onPress={() =>
//           navigation.navigate("ChatDetail", { chatId: item._id })
//         }
//       >
//         {/* AVATAR */}
//         <Image
//           source={{
//             uri:
//               otherUser?.photo ||
//               "https://cdn-icons-png.flaticon.com/512/847/847969.png",
//           }}
//           style={styles.avatar}
//         />

//         {/* CENTER */}
//         <View style={styles.content}>
//           <Text style={styles.name}>{otherUser?.name || "User"}</Text>
//           <Text style={styles.lastMessage} numberOfLines={1}>
//             {item.lastMessage?.message || "Hi Muskan, how are you"}
//           </Text>
//         </View>

//         {/* RIGHT */}
//         <View style={styles.right}>
//           <Text style={styles.time}>
//             {item.lastMessage?.createdAt
//               ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })
//               : "9:00 PM"}
//           </Text>

//           {/* UNREAD COUNT */}
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>3</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   /* ================= LOADER ================= */
//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#ff4e50" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Header title="Chat List" />

//       {/* EMPTY STATE */}
//       {chats.length === 0 ? (
//         <View style={styles.center}>
//           <View style={styles.card}>
//             <Image
//               source={{
//                 uri: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
//               }}
//               style={styles.image}
//             />

//             <Text style={styles.emptyTitle}>No Conversations Yet</Text>

//             <Text style={styles.subTitle}>
//               When you connect with matches, your conversations will appear
//               here.
//             </Text>

//             <TouchableOpacity
//               style={styles.button}
//               onPress={() => navigation.navigate("Matches")}
//             >
//               <Text style={styles.buttonText}>Find Matches</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ) : (
//         /* CHAT LIST */
//         <FlatList
//           data={chats}
//           keyExtractor={(item) => item._id}
//           renderItem={renderItem}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 90 }}
//         />
//       )}

//       <Footer />
//     </View>
//   );
// }

// /* ================= STYLES ================= */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },

//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   /* EMPTY STATE */
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },

//   card: {
//     backgroundColor: "#fff",
//     width: "100%",
//     borderRadius: 18,
//     paddingVertical: 32,
//     paddingHorizontal: 22,
//     alignItems: "center",
//     elevation: 5,
//   },

//   image: {
//     width: 110,
//     height: 110,
//     marginBottom: 20,
//     opacity: 0.9,
//   },

//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#333",
//     marginBottom: 8,
//   },

//   subTitle: {
//     fontSize: 14,
//     color: "#777",
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 22,
//   },

//   button: {
//     backgroundColor: "#ff4e50",
//     paddingVertical: 12,
//     paddingHorizontal: 28,
//     borderRadius: 25,
//   },

//   buttonText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "600",
//   },

//   /* CHAT ROW */
//   chatRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderColor: "#f0f0f0",
//   },

//   avatar: {
//     width: 54,
//     height: 54,
//     borderRadius: 27,
//     marginRight: 12,
//     backgroundColor: "#eee",
//   },

//   content: {
//     flex: 1,
//   },

//   name: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#111",
//   },

//   lastMessage: {
//     fontSize: 13,
//     color: "#999",
//     marginTop: 4,
//   },

//   right: {
//     alignItems: "flex-end",
//     justifyContent: "space-between",
//     height: 44,
//   },

//   time: {
//     fontSize: 11,
//     color: "#999",
//   },

//   badge: {
//     backgroundColor: "#4CAF50",
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 6,
//   },

//   badgeText: {
//     color: "#fff",
//     fontSize: 11,
//     fontWeight: "700",
//   },
// });

