import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handles the form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission reload
    setIsLoading(true); // Show loading state
    setErrorMsg(''); // Clear previous error message

    console.log('Data being sent to backend:', { username, password }); // Log data for debugging

    try {
      const data = await loginUser(username, password); // Call the login API

      // Check if data.ok is true and message is not "Username or password is invalid!"
      if (data.ok && data.data !== 'Username or password is invalid!') {
        navigate('/employee'); // Navigate to the Employee page
      } else {
        setErrorMsg(data.data || 'Login failed. Please try again.'); // Display the error message
      }
    } catch (error) {
      setErrorMsg(error.message || 'Unexpected error occurred.'); // Display any errors caught
    } finally {
      setIsLoading(false); // Remove loading state
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h1>Login</h1>

        {errorMsg && <div style={styles.errorMsg}>{errorMsg}</div>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state on change
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state on change
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f6f8',
  },
  form: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  errorMsg: {
    color: 'red',
    marginBottom: '15px',
  },
};

export default Login;
