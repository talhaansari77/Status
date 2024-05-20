import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, version } from "react";
import { appStyles } from "../../../utils/AppStyles";
import CustomText from "../../../components/CustomText";
import { colors } from "../../../utils/colors";
import { images } from "../../../assets/images";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { windowHeight, windowWidth } from "../../../utils/Dimensions";
import CustomButton from "../../../components/CustomButton";
import MessagesComponent from "../../../components/MessageComponent";
import { profileComments } from "../../../utils/Data";
import { scale, verticalScale } from "react-native-size-matters";
import { Spacer } from "../../../components/Spacer";
import SizeBar from "../../../components/SizeBar";
import CustomModal from "../../../components/CustomModal";
import BlockModal from "./BlockModal";
import Channel from "../Channel";
import FastImage from "react-native-fast-image";
import NewText from "../../../components/NewText";
import {
  AddRemoveViews,
  Blocked,
  CreateComment,
  Favorite,
  Follow,
  GetStatus,
  GetUserComment,
  getUserDetail,
  isFollowing,
} from "../../../api/ApiServices";
import { useSelector } from "react-redux";
import { getToken } from "../../../redux/reducers/authReducer";
import Loader from "../../../components/Loader";
import CustomToast from "../../../components/CustomToast";
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from "@pusher/pusher-websocket-react-native";
import { AUTH, StorageServices } from "../../../utils/hooks/StorageServices";

const OthersProfile = () => {
  const pusher = Pusher.getInstance();
  const route: any = useRoute();
  const id = route?.params?.id;
  let isChannel = route?.params?.isChannel;
  const channelId = route?.params?.channelId;
  const navigation: any = useNavigation();
  const [isWatchList, setIsWatchList] = useState(false);
  const [isSideBar, setIsBar] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any>([]);
  const [newComment, setNewComment] = useState<any>({});
  const [posts, setPosts] = useState<any>([]);
  const [newPost, setNewPost] = useState<any>({});
  const [isBlockModal, setIsBlockModal] = useState(false);
  const [isReportModal, setIsReportModal] = useState(false);
  const [isActiveProfile, setIsActiveProfile] = useState("Profile");
  const token = useSelector(getToken);
  const [data, setData] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [toastColor, setToastColor] = useState(colors.red);
  const isFocused = useIsFocused();
  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [counter1, setCounter1] = useState(0);

  const [isUnfollowModal, setIsUnfollowModal] = useState(false);

  // const [channelId, setIsChannelId] = useState("");
  // const getChannelId = async () => {
  //   const userInfo = await StorageServices.getItem(AUTH);
  //   setIsChannelId(userInfo?.channel?.id);
  // };
  // useEffect(() => {
  //   getChannelId();
  // }, []);
  // function onConnectionStateChange(currentState:string, previousState:string) {

  //   console.log(`Connection: ${currentState}`,'commentsChannel_'+id);
  // }

  useEffect(() => {
    // if (newComment)
    setComments([...comments, newComment]);
  }, [newComment]);

  // useEffect(() => {
  //   if(newPost)
  //   setNewPost([...posts,newPost])
  // }, [newPost])

  const con = async () => {
    console.log("am focused");
    try {
      await pusher.init({
        apiKey: "e8f7ca7b8515f9bfcbb0",
        cluster: "mt1",
        // onConnectionStateChange,
      });
      // console.log('init')
      await pusher.subscribe({
        channelName: "commentsChannel_" + id,
        onEvent: (event: PusherEvent) => {
          // console.log("channelUpdates_"+JSON.stringify(route?.params))
          console.log("commentsChannel_", JSON.parse(event.data));
          let com = JSON.parse(event.data).comment;
          if (com?.deleted) {
            let filter = comments.filter((c: any) => c.id != com.commentId);
            setComments(filter);
          } else {
            setNewComment(com);
            // setComments([...comments,com])
          }
          // let newCommentList= comments;
          // newCommentList.push(JSON.parse(event.data).comment)
          // console.log(newCommentList)
          // setNewComment(JSON.parse(event.data).comment);
          // comments.push(JSON.parse(event.data).comment)
        },
      });
      await pusher.subscribe({
        channelName: "channelUpdates_" + channelId,
        onEvent: (event: PusherEvent) => {
          console.log("channelUpdates_", JSON.parse(event.data).post);
          // let newPostList= [posts,JSON.parse(event.data).post];
          let post = JSON.parse(event.data).post;
          // if(post.id){
          //   setNewPost(post)
          // }
          // setPosts([...posts, post]);
          // setNewPost(JSON.parse(event.data).post);
        },
      });
      // await pusher.subscribe({ channelName:'commentsChannel_'+id });
      await pusher.connect();
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }
  };
  const unCon = async () => {
    await pusher.unsubscribe({ channelName: "commentsChannel_" + id });
    await pusher.unsubscribe({ channelName: "channelUpdates_" + channelId });
    await pusher.disconnect();
  };

  useEffect(() => {
    if (isFocused) {
      con();
    } else {
      unCon();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isChannel) {
      setIsActiveProfile("Channel");
    } else {
      setIsActiveProfile("Profile");
    }
    getDetail();
  }, []);
  // console.log("UserID", data?.gif);

  useEffect(() => {
    if (isFocused) getUserComment();
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) GetPosts();
  }, [isFocused, counter1]);

  const GetPosts = async () => {
    GetStatus(id, token, async ({ isSuccess, response }: any) => {
      console.log("data p", isSuccess);

      let result = JSON.parse(response);
      if (result.status) {
        // console.log(result?.posts?.data)
        setPosts(result?.posts?.data);
        result?.posts?.data.map(async (p: any,index:any) => {
          let user = await StorageServices.getItem(AUTH);
          let data = { user_id: user.id, post_id: p.id };
          
          AddRemoveViews(data, token, async ({ isSuccess, response }: any) => {
            let result = JSON.parse(response);
            if (result.status) {
              setCounter1(counter1 + 1);
            } else {
              console.log(result);
              // Alert.alert("Alert!", "Something went wrong",);
              console.log("Something went wrong");
            }
          });
        });
      } else {
        console.log(result);
        // Alert.alert("Alert!", "Something went wrong",);
        console.log("Something went wrong");
      }
    });
  };

  const getUserComment = async () => {
    let data = {
      userId: id,
    };
    GetUserComment(data, token, async ({ isSuccess, response }: any) => {
      console.log("data g", isSuccess);

      let result = JSON.parse(response);
      if (result.status) {
        // console.log(result.comments.data)
        setComments(result?.comments?.data);
        // setLoading(false);
      } else {
        console.log(result);
        // Alert.alert("Alert!", "Something went wrong",);
        console.log("Something went wrong");
      }
    });
  };

  const submitComment = async () => {
    let data = {
      description: comment,
      userId: id,
    };
    // setComment("")

    // console.log(comment)
    setLoading2(true);

    CreateComment(data, token, async ({ isSuccess, response }: any) => {
      console.log("data c", isSuccess);

      let result = JSON.parse(response);
      // console.log('result',result);
      if (result.status) {
        // setComments([...comments, result.comment]);
        setComment("");
        setLoading2(false);
      } else {
        // Alert.alert("Alert!", "Something went wrong");
        console.log("Something went wrong");
      }
    });
  };

  const getDetail = () => {
    setLoading(true);
    let params = {
      id: id,
    };
    getUserDetail(params, token, async ({ isSuccess, response }: any) => {
      console.log("knckdnc", isSuccess);

      let result = JSON.parse(response);
      if (result.status) {
        console.log("user", result);
        setData(result?.user);
        if (result?.user?.followers.length > 0) {
          setIsFollow(true);
        }
        if (result?.user?.favoritee.length > 0) {
          setIsFavorite(true);
        }
        setLoading(false);

        //   if (result?.) {
        //     setIsFollow(true)
        //   }
        //   else {
        //     setIsFollow(false)
        //   }
        // } else {
        //   // Alert.alert("Alert!", "Something went wrong");
      } else {
        Alert.alert("Alert!", "Something went wrong");
      }
    });
  };

  const onFollow = () => {
    setIsFollow(!isFollow);
    if (!isFollow) {
      let name = `You followed ${data?.name}`;
      setShowMessage(true);
      setMessage(name);
      setToastColor(colors.green);

      setTimeout(() => {
        setShowMessage(false);
        setToastColor(colors.red);
      }, 4000);
    }

    let params = {
      followee: id,
    };

    Follow(params, token, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        let result = JSON.parse(response);
        console.log("FollowUser", result);

        if (result.status) {
        } else {
          Alert.alert("Alert!", "Something went wrong");
        }
      } else {
        // setLoading(false);

        Alert.alert("Alert!", "Network Error.");
      }
    });
  };
  const onFavorite = () => {
    setIsFavorite(!isFavorite);

    let params = {
      favorite: id.toString(),
    };

    Favorite(params, token, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        let result = JSON.parse(response);
        console.log("Favorite", result);

        if (result.status) {
          // setLoading(false);
          // setAllUsers(result?.users?.data)
          // setNextPageUrl(!result?.users?.next_page_url?true:false)
        } else {
          Alert.alert("Alert!", "Something went wrong");
        }
      } else {
        // setLoading(false);

        Alert.alert("Alert!", "Network Error.");
      }
    });
  };

  const renderChatList = ({ item }: any) => {
    // console.log("kncdknc", item);
    return (
      <MessagesComponent
        comments={true}
        profile={true}
        onPress={() =>
          navigation.navigate("OtherUserProfile", {
            id: item?.commentatorId,
          })
        }
        onDelete={false}
        name={item?.username}
        image={item?.imageUrl}
        message={item?.description}
        time={item?.created_at}
        chatDate={item?.chatDate}
      />
    );
  };

  const onBlocked = () => {
    // setIsFollow(!isFollow)
    let params = {
      blocked: data.id.toString(),
    };
    console.log("BlokcedResult", params);

    Blocked(params, token, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        let result = JSON.parse(response);

        if (result.status) {
          setIsBlockModal(false);
          navigation.goBack();
          // setLoading(false);
          // setAllUsers(result?.users?.data)
          // setNextPageUrl(!result?.users?.next_page_url?true:false)
        } else {
          Alert.alert("Alert!", "Something went wrong");
        }
      } else {
        // setLoading(false);

        Alert.alert("Alert!", "Network Error.");
      }
    });
  };

  const shortenedText =
    data?.name?.length > 17 ? data?.name?.substring(0, 16) + "..." : data?.name;

  return (
    <>
      <SafeAreaView style={appStyles.main}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <View style={appStyles.rowjustify}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: scale(20),
                  paddingVertical: verticalScale(5),
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    width: scale(30),
                    height: scale(35),
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                  onPress={() => navigation.goBack()}
                >
                  <Image
                    style={{ width: scale(18), height: scale(25) }}
                    source={images.back200}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <FastImage
                  style={{
                    width: scale(37),
                    height: scale(37),
                    borderRadius: 999,
                  }}
                  source={{
                    uri: data?.imageUrl,
                    headers: { Authorization: "someAuthToken" },
                    priority: FastImage.priority.high,
                  }}
                />
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
                    text={shortenedText}
                  />
                  <NewText
                    // fontWeight="700"
                    color={colors.white}
                    size={14}
                    style={{ marginTop: verticalScale(-3) }}
                    text={`${data?.followers_count} Followers`}
                  />
                </View>
              </View>
              <View style={{ ...appStyles.row, paddingRight: scale(10) }}>
                {isFollow ? (
                  <></>
                ) : (
                  <TouchableOpacity activeOpacity={0.6} onPress={onFollow}>
                    <NewText
                      color={colors.white}
                      size={16}
                      fontFam="Poppins-SemiBold"
                      fontWeight="700"
                      textDecorationLine={"underline"}
                      // style={{marginTop:verticalScale(5)}}
                      text={"Follow"}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{
                    width: scale(30),
                    height: scale(35),
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                  onPress={() => setIsBar(!isSideBar)}
                >
                  <Image
                    style={{
                      width: scale(30),
                      height: scale(25),
                      tintColor: colors.white,
                      marginLeft: scale(-3),
                    }}
                    source={images.dot}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* <CustomText color={"transparent"} size={18} text={"sss"} /> */}
            </View>

            <View
              style={{
                ...appStyles.rowjustify,
                paddingHorizontal: scale(10),
                marginBottom: verticalScale(5),
              }}
            >
              {["Profile", "Channel"].map((item, index) => {
                return (
                  <CustomButton
                    width={"48.5%"}
                    onPress={() => setIsActiveProfile(item)}
                    text={item}
                    textColor={
                      isActiveProfile == item ? colors.black : colors.white
                    }
                    height={35}
                    bgColor={
                      isActiveProfile == item ? colors.grey400 : colors.primary
                    }
                    borderRadius={8}
                  />
                );
              })}

              {/* <CustomButton
              width={"48.5%"}
              borderRadius={8}
              text="Channel"
              height={35}
            /> */}
            </View>

            {isActiveProfile == "Profile" ? (
              <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View
                    style={{
                      ...appStyles.row,
                      paddingBottom: verticalScale(5),
                      paddingHorizontal: scale(20),
                    }}
                  >
                    <View style={{ ...appStyles.row, width: "45%" }}>
                      <Image
                        style={{
                          width: scale(16),
                          height: scale(16),
                        }}
                        source={images.locationicon}
                      />
                      <CustomText
                        color={colors.grey300}
                        size={15}
                        numberOfLines={1}
                        fontFam="Inter-Medium"
                        style={{ marginLeft: scale(8) }}
                        text={data?.location}
                      />
                    </View>
                    <Spacer width={scale(22)} />

                    <View style={{ ...appStyles.row, width: "48%" }}>
                      <Image
                        style={{
                          width: scale(20),
                          height: scale(20),
                        }}
                        source={images.bagicon}
                      />
                      <CustomText
                        color={colors.grey300}
                        size={15}
                        numberOfLines={1}
                        fontFam="Inter-Medium"
                        style={{ marginLeft: scale(8), marginRight: scale(10) }}
                        text={"Actress, Modal"}
                      />
                    </View>
                  </View>
                  <FastImage
                    style={{
                      width: "100%",
                      height: verticalScale(350),
                      alignSelf: "center",
                    }}
                    resizeMode="cover"
                    source={{
                      uri: data?.imageUrl,
                      headers: { Authorization: "someAuthToken" },
                      priority: FastImage.priority.high,
                    }}
                  />
                  <View style={appStyles.rowjustify}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={onFavorite}
                      style={styles.box}
                    >
                      <Image
                        style={{
                          width: 30,
                          height: 30,
                          tintColor: colors.white,
                        }}
                        source={isFavorite ? images.star1 : images.star}
                        resizeMode="contain"
                      />
                      <CustomText
                        color={colors.white}
                        size={13}
                        numberOfLines={1}
                        fontFam="Inter-Medium"
                        style={{ marginTop: scale(5) }}
                        text={"Favorite"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => setIsWatchList(!isWatchList)}
                      style={styles.box}
                    >
                      <Image
                        style={{
                          width: 25,
                          height: 25,
                          tintColor: colors.white,
                        }}
                        source={images.appicon}
                        resizeMode="contain"
                      />
                      <CustomText
                        color={colors.white}
                        size={13}
                        numberOfLines={1}
                        fontFam="Inter-Medium"
                        style={{ marginTop: scale(7) }}
                        text={"STATUS"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() =>
                        navigation.navigate("NewMessage", {
                          user: data,
                        })
                      }
                      style={styles.box}
                    >
                      <Image
                        style={{
                          width: 30,
                          height: 30,
                          tintColor: colors.white,
                        }}
                        source={images.profilemessage}
                        resizeMode="contain"
                      />
                      <CustomText
                        color={colors.white}
                        size={13}
                        numberOfLines={1}
                        fontFam="Inter-Medium"
                        style={{ marginTop: scale(5) }}
                        text={"Message"}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ paddingHorizontal: scale(10) }}>
                    <View
                      style={{
                        backgroundColor: colors.black,
                        borderBottomRightRadius: scale(5),
                        borderBottomLeftRadius: scale(5),
                        paddingVertical: verticalScale(10),
                      }}
                    >
                      {data?.bio && (
                        <NewText
                          color={colors.white}
                          lineHeight={20}
                          size={15}
                          text={data?.bio}
                        />
                      )}

                      {data?.link && (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => {
                            Linking.openURL(data?.link);
                          }}
                          style={{
                            flexDirection: "row",
                            marginTop: verticalScale(3),
                          }}
                        >
                          <Image
                            style={{
                              width: scale(18),
                              height: scale(18),
                            }}
                            resizeMode="contain"
                            source={images.link}
                          />
                          <NewText
                            color={colors.grey300}
                            size={14}
                            fontFam="Inter-Medium"
                            style={{
                              marginRight: scale(20),
                              marginLeft: scale(8),
                            }}
                            text={data?.link}
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* <View
             style={{
               ...appStyles.rowjustify,
               marginVertical: verticalScale(10),
             }}
           >
             <Image
               style={{
                 width: "48.5%",
                 height: windowHeight / 4.2,
                 borderRadius: 8,
               }}
               source={images.defimg400}
             />
             <Image
               style={{
                 width: "48.5%",
                 height: windowHeight / 4.2,
                 borderRadius: 8,
               }}
               source={images.defimage4}
             />
           </View> */}

                    <View style={appStyles.rowjustify}>
                      {data?.gif1 && (
                        <View style={styles.gifhyContainer}>
                          <Image
                            style={{ width: "100%", height: "100%" }}
                            source={{ uri: data?.gif1 }}
                          />

                          <View
                            style={{
                              position: "absolute",
                              right: 5,
                              bottom: 0,
                            }}
                          >
                            <Image
                              style={{
                                width: 100,
                                height: 30,
                                alignSelf: "flex-end",
                              }}
                              source={images.giphy}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                      )}
                      {data?.gif2 && (
                        <View style={styles.gifhyContainer}>
                          <Image
                            style={{ width: "100%", height: "100%" }}
                            source={{ uri: data?.gif2 }}
                          />
                          <View
                            style={{
                              position: "absolute",
                              right: 5,
                              bottom: 0,
                            }}
                          >
                            <Image
                              style={{
                                width: 100,
                                height: 30,
                                alignSelf: "flex-end",
                              }}
                              source={images.giphy}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                      )}
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 20,
                        borderWidth: 1,
                        borderColor: colors.gray200,
                        // paddingVertical:verticalScale(5),
                        borderRadius: 10,
                        marginVertical: verticalScale(10),
                      }}
                    >
                      <TextInput
                        style={{
                          color: colors.gray200,
                          width: "90%",
                          fontSize: verticalScale(15),
                        }}
                        placeholderTextColor={colors.gray200}
                        placeholder="Write on my wall"
                        value={comment}
                        onChangeText={(text) => setComment(text)}
                      />
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={submitComment}
                      >
                        {loading2 ? (
                          <ActivityIndicator
                            size={"small"}
                            color={colors.white}
                          />
                        ) : (
                          <Image
                            style={{ tintColor: colors.gray200 }}
                            source={images.send}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                    {/* public comments */}
                    <FlatList
                      data={comments}
                      contentContainerStyle={{
                        gap: 7,
                      }}
                      renderItem={renderChatList}
                    />
                  </View>
                </ScrollView>
              </View>
            ) : (
              <>
                <View
                  style={{
                    width: "100%",
                    height: windowHeight,
                    paddingTop: verticalScale(10),
                  }}
                >
                  <Channel
                    posts={posts}
                    hideSendMessage={true}
                    channelId={channelId}
                    counter={counter}
                    setCounter={setCounter}
                  />
                </View>
              </>
            )}
          </>
        )}
      </SafeAreaView>
      <SizeBar
        setIsModalVisible={setIsBar}
        top={verticalScale(-15)}
        right={scale(-8)}
        // paddingHorizontal={5}
        // paddingVertical={5}
        isModalVisible={isSideBar}
      >
        {!isFollow ? (
          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setIsBar(false);
                setTimeout(() => {
                  setIsBlockModal(true);
                }, 1000);
              }}
            >
              <CustomText
                color={"#F9FFFF"}
                size={15}
                style={{ marginBottom: verticalScale(10) }}
                // fontFam="Inter-Medium"
                // style={{ marginLeft: scale(8) }}
                text={"Block"}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <CustomText
                color={"#F9FFFF"}
                size={15}
                // fontFam="Inter-Medium"
                style={{ marginBottom: verticalScale(10) }}
                text={"Report"}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setIsBar(false);
                onFollow();
              }}
            >
              <CustomText
                color={"#F9FFFF"}
                size={15}
                style={{ marginBottom: verticalScale(10) }}
                // fontFam="Inter-Medium"
                // style={{ marginLeft: scale(8) }}
                text={"Unfollow"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setIsBar(false);
                setTimeout(() => {
                  setIsBlockModal(true);
                }, 1000);
              }}
            >
              <CustomText
                color={"#F9FFFF"}
                size={15}
                style={{ marginBottom: verticalScale(10) }}
                // fontFam="Inter-Medium"
                // style={{ marginLeft: scale(8) }}
                text={"Block"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setIsBar(false);
                setTimeout(() => {
                  setIsReportModal(true);
                }, 1000);
              }}
            >
              <CustomText
                color={"#F9FFFF"}
                size={15}
                // fontFam="Inter-Medium"
                // style={{ marginLeft: scale(8) }}
                text={"Report"}
              />
            </TouchableOpacity>
          </View>
        )}
      </SizeBar>
      <BlockModal
        isModalVisible={isBlockModal}
        setModalVisible={setIsBlockModal}
        isBlock={"BLOCK"}
        onBlocked={onBlocked}
        title={`Block ${data?.name}?`}
        des={
          "This user will no longer be able to follow, message, or see your profile."
        }
      />

      <BlockModal
        isModalVisible={isReportModal}
        setModalVisible={setIsReportModal}
        isBlock={"REPORT"}
        title={`Report ${data?.name}?`}
        des={
          "If you feel this user has violated our terms of service select REPORT and we will review your anonymous submission."
        }
      />
      {/* 
      <CustomModal
          isModalVisible={isBlockModal}
          setModalVisible={setIsBlockModal}
      >

<View
                style={{ alignItems: "center" }}>
                <View
                    style={{
                        width: "85%",
                        backgroundColor: colors.white,
                        paddingVertical: 20,
                        paddingHorizontal: 20,
                        borderRadius:scale(15)
                    }}
                >

<CustomText
                        text={"Block Carmen Electra?!"}
                        size={17}
                        fontWeight='700'
                        fontFam="Poppins-Bold"
                        color={colors.black}
                        style={{ textAlign: "center" }}
                    />

<CustomText
                        text={"This user will no longer be able to follow, message, or see your profile."}
                        size={16}
                        color={colors.black}
                        style={{ textAlign: "center",marginVertical:verticalScale(10) }}
                    />
                    <View style={{...appStyles.row,alignSelf:"center"}}>

                    <CustomButton
          text={"Cancel"}
          // width={windowWidth/3.5}
          size={16}
          height={verticalScale(43)}
          borderRadius={scale(20)}
          paddingHoriontal={scale(25)}
          onPress={()=>setIsFollow(!isFollow)}
          // fontWeight={"600"}
          fontFam={"Poppins-Regular"}
          bgColor={"#C4C4C4"}
          textColor={colors.black}
          />
          <Spacer width={scale(20)}/>

          <CustomButton
          text={"BLOCK"}
          // width={windowWidth/3.5}
          size={16}
          height={verticalScale(43)}
          borderRadius={scale(20)}
          paddingHorizontal={scale(25)}
          // onPress={()=>setIsFollow(!isFollow)}
          // fontWeight={"600"}
          fontFam={"Poppins-Regular"}
          bgColor={"#277DD2"}
          textColor={colors.white}
          />
  

                    </View>
                    
                </View>
            </View>



      </CustomModal> */}

      {showMessage && (
        <CustomToast
          showError={showMessage}
          setShowError={setShowMessage}
          bgColor={toastColor}
          text={message}
        />
      )}
    </>
  );
};

export default OthersProfile;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.black100,
    alignItems: "center",
    paddingBottom: "3%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: windowWidth / 2,
  },
  icon: {
    height: 20,
    width: 20,
    marginRight: 10,
    resizeMode: "contain",
  },
  flex: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  box: {
    alignItems: "center",
    width: "33%",
    height: 75,
    backgroundColor: colors.black300,
    justifyContent: "center",
  },
  gifhyContainer: {
    width: "48%",
    height: windowHeight / 4.3,
    overflow: "hidden",
    borderRadius: scale(5),
    alignItems: "center",
    justifyContent: "center",
  },
});
