import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  /* 🔹 FETCH OWN PROFILE (ONCE) */
  const fetchOwnProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");

      if (!token || !user) {
        setLoadingProfile(false);
        return;
      }

      const parsedUser = JSON.parse(user);

      const res = await axios.get(
        `${API_URL}/profile/own-profile/${parsedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        setProfile(res.data.profile);

        // optional cache
        await AsyncStorage.setItem(
          "ownProfile",
          JSON.stringify(res.data.profile)
        );
      }
    } catch (error) {
      console.log(
        "OWN PROFILE ERROR 👉",
        error?.response?.data || error.message
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  /* 🔹 LOAD FROM CACHE FIRST */
  useEffect(() => {
    const loadCachedProfile = async () => {
      const cached = await AsyncStorage.getItem("ownProfile");
      if (cached) {
        setProfile(JSON.parse(cached));
        setLoadingProfile(false);
      }
      fetchOwnProfile(); // refresh in background
    };

    loadCachedProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        loadingProfile,
        refreshProfile: fetchOwnProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
