import React, { useState } from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import TripDetails from "../../modals/TripDetails";

const RideHistoryCard = ({ trip }) => {
  const [openDetails, setOpenDetails] = useState(false);

  return (
    <Box>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent>
          {/* Locations */}
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
              <TripOriginIcon
                sx={{ fontSize: 15, color: "green", marginRight: 1 }}
              />
              <Typography variant="body1">
                {trip.pickUpLocation &&
                trip.pickUpLocation.address &&
                trip.pickUpLocation.address.structured_formatting
                  ? trip.pickUpLocation.address.structured_formatting.main_text
                  : "Pick-up location"}
              </Typography>
            </Box>

            <Box
              sx={{
                borderLeft: "1px dashed gray",
                height: 20,
                marginLeft: "7px",
                marginY: "-8px",
              }}
            />

            <Box display="flex" alignItems="center">
              <TripOriginIcon
                sx={{ fontSize: 15, color: "red", marginRight: 1 }}
              />

              <Typography variant="body1">
                {trip.status === "ongoing"
                  ? "on-going"
                  : typeof trip?.dropOffLocation === "object"
                  ? trip?.dropOffLocation?.address?.structured_formatting
                      ?.main_text ||
                    trip?.dropOffLocation?.address?.description ||
                    "Destination"
                  : trip?.dropOffLocation || "Destination"}
              </Typography>
            </Box>
          </Box>

          {/* Date & Time */}
          <Box display="flex" alignItems="center" mt={2} gap={3}>
            <Box display="flex" alignItems="center">
              <EventIcon sx={{ fontSize: 18, marginRight: 1, color: "gray" }} />
              <Typography variant="body2" fontWeight="bold">
                {trip.startedAt && trip.startedAt.seconds
                  ? new Date(trip.startedAt.seconds * 1000).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      }
                    )
                  : "N/A"}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <AccessTimeIcon
                sx={{ fontSize: 18, marginRight: 1, color: "gray" }}
              />
              <Typography variant="body2" fontWeight="bold">
                {trip.startedAt && trip.startedAt.seconds
                  ? new Date(trip.startedAt.seconds * 1000).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : "N/A"}
              </Typography>
            </Box>
          </Box>

          {/* View More Button */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            mt={2}
            onClick={() => setOpenDetails(true)}
          >
            <Typography
              variant="body2"
              sx={{ color: "#22CEA6", cursor: "pointer" }}
            >
              View more
            </Typography>
            <IconButton sx={{ color: "#22CEA6", padding: "4px" }}>
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
      <TripDetails
        trip={trip}
        open={openDetails}
        onClose={() => setOpenDetails(false)}
      />
    </Box>
  );
};

export default RideHistoryCard;
