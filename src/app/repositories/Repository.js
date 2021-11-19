class Repository {
  constructor(schema) {
    this.schema = schema;
  }

  async getAll(filter, offset = 0, limit = 100) {
    Number(limit);
    Number(offset);

    return this.schema.paginate(filter, { offset, limit });
  }

  async getById(id) {
    return this.schema.findById(id);
  }

  async create(payload) {
    return this.schema.create(payload);
  }

  async update(id, payload) {
    return this.schema.findByIdAndUpdate(id, payload, { new: true });
  }

  async delete(id) {
    return this.schema.findByIdAndDelete(id);
  }
}

module.exports = Repository;
