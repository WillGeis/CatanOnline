import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { usePlayer } from "./PlayerContext";

export default function HostWaitingScreen({ route, navigation }) {
  const { hostConfig } = route.params;
  const { targetServerUrl, ...restOfConfig } = hostConfig;
  const { setGuid, setServerUrl, setPlayerNumber } = usePlayer();
  const [status, setStatus] = useState("Starting server...");

  useEffect(() => {
    const pingServer = async () => {
      try {
        const res = await fetch(`${targetServerUrl}/host`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(restOfConfig),
        });

        console.log("HTTP status:", res.status);
        console.log("HTTP headers:", [...res.headers.entries()]);

        const rawText = await res.text();
        console.log("RAW RESPONSE BODY:", rawText);

        if (!res.ok) throw new Error("Server rejected host");

        let data;
        try {
          data = JSON.parse(rawText);
          console.log("PARSED JSON:", data);
        } catch (e) {
          console.error("JSON PARSE FAILED:", e);
          throw e;
        }

        setGuid(data.playerGUID);
        setServerUrl(data.serverIP);
        setPlayerNumber(0);

        setStatus("Server online. Waiting for players...");

        setTimeout(() => {
          navigation.replace("PlayerWaiting", {
            serverIP: data.serverIP,
            playerGUID: data.playerGUID,
          });
        }, 1500);
      } catch (err) {
        setStatus("Failed to start server");
        console.error(err);
      }
    };

    pingServer();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#e24b25" />
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d18",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  text: {
    color: "#e0e7ff",
    fontFamily: "Jersey10",
    fontSize: 18,
    marginTop: 20,
  },
});
