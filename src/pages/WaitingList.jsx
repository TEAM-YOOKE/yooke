import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { db } from "../firebase-config";
import { collection, query, onSnapshot } from "firebase/firestore";
import { format } from "date-fns"; // For date formatting
import SearchField from "../components/inputs/SearchField";
import YookePagination from "../components/navbars/Pagination";
import { CircularProgress } from "@mui/material";
import CircularProgressLoading from "../components/feedbacks/CircularProgressLoading";
import useWaitingList from "../hooks/watingList";

const WaitingList = () => {
  const [loading, setLoading] = useState(true);
  // const [waitingList, setWaitingList] = useState([]); // Full waiting list from Firestore
  const [filteredWaitingList, setFilteredWaitingList] = useState([]); // Filtered list after search/sort
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [sortOrder, setSortOrder] = useState("email"); // Default sorting by email
  const [pageNumber, setPageNumber] = useState(1); // Current page number
  const itemsPerPage = 5; // Number of items per page

  const {
    waitingList,
    waitingListLoading,
    refreshWatingList,
    waitingListError,
  } = useWaitingList();

  // Fetch data from Firestore
  // useEffect(() => {
  //   const q = query(collection(db, "waitinglist"));
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     const waitingListData = querySnapshot.docs.map((doc) => {
  //       const data = doc.data();
  //       return {
  //         id: doc.id,
  //         email: data.email,
  //         date: data.date?.toDate() || null, // Convert Firestore Timestamp to JS Date
  //       };
  //     });
  //     setWaitingList(waitingListData);
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  // Filter and sort data whenever searchQuery, sortOrder, or waitingList changes
  useEffect(() => {
    const filtered = waitingList?.filter((item) =>
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = filtered?.sort((a, b) => {
      return sortOrder === "email"
        ? a.email.localeCompare(b.email)
        : new Date(b.date?.toDate()) - new Date(a.date?.toDate());
    });

    console.log(sorted);

    setFilteredWaitingList(sorted);
    setPageNumber(1); // Reset to the first page when filters change
  }, [waitingList, searchQuery, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredWaitingList?.length / itemsPerPage);
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const currentItems = filteredWaitingList?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Box sx={{ overflow: "auto" }}>
      {/* Search Field */}
      <SearchField
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        label="Search by email"
      />

      {/* Sorting Chips */}
      <Box sx={{ m: 2, display: "flex", gap: 1 }}>
        <Chip
          label="Order by Email (A-Z)"
          color={sortOrder === "email" ? "primary" : "default"}
          onClick={() => setSortOrder("email")}
        />
        <Chip
          label="Most Recently Added"
          color={sortOrder === "recent" ? "primary" : "default"}
          onClick={() => setSortOrder("recent")}
        />
      </Box>

      {/* Waiting List */}
      <List>
        {waitingListLoading ? (
          <CircularProgressLoading />
        ) : (
          currentItems?.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body1">
                    <strong>Email:</strong> {item.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date Added:</strong>{" "}
                    {item.date
                      ? format(
                          new Date(item.date.toDate()),
                          "MMMM d, yyyy hh:mm a"
                        )
                      : "N/A"}
                  </Typography>
                </Box>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        )}
      </List>

      {/* Pagination */}
      <YookePagination
        page={pageNumber}
        count={totalPages}
        onChange={(e, page) => setPageNumber(page)}
      />
    </Box>
  );
};

export default WaitingList;
