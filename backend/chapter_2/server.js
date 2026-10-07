//This is the address of the server connect to network : http://localhost:8383
// url: http://localhost:8383
// ip :  192.168.19.232:8383
const express = require('express');
const app = express();
const PORT = 8383;
let data =[ "John Doe"]

app.use(express.json()); //middleware to parse json data from request body
//http verbs(GET, POST, PUT, DELETE) and routes (or path)

// Type 1 : Enpoints for visual 
app.get('/',(req, res)=>{
    res.send(`
        <body>
        <h1>Welcome to home</h1>
        <p>DATA: ${data}</p>
        </body>
        <a href="/dashboard">Dashboard</a>
        `);
    console.log("yay i got a hit by ", req.method)
})

app.get('/dashboard', (req, res)=>{
 console.log("Dashboard hit by ", req.method);
 res.send(`<body> 
    <h1>Welcome to dashboard</h1>
    <a href="/">Home</a>
    </body>`);
})

// Type 2 : Enpoints for API 

// CRUD : create-post, read-get, update-put/patch, delete-delete

app.get("/api/data", (req, res)=>{
    res.send(`DATA: ${data}`);
    console.log("This one if for data")
})

app.post("/api/data", (req, res)=>{
  const newEntry = req.body;
  data.push(newEntry.name);
  res.sendStatus(201);
  console.log("new data added", newEntry);
})

app.put("/api/data", (req, res)=>{
const updatedEntry = req.body;
data[data.length-1] = updatedEntry.name;
res.sendStatus(200);
console.log("data updated", updatedEntry);
})

app.delete("/api/data", (req, res)=>{
    data.pop();
    res.sendStatus(200);
    console.log("data deleted");
})
app.listen(PORT, ()=>{console.log(`Server is running on: ${PORT}`)});