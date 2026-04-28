import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import NewTradeWindowOverlay from "./NewTradeWindowOverlay";

const RESOURCE_NAMES = ["Wood", "Brick", "Sheep", "Wheat", "Ore"];

export default function TradeWindowOverlay({
  trades,
  playerNames,
  onClose,
  serverUrl,
  guid,
  playerNumber,
}) {
  const [showCreate, setShowCreate] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => pan.extractOffset(),
    }),
  ).current;

  const decodeABB = (val) => {
    if (val === 0) return null;
    const resId = Math.floor(val / 100);
    const amount = val % 100;
    return { name: RESOURCE_NAMES[resId], amount };
  };

  const getTradeIdString = (tradeArray) => {
    return `${tradeArray[0]}|${tradeArray[1]}|${tradeArray[2]}|${tradeArray[3]}`;
  };

  const handleAcceptTrade = async (idString) => {
    try {
      const moveData = JSON.stringify({
        PlayerID: playerNumber,
        tradeOfferIDString: idString,
      });

      const url = `${serverUrl}/processMove?guid=${guid}&moveType=10&moveDataJson=${encodeURIComponent(moveData)}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.success) {
        onClose();
      } else {
        console.warn("Trade failed:", json.error);
      }
    } catch (err) {
      console.error("Accept Trade Error:", err);
    }
  };

  return (
    <Animated.View style={[pan.getLayout(), styles.windowContainer]}>
      <View {...panResponder.panHandlers} style={styles.header}>
        <TouchableOpacity
          onPress={() => setShowCreate(true)}
          style={styles.newBtn}
        >
          <Text style={styles.newBtnText}>+ New</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Active Trades</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>X</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {trades.length > 0 ? (
          trades.map((tradeArray) => {
            const idString = getTradeIdString(tradeArray);
            const playerId = tradeArray[4];
            const offered = tradeArray.slice(5, 10);
            const requested = tradeArray.slice(10, 15);

            return (
              <View key={idString} style={styles.tradeRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tradeTitle}>
                    {playerNames[playerId] || `Player ${playerId}`}
                  </Text>
                  <Text style={styles.details}>
                    Offers:{" "}
                    {offered
                      .map((v) => decodeABB(v))
                      .filter(Boolean)
                      .map((o) => `${o.name} x${o.amount}`)
                      .join(", ")}
                  </Text>
                  <Text style={styles.details}>
                    Wants:{" "}
                    {requested
                      .map((v) => decodeABB(v))
                      .filter(Boolean)
                      .map((o) => `${o.name} x${o.amount}`)
                      .join(", ")}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleAcceptTrade(idString)}
                >
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text style={styles.noTrades}>No active trades</Text>
        )}
      </ScrollView>

      {showCreate && (
        <NewTradeWindowOverlay
          onClose={() => setShowCreate(false)}
          serverUrl={serverUrl}
          guid={guid}
          playerNumber={playerNumber}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  windowContainer: {
    position: "absolute",
    width: 800,
    backgroundColor: "#1a1a2e",
    borderWidth: 2,
    borderColor: "#972929",
    zIndex: 1000,
    elevation: 10,
  },
  header: {
    backgroundColor: "#972929",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "#090d18",
    fontWeight: "bold",
    fontFamily: "Jersey10",
    fontSize: 20,
  },
  newBtn: {
    backgroundColor: "#972929",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  newBtnText: { color: "#ffd000", fontSize: 14, fontWeight: "bold" },
  closeBtn: { padding: 5 },
  closeBtnText: { fontWeight: "bold", fontSize: 18 },
  content: { maxHeight: 300, padding: 5 },
  tradeRow: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    alignItems: "center",
  },
  acceptBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  acceptText: { color: "white", fontWeight: "bold" },
  details: { color: "#ccc", fontSize: 12, marginTop: 2 },
  tradeTitle: { color: "#ffd000", fontWeight: "bold", fontSize: 16 },
  noTrades: {
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});
