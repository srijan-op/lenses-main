const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatControllers");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupAdd").put(protect, addToGroup);
router.route("/groupRemove").put(protect, removeFromGroup);
module.exports = router;
