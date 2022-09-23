import {
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  bottom: {
    bottom: "0%",
    // width: "70%",
    // left: "0%",
    // paddingBottom: 0
  },
  dice_container: {
    alignItems: "center",
    justifyContent: "center", //Centered horizontally
    alignItems: "center", //Centered vertically
    flex: 1,
    marginHorizontal: "1%",
    marginVertical: "50%",
    // borderWidth: 1,
  },
  square: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: windowWidth / 50,
  },
  // one: {
  //   width: 44,
  //   height: 44,
  //   borderRadius: 44 / 2,
  //   backgroundColor: "black",
  // },
  centered: {
    textAlign: "center",
    // margin: windowWidth / 2,
  },
  dice_text: {
    fontSize: windowWidth / 20,
  },

  modalContainer: {
    borderRadius: 10,
    padding: "5%",
    height: "50%",
    top: "25%",
    width: "70%",
    right: "-15%",
    backgroundColor: "white",
    borderWidth: 2,
    elevation: 30,
  },
});

export default styles;
