const fs = require('fs');
const {
	BOOK,
	REVENUE,
	ADDITIONAL,
} = require('./constants');
const Racetrack = require('./racetrack');

const handleInput = (data) => {
	const racetrackSession = new Racetrack();
	for (const input of data) {
		const commands = input.split(' ');

		if (commands[0] === BOOK) {
			const [vehicleType, vehicleNo, entryTime] = commands.slice(1, 4);

			racetrackSession.book(vehicleType, vehicleNo, entryTime);
		} else if (commands[0] === ADDITIONAL) {
			const [vehicleNo, exitTime] = commands.slice(1, 3);

			racetrackSession.additional(vehicleNo, exitTime);
		} else if (commands[0] === REVENUE) {
			racetrackSession.revenue();
		}
	}
};

// readFile
const data = fs.readFileSync(process.argv[2], 'utf-8').toString().replace(/\r|/g, '').split('\n');

handleInput(data);
