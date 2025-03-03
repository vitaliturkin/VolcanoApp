const { Router } = require("express");
const router = Router();

// Administration
router.get("/me", (req, res) => {
  res.json({
    name: "Vitali Turkin",
    student_number: "n11889799",
  });
});

module.exports = router;
