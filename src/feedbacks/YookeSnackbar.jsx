import { Alert, Fade, Snackbar } from "@mui/material"

const YookeSnackbar = ({message='', severity='success'})=>{

    const [snackbar, setSnackbar] = usestate({
        open:false, 
        message,
        severity
    })

    return(
        
        <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        TransitionComponent={}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    )
}

export default YookeSnackbar