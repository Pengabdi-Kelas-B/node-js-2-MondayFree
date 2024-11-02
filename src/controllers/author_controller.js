const DB = require('../models');
const ResponseHelper = require('../utils/response');

class AuthorController  {
  static async getAll(req, res) {
    try {
      const items = await DB.Author.find();
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
      const items = await DB.Author.findById(req.params.id).populate('books', 'title description isbn coverUrl totalPages publishedDate publisher language')
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message, error.kind === 'ObjectId' ? 400 : 500);
    }
  }

  static async create(req, res) {
    try {
      const items = await DB.Author.create(req.body);
      return ResponseHelper.success(res, items, 'Success', 201);
    } catch (error) {
      let code = 500;
      if(error.message.includes('Author validation failed') || error.code === 11000) code = 400
      return ResponseHelper.error(res, error.message, code);
    }
  }

  static async update(req, res) {
    try {
      if(!req.params.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }
      const items = await DB.Author.findByIdAndUpdate(req.params.id, req.body);
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
      const items = await DB.Author.findByIdAndDelete(req.params.id);
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
      const item = await DB.Author.findById(req.body.id);
      item.photoUrl = req.body.coverUrl;
      await item.save()
      return ResponseHelper.success(res, item);
    } catch (error) {
      return ResponseHelper.error(res, error.message, error.kind === "ObjectId" ? 400 : 500);
    }
  }
}

module.exports = AuthorController