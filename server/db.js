const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;
const MONGO_LINK = process.env.MONGO_LINK;

const User = new Schema({
    email: {type: String, unique: true},
    password: String,
    name: String
})

const Todo = new Schema({
    userId: ObjectId,
    title: String,
    status: Boolean,
})

const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todos', Todo);

module.exports = {
    UserModel,
    TodoModel,
    MONGO_LINK
}