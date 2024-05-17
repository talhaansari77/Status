import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { appStyles } from "../../../utils/AppStyles";
import { colors } from "../../../utils/colors";
import CustomText from "../../../components/CustomText";
import { images } from "../../../assets/images";
import { useNavigation, useRoute } from "@react-navigation/native";
import ImagePicker from "react-native-image-crop-picker";
import { messages, messagesList } from "../../../utils/Data";
import MessagesComponent from "../../../components/MessageComponent";
import { scale, verticalScale } from "react-native-size-matters";
import { Spacer } from "../../../components/Spacer";
import MessageSender from "../../../components/MessageSender";
import { SearchUserName } from "../../../api/ApiServices";
import { StorageServices, TOKEN } from "../../../utils/hooks/StorageServices";
import { useSelector } from "react-redux";
import { getUserData } from "../../../redux/reducers/authReducer";
import NewText from "../../../components/NewText";

const NewMessage = () => {
  const route: any = useRoute();
  const navigation: any = useNavigation();
  const [selectedUser, setSelectedUser] = useState<any>();
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(true);
  const [conversation, setConversation] = useState<any>([]);
  const userData = useSelector(getUserData);

  const [usersList, setUsersList] = useState([]);

  const onSearchUsers = async (text: string) => {
    console.log("Input text:", text);
    setSearch(text);

    if (text.length > 0) {
      console.log("Text length is greater than 0");
      try {
        const token = await StorageServices.getItem(TOKEN);
        console.log("Retrieved token:", token);

        if (token) {
          console.log("Token is valid, proceeding with search");
          SearchUserName(
            { search: text },
            token,
            async ({ isSuccess, response }: any) => {
              console.log("Search result:", isSuccess);
              if (response.status) {
                console.log("Search response:", response?.result?.data);
                if (response?.result?.data.length) {
                  setUsersList(response?.result?.data);
                } else {
                  setUsersList([]);
                }
              } else {
                console.log("Search failed:", response);
                console.log("Something went wrong");
              }
            }
          );
        } else {
          console.error("No token found");
        }
      } catch (error) {
        console.error("Error while searching users:", error);
      }
    } else {
      console.log("Text length is 0, resetting search");
      setSearch("");
      setUsersList([]);
    }
  };

  return (
    <Pressable 
    onPress={()=>Keyboard.dismiss()}
    style={appStyles.main}>
      <StatusBar backgroundColor={colors.black300} barStyle="light-content" />

      <View style={styles.header}>
        <View style={{ width: "30%" }} />

        <View style={{ width: "40%" }}>
          <NewText
            fontWeight="600"
            color={colors.white}
            fontFam="Poppins-Medium"
            size={17}
            text={"New Message"}
          />
        </View>

        <TouchableOpacity
          style={{
            width: "30%",
            alignItems: "flex-end",
            // paddingRight: scale(10),
          }}
          onPress={() => navigation.goBack()}
        >
          <NewText
            // fontWeight="600"
            color={colors.white}
            // fontFam="Poppins-Medium"
            size={16}
            text={"Cancel"}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{ paddingHorizontal: scale(15), paddingTop: verticalScale(20) }}
      >
        <View style={appStyles.rowjustify}>
          <NewText
            fontWeight="600"
            color={colors.white}
            fontFam="Poppins-Medium"
            size={18}
            style={{ marginRight: scale(10) }}
            text={"To:"}
          />

          <View
            style={{
              width: "90%",
              borderWidth: 1,
              borderRadius: scale(8),
              borderColor: colors.grey300,
              paddingHorizontal: scale(10),
            }}
          >
            {selectedUser ? (
              <TouchableOpacity
                activeOpacity={0.6}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View
                  style={{
                    marginVertical: verticalScale(4),
                    borderRadius: scale(8),
                    borderWidth: 1,
                    borderColor: colors.white,
                  }}
                >
                  <NewText
                    color={colors.white}
                    size={16}
                    style={{
                      marginHorizontal: scale(10),
                      marginVertical: verticalScale(1),
                    }}
                    text={selectedUser.name}
                  />
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      setSelectedUser("");
                      setSearch("");
                      setIsSearch(true);
                      setUsersList([]);
                    }}
                    style={{
                      width: 22,
                      height: 22,
                      backgroundColor: colors.gray200,
                      position: "absolute",
                      top: -12,
                      right: -12,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 999,
                      padding: 5,
                    }}
                  >
                    <Image
                      style={{ width: 13, height: 13 }}
                      source={images.crossicon}
                    />
                  </TouchableOpacity>
                </View>

                <View />
              </TouchableOpacity>
            ) : (
              <TextInput
                placeholder="Search"
                placeholderTextColor={colors.white}
                value={search}
                onChangeText={onSearchUsers}
                style={{
                  fontSize: verticalScale(15),
                  fontFamily: "Poppins-Regular",
                  fontWeight: "400",
                  color: colors.white,
                  width: "87%",
                  paddingVertical: verticalScale(6),
                  alignItems: "center",
                }}
              />
            )}
          </View>
        </View>

        <Spacer height={verticalScale(10)} />
        {isSearch && (
          <View>
            {usersList.map((item, index) => {
              return (
                <TouchableOpacity
                  style={{
                    ...appStyles.row,
                    paddingVertical: 8,
                    marginLeft: 10,
                  }}
                  activeOpacity={0.6}
                  onPress={() => {
                    setSearch(item.name);
                    setSelectedUser(item);
                    setIsSearch(false);
                  }}
                >
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: 10,
                      borderRadius: 999,
              
                    }}
                    source={{ uri: item?.imageUrl }}
                  />
                  <NewText
                    fontWeight="600"
                    color={colors.white}
                    fontFam="Poppins-Medium"
                    size={17}
                    style={{ marginVertical: verticalScale(5) }}
                    text={item?.name}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {selectedUser && (
          <View
            style={{
              marginTop: "20%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                width: scale(100),
                height: scale(100),
                borderRadius: scale(10),
              }}
              source={{uri:selectedUser?.imageUrl}}
            />
            <CustomText
              fontWeight="600"
              color={colors.white}
              fontFam="Poppins-Medium"
              size={17}
              style={{ marginVertical: verticalScale(10) }}
              text={selectedUser.name}
            />

            <CustomText
              // fontWeight="600"
              color={colors.white}
              // fontFam="Poppins-Medium"
              size={17}
              style={{ textAlign: "center", marginHorizontal: scale(20) }}
              text={`You started a private message with ${selectedUser.name}. Please be respectful. `}
              // text={
              //   "You started a private message with Mike O’Dea. Please be respectful."
              // }
            />
          </View>
        )}
      </View>
      {selectedUser && (
        <MessageSender
          message={"chat"}
          notShow={true}
          placeholder={"Write a message"}
          // setConversation={setConversation}
          // conversation={conversation}
          receiver={selectedUser}
          newChat={true}
          receiverId={selectedUser?.id}
          authId={userData.id}
        />
      )}
    </Pressable>
  );
};

export default NewMessage;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.black300,
    alignItems: "center",
    paddingTop: Platform.OS == "ios" ? "18%" : "3%",
    paddingBottom: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(15),
  },
});
