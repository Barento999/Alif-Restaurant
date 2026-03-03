import Order from "../models/Order.js";

export const getDailyReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      createdAt: { $gte: today },
      status: "paid",
    });

    const revenue = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      success: true,
      data: { date: today, totalOrders: orders.length, revenue },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlyReport = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      createdAt: { $gte: startOfMonth },
      status: "paid",
    });

    const revenue = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      success: true,
      data: { month: startOfMonth, totalOrders: orders.length, revenue },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { status: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "menuitems",
          localField: "_id",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: "$item" },
    ]);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
