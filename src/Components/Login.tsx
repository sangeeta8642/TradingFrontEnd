import React, { useState } from "react";
import "../CSS/Login.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

import Human from "../images/loginpng.svg";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [see, setSee] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const nav = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(""); // Clear previous errors when user changes email
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(""); // Clear previous errors when user changes password
  };

  // const handleLogin = async () => {
  //   try {
  //     // Validation checks for email and password
  //     if (!email) {
  //       setError("Please provide an email.");
  //       return;
  //     }
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     if (!emailRegex.test(email)) {
  //       setError("Please provide a valid email address.");
  //       return;
  //     }

  //     if (!password) {
  //       setError("Please provide a password.");
  //       return;
  //     }
  //     if (password.length < 6) {
  //       setError("Password must be at least 6 characters long.");
  //       return;
  //     }

  //     const response = await fetch("http://localhost:5000/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ email, password })
  //     });

  //     if (response.ok) {
  //       const responseData = await response.json();
  //       localStorage.setItem("user", JSON.stringify(responseData.user));
  //       setTimeout(() => {
  //         console.log(responseData.user);
  //         nav('/');
  //         window.location.reload();
  //       }, 1000);
  //     } else {
  //       const errorMessage = await response.json();
  //       setError(errorMessage.message || "Invalid email or password.");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     setError("An error occurred while logging in.");
  //   }
  // };


  const handleLogin = async () => {
    try {
      // Validation checks for email and password
      if (!email) {
        setError("Please provide an email.");
        Swal.fire({
          icon: 'error',
          // title: 'Login Error',
          text: 'Please provide an email.',
          timer: 2500,
          timerProgressBar: true,
          toast: true,
          position: 'top',
          showConfirmButton: false
        });
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please provide a valid email address.");
        Swal.fire({
          icon: 'error',
          // title: 'Login Error',
          text: 'Please provide a valid email address.',
          timer: 2500,
          timerProgressBar: true,
          toast: true,
          position: 'top',
          showConfirmButton: false
        });
        return;
      }

      if (!password) {
        setError("Please provide a password.");
        Swal.fire({
          icon: 'error',
          // title: 'Login Error',
          text: 'Please provide a password.',
          timer: 2500,
          timerProgressBar: true,
          toast: true,
          position: 'top',
          showConfirmButton: false
        });
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        Swal.fire({
          icon: 'error',
          // title: 'Login Error',
          text: 'Password must be at least 6 characters long."',
          timer: 2500,
          timerProgressBar: true,
          toast: true,
          position: 'top',
          showConfirmButton: false
        });
        return;
      }

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("user", JSON.stringify(responseData.user));
        Swal.fire({
          icon: 'success',
          title: 'Loggedd In',
          text: "Loggin SuccessFull",
          timer: 2500,
          timerProgressBar: true,
          // toast: true,
          position: 'center',
          showConfirmButton: false
        });
        setTimeout(() => {
          console.log(responseData.user);
          nav('/');
          window.location.reload();
        }, 1600)

      } else {
        const errorMessage = await response.json();
        setError(errorMessage.message || "Invalid email or password.");
        // Display error message using swal
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: errorMessage.message || "Invalid email or password.",
          timer: 2500,
          timerProgressBar: true,
          // toast: true,
          position: 'center',
          showConfirmButton: true
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred while logging in.");
      // Display error message using swal
      Swal.fire({
        icon: 'error',
        // title: 'Login Error',
        text: 'An error occurred while logging in.',
        timer: 2500,
        timerProgressBar: true,
        toast: true,
        position: 'top',
        showConfirmButton: false
      });
    }
  };


  return (
    <div className="LoginPage">
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "45ch", fontWeight: "bold" },
        }}
        noValidate
        autoComplete="off"
      >
        <div className="login-form">
          <div className="login-heading">
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
                nav("/");
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
            <h1>LOGIN</h1>
          </div>
          {/* {error && <p className="error">{error}</p>} */}
          <img src={Human} alt="human" />
          <TextField
            required
            id="email"
            label="Email:"
            value={email}
            onChange={handleEmailChange} // Handle email field changes
          />
          <br />
          <TextField
            required
            id="password"
            label="Password:"
            type={see ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange} // Handle password field changes
            InputProps={{
              classes: { root: "MuiInputBase-input" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSee(!see)}>
                    {see ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              classes: {
                root: "MuiInputLabel-root", // Apply classes to the input label
              },
            }}
          />
          <p>
            {/* Forget password?<a href="#">Yes</a> */}
          </p>
          <Button
            variant="contained"
            color="success"
            onClick={handleLogin}
          >
            LOGIN
          </Button>
        </div>
      </Box>
    </div>
  );
}
