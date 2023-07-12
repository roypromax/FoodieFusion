import React from "react";
import styles from "./MenuTable.module.css";

const MenuTable = ({ menu, deleteMenuItem, editMenuItem }) => {
  return (
    <table className={styles.menuTable}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Availability</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {menu.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>{item.availability ? "Yes" : "No"}</td>
            <td>
              <button onClick={() => editMenuItem(item)}>Edit</button>
              <button onClick={() => deleteMenuItem(item.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MenuTable;
