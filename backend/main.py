from flask import Flask, jsonify, request
import random
import os
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()

mongo_url = os.environ.get('MONGO_URL')
client = MongoClient(mongo_url)
db = client['foodieFusion']


@app.route("/", methods=["GET"])
def home_route():
    return jsonify("Welcome to the FoodieFusion order management app.")


@app.route("/menu/read", methods=["GET"])
def read_menu():
    menu = list(db.menu.find())
    menu_list = []
    for item in menu:
        menu_list.append({
            'id': item['id'],
            'name': item['name'],
            'price': item['price'],
            'availability': item['availability']
        })
    return jsonify(menu_list), 200


@app.route("/menu/create", methods=["POST"])
def create_menu_item():
    new_menu_item = request.get_json()

    if "id" not in new_menu_item or "name" not in new_menu_item or "price" not in new_menu_item or "availability" not in new_menu_item:
        return jsonify({"error": "Invalid menu item data"}), 400

    existing_menu_item = db.menu.find_one({"id": new_menu_item["id"]})

    if existing_menu_item:
        return jsonify({"error": "Menu item ID already exists"}), 400

    db.menu.insert_one(new_menu_item)

    return jsonify({"message": "Menu item created successfully"}), 201


@app.route("/menu/update/<int:item_id>", methods=["PATCH"])
def update_menu_item(item_id):
    updated_menu_item = request.get_json()

    if "name" not in updated_menu_item or "price" not in updated_menu_item or "availability" not in updated_menu_item:
        return jsonify({"error": "Invalid menu item data"}), 400

    menu_item = db.menu.find_one({"id": item_id})

    if menu_item:
        menu_item["name"] = updated_menu_item["name"]
        menu_item["price"] = updated_menu_item["price"]
        menu_item["availability"] = updated_menu_item["availability"]

        db.menu.update_one({"id": item_id}, {"$set": menu_item})

        return jsonify({"message": "Menu item updated successfully"}), 200
    else:
        return jsonify({"error": "Menu item not found"}), 404


@app.route("/menu/delete/<int:item_id>", methods=["DELETE"])
def delete_menu_item(item_id):
    result = db.menu.delete_one({"id": item_id})

    if result.deleted_count > 0:
        return jsonify({"message": "Menu item deleted successfully"}), 200
    else:
        return jsonify({"error": "Menu item not found"}), 404


@app.route("/order", methods=["POST"])
def take_order():
    order_details = request.get_json()

    if "customer_name" not in order_details or "dish_ids" not in order_details:
        return jsonify({"error": "Invalid order data"}), 400

    ordered_dishes = []

    for dish_id in order_details["dish_ids"]:
        dish = db.menu.find_one({"id": dish_id})
        if dish is None:
            return jsonify({"error": f"Dish with ID {dish_id} not found"}), 404
        elif not dish["availability"]:
            return jsonify({"error": f"Dish {dish['name']} is not available"}), 400
        else:
            ordered_dishes.append({
                "id": dish["id"],
                "name": dish["name"],
                "price": dish["price"]
            })

    order = {
        "order_id": random.randint(100, 999),
        "customer_name": order_details["customer_name"],
        "dishes": ordered_dishes,
        "status": "received"
    }

    db.orders.insert_one(order)

    return jsonify({"message": "Order placed successfully"}), 201


@app.route("/review_orders", methods=["GET"])
def review_orders():
    orders = list(db.orders.find())
    orders_list = []
    for item in orders:
        orders_list.append({
            'order_id': item['order_id'],
            'customer_name': item['customer_name'],
            'dishes': item['dishes'],
            'status': item['status']
        })
    return jsonify(orders_list), 200


@app.route("/order/update/<int:order_id>", methods=["PATCH"])
def update_order_status(order_id):
    updated_status = request.get_json().get("status")

    result = db.orders.update_one(
        {"order_id": order_id},
        {"$set": {"status": updated_status}}
    )

    if result.modified_count > 0:
        return jsonify({"message": "Order status updated successfully"}), 200
    else:
        return jsonify({"error": "Order not found"}), 404


if __name__ == "__main__":
    app.run()
