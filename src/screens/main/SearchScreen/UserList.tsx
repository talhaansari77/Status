import React, { useEffect, useState } from "react";
import {
  Alert,
  LogBox,
  StyleSheet,
  View,
  Text,
  Platform,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../../utils/colors";
import CustomText from "../../../components/CustomText";
import { Spacer } from "../../../components/Spacer";
import { appStyles } from "../../../utils/AppStyles";
import { images } from "../../../assets/images";
import { useNavigation } from "@react-navigation/native";
import { scale, verticalScale } from "react-native-size-matters";
export const windowWidth = Dimensions.get("window").width;
import FastImage from "react-native-fast-image";
import NewText from "../../../components/NewText";

const UserList = ({ item, name, image, onPress }: any) => {
  const navigation: any = useNavigation();
  // console.log("item?.distance", item?.distance);
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        style={{
          width: "32.8%",
          height: verticalScale(120),
          borderRadius: 10,
          marginBottom: 3,
          marginHorizontal: 1.5,
          overflow: "hidden",
        }}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          style={{ width: "100%", height: "100%" }}
          source={{
            uri: image,
            headers: { Authorization: "someAuthToken" },
            priority: FastImage.priority.high,
          }}
        />
        {item?.isOnline && (
          <View
            style={{
              width: scale(8),
              height: scale(8),
              borderRadius: 999,
              backgroundColor: colors.green,
              position: "absolute",
              top: 10,
              left: 10,
            }}
          ></View>
        )}

        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            paddingBottom: verticalScale(2),
            justifyContent: "flex-end",
          }}
        >
          {item?.distance>=0 && (
            <View
              style={{
                ...appStyles.row,
                marginLeft: -5,
                marginBottom: verticalScale(-1),
                paddingHorizontal: scale(10),
              }}
            >
              <Image
                style={{ width: 15, height: 15 }}
                source={images.location}
              />

              <CustomText text={item?.distance} color={colors.white} />
            </View>
          )}

          <View style={{ ...appStyles.row, paddingHorizontal: scale(10) }}>
            <Image
              style={{ width: 15, height: 15 }}
              resizeMode="contain"
              source={images.users}
            />

            <CustomText
              text={item?.followers_count}
              fontFam="Poppins-Medium"
              color={colors.white}
              style={{ marginLeft: 5, paddingTop: 4 }}
            />
          </View>

          <View style={{ height: 17 }}>

          <View
              style={{
                position: "absolute",
                width: "100%",
                height: 23,
                backgroundColor: `rgba(0, 0, 0, 0.4)`, // Apply opacity to the background color
                opacity: 0.4,
              }}
            />
            <NewText
              fontFam="Poppins-Bold"
              fontWeight="bold"
              text={name}
              numberOfLines={1}
              size={11.5}
              style={{ marginLeft: 10 }}
              color={colors.white}
            />
           
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default UserList;
