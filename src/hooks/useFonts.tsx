import * as Font from "expo-font";

export default async function useFonts() {
  await Font.loadAsync({
    "Epilogue-Regular": require("../../assets/fonts/Epilogue-Regular.ttf"),
    "Epilogue-Medium": require("../../assets/fonts/Epilogue-Medium.ttf"),
    "Epilogue-SemiBold": require("../../assets/fonts/Epilogue-SemiBold.ttf"),
    "Epilogue-Bold": require("../../assets/fonts/Epilogue-Bold.ttf"),
    "Epilogue-ExtraBold": require("../../assets/fonts/Epilogue-ExtraBold.ttf"),
    "Rubik-Regular": require("../../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-Medium": require("../../assets/fonts/Rubik-Medium.ttf"),
  });
}