import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../styles/Customer.css";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { AiOutlineMenuFold } from "react-icons/ai";

interface CustomerData {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
}

const Customer: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerData[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newCustomer, setNewCustomer] = useState<CustomerData>({
    id: "",
    name: "",
    surname: "",
    phone: "",
    email: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [phoneError, setPhoneError] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://randomuser.me/api/?results=10"
        );
        const fetchedCustomers = response.data.results.map((user: any) => ({
          id: user.login.uuid,
          name: user.name.first,
          surname: user.name.last,
          phone: user.phone,
          email: user.email,
        }));
        setCustomers(fetchedCustomers);
        setFilteredCustomers(fetchedCustomers);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const searchTermLower = e.target.value.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTermLower) ||
        customer.surname.toLowerCase().includes(searchTermLower) ||
        customer.email.toLowerCase().includes(searchTermLower)
    );
    setFilteredCustomers(filtered);
  };

  const handleAddCustomer = () => {
    if (newCustomer.phone.trim() === "") {
      setPhoneError(true);
      return;
    }
    const newId = Date.now().toString();
    const customerToAdd = { ...newCustomer, id: newId };
    setCustomers((prevCustomers) => [...prevCustomers, customerToAdd]);
    setFilteredCustomers((prevCustomers) => [...prevCustomers, customerToAdd]);
    setOpenDialog(false);
    setNewCustomer({ id: "", name: "", surname: "", phone: "", email: "" });
    setPhoneError(false);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPhoneError(false);
  };

  if (loading) {
    return <CircularProgress className="circular" />;
  }

  return (
    <div className="customers_page">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="customers">
        <span className="mobile_menu_open_close" onClick={toggleSidebar}>
          <AiOutlineMenuFold />
        </span>
        <div className="customers_table">
          <Box sx={{ padding: 3 }}>
            <div>
              <h2>Customer List</h2>
              <input
                className="search"
                placeholder="Search Customer"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button onClick={handleOpenDialog}>Add Customer</button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <tr key={customer.id}>
                    <td>
                      <span>{index + 1}</span>
                    </td>
                    <td>{customer.name}</td>
                    <td>{customer.surname}</td>
                    <td>
                      <span>{customer.phone}</span>
                    </td>
                    <td>{customer.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Name"
                  type="text"
                  fullWidth
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                />
                <TextField
                  margin="dense"
                  label="Surname"
                  type="text"
                  fullWidth
                  value={newCustomer.surname}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, surname: e.target.value })
                  }
                />
                <TextField
                  margin="dense"
                  label="Phone"
                  type="text"
                  fullWidth
                  error={phoneError}
                  helperText={phoneError ? "Phone number is required" : ""}
                  value={newCustomer.phone}
                  onChange={(e) => {
                    setNewCustomer({ ...newCustomer, phone: e.target.value });
                    setPhoneError(false);
                  }}
                />
                <TextField
                  margin="dense"
                  label="Email"
                  type="email"
                  fullWidth
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleAddCustomer} color="primary">
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

export default Customer;
