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
export const windowWidth = Dimensions.get("window").width;

const UserList = ({ item }: any) => {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          width: "32.8%",
          height: 140,
          borderRadius: 10,
          marginBottom: 3,
          marginHorizontal: 1.5,
          overflow: "hidden",
        }}>
        <Image style={{ width: "100%", height: "100%" }} source={item.img} />
        {item.online && (
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: colors.green,
              position: "absolute",
              top: 10,
              left: 10,
            }}></View>
        )}

        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            padding: 10,
            justifyContent: "flex-end",
          }}>
              {
                  item.nearby&&(
                    <View style={{...appStyles.row,marginLeft:-5,marginBottom:5}}>
                    <Image style={{ width: 15, height: 15 }} source={images.location} />
      
                    <CustomText text={item.nearby} color={colors.white} 
                              />
      
                    </View>

                  )
              }
               {
                  item.popular&&(
                    <View style={{...appStyles.row,marginBottom:5}}>
                    <Image style={{ width: 15, height: 15 }} 
                    resizeMode="contain"
                    source={images.users} />
      
                    <CustomText text={item.popular} color={colors.white} 
                    style={{marginLeft:5}}
                              />
      
                    </View>

                  )
              }
             
                       

          <CustomText text={item.name} color={colors.white} />

        </View>
      </TouchableOpacity>
    </>
  );
};

export default UserList;
