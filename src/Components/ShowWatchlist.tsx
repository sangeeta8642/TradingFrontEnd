import React, { useEffect, useState } from "react";
import StockData from "./Stock";
import Card1 from "./Card1";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import ibm from "../images/ibm.png";
import jpm from "../images/jpm.jpg";
import msft from "../images/msft.png";

interface ItemData {
  items: StockData[];
  name: String;
  onRemoveItem: (symbol: string) => void;
}

export default function ShowWatchlist({ items, name, onRemoveItem }: ItemData) {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [stock, setStock] = useState<StockData[]>([]);
  const nav = useNavigate();

  // useEffect(()=>{
  // getItems()
  // },[])

  async function getItems() {
    try {
      const response = await fetch(
        `http://localhost:5000/getItems/${user._id}/${name}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch watchlist");
      }
      const data = await response.json(); // Extract JSON data from the response
      setStock(data.items); // Update the state with fetched data
      //  console.log(items);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  }

  async function RemoveItem(symbol: string) {
    try {
      let result = await fetch(
        `http://localhost:5000/removeItem/${user._id}/${name}/${symbol}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      if (!result.ok) {
        throw new Error("Failed to remove item");
      }
      // Update the state by removing the item
      setStock(stock.filter((item) => item.Symbol !== symbol));
      alert("Stock deleted");
      console.log(result);
      // Call the callback function to handle item removal
      onRemoveItem(symbol);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }

  // console.log(items);

  const symbolToImage: Record<string, string> = {
    IBM: ibm,
    JPM: jpm,
    MSFT: msft,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {items.length > 0 ? (
        <>
          {items.map((item) => (
            <Card
              key={item._id}
              sx={{
                width: "135vh",
                height: "max-content",
                display: "flex",
                justifyContent: "center",
                border: "2px solid #000",
                marginTop: "20px",
                borderRadius: "15px",
                marginRight: "50px",
              }}
            >
              <CardMedia
                sx={{ width: "80px" }}
                image={symbolToImage[item.Symbol]} // Select the image based on the stock symbol
                title={item.CompanyName}
              />
              <CardContent
                style={{ width: "95vh" }}
                sx={{
                  display: "flex",
                  width: "auto",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "10px",
                    color: "#000",
                  }}
                >
                  <Typography
                    sx={{
                      width: "900px",
                      fontWeight: "bold",
                      color: "#000",
                      fontSize: "17px",
                    }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {`Information: ${item.Information}`},
                  </Typography>
                  <Typography
                    sx={{
                      width: "900px",
                      fontWeight: "bold",
                      color: "#000",
                      fontSize: "17px",
                    }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {`Last Refreshed: ${item.LastRefreshed}`},
                    {`Output Size: ${item.OutputSize}`},
                    {`Time Zone: ${item.TimeZone}`}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="medium"
                  variant="contained"
                  color="error"
                  onClick={() => {
                    RemoveItem(item.Symbol);
                  }}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          ))}
        </>
      ) : (
        <>
          <h1>No Items Found</h1>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              nav("/");
            }}
          >
            Add Items
          </Button>
        </>
      )}
    </div>
  );
}
