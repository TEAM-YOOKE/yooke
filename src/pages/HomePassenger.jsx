import * as React from "react";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
// import SelectLocation from "../components/SelectLocation";
// import { BookingCards } from "../components/BookingCards";
import { LanguageContext } from "../helpers/LanguageContext";
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import { auth, db } from "../firebase-config";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
function HomePassenger() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const [pickupPoint, setPickupPoint] = useState("");
  const [dropOffPoint, setDropOffPoint] = useState("");
  const [departureTime, setDepartureTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [loading, setLoading] = useState(false)

  console.log(auth.currentUser.email)

  const isSearchEnabled =
    pickupPoint && dropOffPoint && departureTime && selectedSeats;

  // const handleSearch = () => {
  //   if (isSearchEnabled) {
  //     navigate(
  //       `/app/available-routes?pickup=${pickupPoint}&dropoff=${dropOffPoint}&time=${departureTime}&seats=${selectedSeats}`
  //     );
  //   }
  // };

  const handlePickUpChange= (e)=>{
    setPickupPoint(e.target.value)
  }

  const handleUpdateLocation = async()=>{
    try {
      setLoading(true)
      const personQ = query(
        collection(db, "accounts"),
        where("email", "==", auth.currentUser.email)
      )
      const personQuerySnapshot = await getDocs(personQ)

      if(!personQuerySnapshot.empty) {
        const personDoc = personQuerySnapshot.docs[0]
        const personDocRef = doc(db, "accounts", personDoc.id)
        await updateDoc(personDocRef, {pickUpLocation: pickupPoint })
        console.log("location updated")
      }else{
        console.log("person not found")
      }
    } catch (error) {
      console.log("error updating location", error)
      
    }finally{
      setLoading(false)
    }
  }

  return (
    <Box sx={{ padding: "0 24px" }}>
    <Typography
    
    sx={{
      fontWeight: '400', // Bold styling for the text
      color: '#333',       // Dark gray color
      marginBottom: '8px', // Margin below the Typography
      width: "369px",
      height: "96px",
      font: "jost",
      marginTop: "62px"
    }} 

    >
      
     As an employee of XYZ company, a feet of cars will take care of your transportation. Please them know where they can pick you up
    </Typography>

      <Box paddingTop={3}>
      <TextField id="outlined-basic" label="pickup location" variant="outlined" 
      fullWidth
      sx={{ 
      height: "24px", 
      width: "114",
      font: "jost",
      fontWeight: "400", 
          
      }}
      value={pickupPoint}
      onChange={handlePickUpChange}
     />
      </Box>

      <Button
        disableElevation
        variant="contained"
        fullWidth
        type="button"
        disabled={loading}
        sx={{
          height: "48px",
        
          textTransform: "none",
          boxShadow: "none",
          borderRadius: "9px",
          marginTop: "50px",
        }}
        onClick={handleUpdateLocation}
      >
        {loading? "loading...": language.homePassenger.searchButton}
      </Button>
    </Box>
  );
}

export default HomePassenger;
