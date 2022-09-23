import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const small_font_size = 14;
const medium_font_size = 18;
const large_font_size = 24;

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // alignContent: "center",
    // height: "100%",
    // top: "0%",
    // width: "100%",
    // right: "0%",
  },
  bottom: {
    borderWidth: 1,
    bottom: 0,
    justifyContent: "flex-end",
  },
  center_aligned: {
    // justifyContent: "center",
    // alignContent: "center",
    // alignItems: "center"
  },
  dices: {
    flexDirection: "row",
  },
  dices_container: {
    margin: "2%",
  },
  flex: {
    flex: 1,
  },
  horizontal: {
    flexDirection: "row",
  },
  normal_text: {
    fontSize: medium_font_size,
  },
  player_container: {
    borderWidth: 1,
    padding: "1%",
  },
  bold: { fontWeight: "bold", fontSize: medium_font_size },

  h1: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  normal_text: {
    fontSize: 18,
  },
  menu: {
    // flex: 1,
    // borderRadius: 10,
    height: "80%",
    top: "10%",
    width: "50%",
    right: "-25%",
    justifyContent: "space-evenly",
    alignContent: "center",
  },

  menu_button: {
    borderRadius: 100,
  },
});

export default styles;
