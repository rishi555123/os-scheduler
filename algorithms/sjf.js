module.exports = function sjf(processes) {
    let time = 0;
    let completed = [];
    let gantt = [];

    while (processes.length > 0) {
        let available = processes.filter(p => p.arrival <= time);

        if (available.length === 0) {
            time++;
            continue;
        }

        available.sort((a, b) => a.burst - b.burst);
        let p = available[0];

        processes = processes.filter(x => x.id !== p.id);

        let start = time;
        let completion = start + p.burst;

        completed.push({
            id: p.id,
            waiting: start - p.arrival,
            turnaround: completion - p.arrival
        });

        gantt.push({ id: p.id, start, end: completion });

        time = completion;
    }

    return { result: completed, gantt };
};
