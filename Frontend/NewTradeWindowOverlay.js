import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const RESOURCE_NAMES = ["Wood", "Brick", "Sheep", "Wheat", "Ore"];

export default function NewTradeWindowOverlay({
  onClose,
  serverUrl,
  guid,
  playerNumber,
}) {
  const [offered, setOffered] = useState([0, 0, 0, 0, 0]);
  const [requested, setRequested] = useState([0, 0, 0, 0, 0]);

  const increment = (type, index) => {
    if (type === "offered") {
      let newArr = [...offered];
      newArr[index]++;
      setOffered(newArr);
    } else {
      let newArr = [...requested];
      newArr[index]++;
      setRequested(newArr);
    }
  };

  const submitTrade = async () => {
    // Convert to ABB format: (Index * 100) + Amount
    const encode = (arr) =>
      arr.map((amt, idx) => (amt > 0 ? idx * 100 + amt : 0));

    const moveData = JSON.stringify({
      PlayerID: playerNumber,
      offeredResources: encode(offered),
      requestedResources: encode(requested),
    });

    try {
      const url = `${serverUrl}/processMove?guid=${guid}&moveType=9&moveDataJson=${encodeURIComponent(moveData)}`;
      await fetch(url);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const ResourceItem = ({ name, count, onAdd }) => (
    <View style={styles.resItem}>
      <Text style={styles.resText}>
        {name} + {count}
      </Text>
      <TouchableOpacity onPress={onAdd} style={styles.plusBtn}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.fullOverlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Trade</Text>
        <View style={styles.columns}>
          <View style={styles.col}>
            <Text style={styles.colHeader}>You Give</Text>
            {RESOURCE_NAMES.map((n, i) => (
              <ResourceItem
                key={i}
                name={n}
                count={offered[i]}
                onAdd={() => increment("offered", i)}
              />
            ))}
          </View>
          <View style={styles.col}>
            <Text style={styles.colHeader}>You Get</Text>
            {RESOURCE_NAMES.map((n, i) => (
              <ResourceItem
                key={i}
                name={n}
                count={requested[i]}
                onAdd={() => increment("requested", i)}
              />
            ))}
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={submitTrade} style={styles.submit}>
            <Text style={{ color: "white" }}>Post Trade</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  container: {
    width: "90%",
    backgroundColor: "#1a1a2e",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ffd000",
  },
  title: {
    color: "#ffd000",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "Jersey10",
  },
  columns: { flexDirection: "row", justifyContent: "space-between" },
  col: { width: "48%" },
  colHeader: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ffd000",
  },
  resItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  resText: { color: "#ccc", fontSize: 14 },
  plusBtn: {
    backgroundColor: "#ffd000",
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: { fontWeight: "bold", fontSize: 18 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  submit: { backgroundColor: "#28a745", padding: 10 },
  cancel: { backgroundColor: "#ccc", padding: 10 },
});
