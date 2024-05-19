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
import Plot from "react-plotly.js";


import ibm from "../images/ibm.png";
import jpm from "../images/jpm.jpg";
import msft from "../images/msft.png";



interface ItemData {
  items: StockData[];
  name: String;
  onRemoveItem: (symbol: string) => void;
}

interface TimeSeriesData {
  [key: string]: {
    '1. open': string;
    "2. high":string;
    "3. low":string
    "4. close":string
    "5. volume":string
  };
}

interface MetaData {
  "1. Information": string,
  "2. Symbol": string,
  "3. Last Refreshed": any,
  "4. Output Size": string,
  "5. Time Zone": string
}

const initialState: MetaData = {
  "1. Information": "",
  "2. Symbol": "",
  "3. Last Refreshed": null,
  "4. Output Size": "",
  "5. Time Zone": ""
};

export default function ShowWatchlist({ items, name, onRemoveItem }: ItemData) {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [stock, setStock] = useState<StockData[]>([]);
  const nav = useNavigate();
  const[showPlot,setPlot]=useState<boolean>(false)
  const [plotData, setplotData] = useState<any>(null);
  const [stockXvalues, setStockXValues] = useState<string[]>([]);
  const [stockYvalues, setStockYValues] = useState<string[]>([]);
  const [apicompany, setapicompany] = useState<MetaData>(initialState); 

  // useEffect(()=>{
  // getItems()
  // },[])

  async function PlotGraph(symbol:String){
    try {
      let result =await fetch(`https://tradingbackend-2w6s.onrender.com/GettingStocksData/${symbol}`)
      if (!result.ok) {
        throw new Error('Error fetching data');
      }
      const responseData = await result.json();
      console.log(responseData);
      setplotData(responseData);
      console.log("responseData ++++++++");
      console.log(responseData['Meta Data']); 
      console.log("responseData -------");
      console.log(responseData['Time Series (Daily)']);
      setapicompany(responseData['Meta Data'])

      // Loop through the daily time series data and extract values
      const timeSeriesData: TimeSeriesData = responseData['Time Series (Daily)'];
      const xValues: string[] = [];
      const yValues: string[] = [];
      for (const key in timeSeriesData) {
        if (Object.prototype.hasOwnProperty.call(timeSeriesData, key)) {
          const typedKey = key as keyof TimeSeriesData;
          xValues.push(key);
          yValues.push(timeSeriesData[typedKey]['1. open']);
        }
      }

      setStockXValues(xValues);
      setStockYValues(yValues);

      console.log("X values", xValues);
      console.log("Y Values", yValues);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  async function getItems() {
    try {
      const response = await fetch(
        `https://tradingbackend-2w6s.onrender.com/getItems/${user._id}/${name}`
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
        `https://tradingbackend-2w6s.onrender.com/removeItem/${user._id}/${name}/${symbol}`,
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
    <>
     {
      showPlot?
        <>
        <div className="graph-div" style={{width:"70vw",height:"auto",backgroundColor:"#fff",position:"absolute",zIndex:"1"}}>
          <div className='WrongHeader' >
      <button onClick={()=>setPlot(false)} >Close</button>
          </div>

          <div className='MainDetails' >
            {apicompany ?
            <div> <p>Information: {apicompany["1. Information"]}</p>
            <p>Symbol: {apicompany["2. Symbol"]}</p>
            <p>Last Refreshed: {apicompany["3. Last Refreshed"]}</p>
            <p>Output Size: {apicompany["4. Output Size"]}</p>
            <p>Time Zone: {apicompany["5. Time Zone"]}</p>
            </div>
             : <div>Not Found</div>}
          </div>

          <div className='Graph' >
          <Plot
        data={[
          {
            x: stockXvalues,
            y: stockYvalues,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          }
        ]}
        layout={ {width: 700, height: 300, title: 'A Fancy Plot'} }
      />
          </div>
        <div>

        </div>
        </div>
        </>:null
      
    }
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
              <Button size="medium"
              variant="contained"
              color="warning"
              onClick={()=>{
                setPlot(true)
                setTimeout(() => {
                  console.log(item.Symbol);
                  
                  PlotGraph(item.Symbol)

                }, 500);
              }}>Show</Button>
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
        {
          name!==""?<> <h1>No Items Found</h1>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              nav("/");
            }}
          >
            Add Items
          </Button></>:null
        }
         
        </>
      )}
    </div>
    </>
  );
}
