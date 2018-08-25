module.exports = class extends think.Model {
  getList() {
    return this.field("book_borrow").select();
  }
};
