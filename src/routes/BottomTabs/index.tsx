import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { images } from "../../assets/images";
import HomeScreen from "../../screens/main/HomeScreen";
import SearchScreen from "../../screens/main/SearchScreen";
import MessageScreen from "../../screens/main/MessageScreen";
import ProfileScreen from "../../screens/main/ProfileScreen";
import { colors } from "../../utils/colors";
import SearchStack from "../SearchStack";
import AddStatus from "../../screens/main/AddStatus";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserData,
  setDisableBottomTab,
  setProfileActiveBar,
} from "../../redux/reducers/authReducer";
import NewMessage from "../../screens/main/NewMessage";
import { useNavigation } from "@react-navigation/native";

const BottomTab = ({}: any) => {
  const Bottom = createBottomTabNavigator();
  const isDisableTab = useSelector((state) => state.auth)?.disableBottomTab;

  const dispatch = useDispatch();

  const image = useSelector(getUserData)?.imageUrl;

  const navigation = useNavigation();

  // useEffect()

  return (
    <Bottom.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        animationEnabled: false,
        keyboardHidesTabBar: true,

        // tabBarColor: ({focused, size, color}) => {},
        // tabBarStyle:()=>{innerHeight:1000},
        tabBarStyle: {
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
          borderTopWidth: -1,
          display: isDisableTab ? "none" : "flex",
          // paddingTop: 8,
          height: 48,
          // display: route.name === "Home" ? "none" : "flex",
        },
        headerShown: false,
      })}
      // screenOptions= {{
      //   tabBarHideOnKeyboard: true,

      //   tabBarShowLabel: false,
      //   tabBarStyle: {
      //     backgroundColor: "black",
      //     justifyContent: "center",
      //     alignItems: "center",
      //     borderTopWidth: -1,
      //     paddingTop: 8,
      //     height: 55,
      //   },
      // }}
    >
      <Bottom.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  ...style?.itemStyle,
                }}
              >
                <Image
                  source={focused ? images.fillhome : images.home}
                  style={{
                    height: focused ? 27 : 20,
                    width: focused ? 27 : 20,
                  }}
                />
              </View>
            );
          },
        }}
      />

      <Bottom.Screen
        name="SearchStack"
        component={SearchStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  ...style?.itemStyle,

                  paddingTop: 22,
                }}
              >
                <Image
                  source={focused ? images.searchfill : images.search}
                  style={{ height: 22, width: 22 }}
                />
              </View>
            );
          },
        }}
      />
      <Bottom.Screen
        name="AddChat"
        // component={AddStatus}
        // component={ProfileScreen}
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  dispatch(setProfileActiveBar("Channel"));
                  navigation.navigate("AddChat"); // Navigate to the Profile screen

                  setTimeout(() => {
                    dispatch(setDisableBottomTab(true));
                  }, 500);
                }}
                style={{
                  ...style?.itemStyle,

                  paddingTop: 22,
                }}
              >
                <Image
                  source={focused ? images.add : images.add}
                  style={{ height: 20, width: 20 }}
                />
              </TouchableOpacity>
            );
          },
        }}
      />

      <Bottom.Screen
        name="MessageScreen"
        component={MessageScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  ...style?.itemStyle,

                  paddingTop: 22,
                }}
              >
                <View>
                  <Image
                    source={focused ? images.message : images.message}
                    style={{ height: 20, width: 20, tintColor: colors.white }}
                  />
                  {focused && (
                    <Image
                      source={images.fillmesssage}
                      style={{
                        height: 14,
                        width: 14,
                        position: "absolute",
                        left: 3,
                        top: 1,
                        tintColor: colors.white,
                      }}
                      resizeMode="contain"
                    />
                  )}
                </View>
              </View>
            );
          },
        }}
      />
      <Bottom.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  dispatch(setDisableBottomTab(false));

                  dispatch(setProfileActiveBar("Profile"));
                  navigation.navigate("Profile"); // Navigate to the Profile screen
                }}
                style={{
                  ...style?.itemStyle,

                  paddingTop: 22,
                }}
              >
                <Image
                  source={{ uri: image }}
                  style={{ height: 30, width: 30, borderRadius: 999 }}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
    </Bottom.Navigator>
  );
};
export default BottomTab;

const style = StyleSheet.create({
  itemStyle: {
    width: "100%",
    height: Platform.OS === "ios" ? 65 : 75,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 7,
  },
  text: {
    color: colors.white,
  },
});
