import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api";

const ProfileContext = createContext();
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ✅ Logout pe call
  const resetProfileState = () => {
    setProfile(null);
    setProfiles(null);
    setUserPlan(null);
    setLoadingProfile(false);
  };

  const fetchOwnProfile = async (userId, token) => {
    try {
      if (!userId || !token) return;

      const res = await axios.get(`${API_URL}/profile/own-profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setProfile(res.data.profile);
        setProfiles(res.data.profile);

        // ✅ user-wise cache
        await AsyncStorage.setItem(
          `ownProfile_${userId}`,
          JSON.stringify(res.data.profile)
        );
      }
    } catch (e) {
      console.log("OWN PROFILE ERROR", e?.response?.data || e?.message);
    }
  };

  const fetchUserPlan = async (userId, token) => {
    try {
      if (!userId || !token) return;

      const res = await axios.get(`${API_URL}/plan/my-plan`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setUserPlan(res.data.userPlan);

        // ✅ user-wise cache (IMPORTANT)
        await AsyncStorage.setItem(
          `userPlan_${userId}`,
          JSON.stringify(res.data.userPlan)
        );
      } else {
        setUserPlan(null);
      }
    } catch (e) {
      setUserPlan(null);
    }
  };

  // ✅ KEY FUNCTION: login ke baad bhi yahi call hoga
  const bootstrap = async () => {
    try {
      setLoadingProfile(true);

      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user"); 

      if (!token || !userStr) {
        resetProfileState();
        return;
      }

      // ✅ set axios default auth (optional but useful)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const parsedUser = JSON.parse(userStr);
      const userId = parsedUser?._id;

      if (!userId) {
        resetProfileState();
        return;
      }

      // ✅ load user-wise cached profile
      const cachedProfile = await AsyncStorage.getItem(`ownProfile_${userId}`);
      setProfile(cachedProfile ? JSON.parse(cachedProfile) : null);

      // ✅ load user-wise cached plan
      const cachedPlan = await AsyncStorage.getItem(`userPlan_${userId}`);
      setUserPlan(cachedPlan ? JSON.parse(cachedPlan) : null);

      setLoadingProfile(false);

      // ✅ background fresh fetch
      fetchOwnProfile(userId, token);
      fetchUserPlan(userId, token);
    } catch (e) {
      resetProfileState();
    }
  };

  // ✅ app start
  useEffect(() => {
    bootstrap();
  }, []);

  const hasActivePlan =
    userPlan?.status === "active" && new Date(userPlan?.endDate) > new Date();

  const hasFeature = (featureName) =>
    hasActivePlan && userPlan?.plan?.features?.includes(featureName);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        profiles,
        userPlan,
        loadingProfile,
        hasActivePlan,
        hasFeature,
        bootstrap,          // ✅ login ke baad call
        resetProfileState,  // ✅ logout pe call
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
