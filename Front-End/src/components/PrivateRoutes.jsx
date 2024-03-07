import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const { currentUser } = useSelector((state) => state.user);
  return <>{currentUser?.token ? <Outlet /> : <Navigate to={"/sign-in"} />}</>;
};

export default PrivateRoutes;
