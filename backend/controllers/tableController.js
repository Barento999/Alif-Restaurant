import Table from "../models/Table.js";

export const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort("tableNumber");
    res.json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!table)
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    res.json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table)
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    res.json({ success: true, message: "Table deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
