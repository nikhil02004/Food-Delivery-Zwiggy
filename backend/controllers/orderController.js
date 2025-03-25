import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing user order
const placeOrder = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body

    // Create a new order in 'pending' state
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
      status: "pending",
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    console.log("Order saved:", newOrder); // Log the saved order

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error); // Log any errors
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};



// Fetch user orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// List all orders for admin
const listOrders = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (user && user.role === "admin") {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.status(403).json({ success: false, message: "Access denied" });
    }
  } catch (error) {
    console.error("Error listing orders:", error);
    res.status(500).json({ success: false, message: "Error listing orders" });
  }
};

// Update order status (Admin only)
const updateStatus = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (user && user.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
      res.json({ success: true, message: "Order status updated" });
    } else {
      res.status(403).json({ success: false, message: "Access denied" });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

export { placeOrder, userOrders, listOrders, updateStatus };