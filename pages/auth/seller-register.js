import React from "react";

import Auth from "@/layouts/Auth";
import SellerRegistrationForm from "@/components/RegistrationForm/SellerRegistrationForm";

export default function Register() {
  return (
    <div className="container mx-auto px-4 h-full">
      <div
        style={{ gap: "24px" }}
        className="flex justify-between flex-wrap h-full"
      >
        <div className="lg:w-4/12 px-4">
          <h1 style={{ fontSize: "32px", color: "orangered" }}>
            Welcome to the eAuction Registration Portal (Seller)
          </h1>
          <p style={{ fontSize: "18px", color: "white", marginTop: "16px" }}>
            Registering as a seller on eAuction empowers you to showcase your
            products to a worldwide audience and maximize your sales potential.
            Begin by selecting the Seller option during the registration
            process. You'll need to fill out your profile details, including
            your business name (if applicable), contact information, and
            preferred payment method to receive funds from your sales.
          </p>
        </div>
        <div className="w-full lg:w-6/12 px-4">
          <SellerRegistrationForm />
        </div>
      </div>
    </div>
  );
}

Register.layout = Auth;
