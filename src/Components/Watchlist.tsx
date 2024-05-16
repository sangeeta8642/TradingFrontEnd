import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import "../CSS/Watchlist.css";
import { json } from "react-router-dom";
import ShowWatchlist from "./ShowWatchlist";
import StockData from "./Stock";
import { Button } from '@mui/material';
import Swal from "sweetalert2";

interface watchlistinterface {
  name: String;
  item: any;
  _id: String;
}

export default function Watchlist() {
  const [name, setName] = useState<string>("")
  const [stock, setStock] = useState<string>("");
  const [innerArrayName, setArrayName] = useState<string>("");
  const [watchlists, setWatchlists] = useState<watchlistinterface[]>([]);
  const [ShowWatch, SetWatch] = useState<boolean>(false);
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [items, setItems] = useState<StockData[]>([])

  // const getWatchlistName = (watlistname:String) => {
  //   setName(watlistname);
  // };

  useEffect(() => {
    getWatchlist();
  }, []);

  async function RemoveItemFromState(symbol: string) {
    setItems(items.filter(item => item.Symbol !== symbol));
  }

  async function getWatchlist() {
    try {
      const response = await fetch(
        `https://tradingbackend-2w6s.onrender.com/getWatchlists/${user._id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch watchlist");
      }
      const data = await response.json(); // Extract JSON data from the response
      setWatchlists(data); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  }

  async function removeWatchlist() {
    try {
      let result = await fetch(`https://tradingbackend-2w6s.onrender.com/deleteWatchlist/${user._id}/${name}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json"
        }
      });

      if (!result.ok) {
        throw new Error('Failed to delete watchlist');
      }

      // If the deletion is successful, update the watchlists state with the new data
      const updatedWatchlists = await result.json();
      setWatchlists(updatedWatchlists);
      console.log(watchlists);


      // Clear the items associated with the removed watchlist
      setItems([]);

      // Clear the name of the removed watchlist
      setName("");
    } catch (error) {
      console.error('Error removing watchlist:', error);
      // Handle error (e.g., display an error message to the user)
    }
  }


  async function getItems() {
    try {
      const response = await fetch(`https://tradingbackend-2w6s.onrender.com/getItems/${user._id}/${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch watchlist');
      }
      const data = await response.json(); // Extract JSON data from the response
      setItems(data.items); // Update the state with fetched data
      //  console.log(items);

    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  }

  async function CreateWatchlist() {
    if (innerArrayName !== "") {
      // alert("Input field is not empty. Value: " + innerArrayName);
      const data = { innerArrayName };
      try {
        const result = await fetch(
          `https://tradingbackend-2w6s.onrender.com/createInnerArray/${user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // Convert data object to JSON string
          }
        );

        // Check if the response is not OK
        if (!result.ok) {
          throw new Error("Failed to create inner array");
        }

        const responseData = await result.json(); // Parse the JSON response
        console.log(responseData);
        SetWatch(false);
        // alert("watchlist created");
        Swal.fire({
          icon: 'success',
          title: 'Watchlist Created ',
          text: `WatchList Created By Name ` + innerArrayName,
          timer: 2500,
          timerProgressBar: true,
          // toast: true,
          position: 'center',
          // showConfirmButton: true
        });
        getWatchlist();
      } catch (error) {
        console.error("Error creating inner array:", error);
        // Handle error
      }

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Enter The Watchlist Name',
        text: 'Watchlist field is empty.',
        timer: 2500,
        timerProgressBar: true,
        toast: true,
        position: 'bottom-start',
        showConfirmButton: false
      });
    }
  }

  return (
    <div className="watchlist">
      <NavBar />
      {watchlists.length <= 0 ? (
        <>
          <h1>No Watch List Found</h1>
        </>
      ) : null}
      <div className="watchlist-content">
        <div className="watchlist-nav">
          <button onClick={() => SetWatch(!ShowWatch)}>+ New Watchlist</button>
          {watchlists.length > 0 ? (
            <>
              {watchlists.map((watchlist) => {
                return (
                  <button
                  key={watchlist.name.toString()}
                    // key={watchlist.name}
                    onClick={() => {
                      setName(watchlist.name.toString())
                      getItems()
                    }}
                  >
                    {watchlist.name}
                  </button>
                );
              })}
            </>
          ) : null}
        </div>
        <Button variant="contained" color="success" onClick={removeWatchlist} >Remove {name}</Button>
        <div className="watchlist-cards">
          <ShowWatchlist items={items} name={name} onRemoveItem={RemoveItemFromState} />
        </div>
      </div>

      {/* Model Diaplay */}
      {ShowWatch ? (
        <div className="Showdiv">
          <div className="Header">Create New WatchList</div>
          <div className="Middle">
            <input
              type="text"
              value={innerArrayName}
              onChange={(e) => setArrayName(e.target.value)}
            />
          </div>
          <div className="Bottom">
            <button className="btn2" onClick={() => SetWatch(false)}>
              Close
            </button>
            <button className="btn1" onClick={CreateWatchlist}>
              Create
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
