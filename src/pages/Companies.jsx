import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import CompanyCard from "../components/cards/CompanyCard";
import { db } from "../firebase-config";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import RefreshIcon from "@mui/icons-material/Refresh";
import YookePagination from "../components/navbars/Pagination";
import SearchField from "../components/inputs/SearchField";
import CircularProgressLoading from "../components/feedbacks/CircularProgressLoading";
import useCompanies from "../hooks/companies";
import CompanyForm from "../components/dialogs/CompanyForm";
function Companies() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openCompanyForm, setOpenCompanyForm] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const { companies, refreshCompanies, companiesLoading } = useCompanies();

  const companiesPerPage = 6;

  // Apply filters and search query when data or filter changes
  useEffect(() => {
    const filtered = companies?.filter((company) => {
      const matchesSearchQuery = company.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearchQuery;
    });

    setFilteredCompanies(filtered);
    setPageNumber(1); // Reset to the first page when filters change
  }, [companies, searchQuery]);

  const handleSelectedCompany = (company) => {
    setSelectedCompany(company);
  };

  const handleClickOpenCompanyForm = (company) => {
    setSelectedCompany(company);
    setOpenCompanyForm(true);
  };

  const handleCloseCompanyForm = (user) => {
    setSelectedCompany(null);
    setOpenCompanyForm(false);
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        // Delete the company document
        await deleteDoc(doc(db, "companies", companyId));

        // Refresh the company list
        refreshCompanies();
        alert("Company was successfully deleted.");
      } catch (error) {
        console.error("Error deleting company: ", error);
        alert(
          "An error occurred while deleting the company. Please try again."
        );
      }
    }
  };

  // Handle pagination logic
  const startIndex = (pageNumber - 1) * companiesPerPage;
  const currentCompanies = filteredCompanies?.slice(
    startIndex,
    startIndex + companiesPerPage
  );
  const totalPages = Math.ceil(filteredCompanies?.length / companiesPerPage);

  const buttonStyles = {
    backgroundColor: "#001023",
    color: "#fff",
    "&:hover": { backgroundColor: "#333" },
  };

  return (
    <Box>
      <Grid container spacing={8} sx={{ paddingX: 4 }}>
        {/* List of companies */}
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box flexGrow={1}>
              <SearchField
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                label="Search by company name..."
              />
            </Box>
            <Button
              onClick={() => refreshCompanies()}
              variant="outlined"
              color="primary"
              size="small"
              aria-label="Refresh companies"
            >
              <RefreshIcon />
            </Button>
          </Box>

          {companiesLoading ? (
            <CircularProgressLoading />
          ) : currentCompanies && currentCompanies.length ? (
            currentCompanies.map((company, index) => (
              <CompanyCard
                key={index}
                my={1}
                company={company}
                handleDeleteCompany={handleDeleteCompany}
                handleClickOpenCompanyForm={handleClickOpenCompanyForm}
                handleCloseCompanyForm={handleCloseCompanyForm}
              />
            ))
          ) : (
            <Typography variant="body2">No companies available</Typography>
          )}
        </Grid>
      </Grid>

      <YookePagination
        page={pageNumber}
        count={totalPages}
        onChange={(e, page) => setPageNumber(page)}
      />

      <CompanyForm
        open={openCompanyForm}
        handleClose={handleCloseCompanyForm}
        company={selectedCompany}
      />
    </Box>
  );
}

export default Companies;
