import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // alignContent: "center",
    justifyContent: "space-between",
  },
  bottom: {
    borderWidth: 1,
    // justifyContent: "flex-end",
  },
  center_aligned: {
    // justifyContent: "center",
    // alignContent: "center",
    // alignItems: "center"
  },
  dices: {
    flexDirection: "row",
    
  },

  horizontal: {
    flexDirection: "row",
  },
});

export default styles;
