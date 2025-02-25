import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { db } from "../firebase-config";
import {
  collection,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import YookePagination from "../components/navbars/Pagination";
import AccountCard from "../components/cards/AccountCard";
import SearchField from "../components/inputs/SearchField";
import FilterChips from "../components/inputs/FilterChips";
import { CircularProgress } from "@mui/material";
import AdminAddNew from "./AdminAddNew";
import useAccounts from "../hooks/accounts";

const AdminUsersList = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // Stores all users from Firestore
  const [filteredUsers, setFilteredUsers] = useState([]); // Stores filtered users
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [selectedFilter, setSelectedFilter] = useState("All"); // Filter selection state
  const [pageNumber, setPageNumber] = useState(1); // Current page number
  const usersPerPage = 6; // Fixed number of users per page
  const [openAccountForm, setOpenAccountForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { accounts, refreshAccounts, accountsLoading, accountsError } =
    useAccounts();

  console.log(accounts);

  // Fetch users from Firestore
  // useEffect(() => {
  //   setLoading(true);
  //   const q = query(collection(db, "accounts"));
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     const usersData = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setUsers(usersData);
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  // Apply filters and search query when data or filter changes
  useEffect(() => {
    const filtered = accounts?.filter((account) => {
      const matchesSearchQuery =
        account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.username?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAccountType =
        selectedFilter === "All" || account.accountType === selectedFilter;

      return matchesSearchQuery && matchesAccountType;
    });

    setFilteredUsers(filtered);
    setPageNumber(1); // Reset to the first page when filters change
  }, [accounts, searchQuery, selectedFilter]);

  const handleClickOpenAccountForm = (user) => {
    setSelectedUser(user);
    setOpenAccountForm(true);
  };

  const handleCloseAccountForm = (user) => {
    setSelectedUser(null);
    setOpenAccountForm(false);
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "accounts", id));
      refreshAccounts();
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  // Handle pagination logic
  const startIndex = (pageNumber - 1) * usersPerPage;
  const currentUsers = filteredUsers?.slice(
    startIndex,
    startIndex + usersPerPage
  );
  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);

  // Render component
  return (
    <Box>
      {/* Search Field */}
      <SearchField
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        label="Search by email, username or company"
      />

      {/* Filter Chips */}
      <FilterChips
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* User List */}
      <List
      // sx={{
      //   display: "grid",
      //   gap: "1rem",
      //   gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      // }}
      >
        {accountsLoading ? (
          <Box
            sx={{
              height: "50vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          currentUsers?.map((user) => (
            <Box
              sx={{ cursor: "pointer", ":hover": { bgcolor: "#f0fbfb" } }}
              // onClick={() => handleClickOpenAccountForm(user)}
            >
              <AccountCard
                user={user}
                key={user.id}
                handleDelete={() => handleDelete(user.id)}
                handleClickOpenAccountForm={handleClickOpenAccountForm}
                handleCloseAccountForm={handleCloseAccountForm}
              />
            </Box>
          ))
        )}
      </List>

      {/* Pagination */}
      <YookePagination
        page={pageNumber}
        count={totalPages}
        onChange={(e, page) => setPageNumber(page)}
      />
      <AdminAddNew
        open={openAccountForm}
        handleClose={handleCloseAccountForm}
        user={selectedUser}
      />
    </Box>
  );
};

export default AdminUsersList;
