import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const uiReducer = createSlice({
  name: "uiReducer",
  initialState: {
    userInfo: null,
    auth: {
      isAuth: false,
      refresh_token: null
    },
    access_token: null,
    isSidebarOpen: false,
    loader: false,
    isExpired: false,
    screenwidth: '',
    snackbar: { isOpen: false, message: "", isSuccess: false },
    envData: null,
    profileDetail: null,
    balance: null,
    totalUsers: null,
    isTime: null,
    scannerModal: false,
    sessionScanId: '',
  },
  reducers: {
    setIsAuth: (state, action) => {
      state.auth.isAuth = action.payload.isAuth;
      state.userInfo = action.payload.data;
      state.auth.refresh_token = action.payload.refresh_token;
    },
    setViewSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    setAccessToken: (state, action) => {
      state.access_token = action.payload;
    },
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
    setExpired: (state, action) => {
      state.isExpired = action.payload;
    },
    setScreenWidth: (state, action) => {
      state.screenwidth = action.payload;
    },
    setSnackbar: (state, action) => {
      state.snackbar = action.payload;
    },
    setEnvData: (state, action) => {
      state.envData = action.payload
    },
    setScannerModal: (state, action) => {
      state.scannerModal = action.payload
    },
    setSessionScannerId: (state, action) => {
      state.sessionScanId = action.payload
    },
    setProfileDetail: (state, action) => {
      state.profileDetail = action.payload
    },
    // logout
    resetAuth: (state, action) => {
      state.auth = { isAuth: false, refresh_token: null }
      state.userInfo = null
      state.access_token = null
      state.isExpired = false
    },
    setBalance: (state, action) => {
      state.balance = action.payload?.available_balance
      state.totalUsers = action.payload?.totalUsers
    },
    setTime: (state, action) => {
      state.isTime = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const { setIsAuth, setLoader, setExpired, setEnvData, setProfileDetail, setScannerModal, setSessionScannerId,
  setViewSidebar, resetAuth, setAccessToken, setScreenWidth, setSnackbar, setBalance, setTime } = uiReducer.actions;

export default uiReducer.reducer;
