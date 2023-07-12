import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuItemForm from "./MenuItemForm";
import MenuTable from "./MenuTable";
import styles from "./MenuManagement.module.css";
import { backendURL } from "../backendURL";
import OrderForm from "./OrderForm";

const MenuManagement = () => {
  const [menu, setMenu] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${backendURL}/menu/read`);
      setMenu(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const addMenuItem = async (menuItem) => {
    try {
      await axios.post(`${backendURL}/menu/create`, menuItem);
      fetchMenu();
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert(error.response.data.error);
    }
  };

  const deleteMenuItem = async (itemId) => {
    try {
      await axios.delete(`${backendURL}/menu/delete/${itemId}`);
      fetchMenu();
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const editMenuItem = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const updateMenuItem = async (updatedMenuItem) => {
    try {
      await axios.patch(
        `${backendURL}/menu/update/${updatedMenuItem.id}`,
        updatedMenuItem
      );
      fetchMenu();
      setSelectedMenuItem(null);
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  return (
    <div className={styles.mainDisplay}>
      <div className={styles.menuManagement}>
        <h2>Menu Management</h2>
        <MenuItemForm
          addMenuItem={addMenuItem}
          updateMenuItem={updateMenuItem}
          selectedMenuItem={selectedMenuItem}
          resetForm={setSelectedMenuItem}
        />
        <MenuTable
          menu={menu}
          deleteMenuItem={deleteMenuItem}
          editMenuItem={editMenuItem}
        />
      </div>
      <OrderForm />
    </div>
  );
};

export default MenuManagement;
