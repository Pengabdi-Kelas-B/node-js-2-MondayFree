const express = require("express")
const BorrowingController = require("../controllers/borrowing_controller")

const borrowingRouter = express.Router()

borrowingRouter.post("/borrow/book", BorrowingController.create)
borrowingRouter.get("/borrow/book/list", BorrowingController.getAll)
borrowingRouter.post("/borrow/book/return", BorrowingController.update)

module.exports = borrowingRouter