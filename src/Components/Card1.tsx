// Card1.tsx sun npm start kr 
import * as React from "react";
import { useState } from "react";
import "../CSS/Card1.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StockData from "./Stock";
import Plot from "react-plotly.js";


import ibm from "../images/ibm.png";
import jpm from "../images/jpm.jpg";
import msft from "../images/msft.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface watchlistinterface {
  name: String;
  item: any;
  _id: String;
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

interface Card1Props {
  data: StockData[];
  getData:()=>void
}
export default function Card1({ data,getData }: Card1Props) {
  
  const [userWatchlist, showWatchlist] = useState<watchlistinterface[]>([]);
  const [ShowWatch, SetWatch] = useState<boolean>(false);
  const[showPlot,setPlot]=useState<boolean>(false)

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const nav =useNavigate()
  const [company, setCompany] = useState<StockData[]>([]);
  const[watchlistname,setwatchlistname]=useState<String>("")
  const [plotData, setplotData] = useState<any>(null);
  const [stockXvalues, setStockXValues] = useState<string[]>([]);
  const [stockYvalues, setStockYValues] = useState<string[]>([]);
  const [apicompany, setapicompany] = useState<MetaData>(initialState); 

  React.useEffect(() => {
    getWatchlist();
  }, []);
  // console.log(userWatchlist);

  async function PlotGraph(symbol:String){
    try {
      console.log(symbol);
      
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

    
  

  async function getWatchlist() {
    try {
      const response = await fetch(
        `https://tradingbackend-2w6s.onrender.com/getWatchlists/${user._id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch watchlist");
      }
      const data = await response.json(); // Extract JSON data from the response
      showWatchlist(data); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  }

  console.log(company[0],watchlistname);

async function addItem() {
  try{

 
  let result=await fetch(`https://tradingbackend-2w6s.onrender.com/addItemToInnerArray/${user._id}/${watchlistname}`,{
    method:"POST",
    headers:{
      "content-type":"application/json"
    },
    body:JSON.stringify(company[0])
  })

  result=await result.json();
  // alert(`item added to the watchlist` )
  Swal.fire({
    icon: 'success',
    title: 'Item Added Into WatchList',
    text: 'One Stock Added In The WatchList',
    // timer: 2500,
    // timerProgressBar: true,
    // toast: true,
    position: 'center',
    showConfirmButton: true
  });
  SetWatch(false)
}catch(error:any){
  
    if(error.response && error.response===400){
      Swal.fire({
        icon: 'error',
        title: 'Item Present ',
        text: `Item already Present In this WatchList`,
        // timer: 2500,
        // timerProgressBar: true,
        // toast: true
        position: 'center',
        showConfirmButton: true
      });
    }else {
      Swal.fire({
        icon: 'error',
        title: 'Error Adding',
        text: `Error in adding item`,
        // timer: 2500,
        // timerProgressBar: true,
        // toast: true
        position: 'center',
        showConfirmButton: true
      });
    }
} 
}

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
        <div className="graph-div">
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
      {ShowWatch ? (
        <>
          <div className="showWatchlist">
            <svg
              className="closeBtn"
              onClick={() => SetWatch(false)}
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 1024 1024"
              height="2em"
              width="2em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path>
              <path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
            </svg>
            {/* <h1>watchlist</h1> */}
            <div className="list">
              {userWatchlist.length > 0 ? (
                <>
                  {userWatchlist.map((item) => {
                    return (
                      <Button key={item._id.toString()} variant="text" color="info" onClick={()=>{setwatchlistname(item._id.toString());
                        addItem()
                      }}>
                        {item.name}
                      </Button>
                    );
                  })}
                   <Button variant="text" color="info" onClick={()=>{
                    nav('/watchlist')
                  }}>
                Create Watchlist
              </Button>
                </>
              ) : (
                <>
                  <p style={{fontWeight:"bold"}}>No watchlist found</p>
                  <Button variant="text" color="info" onClick={()=>{
                    nav('/watchlist')
                  }}>
                Create Watchlist
              </Button>
                </>
              )}
             
            </div>
          </div>
        </>
      ) : null}

      {data.length>0?<>{data.map((item) => (
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
              {/* <Typography sx={{ width: "900px", fontWeight: "bold", color: "#000", fontSize: "17px" }} variant="body2" color="text.secondary">
                {`Company Name: ${item.CompanyName}`}
              </Typography> */}
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
              color="success"
              onClick={() =>{
                if(user){
                  setCompany([item])
                  SetWatch(true)}
                  else{
                    alert("login/signup to access watchlist")
                    
                  }
                }}
      

            >
              Watchlist
            </Button>
            <Button size="medium"
              variant="contained"
              color="warning"
              onClick={()=>{
                setPlot(true)
                setTimeout(() => {
                  console.log("item -> Symbol");
                  console.log(item.Symbol);                  
                  PlotGraph(item.Symbol)

                }, 500);
              }}>Show</Button>
          </CardActions>
        </Card>
      ))}
</>:<><h1>No Stock Found</h1></>}



      
    </>
  );
}
