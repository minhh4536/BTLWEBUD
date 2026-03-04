const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/create", paymentController.createPayment);
router.get("/all", paymentController.getAllPayments);
router.get("/:id", paymentController.getPaymentById);
router.put("/update/:id", paymentController.updatePayment);
router.delete("/delete/:id", paymentController.deletePayment);
module.exports = router;
