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

export const getWeeklyReport = async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      createdAt: { $gte: weekAgo },
      status: "paid",
    });

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo);
      date.setDate(weekAgo.getDate() + i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayOrders = orders.filter(
        (order) => order.createdAt >= dayStart && order.createdAt <= dayEnd,
      );

      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);

      weeklyData.push({
        day: dayNames[date.getDay()],
        date: date.toISOString().split("T")[0],
        revenue: Math.round(revenue),
        orders: dayOrders.length,
      });
    }

    res.json({ success: true, data: weeklyData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's orders
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      status: "paid",
    });

    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );

    // Get pending orders count
    const pendingOrders = await Order.countDocuments({
      status: { $in: ["pending", "preparing"] },
    });

    // Calculate yesterday's revenue for comparison
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayOrders = await Order.find({
      createdAt: { $gte: yesterday, $lt: today },
      status: "paid",
    });
    const yesterdayRevenue = yesterdayOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );

    const revenueChange =
      yesterdayRevenue > 0
        ? Math.round(
            ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100,
          )
        : 0;

    const ordersChange =
      yesterdayOrders.length > 0
        ? Math.round(
            ((todayOrders.length - yesterdayOrders.length) /
              yesterdayOrders.length) *
              100,
          )
        : 0;

    res.json({
      success: true,
      data: {
        todayOrders: todayOrders.length,
        todayRevenue: Math.round(todayRevenue),
        pendingOrders,
        revenueChange,
        ordersChange,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
