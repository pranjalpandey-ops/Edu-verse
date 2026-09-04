const mongoose = require('mongoose');

class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.items = [];
  }

  _clone(doc) {
    return JSON.parse(JSON.stringify(doc));
  }

  async find(query = {}) {
    return this.items.filter(item => this._matches(item, query)).map(this._clone);
  }

  async findOne(query = {}) {
    const item = this.items.find(item => this._matches(item, query));
    return item ? this._clone(item) : null;
  }

  async findById(id) {
    const item = this.items.find(item => item._id === id || item.id === id);
    return item ? this._clone(item) : null;
  }

  async create(doc) {
    const newDoc = {
      _id: doc._id || 'id_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    this.items.push(newDoc);
    return this._clone(newDoc);
  }

  async insertMany(docs) {
    const created = [];
    for (const d of docs) {
      created.push(await this.create(d));
    }
    return created;
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const idx = this.items.findIndex(item => item._id === id || item.id === id);
    if (idx === -1) return null;
    const current = this.items[idx];
    const patch = update.$set ? update.$set : update;
    const updated = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString()
    };
    this.items[idx] = updated;
    return this._clone(updated);
  }

  async updateOne(query, update) {
    const item = this.items.find(i => this._matches(i, query));
    if (!item) return { modifiedCount: 0 };
    const patch = update.$set ? update.$set : update;
    Object.assign(item, patch, { updatedAt: new Date().toISOString() });
    return { modifiedCount: 1 };
  }

  async deleteOne(query) {
    const idx = this.items.findIndex(item => this._matches(item, query));
    if (idx === -1) return { deletedCount: 0 };
    this.items.splice(idx, 1);
    return { deletedCount: 1 };
  }

  async findByIdAndDelete(id) {
    const idx = this.items.findIndex(item => item._id === id || item.id === id);
    if (idx === -1) return null;
    const [deleted] = this.items.splice(idx, 1);
    return deleted;
  }

  async countDocuments(query = {}) {
    return (await this.find(query)).length;
  }

  _matches(item, query) {
    for (const key of Object.keys(query)) {
      if (key === '_id' && item._id !== query._id && item.id !== query._id) return false;
      if (item[key] !== query[key]) return false;
    }
    return true;
  }
}

class MemoryStore {
  constructor() {
    this.collections = {};
  }
  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new MemoryCollection(name);
    }
    return this.collections[name];
  }
}

const memoryStore = new MemoryStore();
let isMongoConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.log('[Database] Running in zero-config memory storage mode.');
    return;
  }
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    console.log('[Database] MongoDB Connected.');
  } catch (err) {
    console.warn('[Database] MongoDB connection failed (' + err.message + '). Operating in memory mode.');
  }
};

module.exports = {
  connectDB,
  memoryStore,
  getIsMongoConnected: () => isMongoConnected
};
