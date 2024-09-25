import React from "react";
import { callApiGet } from "@/utils/FetchApi";
import { useRouter } from "next/router";

const LoginButton = ({ user_id, api_route }) => {
  const router = useRouter();
  //handle login btn click
  const handleLoginBtnClick = async () => {
    const data = await callApiGet(`${api_route}/${user_id}`);
    if (data.success) {
      //  ADMIN CREDENTIALS TO LOGIN AGAIN
      const tokenAdmin = localStorage.getItem("token");
      const dataAdmin = JSON.parse(localStorage.getItem("data"));
      localStorage.setItem("token_a", tokenAdmin);
      localStorage.setItem("data_a", JSON.stringify(dataAdmin));

      localStorage.setItem("token", data.token);
      localStorage.setItem("data", JSON.stringify(data));
      router.push("/dashboard").then(() => {
        window.location.reload();
      });
    } else {
      alert(data.msg);
    }
  };

  return (
    <button
      onClick={handleLoginBtnClick}
      className="flex items-center bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-400 text-white font-semibold py-2 px-3 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
    >
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 110.395 122.88"
        xmlSpace="preserve"
        className="h-5 w-5"
      >
        <g>
          <path
            fill="#ffffff"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0,79.239v-34.54h35.025V13.631l47.004,48.305L35.025,110.31v-31.07H0L0,79.239z M93.359,17.16L75.68,9.377L75.99,0h34.404v61.439v61.44H75.99l-0.311-6.835l17.68-10.946V17.16L93.359,17.16z"
          />
        </g>
      </svg>{" "}
      &nbsp; Login as
    </button>
  );
};

export default LoginButton;
