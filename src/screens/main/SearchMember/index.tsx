import {
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { appStyles } from "../../../utils/AppStyles";
import { images } from "../../../assets/images";
import CustomText from "../../../components/CustomText";
import { colors } from "../../../utils/colors";
import { useNavigation } from "@react-navigation/native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AbsoluteHeader from "../../../components/AbsoluteHeader";
import { scale, verticalScale } from "react-native-size-matters";
import CustomSearch from "../../../components/CustomSearch";
import { Spacer } from "../../../components/Spacer";
import UserList from "../SearchScreen/UserList";
import { SearchUserName } from "../../../api/ApiServices";
import { useSelector } from "react-redux";
import { getToken } from "../../../redux/reducers/authReducer";
import Loader from "../../../components/Loader";

const SearchMember = ({ navigation }:any) => {
  const [search, setSearch] = useState("");

  const token = useSelector(getToken);

  const resentSearch = [{ text: "Lucas" }, { text: "Netflix" }];

  const [loading, setLoading] = useState(false);

  const [memberList, setMemberList] = useState([]);
  console.log("token", memberList);

  let userData = [
    // online
    { name: "MIke O’Dea", img: images.defimage9, online: true },
    { name: "Lexi Reegan", img: images.defimage10, online: true },

    /// nearby
    {
      name: "MIke O’Dea",
      img: images.defimage23,
      nearby: "10mi",
    },
    {
      name: "Lexi Reegan",
      img: images.defimage22,
      nearby: "10mi",
    },
    {
      name: "Lexi Reegan",
      img: images.defimage21,
      nearby: "10mi",
    },
    { name: "MIke O’Dea", img: images.defimage9, nearby: "10mi" },
    { name: "MIke O’Dea", img: images.defimage10, nearby: "10mi" },
    { name: "Lexi Reegan", img: images.defimage11, nearby: "10mi" },

    // new
    { name: "T Smith", img: images.defimage18, new: true, online: true },
    { name: "T Smith", img: images.defimage19, new: true, online: true },
    { name: "Eric Broadway", img: images.defimage20, new: true, online: true },

    // popular

    {
      name: "Eric Broadway",
      img: images.defimage18,
      online: true,
      popular: "205k",
    },
    {
      name: "Lexi Reegan",
      img: images.defimage19,
      online: true,
      popular: "205k",
    },
    { name: "MIke O’Dea", img: images.defimage20, popular: "205k" },
    { name: "Eric Broadway", img: images.defimage21, popular: "205k" },
    { name: "MIke O’Dea", img: images.defimage22, popular: "205k" },
  ];

  const onSearchMember = (txt: any) => {
    // console.log("search Text",txt,token)
    setSearch(txt);
    if (txt.length == 0) {
      setMemberList([]);
      return;
    } else {
      // let form = new FormData();
      setLoading(true);
      // form.append("search", txt);
      SearchUserName({search:txt}, token, async ({ isSuccess, response }: any) => {
        if (isSuccess) {
          if (response?.status) {
            setLoading(false);

            setMemberList(response?.result?.data);
          } else {
            setLoading(false);
            Alert.alert("Alert!", "Network Error.");
          }
        } else {
          setLoading(false);

          Alert.alert("Alert!", "Network Error.");
        }
      });
    }
  };

  const renderUsers = ({ item, index }) => {
    console.log("ckbdk", index);

    return (
      <UserList
        name={item.name}
        image={item.imageUrl}
        id={item.id}
        onPress={() =>
          navigation.navigate("OthersProfile", {
            id: item?.id,
          })
        }
        item={item}
      /> // <FriendList item={item}/>
    );
  };

  return (
    <View style={appStyles.main}>
      {/* <AbsoluteHeader>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{ width: wp(4.5), height: hp(2.3) }}
              resizeMode="contain"
              source={images.back}
            />
          </TouchableOpacity>
          <CustomText
            fontWeight="600"
            color={colors.white}
            fontFam="Poppins-Medium"
            size={18}
            text={"Blocked Accounts"}
          />
          <CustomText color={"transparent"} size={18} text={"sss"} />
        </AbsoluteHeader> */}
      <View style={{ padding: scale(10), paddingTop: verticalScale(20) }}>
        <CustomSearch
          value={search}
          onBack={() => navigation.goBack()}
          navigation={navigation}
          onChangeText={(txt:any) => onSearchMember(txt)}
        />
        {/* {memberList?.length == 0 && (
          <View style={{ paddingHorizontal: scale(10) }}>
            <View
              style={{
                ...appStyles.rowjustify,
                marginTop: verticalScale(20),
                marginBottom: verticalScale(10),
              }}
            >
              <CustomText
                size={14}
                fontWeight="600"
                fontFam="Poppins-Medium"
                color={colors.white}
                text={"Recent"}
              />
              <CustomText
                size={14}
                fontWeight="600"
                fontFam="Poppins-Medium"
                color={colors.white}
                text={"Clear All"}
              />
            </View>
            {resentSearch.map((item, index) => {
              return (
                <View
                  style={{ ...appStyles.row, marginBottom: verticalScale(15) }}
                >
                  <Image
                    style={{ width: scale(18), height: scale(18) }}
                    source={images.recent}
                    resizeMode="contain"
                  />
                  <Spacer width={scale(15)} />
                  <CustomText
                    size={14}
                    fontWeight="600"
                    fontFam="Poppins-Medium"
                    color={colors.white}
                    text={item.text}
                  />
                </View>
              );
            })}
          </View>
        )} */}

        {/* <FlatList
        // style={{paddingHorizontal:10}}
        // onScroll={onScroll}
        showsVerticalScrollIndicator={false}
          data={userList}
          contentContainerStyle={{
            gap: verticalScale(15),
          }}
          renderItem={renderUserList}
        /> */}
      </View>

      <View style={{ marginTop: verticalScale(10) }}>
        {loading && <Loader />}
        <FlatList
          data={memberList}
          numColumns={3}
          style={{ marginBottom: verticalScale(75) }}
          renderItem={renderUsers}
        />
      </View>
    </View>
  );
};

export default SearchMember;

const styles = StyleSheet.create({
  rowConttainer: {
    height: verticalScale(50),
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
});
