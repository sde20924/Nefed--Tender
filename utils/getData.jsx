import {
  addAllRejectedSellers,
  addSellersToRedux,
} from "@/store/slices/sellerSlice";

const {
  addBuyersToRedux,
  addAllRejectedBuyers,
} = require("@/store/slices/buyersSlice");
const { callApiGet } = require("./FetchApi");

//get all verified buyers
export const getAllApprovedBuyers = async (dispatch) => {
  const data = await callApiGet("get-all-verified-buyers");
  console.log(data);
  if (data.success) {
    if (data.data) {
      dispatch(addBuyersToRedux(data.data));
    } else {
      dispatch(addBuyersToRedux([]));
    }
  } else {
    alert(data.msg);
  }
};

// get all rejected buyers
export const getAllRejectedBuyers = async (dispatch) => {
  const data = await callApiGet("get-all-rejected-buyers");
  console.log(data);
  if (data.success) {
    if (data.data) {
      dispatch(addAllRejectedBuyers(data.data));
    } else {
      dispatch(addAllRejectedBuyers([]));
    }
  } else {
    alert(data.msg);
  }
};

//get all verified sellers
export const getAllApprovedSellers = async (dispatch) => {
  const data = await callApiGet("get-all-verified-sellers");
  console.log(data);
  if (data.success) {
    if (data.data) {
      dispatch(addSellersToRedux(data.data));
    } else {
      dispatch(addSellersToRedux([]));
    }
  } else {
    alert(data.msg);
  }
};

// get all rejected buyers
export const getAllRejectedSellers = async (dispatch) => {
  const data = await callApiGet("get-all-rejected-sellers");
  console.log(data);
  if (data.success) {
    if (data.data) {
      dispatch(addAllRejectedSellers(data.data));
    } else {
      dispatch(addAllRejectedSellers([]));
    }
  } else {
    alert(data.msg);
  }
};
