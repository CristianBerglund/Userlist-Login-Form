import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import axios, { AxiosResponse } from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import LoginForm from "../components/LoginForm";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("LoginForm", () => {
  test("renders LoginForm correctly", () => {
    render(
      <Router>
        <LoginForm />
      </Router>
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("submits form data correctly", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: "success",
    } as AxiosResponse);

    render(
      <Router>
        <LoginForm />
      </Router>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Username/i), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: "testpassword" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Login/i }));

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          "https://jsonplaceholder.typicode.com/posts",
          expect.objectContaining({
            userId: 1,
            title: "testuser",
            body: "testpassword",
          })
        );
      });
    });

    expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });
});
