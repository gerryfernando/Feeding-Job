import HomePage from "../pages/HomePage";
import ThemeWrapper from "../components/Theme";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("Test in home page", () => {
  it("renders home page and components", () => {
    render(<HomePage />);
    expect(screen.getByTestId("homeContainer")).toBeInTheDocument();
    expect(screen.getByTestId("homeTable")).toBeInTheDocument();
    expect(screen.getByText("Add Job")).toBeInTheDocument();
    expect(screen.getByText("Generate Jobs")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  it("renders modal generate job", async () => {
    render(<HomePage />);
    expect(screen.queryByTestId("homeGenerateModal")).toBeNull();
    fireEvent.click(screen.getByText("Generate Jobs"));
    await waitFor(() => {
      expect(screen.getByTestId("homeGenerateModal")).toBeInTheDocument();
    });
  });

  it("renders modal add job", async () => {
    render(<HomePage />);
    const button = screen.getByText("Add Job");
    expect(screen.queryByTestId("homeFormModal")).toBeNull();
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    await waitFor(() =>
      expect(screen.getByTestId("homeFormModal")).toBeInTheDocument()
    );
  });

  it("renders form job", async () => {
    render(<HomePage />);
    const button = screen.getByText("Add Job");
    fireEvent.click(button);
    await waitFor(() =>
      expect(screen.getByTestId("formJob")).toBeInTheDocument()
    );
  });

  // it("expect filter job", async () => {
  //   render(<HomePage />);
  //   const filter = screen.getByTestId("filterJob");
  //   expect(filter).toBeInTheDocument();
  //   fireEvent.click("Angular");

  //   const option = screen.getByText("Angular");
  //   fireEvent.click(option);
  //   await waitFor(() => {
  //     expect(filter).toHaveValue("Angular");
  //   });
  // });
});
