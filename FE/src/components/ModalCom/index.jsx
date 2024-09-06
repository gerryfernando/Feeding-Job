import { CancelRounded, CheckCircleRounded, Close } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const ModalCom = ({
  open,
  onClose,
  title,
  size = "md",
  okText,
  cancelText,
  children,
  onConfirm = null,
  minHeight,
  loading,
  testId,
}) => {
  return (
    <Dialog
      data-testid={testId}
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          boxShadow: "1px 1px 8px rgb(0,0,0,0.5)",
          padding: { xs: "10px", sm: "30px" },
          maxHeight: "85vh",
          minHeight: minHeight || "unset",
        },
      }}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;
        onClose();
      }}
      maxWidth={size}
      fullWidth
      hideBackdrop
    >
      <DialogTitle mb={{ xs: 1, sm: title ? "15px" : "0px" }}>
        {title && (
          <>
            <Typography fontSize={{ xs: 24, sm: 36 }} fontWeight={800}>
              {title}
            </Typography>
          </>
        )}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 18,
              top: 18,
            }}
          >
            <Close />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Grid container columnSpacing={1} mt={{ xs: 1.5, sm: "40px" }}>
          <Grid
            item
            xs={12}
            sx={{
              textAlign: { xs: "center", sm: "right" },
              py: 1,
              pr: { sm: 2 },
            }}
          >
            <LoadingButton
              loading={loading}
              variant="outlined"
              size="medium"
              sx={{ mr: 1, borderRadius: "5px", paddingX: 4 }}
              startIcon={<CancelRounded />}
              onClick={onClose}
              type="button"
            >
              <span> {cancelText || "Cancel"}</span>
            </LoadingButton>

            <LoadingButton
              loading={loading}
              startIcon={<CheckCircleRounded />}
              loadingPosition="start"
              type={!!onConfirm ? "button" : "submit"}
              fontcolor="#fff"
              sx={{ mr: 1, borderRadius: "5px", paddingX: 4 }}
              variant="contained"
              onClick={onConfirm}
            >
              {okText || "OK"}
            </LoadingButton>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCom;
