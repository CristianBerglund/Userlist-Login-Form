import React, { useState } from "react";
import axios from "axios";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        {
          userId: 1,
          title: username,
          body: password,
        }
      );

      console.log("Login successful:", response.data);

      setUsername("");
      setPassword("");
      setMessage(`Login successful! Welcome ${username}!`);
      setError("");
    } catch (err) {
      console.error("Login failed:", err);

      setMessage("");
      setError("Login failed. Please try again.");
    }
  };

  return (
    <main className="container">
      <h2>Login</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <form>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </main>
  );
};

export default LoginForm;
