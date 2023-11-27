import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import axios, { AxiosResponse } from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import UserList from "../components/UserList";

jest.mock("axios");

const mockUsers = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Doe", email: "jane.doe@example.com" },
];

describe("UserList Component", () => {
  it("renders correctly with default settings", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: mockUsers,
    } as AxiosResponse);

    render(
      <Router>
        <UserList />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("User List")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(mockUsers.length);
    });
  });

  it("renders the correct title when the title prop is set", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: mockUsers,
    } as AxiosResponse);

    render(
      <Router>
        <UserList title="Custom Title" />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Custom Title")).toBeInTheDocument();
    });
  });

  it("fetches data from the API endpoint correctly", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: mockUsers,
    } as AxiosResponse);

    render(
      <Router>
        <UserList />
      </Router>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/users"
      );
    });
  });

  beforeEach(() => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: mockUsers });
  });

  it("renders a list of users with correct names and email addresses", async () => {
    render(
      <Router>
        <UserList />
      </Router>
    );

    await waitFor(() => {
      mockUsers.forEach((user) => {
        expect(screen.getByText(new RegExp(user.name))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(user.email))).toBeInTheDocument();
      });
    });
  });

  it("sorts users correctly based on sortBy and sortDirection properties", async () => {
    render(
      <Router>
        <UserList />
      </Router>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Sort by:"), {
        target: { value: "email" },
      });

      fireEvent.change(screen.getByLabelText("Sort direction:"), {
        target: { value: "desc" },
      });
    });
    await waitFor(() => {
      const expectedUserNames = mockUsers
        .sort((a, b) => b.email.localeCompare(a.email))
        .map((user) => `${user.name} - ${user.email}`);

      const renderedUserNames = screen
        .getAllByRole("listitem")
        .map((li) => li.textContent);
      expect(renderedUserNames).toEqual(expectedUserNames);
    });
  });
});
