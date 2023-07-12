import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderTable from "./OrderTable";
import styles from "./OrdersManagement.module.css";
import { backendURL } from "../backendURL";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${backendURL}/review_orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${backendURL}/order/update/${orderId}`, {
        status: newStatus,
      });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className={styles.ordersManagement}>
      <h2>Orders Management</h2>
      <OrderTable orders={orders} updateOrderStatus={updateOrderStatus} />
    </div>
  );
};

export default OrdersManagement;
