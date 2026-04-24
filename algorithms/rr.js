module.exports = function rr(processes, quantum) {
    let queue = [...processes];
    let time = 0;
    let gantt = [];
    let remaining = {};

    processes.forEach(p => remaining[p.id] = p.burst);

    let completed = {};

    while (queue.length > 0) {
        let p = queue.shift();

        if (remaining[p.id] > 0) {
            let exec = Math.min(quantum, remaining[p.id]);

            gantt.push({ id: p.id, start: time, end: time + exec });

            time += exec;
            remaining[p.id] -= exec;

            if (remaining[p.id] > 0) {
                queue.push(p);
            } else {
                completed[p.id] = {
                    id: p.id,
                    turnaround: time - p.arrival,
                    waiting: time - p.arrival - p.burst
                };
            }
        }
    }

    return {
        result: Object.values(completed),
        gantt
    };
};
