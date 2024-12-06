import React, { useEffect, useState, useRef } from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box } from "@mui/material";

const YookePagination = ({ page, onChange, count }) => {
  const [paginationHeight, setPaginationHeight] = useState(0);
  const paginationRef = useRef(null);

  useEffect(() => {
    if (paginationRef.current) {
      setPaginationHeight(paginationRef.current.offsetHeight);
    }
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 1,
          position: "fixed",
          bottom: "0",
          width: "100%",
          bgcolor: "white",
          boxShadow: "0px -6px 8px rgba(0, 0, 0, 0.1)",
        }}
        ref={paginationRef}
      >
        <Stack spacing={2}>
          <Pagination
            count={count}
            page={page}
            onChange={onChange}
            variant="outlined"
            renderItem={(item) => (
              <PaginationItem
                sx={{ mx: 1 }}
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </Stack>
      </Box>
      <Box sx={{ height: paginationHeight }}></Box>
    </Box>
  );
};

export default YookePagination;
