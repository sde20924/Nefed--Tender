import { callApi, callApiGet } from "@/utils/FetchApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getProfileData = createAsyncThunk(
  "getProfileData",
  async (args, { rejectWithValue }) => {
    try {
      console.log("fff");
      const userData = await callApiGet("get-user-info");
      const docs = await callApiGet("get-list-of-required-docs");
      console.log(docs);
      console.log(userData);
      return {
        profileData: userData.userDetails,
        docs: docs.requiredDocuments,
      };
    } catch (err) {
      return rejectWithValue("Opps found an error", err.response.data);
    }
  }
);

//update slice
export const updateProfile = createAsyncThunk(
  "updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const userData = await callApi("edit-user-info", "POST", { ...data });
      return userData;
    } catch (error) {
      return rejectWithValue("Opps found an error", error.response.data);
    }
  }
);

export const updateMSG = createAsyncThunk(
  "updateMSG",
  async (data, { rejectWithValue }) => {
    return null;
  }
);

export const updateUserStatus = createAsyncThunk(
  "updateUserStatus",
  async (data, { rejectWithValue }) => {
    return data;
  }
);

export const profileSlice = createSlice({
  name: "profileData",
  initialState: {
    profileData: null,
    profileLoading: false,
    error: null,
    p_msg: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileData.pending, (state) => {
        state.profileLoading = true;
      })
      .addCase(getProfileData.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profileData = {
          ...action.payload.profileData,
          docs: action.payload.docs,
        };
      })
      .addCase(getProfileData.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.p_msg = null;
        state.profileLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.p_msg = action.payload.msg;
        state.profileData = action.payload.user;
        // state.profileData = ;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.p_msg = action.payload;
        state.error = action.payload;
      })
      .addCase(updateMSG.fulfilled, (state, action) => {
        state.p_msg = action.payload;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.profileData = { ...state.profileData, status: action.payload };
      });
  },
});
export default profileSlice.reducer;
