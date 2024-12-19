import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Snackbar,
  Grid,
} from "@mui/material";
import { functions } from "../../firebase-config";
import { httpsCallable } from "firebase/functions";
import useCompanies from "../../hooks/companies";

const CompanyForm = ({ open, handleClose, company }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { refreshCompanies } = useCompanies();

  // Populate form data for editing
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [company]);

  const validateField = (name, value) => {
    const validators = {
      name: (val) => val.trim() !== "" || "Company name is required",
    };
    return validators[name] ? validators[name](value) : true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const validationResult = validateField(key, formData[key]);
      if (validationResult !== true) {
        newErrors[key] = validationResult;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createCompany = httpsCallable(functions, "createCompany");
  const updateCompany = httpsCallable(functions, "createCompany");
  const handleCreateOrUpdateCompany = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      let result;
      if (company) {
        // result = await updateCompany({
        //   ...formData,
        // });
        console.log("company to update -->", company);
      } else {
        result = await createCompany({
          ...formData,
        });
      }

      console.log(
        company ? "updated company" : "added company",
        "--->",
        result.data
      );
      handleClose();
      refreshCars();
    } catch (error) {
      console.log(
        company ? "Error updating company" : "Error creating company",
        "--->",
        error
      );
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {company ? "Update Company" : "Add New Company"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} py={1}>
            <Grid item xs={12}>
              <TextField
                label="Company Name"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrUpdateCompany}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : company ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CompanyForm;
