import { callApi, callApiGet } from "@/utils/FetchApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllManagers = createAsyncThunk(
  "getAllManagers",
  async (args, { rejectWithValue }) => {
    try {
      console.log("getting all managers");
      const data = await callApiGet("get-all-managers");
      console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue("Opps found an error", err.response.data);
    }
  }
);

export const deleteManager = createAsyncThunk(
  "deleteManager",
  async (args, { rejectWithValue }) => {
    try {
      console.log("deleting manager");
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
export const blockManager = createAsyncThunk(
  "blockManager",
  async (args, { rejectWithValue }) => {
    try {
      console.log("blocking manager");
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

export const updateMSGManager = createAsyncThunk(
  "updateMSGManager",
  async (data, { rejectWithValue }) => {
    return null;
  }
);

export const addManager = createAsyncThunk(
  "addManager",
  async (data, { rejectWithValue }) => {
    return data;
  }
);

export const managersSlice = createSlice({
  name: "managersSlice",
  initialState: {
    managers: null,
    managersLoading: false,
    error: null,
    m_msg: null,
    delete_success: null,
    block_success: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllManagers.pending, (state) => {
        state.managersLoading = true;
      })
      .addCase(getAllManagers.fulfilled, (state, action) => {
        state.managersLoading = false;
        if (action.payload.data) state.managers = action.payload.data;
        else state.managers = [];
      })
      .addCase(getAllManagers.rejected, (state, action) => {
        state.managersLoading = false;
        state.error = action.payload;
        state.m_msg = action.payload.msg;
      })

      .addCase(deleteManager.fulfilled, (state, action) => {
        state.delete_success = true;
        state.m_msg = action.payload.msg;
        state.managers = state.managers.filter(
          (ele) => ele.user_id != action.meta.arg.user_id
        );
      })
      .addCase(deleteManager.rejected, (state, action) => {
        state.delete_success = false;
        state.m_msg = action.payload.msg;
      })
      .addCase(blockManager.fulfilled, (state, action) => {
        state.block_success = true;
        state.m_msg = action.payload.msg;
        state.managers = state.managers.filter(
          (ele) => ele.user_id != action.meta.arg.user_id
        );
      })
      .addCase(blockManager.rejected, (state, action) => {
        state.block_success = false;
        state.m_msg = action.payload.msg;
      })
      .addCase(updateMSGManager.fulfilled, (state, action) => {
        state.m_msg = action.payload;
        state.delete_success = null;
        state.block_success = null;
      })
      .addCase(addManager.fulfilled, (state, action) => {
        if (Array.isArray(state.managers)) {
          state.managers = [...state.managers, action.payload];
        } else {
          state.managers = [{ ...action.payload }];
        }
      });
  },
});
export default managersSlice.reducer;
