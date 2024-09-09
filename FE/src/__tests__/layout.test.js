import Navbar from "../components/Layout/Navbar";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("Test layout page", () => {
  it("renders layout", () => {
    render(<Navbar />);
    expect(screen.getByTestId("navbarComponent")).toBeInTheDocument();
    expect(screen.getByTestId("titleNavbar")).toBeInTheDocument();
  });
});
