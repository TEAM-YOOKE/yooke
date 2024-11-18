import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InsufficientFunds() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        disableElevation
        variant="contained"
        fullWidth // Apply fullWidth to make button span the full width
        type="submit" // Set the type to "submit" for form submission
        sx={{
          height: "47px",
          textTransform: "none",
          boxShadow: "none",
          borderRadius: "9px",
        }}
        onClick={handleClickOpen}
      >
        Accepter le trajet
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Fonds insuffisants"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Vous avez des fonds insuffisants dans votre porte-monnaie
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Rechargez
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
