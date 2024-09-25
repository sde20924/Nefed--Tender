import { callApi, callApiGet } from "@/utils/FetchApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const addBuyersToRedux = createAsyncThunk(
  "addBuyersToRedux",
  async (args, { rejectWithValue }) => {
    return args;
  }
);

export const addAllNewBuyers = createAsyncThunk(
  "addAllNewBuyers",
  async (args, { rejectWithValue }) => {
    return args;
  }
);
export const addAllRejectedBuyers = createAsyncThunk(
  "addAllRejectedBuyers",
  async (args, { rejectWithValue }) => {
    return args;
  }
);

export const deleteBuyer = createAsyncThunk(
  "deleteBuyer",
  async (args, { rejectWithValue }) => {
    try {
      console.log("deleting buyer");
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
export const blockBuyer = createAsyncThunk(
  "blockBuyer",
  async (args, { rejectWithValue }) => {
    try {
      console.log("blocking buyer");
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

//get buyers TAGS
export const getBuyerTags = createAsyncThunk(
  "getBuyerTags",
  async (args, { rejectWithValue }) => {
    try {
      console.log("getting buyer tags");
      const data = await callApiGet(`admin/get-all-buyer-tags`);
      console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue("Opps found an error", err.response.data);
    }
  }
);
//add new buyers TAG
export const addBuyerTag = createAsyncThunk(
  "addBuyerTag",
  async (args, { rejectWithValue }) => {
    return args;
  }
);

export const updateMSG = createAsyncThunk(
  "updateMSG",
  async (data, { rejectWithValue }) => {
    return null;
  }
);
export const addBuyer = createAsyncThunk(
  "addBuyer",
  async (data, { rejectWithValue }) => {
    return data;
  }
);
export const acceptBuyer = createAsyncThunk(
  "acceptBuyer",
  async (data, { rejectWithValue }) => {
    return data;
  }
);
export const rejectBuyer = createAsyncThunk(
  "rejectBuyer",
  async (data, { rejectWithValue }) => {
    return data;
  }
);

export const buyersSlice = createSlice({
  name: "buyersData",
  initialState: {
    buyers: null,
    newBuyers: null,
    rejectedBuyers: null,
    buyerTags: null,
    buyerLoading: false,
    error: null,
    b_msg: null,
    delete_success: null,
    block_success: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBuyersToRedux.fulfilled, (state, action) => {
        state.buyers = action.payload;
      })
      .addCase(addAllNewBuyers.fulfilled, (state, action) => {
        state.newBuyers = action.payload;
      })
      .addCase(addAllRejectedBuyers.fulfilled, (state, action) => {
        state.rejectedBuyers = action.payload;
      })
      .addCase(getBuyerTags.pending, (state) => {
        state.buyerLoading = true;
      })
      .addCase(getBuyerTags.fulfilled, (state, action) => {
        state.buyerLoading = false;
        state.buyerTags = action.payload.buyerTags;
      })
      .addCase(getBuyerTags.rejected, (state, action) => {
        state.buyerLoading = false;
        state.error = action.payload;
        state.b_msg = action.payload.msg;
      })
      .addCase(deleteBuyer.fulfilled, (state, action) => {
        state.delete_success = true;
        state.b_msg = action.payload.msg;
        state.buyers = state.buyers.filter(
          (ele) => ele.user_id != action.meta.arg.user_id
        );
        //state.rejectedBuyers = action.payload.data;
      })
      .addCase(deleteBuyer.rejected, (state, action) => {
        state.delete_success = false;
        state.b_msg = action.payload.msg;
      })
      .addCase(blockBuyer.fulfilled, (state, action) => {
        state.block_success = true;
        state.b_msg = action.payload.msg;
        state.buyers = state.buyers.filter(
          (ele) => ele.user_id != action.meta.arg.user_id
        );
      })
      .addCase(blockBuyer.rejected, (state, action) => {
        state.block_success = false;
        state.b_msg = action.payload.msg;
      })
      .addCase(updateMSG.fulfilled, (state, action) => {
        state.b_msg = action.payload;
        state.delete_success = null;
        state.block_success = null;
      })
      .addCase(addBuyer.fulfilled, (state, action) => {
        if (Array.isArray(state.newBuyers)) {
          state.newBuyers = [...state.newBuyers, action.payload];
        } else {
          state.newBuyers = [{ ...action.payload }];
        }
      })
      .addCase(acceptBuyer.fulfilled, (state, action) => {
        const data = action.payload.data;
        const key = action.payload.key;
        if (key === "newApp") {
          if (state.newBuyers) {
            state.newBuyers = state.newBuyers.filter(
              (ele) => ele.user_id != data.user_id
            );
          }
        }
        if (key === "rejApp") {
          if (state.rejectedBuyers) {
            state.rejectedBuyers = state.rejectedBuyers.filter(
              (ele) => ele.user_id != data.user_id
            );
          }
        }

        if (Array.isArray(state.buyers)) {
          state.buyers = [...state.buyers, { ...data, status: "approved" }];
        } else {
          state.buyers = [{ ...data, status: "approved" }];
        }
      })
      .addCase(rejectBuyer.fulfilled, (state, action) => {
        const data = action.payload.data;
        if (state.newBuyers) {
          state.newBuyers = state.newBuyers.filter(
            (ele) => ele.user_id != data.user_id
          );
        }

        if (state.rejectedBuyers) {
          state.rejectedBuyers = [
            ...state.rejectedBuyers,
            { ...data, status: "rejected" },
          ];
        } else {
          state.rejectedBuyers = [{ ...data, status: "rejected" }];
        }
      })
      .addCase(addBuyerTag.fulfilled, (state, action) => {
        state.buyerTags = [...state.buyerTags, action.payload];
      });
  },
});
export default buyersSlice.reducer;
