const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
require('dotenv').config()


const app = express()


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))


const Task = mongoose.model('Task', new mongoose.Schema({
title: String,
priority: String
}))


app.get('/', async (req, res) => {
const tasks = await Task.find()
res.render('index', { tasks: tasks, alert: req.query.alert })
})


app.post('/tasks', async (req, res) => {
if (!req.body.title || req.body.title.trim() === "") {
return res.redirect('/?alert=' + encodeURIComponent('Title required'))
}
await Task.create({ title: req.body.title, priority: req.body.priority })
res.redirect('/?alert=' + encodeURIComponent('Task added'))
})


app.get('/tasks/:id/edit', async (req, res) => {
const task = await Task.findById(req.params.id)
res.render('edit', { task: task })
})


app.put('/tasks/:id', async (req, res) => {
if (!req.body.title || req.body.title.trim() === "") {
return res.redirect('/?alert=' + encodeURIComponent('Title required'))
}
await Task.findByIdAndUpdate(req.params.id, { title: req.body.title, priority: req.body.priority })
res.redirect('/?alert=' + encodeURIComponent('Task updated'))
})


app.delete('/tasks/:id', async (req, res) => {
await Task.findByIdAndDelete(req.params.id)
res.redirect('/?alert=' + encodeURIComponent('Task deleted'))
})


app.listen(process.env.PORT || 3000, () => {
console.log("Server running")
})