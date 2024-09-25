import { callApi, callApiGet } from "@/utils/FetchApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllManagerClients = createAsyncThunk(
  "getAllManagerClients",
  async (args, { rejectWithValue }) => {
    try {
      console.log("calling manager admin api");
      const data = await callApiGet("manager/get-all-client");
      console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue("Opps found an error", err.response.data);
    }
  }
);

export const clientsSlice = createSlice({
  name: "buyersData",
  initialState: {
    clients: null,
    clientLoading: false,
    error: null,
    c_msg: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllManagerClients.pending, (state) => {
        state.clientLoading = true;
      })
      .addCase(getAllManagerClients.fulfilled, (state, action) => {
        state.clientLoading = false;
        state.clients = action.payload.data;
      })
      .addCase(getAllManagerClients.rejected, (state, action) => {
        state.clientLoading = false;
        state.error = action.payload;
        state.c_msg = action.payload.msg;
      });
  },
});
export default clientsSlice.reducer;
