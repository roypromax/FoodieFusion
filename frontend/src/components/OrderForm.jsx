import React, { useState } from "react";
import axios from "axios";
import styles from "./OrderForm.module.css";
import { backendURL } from "../backendURL";

const OrderForm = () => {
  const [customerName, setCustomerName] = useState("");
  const [dishIds, setDishIds] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !dishIds) {
      setErrorMessage("Please enter customer name and dish IDs.");
      return;
    }

    const dishIdArray = dishIds.split(",").map((id) => +id.trim());

    try {
      await axios.post(`${backendURL}/order`, {
        customer_name: customerName,
        dish_ids: dishIdArray,
      });
      setCustomerName("");
      setDishIds("");
      setErrorMessage("");
      alert("Order placed successfully");
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
    }
  };

  return (
    <div className={styles.orderForm}>
      <h3>Take New Order</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerName">Customer Name:</label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="dishIds">Dish IDs (comma-separated):</label>
          <input
            type="text"
            id="dishIds"
            value={dishIds}
            onChange={(e) => setDishIds(e.target.value)}
          />
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
