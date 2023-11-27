import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserData, UserListProps } from "../types";
import { Link } from "react-router-dom";

const UserList: React.FC<UserListProps> = ({
  title = "User List",
  sortBy: initialSortBy = "name",
  sortDirection: initialSortDirection = "asc",
}) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "email">(initialSortBy);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSortDirection
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<UserData[]>(
          "https://jsonplaceholder.typicode.com/users"
        );

        let sortedUsers = response.data.sort((a, b) => {
          const aValue = String(a[sortBy as keyof UserData]);
          const bValue = String(b[sortBy as keyof UserData]);

          if (sortDirection === "asc") {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        });

        sortedUsers = sortedUsers.filter((user) =>
          user.name.toLowerCase().includes(filterText.toLowerCase())
        );

        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUsers();
  }, [sortBy, sortDirection, filterText]);

  return (
    <div className="container">
      <h2>{title}</h2>
      <div className="header-container">
        <label htmlFor="sortBySelect" data-testid="sortBy">
          Sort by:{" "}
        </label>
        <select
          id="sortBySelect"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "email")}
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
        </select>

        <label htmlFor="sortDirectionSelect" data-testid="sortDirection">
          Sort direction:{" "}
        </label>
        <select
          id="sortDirectionSelect"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div>
        <label>Filter by name: </label>
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
};

export default UserList;