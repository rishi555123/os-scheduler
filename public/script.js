let processes = [];

// Add process
function addProcess() {
    const id = document.getElementById("pid").value.trim();
    const arrival = parseInt(document.getElementById("arrival").value);
    const burst = parseInt(document.getElementById("burst").value);

    if (!id || isNaN(arrival) || isNaN(burst)) {
        alert("Please enter valid process details.");
        return;
    }

    processes.push({ id, arrival, burst });
    renderProcessList();

    document.getElementById("pid").value = "";
    document.getElementById("arrival").value = "";
    document.getElementById("burst").value = "";
}

// Delete
function deleteProcess(index) {
    processes.splice(index, 1);
    renderProcessList();
}

// Render list
function renderProcessList() {
    const list = document.getElementById("processList");
    list.innerHTML = "";

    processes.forEach((p, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${p.id} | Arrival: ${p.arrival} | Burst: ${p.burst}
            <button class="delete-btn" onclick="deleteProcess(${i})">×</button>
        `;
        list.appendChild(li);
    });
}

// Run scheduler
async function run() {
    if (processes.length === 0) {
        alert("Please add at least one process.");
        return;
    }

    const algorithm = document.getElementById("algo").value;
    const quantum = parseInt(document.getElementById("quantum").value);

    if (algorithm === "RR" && (!quantum || quantum <= 0)) {
        alert("Time Quantum is required for Round Robin.");
        return;
    }

    try {
        const res = await fetch("/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ processes, algorithm, quantum })
        });

        if (!res.ok) {
            throw new Error("Server error");
        }

        const data = await res.json();

        renderGantt(data.gantt, data.result);
        renderResults(data.result);

    } catch (err) {
        alert("Something went wrong while scheduling.");
        console.error(err);
    }
}

// Gantt chart
function renderGantt(gantt) {
    const container = document.getElementById("gantt");
    container.innerHTML = "";

    // find last execution index (for star)
    const lastExecution = {};
    gantt.forEach((g, index) => {
        lastExecution[g.id] = index;
    });

    gantt.forEach((g, index) => {
        const block = document.createElement("div");
        block.className = "block";

        const duration = g.end - g.start;
        block.style.width = (duration * 60) + "px"; // slightly bigger

        block.style.background = getColor(g.id);

        // ⭐ mark only last execution
        const star = (lastExecution[g.id] === index) ? " *" : "";

        block.innerHTML = `
            <div class="pid">${g.id}${star}</div>
            <div class="time">${g.start} - ${g.end}</div>
        `;

        container.appendChild(block);
    });
}

// Results
function renderResults(results) {
    let totalWT = 0, totalTAT = 0;

    let html = `
        <table>
            <tr>
                <th>Process</th>
                <th>Waiting Time</th>
                <th>Turnaround Time</th>
            </tr>
    `;

    results.forEach(r => {
        totalWT += r.waiting;
        totalTAT += r.turnaround;

        html += `
            <tr>
                <td>${r.id}</td>
                <td>${r.waiting}</td>
                <td>${r.turnaround}</td>
            </tr>
        `;
    });

    html += `</table>`;

    html += `
        <div class="metrics">
            <div>Average Waiting Time: ${(totalWT / results.length).toFixed(2)}</div>
            <div>Average Turnaround Time: ${(totalTAT / results.length).toFixed(2)}</div>
        </div>
    `;

    document.getElementById("results").innerHTML = html;
}

// SAFE color generator
function getColor(id) {
    const colors = ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed"];

    let sum = 0;
    for (let i = 0; i < id.length; i++) {
        sum += id.charCodeAt(i);
    }

    return colors[sum % colors.length];
}
