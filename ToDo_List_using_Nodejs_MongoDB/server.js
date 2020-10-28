const express = require("express")
const config = require("./config")
const mongoose = require("mongoose");
const app = express()

//models
const TodoTask = require("./model/TodoTask")

//Setting  Templating engine
app.set("view engine","ejs")

app.use("/static", express.static("public"));


//Urlencoded will allow us to extract the data from the form
app.use(express.urlencoded({extended:true}))


app.get("/",(req,res) => {
    // res.json({status:200,message:"API Working"})
    TodoTask.find({},(err,tasks) => {
        res.render('./todo.ejs',{todoTasks :tasks})
    })
   
})

app.post('/',async(req,res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    })


try {
    await todoTask.save()
    res.redirect("/")
}catch (err) {
    res.redirect("/")
}

})


//UPDATE

app.route("/edit/:id")
.get((req,res) => {
    const id = req.params.id
    TodoTask.find({} ,(err,tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    })
})
.post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });
    
//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });


// CONNECTION TO DB
mongoose.set("useFindAndModify",false);
mongoose.connect(DB_CONNECT,{
    useNewUrlParser:true},() => {
        app.listen(PORT,(req,res) => {
                console.log(`Server Started at PORT ${PORT}`)
            })

    })


    