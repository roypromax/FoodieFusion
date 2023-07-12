import React, { useState, useEffect } from "react";
import styles from "./MenuItemForm.module.css";

const MenuItemForm = ({
  addMenuItem,
  updateMenuItem,
  selectedMenuItem,
  resetForm,
}) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState(true);

  useEffect(() => {
    if (selectedMenuItem) {
      setId(selectedMenuItem.id);
      setName(selectedMenuItem.name);
      setPrice(selectedMenuItem.price);
      setAvailability(selectedMenuItem.availability);
    }
  }, [selectedMenuItem]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const menuItem = {
      id: +id,
      name,
      price: +price,
      availability,
    };

    if (selectedMenuItem) {
      updateMenuItem(menuItem);
    } else {
      addMenuItem(menuItem);
    }

    clearForm();
  };

  const clearForm = () => {
    setId("");
    setName("");
    setPrice("");
    setAvailability(true);
    resetForm(null);
  };

  return (
    <div className={styles.menuItemForm}>
      <h3>{selectedMenuItem ? "Update Menu Item" : "Add Menu Item"}</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles["form-field-group"]}>
          <label htmlFor="id">ID:</label>
          <input
            type="number"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            disabled={selectedMenuItem}
          />
        </div>
        <div className={styles["form-field-group"]}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles["form-field-group"]}>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className={styles["form-field-group"]}>
          <label htmlFor="availability">Availability:</label>
          <select
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value === "true")}
            required
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
        <div className={styles["form-actions"]}>
          <button type="submit">
            {selectedMenuItem ? "Update" : "Add"} Item
          </button>
          <button type="button" onClick={clearForm}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuItemForm;
