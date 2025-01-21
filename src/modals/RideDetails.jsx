import React, { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  AppBar,
  CircularProgress,
  Icon,
  IconButton,
  Typography,
  Zoom,
} from "@mui/material";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
// import OrderTrackingMap from "../OrderTrackingMap";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import CircularProgressLoading from "../components/feedbacks/CircularProgressLoading";
import RideTrackingMap from "../components/inputs/RideTrackingMap";
const style = {
  position: "absolute",
  bottom: 0,
  height: "100%",
  overflowY: "scroll",
  width: "100%",
  bgcolor: "#EFF3F6",
  boxShadow: 24,
  boxSizing: "border-box",
  background: "transparent",
};

var render = function (status) {
  if (status === Status.LOADING)
    return (
      <Box display="flex" justifyContent="center">
        <Typography>
          <CircularProgress thickness={4} />
        </Typography>
      </Box>
    );
  if (status === Status.FAILURE)
    return (
      <Box display="flex" justifyContent="center">
        <Typography variant="body2">Unable to load map...</Typography>
      </Box>
    );

  return null;
};

const RideDetails = (props) => {
  const [loading, setLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [calculatedDistance, setCalculatedDistance] = useState(0);

  const containerRef = React.useRef(null);

  return (
    <div>
      <Modal
        closeAfterTransition={true}
        open={props.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Zoom
          container={containerRef.current}
          appear={true}
          in={props.open}
          direction="left"
          mountOnEnter
          unmountOnExit
          //   timeout={300}
        >
          <Box
            sx={{
              background: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(5.8px)",
              WebkitBackdropFilter: "blur(5.8px)",
              width: "100%",
              height: "100vh",
            }}
          >
            <Box sx={style}>
              <IconButton
                sx={{
                  position: "fixed",
                  right: "5%",
                  top: "3%",
                  zIndex: 5,
                  bgcolor: "#fff",
                  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.2)",
                  },
                }}
                onClick={() => {
                  props.onClose();
                }}
              >
                <CloseIcon sx={{ color: "#000" }} />
              </IconButton>
              <Wrapper
                render={render}
                apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              >
                {/* <OrderTrackingMap
                  order={props.order}
                  lat={props.lat}
                  lng={props.lng}
                  user={props.user}
                  selectedBranch={props.selectedBranch}
                  setEstimatedTime={setEstimatedTime}
                  setCalculatedDistance={setCalculatedDistance}
                /> */}
                <RideTrackingMap
                  setEstimatedTime={setEstimatedTime}
                  setCalculatedDistance={setCalculatedDistance}
                />
                <Box borderTopRightRadius="12px" borderTopLeftRadius="12px">
                  <AppBar
                    position="fixed"
                    color="inherit"
                    sx={{
                      boxShadow: "4px 4px 8px 5px rgba(0, 0, 0, 0.2)",
                      top: "auto",
                      bottom: 0,
                      p: 2,

                      width: { md: "60%" },
                      left: { md: "20%" },
                      borderTopRightRadius: "12px",
                      borderTopLeftRadius: "12px",
                    }}
                  >
                    {estimatedTime && calculatedDistance ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="body1">
                          <strong>Estimated Time:</strong> {estimatedTime}
                        </Typography>
                        {/* <Subtitle title={calculatedDistance} my={0} /> */}

                        <IconButton size="small" color="primary">
                          <Box display="flex" alignItems="center">
                            <PhoneIcon />
                            <Typography variant="body2" fontWeight={500}>
                              Contact driver
                            </Typography>
                          </Box>
                        </IconButton>
                      </Box>
                    ) : (
                      ""
                    )}
                  </AppBar>
                </Box>
                {loading && <CircularProgressLoading />}
              </Wrapper>
            </Box>
          </Box>
        </Zoom>
      </Modal>
    </div>
  );
};

export default RideDetails;
