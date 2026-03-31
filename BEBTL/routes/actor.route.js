const express = require("express");
const router = express.Router();
const actorController = require("../controllers/actor.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.get("/", actorController.getAllActors);
router.get("/search", actorController.getActorByName); // GET /actors/search?name=...
router.get("/:id", actorController.getActorById);
router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  actorController.createActor,
);
router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  actorController.updateActor,
);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  actorController.deleteActor,
);

module.exports = router;
