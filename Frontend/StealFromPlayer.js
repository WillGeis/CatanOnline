import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

export default function StealFromPlayer({
  victims,
  playerNames,
  onSelect,
  playerNumber,
}) {
  const validVictims = victims.filter((id) => id !== -1);

  return (
    <Modal transparent visible={validVictims.length > 0} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.window}>
          <Text style={styles.header}>Steal From:</Text>
          {validVictims.map((victimId) => (
            <TouchableOpacity
              key={victimId}
              style={styles.button}
              onPress={() => onSelect(victimId)}
            >
              <Text style={styles.buttonText}>
                {playerNames[victimId] || `Player ${victimId}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  window: {
    backgroundColor: "#2c3e50",
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ffd000",
    width: 250,
  },
  header: {
    color: "#ffd000",
    fontSize: 24,
    fontFamily: "Jersey10",
    textAlign: "center",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#972929",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
