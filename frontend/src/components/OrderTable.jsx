import React from "react";
import styles from "./OrderTable.module.css";

const OrderTable = ({ orders, updateOrderStatus }) => {
  return (
    <div className={styles.orderTable}>
      <h3>Orders</h3>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Dishes</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.customer_name}</td>
              <td>
                {order.dishes.map((dish, index) => {
                  if (index !== order.dishes.length - 1) {
                    return <span key={dish.id}>{dish.name}, </span>;
                  } else {
                    return <span key={dish.id}>{dish.name}</span>;
                  }
                })}
              </td>
              <td>{order.status}</td>
              <td>
                {order.status !== "delivered" && (
                  <select
                    name="orderStatus"
                    id="orderStatus"
                    value=""
                    onChange={(event) =>
                      updateOrderStatus(order.order_id, event.target.value)
                    }
                  >
                    <option value="" disabled hidden>
                      Update status
                    </option>
                    <option value="preparing">Preparing</option>
                    <option value="ready for pickup">Ready for pickup</option>
                    <option value="delivered">Delivered</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
