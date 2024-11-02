const DB = require('../models');
const ResponseHelper = require('../utils/response');

class BookController  {
  static async getAll(req, res) {
    try {
      const items = await DB.Book.find().populate('categoryId', 'name description').populate('authorId', 'name bio');
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Book.findById(req.params.id).populate('categoryId', 'name description').populate('authorId', 'name bio')
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    try {
      const items = await DB.Book.create(req.body);
      return ResponseHelper.success(res, items, 'Success', 201);
    } catch (error) {
      let code = 500;
      if(error.message.includes('Book validation failed') || error.code === 11000) code = 400
      return ResponseHelper.error(res, error.message, code);
    }
  }

  static async update(req, res) {
    try {
      if(!req.params.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }
      const items = await DB.Book.findByIdAndUpdate(req.params.id, req.body);
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
      const items = await DB.Book.findByIdAndDelete(req.params.id);
      return ResponseHelper.success(res, items);
    } catch (error) {
      let code = (error.kind === 'ObjectId') ? 400 : 500;
      return ResponseHelper.error(res, error.message, code);
    }
  }

  static async uploadImage(req, res) {
    try {
      if(!req.body.id || !req.body.coverUrl) {
        return ResponseHelper.error(res, 'Input is Invalid', 400);
      }
      const item = await DB.Book.findById(req.body.id);
      item.coverUrl = req.body.coverUrl;
      await item.save()
      return ResponseHelper.success(res, item);
    } catch (error) {
      return ResponseHelper.error(res, error.message, error.kind === "ObjectId" ? 400 : 500);
    }
  }
}

module.exports = BookController