import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Users.css";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AiOutlineMenuFold } from "react-icons/ai";

interface UserData {
  email: string;
  password: string;
  showPassword: boolean;
}

const User: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<UserData>({
    email: "",
    password: "",
    showPassword: false,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const storedEmail = getCookie("userEmail");
    const storedPassword = getCookie("userPassword");

    if (storedEmail && storedPassword) {
      setUsers([
        { email: storedEmail, password: storedPassword, showPassword: false },
      ]);
    }
  }, []);

  const handleAddUser = () => {
    setCookie("userEmail", newUser.email, 7);
    setCookie("userPassword", newUser.password, 7);

    const updatedUsers = [...users, { ...newUser, showPassword: false }];
    setUsers(updatedUsers);

    setOpenDialog(false);
    setNewUser({ email: "", password: "", showPassword: false });
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/`;
  };

  const getCookie = (name: string) => {
    return document.cookie.split("; ").reduce((r, c) => {
      const [key, ...v] = c.split("=");
      return key === name ? decodeURIComponent(v.join("=")) : r;
    }, "");
  };

  const toggleShowPassword = (index: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user, i) =>
        i === index ? { ...user, showPassword: !user.showPassword } : user
      )
    );
  };

  return (
    <div className="users_page">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="users">
        <span className="mobile_menu_open_close" onClick={toggleSidebar}>
          <AiOutlineMenuFold />
        </span>
        <div className="users_table">
          <Box sx={{ padding: 3 }}>
            <div>
              <h2>User List</h2>
              <button onClick={handleOpenDialog}>Add User</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.showPassword ? user.password : "*******"}{" "}
                      <IconButton onClick={() => toggleShowPassword(index)}>
                        {user.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Add New User</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Email"
                  type="email"
                  fullWidth
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      email: e.target.value,
                      showPassword: false,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Password"
                  type={newUser.showPassword ? "text" : "password"}
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      password: e.target.value,
                      showPassword: false,
                    })
                  }
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() =>
                          setNewUser((prev) => ({
                            ...prev,
                            showPassword: !prev.showPassword,
                          }))
                        }
                      >
                        {newUser.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleAddUser} color="primary">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default User;
