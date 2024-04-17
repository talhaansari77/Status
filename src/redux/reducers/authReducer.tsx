import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";


export interface AuthState {
  user: any;
  token:string;
  notificationAlert:boolean,
  remember:boolean;
  isSuccess:boolean;
  successResponse:{
    label:string,
    text:string

  }



}
export const initialState: AuthState = {
  user: null,
  token:"",
  notificationAlert:false,
  remember:true,
  isSuccess:false,
  successResponse:{
    label:"",
    text:""
  }
   

};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   
    setUserData: (state, { payload }: PayloadAction<SignupState>) => {
      state.user = payload;
    },
    setToken: (state, { payload }: PayloadAction<SignupState>) => {
      state.token = payload;
    },
    setRemember: (state, { payload }: PayloadAction<SignupState>) => {
      state.remember = payload;
    },
    setSuccessResponse: (state, { payload }: PayloadAction<AuthState>) => {
      state.successResponse.label = payload?.label;
      state.successResponse.text = payload?.text;
    },
    setIsSuccess: (state, { payload }: PayloadAction<AuthState>) => {
      state.isSuccess = payload;
    },
   
  
   
  
  
    
  
   
   
  },
});

export const { setUserData,setRemember,setToken,setSuccessResponse,setIsSuccess } = authSlice.actions;
export default authSlice.reducer;
export const getRemember = (state: RootState) => state?.auth.remember;
export const getUserData = (state: RootState) => state?.auth.user;
export const getNotificationAlert = (state: RootState) => state?.auth.notificationAlert;
export const getSuccessResponse = (state: RootState) => state?.auth.successResponse;
export const getIsSuccess = (state: RootState) => state?.auth.isSuccess;

export const getToken = (state: RootState) => state?.auth.token;





