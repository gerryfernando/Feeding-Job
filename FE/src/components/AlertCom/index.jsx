import { ErrorRounded } from "@mui/icons-material";
import { Box, Container, Grid, Modal, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const AlertCom = ({
  title = "",
  message = "",
  open = false,
  width = "460px",
  type = "success",
  cancelText,
  onConfirm,
  okText,
  onClose = () => {},
  loading = false,
  duration = 500,
  testId,
  sx,
}) => {
  const colors = {
    error: "#FC0005",
    info: "#A1A3A5",
    success: "#4FCB09",
  };

  return (
    <Modal
      data-testid={testId}
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;
        onClose();
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: width,
          bgcolor: "#ffffff",
          borderRadius: "10px",
          border: "none",
          ...sx,
        }}
      >
        <Container>
          <Grid container textAlign={"center"} py={2}>
            <Grid item xs={12} mt={2} mb="20px">
              <ErrorRounded sx={{ color: colors[type], fontSize: 100 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{ marginBottom: "10px", fontWeight: "bold" }}
                fontSize="20px"
              >
                {title}
              </Typography>
              <Typography px={2} fontSize="15px">
                {message}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ margin: "30px 0" }} px={2}>
              <Grid spacing={1} justifyContent="center" container px={1}>
                <Grid xs={12} sm={!onConfirm ? 12 : 6} item>
                  <LoadingButton
                    size="small"
                    fullWidth
                    variant="outlined"
                    onClick={onClose}
                    loading={loading}
                  >
                    {cancelText || "Cancel"}
                  </LoadingButton>
                </Grid>
                {!!onConfirm && (
                  <Grid xs={12} sm={6} item>
                    <LoadingButton
                      size="small"
                      loading={loading}
                      fullWidth
                      variant="contained"
                      fontcolor="#fff"
                      color={type || "primary"}
                      onClick={onConfirm}
                    >
                      {okText || "Yes"}
                    </LoadingButton>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Modal>
  );
};

export default AlertCom;
