from flask import Flask, jsonify, request
import json
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home_route():
    return jsonify("Welcome to the FoodieFiesta order management app.")


@app.route("/menu/read", methods=["GET"])
def read_menu():
    with open("menu.json", "r") as file:
        menu = json.load(file)

    return jsonify(menu), 200


@app.route("/menu/create", methods=["POST"])
def create_menu_item():
    new_menu_item = request.get_json()

    if "id" not in new_menu_item or "name" not in new_menu_item or "price" not in new_menu_item or "availability" not in new_menu_item:
        return jsonify({"error": "Invalid menu item data"}), 400

    with open("menu.json", "r") as file:
        menu = json.load(file)

    for item in menu:
        if item["id"] == new_menu_item["id"]:
            return jsonify({"error": "Menu item ID already exists"}), 400

    menu.append(new_menu_item)

    with open("menu.json", "w") as file:
        json.dump(menu, file)

    return jsonify({"message": "Menu item created successfully"}), 201


@app.route("/menu/update/<int:item_id>", methods=["PATCH"])
def update_menu_item(item_id):
    updated_menu_item = request.get_json()

    with open("menu.json", "r") as file:
        menu = json.load(file)

    for item in menu:
        if item["id"] == item_id:
            item.update(updated_menu_item)

            with open("menu.json", "w") as file:
                json.dump(menu, file)

            return jsonify({"message": "Menu item updated successfully"}), 200

    return jsonify({"error": "Menu item not found"}), 404


@app.route("/menu/delete/<int:item_id>", methods=["DELETE"])
def delete_menu_item(item_id):

    with open("menu.json", "r") as file:
        menu = json.load(file)

    for item in menu:
        if item["id"] == item_id:
            menu.remove(item)

            with open("menu.json", "w") as file:
                json.dump(menu, file)

            return jsonify({"message": "Menu item deleted successfully"}), 200

    return jsonify({"error": "Menu item not found"}), 404


@app.route("/order", methods=["POST"])
def take_order():
    order_details = request.get_json()

    if "customer_name" not in order_details or "dish_ids" not in order_details:
        return jsonify({"error": "Invalid order data"}), 400

    ordered_dishes = []

    with open("menu.json", "r") as file:
        menu = json.load(file)

    for dish_id in order_details["dish_ids"]:
        dish = next((item for item in menu if item["id"] == dish_id), None)
        if dish is None:
            return jsonify({"error": f"Dish with ID {dish_id} not found"}), 404
        elif not dish["availability"]:
            return jsonify({"error": f"Dish {dish['name']} is not available"}), 400
        else:
            ordered_dishes.append(dish)

    order = {
        "order_id": random.randint(100, 999),
        "customer_name": order_details["customer_name"],
        "dishes": ordered_dishes,
        "status": "received"
    }

    with open("orders.json", "r") as file:
        orders = json.load(file)

    orders.append(order)

    with open("orders.json", "w") as file:
        json.dump(orders, file)

    return jsonify({"message": "Order placed successfully"}), 201


@app.route("/review_orders", methods=["GET"])
def review_orders():

    with open("orders.json", "r") as file:
        orders = json.load(file)

    return jsonify(orders), 200


@app.route("/order/update/<int:order_id>", methods=["PATCH"])
def update_order_status(order_id):
    updated_status = request.get_json().get("status")

    with open("orders.json", "r") as file:
        orders = json.load(file)

    for order in orders:
        if order["order_id"] == order_id:
            order["status"] = updated_status

            with open("orders.json", "w") as file:
                json.dump(orders, file)

            return jsonify({"message": "Order status updated successfully"}), 200

    return jsonify({"error": "Order not found"}), 404


if __name__ == "__main__":
    app.run()
