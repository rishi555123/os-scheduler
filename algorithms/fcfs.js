module.exports = function fcfs(processes) {
    processes.sort((a, b) => a.arrival - b.arrival);

    let time = 0;
    let result = [];
    let gantt = [];

    processes.forEach(p => {
        if (time < p.arrival) time = p.arrival;

        let start = time;
        let completion = start + p.burst;

        result.push({
            id: p.id,
            waiting: start - p.arrival,
            turnaround: completion - p.arrival
        });

        gantt.push({ id: p.id, start, end: completion });

        time = completion;
    });

    return { result, gantt };
};
