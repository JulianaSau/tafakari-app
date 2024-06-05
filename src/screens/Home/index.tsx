import * as React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Text,
} from "react-native";
import { Image } from "expo-image";
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import SectionGreetings from "./SectionGreetings";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import axios from "axios";
// import { API_URL } from "../../app/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getTimeOfDay } from "@/lib/utils";
import useColors from "@/hooks/useColors";
import Indicator from "@/components/Indicator";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/constants/Config";
import { ImageBackground } from 'react-native';

export const API_URL = "https://tafakari-7d6ea5b42c18.herokuapp.com/";

const HomeScreen = () => {
  const [canClick, setCanClick] = useState(true);
  const [lastClickedDate, setLastClickedDate] = useState(null);
  const navigation = useNavigation();

  const checkCanClick = async () => {
    try {
      const lastDate = await AsyncStorage.getItem("@LastClickedDate");
      if (lastDate) {
        const today = new Date().toDateString();
        if (lastDate === today) {
          setCanClick(false);
        } else {
          setCanClick(true);
        }
      }
    } catch (error) {
      console.error("Error reading data from AsyncStorage:", error);
    }
  };

  const handleFeelingClick = async (index) => {
    if (canClick) {
      const registeredFeeling = feelings[index].name;

      try {
        const response = await axios.post(`${API_URL}feelings`, {
          emotion: registeredFeeling,
        });
        const status = response.status;
        if (status === 201) {
          try {
            const today = new Date().toDateString();
            await AsyncStorage.setItem("@LastClickedDate", today);
            // @ts-ignore
            setLastClickedDate(today);
            setCanClick(false);
          } catch (error) {
            console.error("Error storing data in AsyncStorage:", error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [userName, setUserName] = useState("Jane Doe");
  useEffect(() => {
    const getUser = async () => {
      const user = await axios.get(`${API_URL}users/users/me/`);
      setUserName(user.data.fullname ?? "Jane Doe");
    };
    checkCanClick();
    getUser();
  }, []);

  const feelings = [
    { name: "Happy", icon: "smile", color: "#FFC107" },
    { name: "Sad", icon: "frown", color: "#2196F3" },
    { name: "Excited", icon: "heart", color: "#E91E63" },
    { name: "Angry", icon: "user-x", color: "#F44336" },
    { name: "Anxious", icon: "wind", color: "#FF9800" },
    { name: "Depressed", icon: "x-circle", color: "#9C27B0" },
    { name: "Stressed", icon: "zap-off", color: "#4CAF50" },
  ];

  // function to get the greetings in the day
  const greeting = getTimeOfDay();
  const colors = useColors();
  const calendarNavigation = useCalendarNavigation();
  const onPressDay = React.useCallback(
    (date: string) => {
      calendarNavigation.openDay(date);
    },
    [navigation, calendarNavigation]
  );
  return (
    <View style={{flex: 1}}>
      <ImageBackground source={require('../../../assets/ankara.png')} style={{width: '100%', height: 55}} resizeMode="cover">
        <View style={{height: '100%', marginTop: -20, paddingTop: 20}}>
          <StatusBar barStyle="dark-content" />
          <SectionGreetings />
        </View>
      </ImageBackground>

      <ScrollView
        // className="mt-3 mx-4 mb-16"
        style={{
          marginTop: 3,
          marginHorizontal: 16,
          marginBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greetings section */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 25,
            marginBottom: 5,
            padding: 10,
          }}
          // className="flex mt-3 flex-row mb-3"
        >
          <Text
            //   className="text-2xl font-bold text-[#371B34]"
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: colors.textSecondary,
            }}
          >
            <Text
              // className="font-medium"
              style={{
                fontWeight: "400",
                color: colors.text,
              }}
            >
              {greeting},{" "}
            </Text>{" "}
            {"\n"}
            {userName?.slice(0, 8)}!
          </Text>
        </View>

        {/* Self Conqueror and feelings section */}

        {canClick && (
          <View style={styles.container}>
            <Text style={{ ...styles.heading, color: colors.text }}>
              How are you feeling today?
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.scrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {feelings?.map((feeling, index) => (
                <View
                  key={index}
                  //   className="flex align-middle"
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    // alignContent: "center"
                  }}
                >
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.feelingBox,
                      { backgroundColor: feeling.color },
                    ]}
                    disabled={!canClick}
                    onPress={() => {
                      // handleFeelingClick(index)
                      // Get today's date
                      const today = dayjs();

                      // Format today's date using DATE_FORMAT constant
                      const formattedDate = today.format(DATE_FORMAT);
                      onPressDay(formattedDate);
                    }}
                  >
                    <Feather
                    // @ts-ignore
                      name={feeling.icon}
                      size={30}
                      style={{ padding: 10 }}
                      color="white"
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: "normal",
                      fontSize: 12,
                      marginRight: 25,
                      marginTop: 10,
                    }}
                    // className="text-[#828282] font-semibold text-[12px] ml-4"
                  >
                    {feeling.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={[styles.rectangleGroup, styles.groupLayout]}>
          <View style={[styles.rectangle1, styles.rectangleLayout]} />
          <Image
            style={[styles.maskGroupIcon, styles.maskGroupIconPosition]}
            contentFit="cover"
            source={require("../../../assets/mask-group2.png")}
          />
          <View style={styles.peerGroupMeetup}>
            <Text style={[styles.journal, styles.startClr]}>Journal</Text>
            <Text style={[styles.getBackChat, styles.startClr]}>
              Get back chat access and session credits
            </Text>
            <View style={[styles.watchNow, styles.watchLayout]}>
              <View style={[styles.watchNowChild, styles.watchLayout]} />
              <Text
                onPress={() => navigation.navigate("Calendar")}
                style={[styles.start, styles.startClr]}
              >
                Start
              </Text>
              <Feather
                    // @ts-ignore
                      name={"arrow-right"}
                      size={16}
                      style={{ padding: 10, marginLeft: 30, marginTop:3  }}
                      color="white"
                    />
            
            </View>
          </View>
          <Image
            style={[styles.meditationIcon, styles.iconPosition]}
            contentFit="cover"
            source={require("../../../assets/meditation-icon.png")}
          />
        </View>
        <View
          // className="flex mt-9 flex-row justify-around items-center"
          style={{
            marginHorizontal: 8,
            marginBottom: 20,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Calendar")}
            // className="flex  px-9 py-4 rounded-3xl  flex-row items-center justify-between bg-[#F4F3F1]"
            style={{
              backgroundColor: "#F4F3F1",
              // opacity:.2, //for dark mode
              padding: 25,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              width: "50%",
              marginRight: 30,
            }}
          >
            <Ionicons name="journal" size={24} color={colors.textSecondary} />
            <Text
              // className="ml-2 text-[#573926] text-[14px]"
              style={{
                marginLeft: 8,
                // color: "#573926",
                fontSize: 16,
                color: colors.textSecondary,
                fontWeight: "bold",
              }}
            >
              {" "}
              Journal{" "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Calendar")}
            // className="flex  px-9 py-4 rounded-3xl  flex-row items-center justify-between bg-[#F4F3F1]"
            style={{
              backgroundColor: "#F4F3F1",
              // opacity:.2, //for dark mode
              padding: 25,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "50%",
            }}
          >
            <Ionicons name="people" size={24} color={colors.textSecondary} />
            <Text
              // className="ml-2 text-[#573926] text-[14px]"
              style={{
                // marginLeft: 8,
                // color: "#573926",
                fontSize: 16,
                color: colors.textSecondary,
                fontWeight: "bold",
              }}
            >
              Community
            </Text>
          </TouchableOpacity>
        </View>

        <View
          // className="bg-[#F8F6F6] px-8 py-5"
          style={{
            backgroundColor: "#F8F6F6",
            // opacity:.1, //for dark mode
            padding: 20,
            borderRadius: 20
          }}
        >
          <Text
            //   className="text-[#707070] text-[14px]"
            style={{
              color: "#707070",
              fontSize: 18,
            }}
          >
            “It is better to conquer yourself than to win a thousand battles”
          </Text>
        </View>

        {/* last container  */}

        <View
          // className="mt-5 py-5 flex flex-row bg-[#FEF3E7] rounded-xl justify-between items-center"
          style={{
            marginTop: 20,
            padding: 20,
            backgroundColor: "#FEF3E7",
            // opacity:.1, //for dark mode
            borderRadius: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            //   className="flex mt-4 px-4"
            style={{
              marginTop: 4,
              paddingHorizontal: 10,
            }}
          >
            <Text
              // className="text-[22px] mb-3 font-bold text-[#573926]"
              style={{
                fontSize: 22,
                marginBottom: 12,
                fontWeight: "bold",
                color: "#573926",
                // color: "white" //for dark mode
              }}
            >
              Library
            </Text>
            <Text
              //   className="text-md mb-3 font-[12px] text-[#371B34]"
              style={{
                fontSize: 12,
                color: "#371B34",
                marginBottom: 12,
              }}
            >
              Let’s open up to the things that {"\n"}matter the most
            </Text>

            <TouchableOpacity
            onPress={() => navigation.navigate("Calendar")}
            // className="flex  px-9 py-4 rounded-3xl  flex-row items-center justify-between bg-[#F4F3F1]"
            style={{
              backgroundColor: "#F4F3F1",
              // opacity:.2, //for dark mode
              padding: 20,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              
            }}
          >
            <Ionicons name="construct" size={24} color={"#FE8235"} />
            <Text
              // className="ml-2 text-[#573926] text-[14px]"
              style={{
                // marginLeft: 8,
                // color: "#573926",
                fontSize: 16,
                color: colors.textSecondary,
                fontWeight: "bold",
              }}
            >
              Coming Soon
            </Text>
          </TouchableOpacity>

            {/* <Indicator
              colorName="orange"
              style={{
                // marginLeft: 8,
                width: 100,
              }}
            >
              Coming Soon
            </Indicator> */}

            {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  // className="text-[#FE8235] font-bold"
                  style={{
                    color: "#FE8235",
                    fontWeight: "bold",
                  }}
                >
                  Access{" "}
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={24}
                  color="#FE8235"
                />
              </View> */}
            {/* </TouchableOpacity> */}
          </View>
          <Feather
                    // @ts-ignore
                      name={"package"}
                      size={50}
                      style={{ padding: 10, marginLeft: 30, marginTop:3  }}
                      color={colors.textSecondary}
                    />
        </View>
      </ScrollView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: "normal",
    // color: "#371B34",
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  feelingBox: {
    marginRight: 24,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  feelingText: {
    textAlign: "center",
    color: "white",
    marginTop: 5,
    fontWeight: "bold",
  },
  frameScrollViewContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  rectangleLayout: {
    borderRadius: Border.br_xl,
    left: 0,
    top: 0,
    height: 161,
    width: "100%",
    position: "absolute",
  },
  maskGroupIconPosition: {
    right: 0,
    top: 10,
    position: "absolute",
  },
  libraryClr: {
    color: Color.dimgray_200,
    textAlign: "left",
  },
  letsOpenUpTypo: {
    opacity: 0.9,
    fontFamily: FontFamily.rubikRegular,
    lineHeight: 18,
    fontSize: FontSize.size_xs,
    marginTop: 8,
  },
  watchLayout: {
    height: 39,
    width: 138,
  },
  startTypo: {
    fontFamily: FontFamily.epilogueBold,
    fontWeight: "700",
    lineHeight: 32,
    fontSize: FontSize.size_base,
    top: 4,
    left: 0,
    position: "absolute",
  },
  evaarrowIconLayout: {
    height: 16,
    width: 16,
    position: "absolute",
    overflow: "hidden",
  },
  iconPosition: {
    right: 30,
    bottom:5,
    position: "absolute",
    overflow: "hidden",
  },
  groupLayout: {
    height: 180,
    width: "100%",
  },
  startClr: {
    color: Color.white,
    textAlign: "left",
  },
  shadow: {
    top: 474,
    left: 38,
    borderRadius: Border.br_146xl,
    backgroundColor: Color.iris100,
    width: 298,
    height: 23,
    display: "none",
    position: "absolute",
  },
  rectangle: {
    backgroundColor: Color.linen,
  },
  maskGroupIcon: {
    height: 151,
    width: 325,
  },
  library: {
    textAlign: "left",
    fontFamily: FontFamily.epilogueExtraBold,
    fontWeight: "800",
    fontSize: FontSize.size_3xl,
  },
  letsOpenUp: {
    marginTop: 8,
    textAlign: "left",
    color: Color.dimgray_200,
    width: 199,
  },
  watchNowChild: {
    borderRadius: Border.br_3xs,
    left: 0,
    top: 0,
    position: "absolute",
  },
  access: {
    color: Color.chocolate,
    textAlign: "left",
  },
  evaarrowBackFillIcon: {
    top: 10,
    left: 84,
  },
  watchNow: {
    marginTop: 8,
  },
  peerGroupMeetup: {
    top: 23,
    left: 20,
    width: 199,
    position: "absolute",
  },
  meetupIcon: {
    top: 36,
    width: 85,
    height: 80,
  },
  rectangle1: {
    backgroundColor: "#53a06e",
    // opacity:.2, //for dark mode
  },
  journal: {
    fontFamily: FontFamily.epilogueExtraBold,
    fontWeight: "800",
    fontSize: FontSize.size_3xl,
  },
  getBackChat: {
    width: 169,
    marginTop: 8,
    opacity: 0.9,
    fontFamily: FontFamily.rubikRegular,
    lineHeight: 18,
    fontSize: FontSize.size_xs,
  },
  start: {
    fontFamily: FontFamily.epilogueBold,
    fontWeight: "700",
    lineHeight: 32,
    fontSize: FontSize.size_base,
    top: 4,
    left: 0,
    position: "absolute",
  },
  evaarrowBackFillIcon1: {
    top: 11,
    left: 83,
  },
  meditationIcon: {
    top: 44,
    width: 80,
    height: 62,
  },
  rectangleGroup: {
    marginTop: 26,
  },
  groupParent: {
    top: 354,
    left: 27,
    position: "absolute",
    flex: 1,
  },
  home: {
    backgroundColor: Color.gray_100,
    width: "100%",
    height: 968,
    overflow: "hidden",
    flex: 1,
  },
});

export default HomeScreen;
