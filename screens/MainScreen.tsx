import { StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import Weather from "../components/Weather";
import { RootTabScreenProps } from "../types";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"Main">) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current weather at:</Text>
      <Weather />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    overflow: "scroll",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
