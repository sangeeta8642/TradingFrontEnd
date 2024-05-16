import React, { useState } from "react";
import "../CSS/Signup.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Human from "../images/signuppng.svg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Signup() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [see, setSee] = useState(false);
  const [cpassword, setCPassword] = useState("");
  const [csee, setCSee] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Form validation
    if (!fname || !lname || !email || !password || !cpassword) {
      // setError("All fields are required");
      Swal.fire({
        icon: 'error',
        // title: 'Login Failed',
        text: "All fields are required",
        timer: 2500,
        timerProgressBar: true,
        toast: true,
        position: 'top',
        showConfirmButton: false
      });
      return;
    }
    if (password !== cpassword) {
      setError("Passwords do not match");
      Swal.fire({
        icon: 'error',
        // title: 'Login Failed',
        text: "Passwords do not match",
        timer: 2500,
        timerProgressBar: true,
        toast: true,
        position: 'top',
        showConfirmButton: false
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname,
          lname,
          email,
          password
        }),
      });

      const responseData = await response.json(); 

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      } else {
        console.log("Response:", responseData);
      }
      Swal.fire({
        icon: 'success',
        title: 'Login SuccessFull',
        text: "Signup SuccessFull & LoggedIn",
        timer: 2500,
        timerProgressBar: true,
        // toast: true,
        position: 'center',
        showConfirmButton: false
      });
      localStorage.setItem("user", JSON.stringify(responseData));
      navigate('/')
      window.location.reload();
      console.log("Signup successful");

    } catch (error:any) {
      console.error("Error:", error.message);
      setError(error.message);
      Swal.fire({
        icon: 'error',
        // title: 'Login Failed',
        text: "error",
        timer: 2500,
        timerProgressBar: true,
        toast: true,
        position: 'top',
        showConfirmButton: false
      });
    }
  };


  return (
    <div className="signuppage">
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "45ch", fontWeight: "bold" },
        }}
        noValidate
        autoComplete="off"
      >
        <div className="signup-div">
          <div className="signup-heading">
            <svg
              className="backArrow"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="2em"
              width="2em"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                navigate("/");
              }}
            >
              <path
                fillRule="evenodd"
                d="M5.854 4.646a.5.5 0 010 .708L3.207 8l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z"
                clipRule="evenodd"
              ></path>
              <path
                fillRule="evenodd"
                d="M2.5 8a.5.5 0 01.5-.5h10.5a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"
                clipRule="evenodd"
              ></path>
            </svg>

            <h1>SIGNUP</h1>
          </div>
          <div className="signp-form">
            <img src={Human} style={{ width: "40%" }} alt="human" />
            <div>
              <TextField
                required
                id="firstname"
                label="First Name:"
                value={fname}
                onChange={(e) => {
                  setFname(e.target.value);
                }}
              />
              <br />
              <TextField
                required
                id="lastname"
                label="Last Name:"
                value={lname}
                onChange={(e) => {
                  setLname(e.target.value);
                }}
              />
              <br />
              <TextField
                required
                id="email"
                label="Email:"
                value={email}
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <br />
              <TextField
                required
                id="password"
                label="Password:"
                type={see ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSee(!see)}>
                        {see ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <br />
              <TextField
                required
                id="cpassword"
                label="Confirm Password:"
                type={csee ? "text" : "password"}
                value={cpassword}
                onChange={(e) => {
                  setCPassword(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setCSee(!csee)}>
                        {csee ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <br />
              {error && <div style={{ color: "red" }}>{error}</div>}
              <br />
            </div>
          </div>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Signup
          </Button>
        </div>
      </Box>
    </div>
  );
}
