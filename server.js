const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('api/notes',(req,res)=>{ 
    res.readFile('db.json', 'utf8', (err, data)=>{
        if(err){
            console.log(err);
            return res.status(500).send("error reading notes.");
        }
        const notes = JSON.parse(data);
        res.json(notes);
        });
});

app.post('api/notes', (req,res)=>{
    fs.readFile('db.json', 'utf8', (err,data)=>{
        if(err){
            console.log(err);
            return res.status(500).send("error reading notes.");
        };
        const notes = JSON.parse(data);
        const newNote = {
            id: uuidv4(),
            title: req.body.title,
            text: req.body.text,
        };

        notes.push(newNote);

        fs.writeFile('db.json', JSON.stringify(notes), (err)=>{
            if(err){
                console.log(err);
                return res.status(500).send('Error writing notes.');
            }
        res.json(newNote);
        });
    });
});

app.listen(PORT, ()=>{
    console.log("Server running.");
  })