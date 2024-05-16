// Home.tsx
import { useState, useEffect } from "react";
import "../CSS/Home.css";
import Card1 from "./Card1";
import NavBar from "./NavBar";
import  StockData  from "./Stock"; // Import StockData interface

export default function Home() {
  const [stock, setStock] = useState<string>("");
  const [data, setData] = useState<StockData[]>([]);

  useEffect(() => {
    getData();
  }, []);

  
  const getData = async () => {
    try {
      const response = await fetch("https://tradingbackend-2w6s.onrender.com/GettingAllstocks");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setStock(e.target.value);
  // };

  const handleStockChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setStock(e.target.value);
      const response = await fetch(`https://tradingbackend-2w6s.onrender.com/search?q=${e.target.value}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  return (
    <div className="home">
      <NavBar />
      <h1>Welcome to TradeGenius</h1>
      <input
        placeholder="Search the stock you want..!!"
        value={stock}
        onChange={handleStockChange}
      />
      <Card1 data={data} getData={getData} />
    </div>
  );
}
