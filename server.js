const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const fcfs = require("./algorithms/fcfs");
const sjf = require("./algorithms/sjf");
const rr = require("./algorithms/rr");

app.post("/schedule", (req, res) => {
    const { processes, algorithm, quantum } = req.body;

    let result;

    if (algorithm === "FCFS") result = fcfs(processes);
    else if (algorithm === "SJF") result = sjf(processes);
    else if (algorithm === "RR") result = rr(processes, quantum);

    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});