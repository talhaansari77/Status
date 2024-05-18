import { BlurView, VibrancyView } from "@react-native-community/blur";
import React from "react";
import {
  ScrollView,
  Text,
  useWindowDimensions,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import Modal from "react-native-modal";
import { scale, verticalScale } from "react-native-size-matters";
import CustomText from "../CustomText";
import { images } from "../../assets/images";
import { colors } from "../../utils/colors";
import { appStyles } from "../../utils/AppStyles";
import CustomLine from "../CustomLine";
import { Spacer } from "../Spacer";
import NewText from "../NewText";
import moment from "moment";

interface Props {
  isModalVisible?: boolean;
  setModalVisible?: any;
  justifyContent?: any;
  imageData?: any;
  createPost?: any;
  sendMessage?: any;
  setState?: any;
  state?: any;
  msg?: any;
  setMsg?: any;
  message?: any;
  loading?: any;
  imageObject?: object;
}
const ImageViewModal: React.FC<Props> = ({
  isModalVisible,
  setModalVisible,
  justifyContent,
  imageData,
  imageObject,
  createPost,
  sendMessage,
  setState,
  state,
  msg,
  setMsg,
  message,
  loading,
}) => {
  console.log("imageData", imageData);
  const windowWidth = useWindowDimensions().width;
  const createdAtDate = moment(imageObject.time);
const currentDate = moment();

// Check if the created_at date is today
const isToday = createdAtDate.isSame(currentDate, 'day');

// Format the date differently based on whether it's today or not
const formattedDate = isToday
  ? 'Today at ' + createdAtDate.format('hh:mm A')
  : createdAtDate.format('MMM D [at] hh:mm A');

  return (
    <Modal
      style={{
        ...styles.modalContainer,
        justifyContent: justifyContent || "flex-start",
      }}
      deviceWidth={windowWidth}
      isVisible={isModalVisible}
      onBackButtonPress={() => setModalVisible?.(false)}
      onBackdropPress={() => setModalVisible?.(false)}
      backdropColor="transparent"
      customBackdrop={
        <Pressable
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: colors.black300,
          }}
          onPress={() => {
            setModalVisible?.(false);
          }}
        ></Pressable>
      }
    >
      <View
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={{
          width: "101%",
          height: "100%",
          backgroundColor: "#0B0B0B",
         
        }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: scale(20),
              paddingVertical: verticalScale(5),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={()=>{
                setModalVisible?.(false);


              }}
              style={{
                width: scale(30),
                height: scale(30),
                // alignItems:"center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: 999,
                }}
                source={images.back}
              />
            </TouchableOpacity>

            <View
              style={{
                marginHorizontal: scale(7),
                paddingBottom: verticalScale(5),
                width: windowWidth / 2.5,
              }}
            >
              <NewText
                color={colors.white}
                size={18}
                numberOfLines={1}
                style={{ marginTop: verticalScale(5) }}
                text={imageObject.name}
              />
              <NewText
                color={colors.white}
                size={14}
                style={{ marginTop: verticalScale(-3) }}
                text={formattedDate}
              />
            </View>
          </View>
        </View>
        <View style={{ width: "100%", height: "75%" }}>
          <Image
            style={{
              width: "100%",
              height: "100%",
            
            }}
            resizeMode="cover"
            source={{ uri: imageObject?.uri }}
          />

          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: `rgba(0, 0, 0, 0.4)`, // Apply opacity to the background color
              opacity: 0.5,
            }}
          />
        </View>

        <View></View>

     <View
          style={{
            // flexDirection: "row",
            // alignItems: "center",
            justifyContent: "space-between",
            // height:"25%",
            width:windowWidth,
            paddingTop: "12%",
            paddingHorizontal:15
          }}
        >
             <NewText
                color={colors.white}
                size={15}
                numberOfLines={3}
                // style={{ textAlign:"center" }}
                text={imageObject.description}
              />
         
        </View> 
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 0,
    backgroundColor: colors.black300,
  },
  imgContainer: {
    width: scale(25),
    height: scale(30),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ImageViewModal;