import { callApi, callApiGet } from "@/utils/FetchApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const addSellersToRedux = createAsyncThunk(
  "addSellersToRedux",
  async (args, { rejectWithValue }) => {
    return args;
  }
);

export const addAllNewSellers = createAsyncThunk(
  "addAllNewSellers",
  async (args, { rejectWithValue }) => {
    return args;
  }
);

export const addAllRejectedSellers = createAsyncThunk(
  "addAllRejectedSellers",
  async (args, { rejectWithValue }) => {
    return args;
  }
);

//get sellers TAGS
export const getSellerTags = createAsyncThunk(
  "getSellerTags",
  async (args, { rejectWithValue }) => {
    try {
      console.log("getting seller tags");
      const data = await callApiGet(`admin/get-all-seller-tags`);
      console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue("Opps found an error", err.response.data);
    }
  }
);
//add new sellers TAG
export const addSellerTag = createAsyncThunk(
  "addSellerTag",
  async (args, { rejectWithValue }) => {
    return args;
  }
);
export const deleteSeller = createAsyncThunk(
  "deleteSeller",
  async (args, { rejectWithValue }) => {
    try {
      console.log("deleting seller");
      const data = await callApi(`admin/block-or-delete-user`, "POST", {
        ...args,
      });
      console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue("Opps found an error", err.response.data);
    }
  }
);
export const blockSeller = createAsyncThunk(
  "blockSeller",
  async (args, { rejectWithValue }) => {
    try {
      console.log("blocking seller");
      const data = await callApi(`admin/block-or-delete-user`, "POST", {
        ...args,
      });
      console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue("Opps found an error", err.response.data);
    }
  }
);

export const updateMSGSeller = createAsyncThunk(
  "updateMSGSeller",
  async (data, { rejectWithValue }) => {
    return null;
  }
);

export const addSeller = createAsyncThunk(
  "addSeller",
  async (data, { rejectWithValue }) => {
    return data;
  }
);
export const acceptSeller = createAsyncThunk(
  "acceptSeller",
  async (data, { rejectWithValue }) => {
    return data;
  }
);
export const rejectSeller = createAsyncThunk(
  "rejectSeller",
  async (data, { rejectWithValue }) => {
    return data;
  }
);

export const sellersSlice = createSlice({
  name: "sellersSlice",
  initialState: {
    sellers: null,
    newSellers: null,
    rejectedSellers: null,
    sellerTags: null,
    sellerLoading: false,
    error: null,
    s_msg: null,
    delete_success: null,
    block_success: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSellersToRedux.fulfilled, (state, action) => {
        state.sellers = action.payload;
      })
      .addCase(addAllNewSellers.fulfilled, (state, action) => {
        state.sellerLoading = false;
        state.newSellers = action.payload;
      })
      .addCase(addAllRejectedSellers.fulfilled, (state, action) => {
        state.rejectedSellers = action.payload;
      })
      .addCase(getSellerTags.pending, (state) => {
        state.sellerLoading = true;
      })
      .addCase(getSellerTags.fulfilled, (state, action) => {
        state.sellerLoading = false;
        state.sellerTags = action.payload.sellerTags;
      })
      .addCase(getSellerTags.rejected, (state, action) => {
        state.sellerLoading = false;
        state.error = action.payload;
        state.s_msg = action.payload.msg;
      })
      .addCase(deleteSeller.fulfilled, (state, action) => {
        state.delete_success = true;
        state.s_msg = action.payload.msg;
        state.sellers = state.sellers.filter(
          (ele) => ele.user_id != action.meta.arg.user_id
        );
      })
      .addCase(deleteSeller.rejected, (state, action) => {
        state.delete_success = false;
        state.s_msg = action.payload.msg;
      })
      .addCase(blockSeller.fulfilled, (state, action) => {
        state.block_success = true;
        state.s_msg = action.payload.msg;
        state.sellers = state.sellers.filter(
          (ele) => ele.user_id != action.meta.arg.user_id
        );
      })
      .addCase(blockSeller.rejected, (state, action) => {
        state.block_success = false;
        state.s_msg = action.payload.msg;
      })
      .addCase(updateMSGSeller.fulfilled, (state, action) => {
        state.s_msg = action.payload;
        state.delete_success = null;
        state.block_success = null;
      })
      .addCase(addSeller.fulfilled, (state, action) => {
        if (Array.isArray(state.newSellers)) {
          state.newSellers = [...state.newSellers, action.payload];
        } else {
          state.newSellers = [{ ...action.payload }];
        }
      })
      .addCase(acceptSeller.fulfilled, (state, action) => {
        const data = action.payload.data;
        const key = action.payload.key;

        if (key === "newApp") {
          if (state.newSellers) {
            state.newSellers = state.newSellers.filter(
              (ele) => ele.user_id != data.user_id
            );
          }
        }
        if (key === "rejApp") {
          if (state.rejectedSellers) {
            state.rejectedSellers = state.rejectedSellers.filter(
              (ele) => ele.user_id != data.user_id
            );
          }
        }

        if (Array.isArray(state.sellers)) {
          state.sellers = [...state.sellers, { ...data, status: "approved" }];
        } else {
          state.sellers = [{ ...data, status: "approved" }];
        }
      })
      .addCase(rejectSeller.fulfilled, (state, action) => {
        const data = action.payload.data;
        if (state.newSellers) {
          state.newSellers = state.newSellers.filter(
            (ele) => ele.user_id != data.user_id
          );
        }
        if (state.rejectedSellers) {
          state.rejectedSellers = [
            ...state.rejectedSellers,
            { ...data, status: "rejected" },
          ];
        } else {
          state.rejectedSellers = [{ ...data, status: "rejected" }];
        }
      })
      .addCase(addSellerTag.fulfilled, (state, action) => {
        state.sellerTags = [...state.sellerTags, action.payload];
      });
  },
});
export default sellersSlice.reducer;
