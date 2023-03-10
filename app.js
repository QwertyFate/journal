const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
let titles = [];
let entries = [];
let numberentries =[];
mongoose.connect("mongodb+srv://admin-qwerty:qwerty12321@cluster0.dd2mtgv.mongodb.net/?retryWrites=true&w=majority/journal");


// MONGOOSE functions

const journalschema = new mongoose.Schema({
    Title: {
        type: String,
        require: true
    },
    entry: String,
    entrynumber: Number
});


const newjournal = mongoose.model("entry", journalschema);

async function getjournal(){
    titles = [];
    entries = [];
    let findings = await newjournal.find();
    await findings.forEach(function(enter){
        titles.push(enter.Title);
        entries.push(enter.entry);
        numberentries.push(enter.entrynumber);
    });

};


async function savejournal(newtit,newent,newnum){
    let newentries = new newjournal({
        Title: newtit,
        entry: newent,
        entrynumber: newnum
        
    })
    newentries.save();
};



// backend 


app.get("/", async function(req,res){
 await getjournal();
    res.render("home",  {titlelist: titles , entrylist: entries ,urls: numberentries });
});


app.get("/posts/:postName", function(req,res){
    let postname = "/posts/" + req.params.postName;
    let checkindex = numberentries.indexOf(postname)
    console.log(checkindex);
    let titleneeded = titles[checkindex];
    let paraneeded = entries[checkindex];
    res.render("posts", {title: titleneeded, paragraph: paraneeded});
});



app.get("/compose" , function(req,res){
    res.render("compose");
});

app.post("/compose", async function(req,res){
    let newtitle = req.body.title;
    let newentry = req.body.textbox;
    titles.push(newtitle);
    entries.push(newentry);
    let newnumber = titles.length;
    let newnumentry = "/posts/" + newnumber + "0" + newnumber;
    numberentries.push(newnumentry);
    await savejournal(newtitle,newentry, newnumentry);
    await res.redirect("/");
    console.log(numberentries);
});

app.get("/about", function(req,res){
    res.render("about");
});

app.get("/contact", function(req,res){
    res.render("contactme");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server up at 3000 port");
});








