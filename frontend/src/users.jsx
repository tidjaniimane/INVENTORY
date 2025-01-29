// users.jsx

import './styles.css';


    import  { useState, useEffect } from "react";

    const Users = () => {
      const apiUrl = "https://inventory-kwv2.onrender.com/api/users";
    
      // State variables
      const [users, setUsers] = useState([]);
      const [addUserData, setAddUserData] = useState({ name: "", role: "admin", email: "", password: "" });
      const [searchInput, setSearchInput] = useState("");
      const [selectedUser, setSelectedUser] = useState(null); // For updating users
      const [deleteUserName, setDeleteUserName] = useState("");
      const [message, setMessage] = useState("");
    
      // Fetch users
      useEffect(() => {
        fetchUsers();
      }, []);
    
      const fetchUsers = async () => {
        try {
          const response = await fetch(apiUrl);
          const result = await response.json();
          setUsers(result.data?.users || []);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
    
      // Add User
      const handleAddUser = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`${apiUrl}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addUserData),
          });
          const data = await response.json();
          if (data.success) {
            setMessage("User added successfully!");
            setAddUserData({ name: "", role: "admin", email: "", password: "" });
            fetchUsers();
          } else {
            setMessage("Error adding user!");
          }
        } catch (error) {
          setMessage(`Error: ${error.message}`);
        }
      };
    
      // Search User
      const handleSearchUser = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`${apiUrl}?search=${encodeURIComponent(searchInput)}`);
          const result = await response.json();
          if (result.success && result.data.users.length > 0) {
            setSelectedUser(result.data.users[0]);
            setMessage("User found!");
          } else {
            setSelectedUser(null);
            setMessage("User not found!");
          }
        } catch (error) {
          setMessage(`Error: ${error.message}`);
        }
      };
    
      // Update User
      const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
          setMessage("No user selected for update!");
          return;
        }
    
        try {
          const response = await fetch(`${apiUrl}/${selectedUser._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedUser),
          });
          const data = await response.json();
          if (data.success) {
            setMessage("User updated successfully!");
            setSelectedUser(null);
            fetchUsers();
          } else {
            setMessage("Error updating user!");
          }
        } catch (error) {
          setMessage(`Error: ${error.message}`);
        }
      };
    
      // Delete User
      const handleDeleteUser = async (e) => {
        e.preventDefault();
        try {
          const searchResponse = await fetch(`${apiUrl}?search=${encodeURIComponent(deleteUserName)}`);
          const searchResult = await searchResponse.json();
          if (!searchResult.success || searchResult.data.users.length === 0) {
            setMessage("User not found!");
            return;
          }
          const userId = searchResult.data.users[0]._id;
          const deleteResponse = await fetch(`${apiUrl}/${userId}`, { method: "DELETE" });
    
          if (deleteResponse.ok) {
            setMessage("User deleted successfully!");
            setDeleteUserName("");
            fetchUsers();
          } else {
            setMessage("Error deleting user!");
          }
        } catch (error) {
          setMessage(`Error: ${error.message}`);
        }
      };
    
      return (
        <div className="container">
          <h1>User Management</h1>
    
          {/* Add User Form */}
          <h2>Add User</h2>
          <form onSubmit={handleAddUser}>
            <input
              type="text"
              placeholder="Name"
              value={addUserData.name}
              onChange={(e) => setAddUserData({ ...addUserData, name: e.target.value })}
              required
            />
            <select
              value={addUserData.role}
              onChange={(e) => setAddUserData({ ...addUserData, role: e.target.value })}
              required
            >
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
            </select>
            <input
              type="email"
              placeholder="Email"
              value={addUserData.email}
              onChange={(e) => setAddUserData({ ...addUserData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={addUserData.password}
              onChange={(e) => setAddUserData({ ...addUserData, password: e.target.value })}
              required
            />
            <button type="submit">Add User</button>
          </form>
    
          {/* Search User Form */}
          <h2>Search User</h2>
          <form onSubmit={handleSearchUser}>
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              required
            />
            <button type="submit">Search</button>
          </form>
    
          {/* Update User Form */}
          {selectedUser && (
            <form onSubmit={handleUpdateUser}>
              <h2>Update User</h2>
              <input
                type="text"
                placeholder="Name"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                required
              />
              <select
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                required
              >
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
                <option value="employee">Employee</option>
              </select>
              <input
                type="email"
                placeholder="Email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
              />
              <button type="submit">Update User</button>
            </form>
          )}
    
          {/* Delete User Form */}
          <h2>Delete User</h2>
          <form onSubmit={handleDeleteUser}>
            <input
              type="text"
              placeholder="Enter username to delete"
              value={deleteUserName}
              onChange={(e) => setDeleteUserName(e.target.value)}
              required
            />
            <button type="submit">Delete User</button>
          </form>
    
          {/* User List */}
          <h2>User List</h2>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
    
          {/* Message Display */}
          {message && <p>{message}</p>}
        </div>
      );
    };
    
   
export default Users;
