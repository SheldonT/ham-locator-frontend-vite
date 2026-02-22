/** @format */

import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_DOMAIN } from "../constants";
import serverInstance from "../api/client";

export const UserContext = createContext({});

//const serverInstance = axios.create({ withCredentials: true });

function UserProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking, "0" = not authenticated, other = user ID
  const [authUserHome, setAuthUserHome] = useState({});
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const userSession = useCallback(async () => {
    try {
      console.log("Getting user id from server...");
      const response = await serverInstance.post(
        `/users/`
      );
      
      if (response.data.success === true) {
        console.log("User authenticated with ID:", response.data.data.user_id);
        setIsAuthenticated(response.data.data.user_id);
        
      // } else if (localStorage.getItem("sessionId")) {
      //   console.log("Session id found in local storage, but server did not validate. Removing session id...");
      //   setIsAuthenticated(0)
      //   // console.log("Getting session id from local storage...");
      //   // setIsAuthenticated(JSON.parse(localStorage.getItem("sessionId")).id);
      // 
      } else {
        console.log("User not authenticated.");
        setIsAuthenticated("0");
      }
    } catch (e) {
      if (e.response?.status === 401 || e.response?.status === 403) {
        console.log('Not authenticated');
        setIsAuthenticated("0");
      } else {
        console.error('Error checking session:', e);
        setIsAuthenticated("0");
      }
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    userSession();
  }, []);

  const authenticate = useCallback(async (userName, passwd) => {
    if (userName !== "" && passwd !== "") {
      try {
        const response = await serverInstance.post(`/users/`, {
          username: userName,
          passwd: passwd,
        });

        if (response.data) {
          console.log(response.data.data)
          setIsAuthenticated(response.data.data);
        }
      } catch (e) {
        if (e.response?.status === 401 || e.response?.status === 403) {
        console.log('Invalid credentials');
        setIsAuthenticated("-1"); // This triggers the error message in UI
      } else {
        console.error('Login error:', e);
      }
      }
    }
  }, []);

  const setHomeDataFromDB = useCallback(async () => {
    try {
      const response = await serverInstance.get(`/users/getuser/`, {
        params: { id: isAuthenticated },
      });

      const home = {
        call: response.data.data.callsign,
        country: response.data.data.country,
        gridloc: response.data.data.gridloc,
        itu: response.data.data.itu,
        anchor: [response.data.data.lat, response.data.data.lng],
        details: "",
        unit: response.data.data.units,
        utc: response.data.utc,
      };

      if (!response.data.success) {
        setIsAuthenticated("0");
        // localStorage.removeItem("sessionId");
      } else {

        console.log("Setting user home data from server...");
        setAuthUserHome(home);
      }
    } catch (e) {
      if (e.response?.status === 401 || e.response?.status === 403) {
        console.log('Session expired');
        setIsAuthenticated("0");
        setAuthUserHome({});
    } else {
      console.error('Error fetching user data:', e);
    }
    }
  }, [isAuthenticated]);

  const logoutUser = useCallback(async () => {
    try {
      const response = await serverInstance.post(`/users/logout/`, {});

      if (response.data.success === true) {
        setIsAuthenticated("0");
        setAuthUserHome({});
        // localStorage.removeItem("sessionId");
      }
    } catch (e) {
      console.log(e);
    }
  }, [isAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        authenticate,
        serverInstance,
        authUserHome,
        setHomeDataFromDB,
        logoutUser,
        isCheckingAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export {UserProvider};
