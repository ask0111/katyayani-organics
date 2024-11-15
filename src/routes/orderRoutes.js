const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.post("/create-order", createOrder); 
router.get("/get-orders", getOrders); 
router.put("/update-order/:id", updateOrder); 
router.delete("/delete-order/:id", deleteOrder); 

module.exports = router;
