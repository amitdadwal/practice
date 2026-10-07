import express from "express";

const app = express();

const PORT = process.env.PORT || 4000;

const jokes = [
  {
    id: 1,
    title: "The Programmer",
    description: "Why do programmers prefer dark mode? Because light attracts bugs."
  },
  {
    id: 2,
    title: "The Array",
    description: "Why did the array go to therapy? It had too many unresolved indexes."
  },
  {
    id: 3,
    title: "The Function",
    description: "Why did the function break up with the loop? It felt stuck in a cycle."
  },
  {
    id: 4,
    title: "The Database",
    description: "Why was the database calm? It had everything indexed."
  },
  {
    id: 5,
    title: "The Commit",
    description: "Why did the developer go broke? Because they used up all their cache."
  }
];

app.get('/', (req, res)=>{
    res.send("Server is running");
})

// get list of 5 jokes 

app.get("/api/jokes", (req, res)=>{
    res.json(jokes);
})

app.listen(PORT, ()=>(console.log(`Port is ${PORT}`)));