import React from "react";

import Auth from "@/layouts/Auth";
import BuyerRegistrationForm from "@/components/RegistrationForm/BuyerRegistrationForm";

export default function Register() {
  return (
    <div className="container mx-auto px-4 h-full">
      <div
        style={{ gap: "24px" }}
        className="flex justify-between flex-wrap h-full"
      >
        <div className="lg:w-4/12 px-4">
          <h1 style={{ fontSize: "32px", color: "orangered" }}>
            Welcome to the eAuction Registration Portal (Buyer)
          </h1>
          <p style={{ fontSize: "18px", color: "white", marginTop: "16px" }}>
            As a buyer on eAuction, you're about to embark on a journey filled
            with thrilling bids and exclusive finds. Our registration process is
            designed to be quick and seamless, ensuring you can start exploring
            and bidding on items in no time.
          </p>
        </div>
        <div className="w-full lg:w-6/12 px-4">
          <BuyerRegistrationForm />
        </div>
      </div>
    </div>
  );
}

Register.layout = Auth;
