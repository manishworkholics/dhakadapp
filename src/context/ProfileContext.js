// import React, { createContext, useContext, useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// const API_URL = "http://143.110.244.163:5000/api";

// const ProfileContext = createContext();

// export const useProfile = () => useContext(ProfileContext);

// export const ProfileProvider = ({ children }) => {
//   const [profile, setProfile] = useState(null);
//   const [loadingProfile, setLoadingProfile] = useState(true);

//   /* 🔹 FETCH OWN PROFILE (ONCE) */
//   const fetchOwnProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const user = await AsyncStorage.getItem("user");

//       if (!token || !user) {
//         setLoadingProfile(false);
//         return;
//       }

//       const parsedUser = JSON.parse(user);

//       const res = await axios.get(
//         `${API_URL}/profile/own-profile/${parsedUser._id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data?.success) {
//         setProfile(res.data.profile);

//         // optional cache
//         await AsyncStorage.setItem(
//           "ownProfile",
//           JSON.stringify(res.data.profile)
//         );
//       }
//     } catch (error) {
//       console.log(
//         "OWN PROFILE ERROR 👉",
//         error?.response?.data || error.message
//       );
//     } finally {
//       setLoadingProfile(false);
//     }
//   };

//   /* 🔹 LOAD FROM CACHE FIRST */
//   useEffect(() => {
//     const loadCachedProfile = async () => {
//       const cached = await AsyncStorage.getItem("ownProfile");
//       if (cached) {
//         setProfile(JSON.parse(cached));
//         setLoadingProfile(false);
//       }
//       fetchOwnProfile(); // refresh in background
//     };

//     loadCachedProfile();
//   }, []);

//   return (
//     <ProfileContext.Provider
//       value={{
//         profile,
//         setProfile,
//         loadingProfile,
//         refreshProfile: fetchOwnProfile,
//       }}
//     >
//       {children}
//     </ProfileContext.Provider>
//   );
// };



import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api";

const ProfileContext = createContext();
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchOwnProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");

      if (!token || !user) return;

      const parsedUser = JSON.parse(user);

      const res = await axios.get(
        `${API_URL}/profile/own-profile/${parsedUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setProfile(res.data.profile);
        await AsyncStorage.setItem(
          `ownProfile_${parsedUser._id}`,
          JSON.stringify(res.data.profile)
        );

      }
    } catch (e) {
      console.log("OWN PROFILE ERROR", e.message);
    }
  };

  const fetchUserPlan = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/plan/my-plan`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setUserPlan(res.data.userPlan);
        await AsyncStorage.setItem(
          "userPlan",
          JSON.stringify(res.data.userPlan)
        );
      }
    } catch (e) {
      setUserPlan(null);
    }
  };

  // ✅ FIX HERE
  useEffect(() => {
    const loadCache = async () => {
      const user = await AsyncStorage.getItem("user");

      // 🔥 logout case
      if (!user) {
        setProfile(null);
        setUserPlan(null);
        setLoadingProfile(false);
        return;
      }



      const parsedUser = JSON.parse(user);

      const cachedProfile = await AsyncStorage.getItem(
        `ownProfile_${parsedUser._id}`
      );

      if (cachedProfile) {
        setProfile(JSON.parse(cachedProfile));
      } else {
        setProfile(null); // 🔥 NO OLD DATA
      }

      const cachedPlan = await AsyncStorage.getItem("userPlan");
      if (cachedPlan) setUserPlan(JSON.parse(cachedPlan));

      setLoadingProfile(false);

      fetchOwnProfile();
      fetchUserPlan();
    };

    loadCache();
  }, []);

  const hasActivePlan =
    userPlan?.status === "active" &&
    new Date(userPlan?.endDate) > new Date();

  const hasFeature = (featureName) =>
    hasActivePlan &&
    userPlan?.plan?.features?.includes(featureName);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        userPlan,
        loadingProfile,
        hasActivePlan,
        hasFeature,
        refreshProfile: fetchOwnProfile,
        refreshPlan: fetchUserPlan,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

