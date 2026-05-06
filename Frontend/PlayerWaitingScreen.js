import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePlayer } from "./PlayerContext";
import useGameHub from "./useGameHub";

//const API_BASE = "http://localhost:5082";

export default function PlayerWaitingScreen({ route, navigation }) {
  const { guid, isHost, setGuid, setServerUrl, setPlayerNumber } = usePlayer();
  const [serverIP, setServerIP] = useState("Loading...............");
  const [players, setPlayers] = useState([]);

  const { serverUrl: contextUrl } = usePlayer();
  const serverUrl = route.params?.serverIP ?? contextUrl;
  const playerGUID = route.params?.playerGUID ?? guid;

  const startingRef = useRef(false);

  console.log("[DEBUG] PlayerWaitingScreen render | isHost =", isHost);

  const { connected } = useGameHub(
    serverUrl,
    playerGUID,
    (gameState) => {
      navigation.replace("Game", { gameState, serverIP: serverUrl });
    },
    async () => {
      try {
        const res = await fetch(`${serverUrl}/players`);
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error("[ERROR] fetch players failed:", err);
      }
    },
  );

  const handleLeaveGame = async () => {
    Alert.alert("Leave Game", "Are you sure you want to disconnect?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(["playerGuid", "lastServerUrl"]);
            setGuid(null);
            setServerUrl(null);
            setPlayerNumber(null);

            navigation.reset({
              index: 0,
              routes: [{ name: "Start" }],
            });
          } catch (err) {
            console.error("Error leaving game:", err);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchServerIP = async () => {
      try {
        const res = await fetch(`${serverUrl}/server-info`);
        const data = await res.json();
        if (isMounted) {
          if (data.ready && data.serverIP) {
            setServerIP(data.serverIP);
          } else {
            setTimeout(fetchServerIP, 2000);
          }
        }
      } catch (err) {
        if (isMounted) {
          setServerIP("[ERROR] retrying...");
          setTimeout(fetchServerIP, 2000);
        }
      }
    };

    const fetchPlayers = async () => {
      try {
        const res = await fetch(`${serverUrl}/server-info`);
        const data = await res.json();
        if (isMounted) setPlayers(data);
      } catch (err) {
        console.error("[ERROR] fetch players failed:", err);
      }
    };

    fetchServerIP();
    fetchPlayers();

    return () => {
      isMounted = false;
    };
  }, [serverUrl]);

  const copyToClipboard = () => {
    console.log("[DEBUG] Copy IP:", serverIP);
    try {
      navigator.clipboard.writeText(serverIP);
      Alert.alert("Copied to clipboard!", serverIP);
    } catch {
      Alert.alert("Clipboard not supported...");
    }
  };

  const handleStartGame = async () => {
    console.log("[DEBUG] Go button pressed!");
    console.log("[DEBUG] Host GUID:", guid);

    if (startingRef.current) return;
    startingRef.current = true;

    try {
      const res = await fetch(`${API_BASE}/startGame`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      console.log("[DEBUG] startGame HTTP status:", res.status);

      const data = await res.json();
      console.log("[DEBUG] startGame response:", data);

      if (!data.success) {
        Alert.alert(
          "[ERROR] Failed to start game",
          data.message || "[ERROR] Unknown error",
        );
        startingRef.current = false;
      } else {
        navigation.replace("Loading");
      }
    } catch (err) {
      startingRef.current = false;
      Alert.alert("[ERROR] startGame request failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hubStatus}>
        <View
          style={[
            styles.hubDot,
            { backgroundColor: connected ? "#00ff99" : "#e24b25" },
          ]}
        />
        <Text style={styles.hubText}>
          {connected ? "Live" : "Connecting..."}
        </Text>
      </View>

      <Pressable style={styles.leaveBox} onPress={handleLeaveGame}>
        <Text style={styles.leaveText}>Exit</Text>
      </Pressable>

      <Text style={styles.title}>Players Connected:</Text>

      <View style={styles.playerList}>
        {players.map((p, i) => (
          <Text key={p.guid} style={styles.player}>
            Player {i + 1}: {p.username}
            {i === 0 ? " (Host)" : ""}
          </Text>
        ))}
      </View>

      <Text style={styles.status}>
        {players.length < 2 ? "Waiting for more players..." : "Ready to start!"}
      </Text>

      {isHost && (
        <Pressable
          onPress={handleStartGame}
          style={[styles.startButton, !connected && styles.startButtonDisabled]}
          disabled={!connected}
        >
          <Text style={styles.buttonText}>Go</Text>
        </Pressable>
      )}

      <Pressable style={styles.ipBox} onPress={copyToClipboard}>
        <Text style={styles.ipText}>{serverIP}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d18", padding: 40 },
  title: {
    fontSize: 20,
    color: "#e0e7ff",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Jersey10",
  },
  playerList: { marginTop: 20 },
  player: {
    fontSize: 40,
    color: "#00ff99",
    marginBottom: 10,
    fontFamily: "Jersey10",
  },
  status: {
    marginTop: 40,
    color: "#aaa",
    textAlign: "center",
    fontFamily: "Jersey10",
    fontSize: 30,
  },
  startButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 30,
    alignSelf: "center",
    backgroundColor: "lime",
  },
  buttonText: {
    color: "#000",
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "Jersey10",
  },
  leaveBox: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "#1e1e2f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e24b25",
  },
  leaveText: {
    color: "#e24b25",
    fontWeight: "bold",
    fontFamily: "Jersey10",
    fontSize: 20,
  },
  ipBox: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#1e1e2f",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#00ff99",
  },
  ipBox: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#1e1e2f",
    fontFamily: "Jersey10",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#00ff99",
  },
  ipText: {
    color: "#00ff99",
    fontWeight: "bold",
    fontFamily: "Jersey10",
    fontSize: 30,
  },
  hubStatus: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  hubDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  hubText: { color: "#94a3b8", fontFamily: "Jersey10", fontSize: 16 },
});
