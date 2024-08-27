import { MenuBook, Work } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";

const Navbar = () => {
  return (
    <AppBar position="absolute">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Stack gap={1} direction="row" display="flex" alignItems="center">
            <Work sx={{ mr: 1 }} />
            <Typography
              noWrap
              color="#fff"
              fontSize="18px"
              component="a"
              href="/"
              sx={{
                mr: 2,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              JOB VACANCY
            </Typography>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
