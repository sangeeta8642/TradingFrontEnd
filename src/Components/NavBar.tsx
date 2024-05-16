import * as React from "react";
import "../CSS/NavBar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";



const user = localStorage.getItem("user");
const pages = ["Login", "Signup"];
const withUser = ["Dashboard", "Watchlist"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function NavBar() {
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    localStorage.removeItem("user");
    Swal.fire({
      icon: 'success',
      title: 'LoggOut',
      text: "LogOut SuccessFull",
      timer: 2500,
      timerProgressBar: true,
      // toast: true,
      position: 'center',
      showConfirmButton: false
    });
    window.location.reload();
    navigate('/')
  }
  
  return (
    <AppBar
      className="navbar1"
      position="static"
      sx={{ width: "90vw", border: "1px solid black", backgroundColor: "black", boxShadow: "2px 0px 20px 0px #707070" }}
    >
      <Container maxWidth="xl" style={{ marginLeft: "0" }} >
        <Toolbar disableGutters>
          <TrendingUpIcon
            sx={{
              display: {
                xs: "none",
                md: "flex",
                width: "34px",
                height: "44px",
              },
              mr: 1,
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 1,
              fontSize: "20px",
              display: { xs: "none", md: "flex" },
              fontFamily: 'monospace',
              fontWeight: "bold",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TradeGenius
          </Typography>

          <Box className='Boxname' sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"

              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {user ? <> <MenuItem onClick={() => {
                navigate('/')
              }} >
                <Typography textAlign="center" fontWeight="bold">
                  Dashboard{" "}
                </Typography>
              </MenuItem>
                <MenuItem onClick={() => {
                  navigate('/watchlist')
                }}>
                  <Typography textAlign="center" fontWeight="bold">
                    MyWatchlist{" "}
                  </Typography>
                </MenuItem>

              </>
                : <div>
                  <MenuItem onClick={() => {
                  navigate('/login')
                }}>

                  <Typography textAlign="center" fontWeight="bold">
                    Login{" "}
                  </Typography>
                </MenuItem>
                  <MenuItem onClick={() => {
                    navigate('/signup')
                  }}>
                    <Typography textAlign="center" fontWeight="bold">
                      Signup{" "}
                    </Typography>
                  </MenuItem>
                </div>}
            </Menu>
          </Box>

          <TrendingUpIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "left",
              // flexGrow: 1,
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TradeGenius
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
            {user ? (
              <>
                {" "}
                <Button
                  onClick={() => {
                    navigate('/')
                  }}
                  sx={{ my: 2, color: "white", display: "block", fontWeight: "bold" }}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => {
                    navigate('/watchlist')
                  }}
                  sx={{ my: 2, color: "white", display: "block", fontWeight: "bolder" }}
                >
                  Watchlist
                </Button>
                <Button
                  onClick={logout}
                  sx={{ my: 2, color: "white", display: "block", fontWeight: "bolder" }}
                >
                  LogOut
                </Button>

              </>
            ) : (
              <>
                {" "}
                <Button
                  onClick={() => {
                    navigate('/login')
                  }}
                  sx={{ my: 2, ml: 2, color: "white", display: "block", fontWeight: "bolder" }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    navigate('/signup')
                  }}
                  sx={{ my: 2, ml: 2, color: "white", display: "block", fontWeight: "bolder" }}
                >
                  Signup
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? <> <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <svg stroke="currentColor" fill="#fff" stroke-width="0" viewBox="0 0 496 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg>

              </IconButton>
            </Tooltip></> : null}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
