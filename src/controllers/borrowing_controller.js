const DB = require('../models');
const ResponseHelper = require('../utils/response');
const mongoose = require('mongoose');

class BorrowingController  {
  static async getAll(req, res) {
    try {
      const filter = {}
      if(req.query.status) filter.status = req.query.status;

      const items = await DB.Borrowing.find(filter).populate('bookId', 'title description').populate('borrowerId', 'membershipId name');
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    const session = await mongoose.startSession()
    try {
      session.startTransaction()

      const book = await DB.Book.findById(req.body.bookId)
      const borrower = await DB.Borrower.findById(req.body.borrowerId)
      if(!book || !borrower) {
        return ResponseHelper.error(res, 'Book or Borrower Not Found', 400);
      }

      const bookStock = await DB.BookStock.findOne({bookId: req.body.bookId});
      if(bookStock.availableQuantity < 1) {
        return ResponseHelper.error(res, 'Book is not available', 400);
      };

      const today = new Date();
      const next5Days = new Date(today);
      next5Days.setDate(today.getDate() + 5);
      const createdBorrowingData = await DB.Borrowing.create({
        ...req.body,
        dueDate: next5Days.toISOString()
      });

      borrower.borrowHistory.push(createdBorrowingData._id)
      await borrower.save()

      bookStock.availableQuantity--;
      bookStock.borrowedQuantity++;
      await bookStock.save();

      await DB.StockLog.create({
        bookId: req.body.bookId,
        bookStockId: bookStock._id,
        action: 'BORROW',
        quantity: 1,
        reason: 'For study',
        referenceId: bookStock._id
      })

      await session.commitTransaction()

      return ResponseHelper.success(res, createdBorrowingData);
    } catch (error) {
      await session.abortTransaction()
      return ResponseHelper.error(res, error.message);
    } finally {
      await session.endSession()
    }
  }

  static async update(req, res) {
    try {
      if(!req.body.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }

      const item = await DB.Borrowing.findById(req.body.id);

      const dueDate = new Date(item.dueDate);
      const now = new Date();
      if(now.getTime() > dueDate.getTime()) {
        let gap = now - dueDate;
        gap = Math.floor(gap / (1000 * 60 * 60 * 24))
        const mulct = gap * 5000;
        item.lateFee = mulct;
        item.status = 'OVERDUE';
      } else {
        item.status = 'RETURNED';
      }
      item.returnDate = (new Date()).toISOString();
      await item.save();

      const stock = await DB.BookStock.findOne({bookId: item.bookId});
      stock.availableQuantity++;
      stock.borrowedQuantity--;
      await stock.save();

      await DB.StockLog.create({
        bookId: item.bookId,
        bookStockId: stock._id,
        action: 'RETURN',
        quantity: 1,
        reason: 'Finish reading',
        referenceId: stock._id
      })

      return ResponseHelper.success(res, item);      
    } catch (error) {
      let msg = error.message;
      let responCode = 500;
      if(error.kind === 'ObjectId') {
        msg = 'Borrowing not found';
        responCode = 400;
      }
      return ResponseHelper.error(res, msg, responCode);
    }
  }
}

module.exports = BorrowingController