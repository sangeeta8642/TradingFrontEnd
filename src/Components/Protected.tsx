import React from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function Protected() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  return (
       <div>{user ? <Outlet /> : <Navigate to="/" />}</div>
    
  );
}
