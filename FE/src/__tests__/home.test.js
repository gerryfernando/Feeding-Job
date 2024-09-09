import HomePage from "../pages/HomePage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("Test in home page", () => {
  it("renders home page", () => {
    const { container } = render(<HomePage />);
    expect(screen.getByTestId("homeContainer")).toBeInTheDocument();
    expect(screen.getByTestId("homeTable")).toBeInTheDocument();
    expect(screen.getByText("Add Job")).toBeInTheDocument();
    expect(screen.getByText("Generate Jobs")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  it("renders modal generate job", async () => {
    render(<HomePage />);
    expect(screen.queryByTestId("homeGenerateModal")).toBeNull();
    const button = screen.getByText("Generate Jobs");
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId("homeGenerateModal")).toBeInTheDocument();
    });
  });

  it("renders modal add job", async () => {
    render(<HomePage />);
    expect(screen.queryByTestId("homeFormModal")).toBeNull();
    const button = screen.getByText("Add Job");
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

  it("expect filter job", async () => {
    render(<HomePage />);
    const select = "Angular";
    const filter = screen.getByTestId("filterJob");
    fireEvent.mouseDown(filter);

    const option = screen.getByText(select);
    fireEvent.click(option);
    expect(filter.textContent).toBe(select);
  });

  it("download jobs data", async () => {
    render(<HomePage />);
    const button = screen.getByText("Download");
    fireEvent.click(button);
    expect(mockDownload).toHaveBeenCalledTimes(1);
  });
});
