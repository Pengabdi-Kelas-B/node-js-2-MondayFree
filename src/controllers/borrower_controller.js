const DB = require('../models');
const ResponseHelper = require('../utils/response');

class BorrowerController  {
  static async getAll(req, res) {
    try {
      const items = await DB.Borrower.find();
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      if(!req.params.id) {
        return ResponseHelper.error(res, "ID is required", 400)
      }
      const items = await DB.Borrower.findById(req.params.id)
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message, error.kind === 'ObjectId' ? 400 : 500);
    }
  }

  static async create(req, res) {
    try {
      const items = await DB.Borrower.create(req.body);
      return ResponseHelper.success(res, items, 'Success', 201);
    } catch (error) {
      let code = 500;
      if(error.message.includes('Borrower validation failed') || error.code === 11000) code = 400
      return ResponseHelper.error(res, error.message, code);
    }
  }

  static async update(req, res) {
    try {
      if(!req.params.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }
      const items = await DB.Borrower.findByIdAndUpdate(req.params.id, req.body);
      return ResponseHelper.success(res, items);
    } catch (error) {
      let code = 500;
      if(error.kind === 'ObjectId' || error.code === 11000) code = 400
      return ResponseHelper.error(res, error.message, code);
    }
  }

  static async delete(req, res) {
    try {
      if(!req.params.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }
      const items = await DB.Borrower.findByIdAndDelete(req.params.id);
      return ResponseHelper.success(res, items);
    } catch (error) {
      let code = (error.kind === 'ObjectId') ? 400 : 500;
      return ResponseHelper.error(res, error.message, code);
    }
  }
}

module.exports = BorrowerController