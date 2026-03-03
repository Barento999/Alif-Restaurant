import Order from "../models/Order.js";
import Table from "../models/Table.js";

export const createOrder = async (req, res) => {
  try {
    const { table, items, notes } = req.body;

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const orderNumber = `ORD-${Date.now()}`;

    const order = await Order.create({
      orderNumber,
      table,
      waiter: req.user._id,
      items,
      subtotal,
      tax,
      total,
      notes,
    });

    await Table.findByIdAndUpdate(table, { status: "occupied" });

    const populatedOrder = await Order.findById(order._id)
      .populate("table")
      .populate("waiter", "name")
      .populate("items.menuItem");

    req.io.emit("newOrder", populatedOrder);

    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
      .populate("table")
      .populate("waiter", "name")
      .populate("items.menuItem")
      .sort("-createdAt");

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    )
      .populate("table")
      .populate("waiter", "name")
      .populate("items.menuItem");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (status === "paid") {
      await Table.findByIdAndUpdate(order.table._id, { status: "available" });
    }

    req.io.emit("orderStatusUpdate", order);

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
