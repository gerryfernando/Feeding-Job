"use client";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme(); // Customize the theme as needed

const ThemeWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default ThemeWrapper;
