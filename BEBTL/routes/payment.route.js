const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.post("/create", verifyToken, paymentController.createPayment);
router.get(
  "/all",
  verifyToken,
  checkRole(["admin"]),
  paymentController.getAllPayments,
);
router.get("/:id", verifyToken, paymentController.getPaymentById);
router.put(
  "/update/:id",
  verifyToken,
  checkRole(["admin"]),
  paymentController.updatePayment,
);
router.patch(
  "/:id/status",
  verifyToken,
  checkRole(["admin"]),
  paymentController.updatePaymentStatus,
);
router.delete(
  "/delete/:id",
  verifyToken,
  checkRole(["admin"]),
  paymentController.deletePayment,
);

module.exports = router;
