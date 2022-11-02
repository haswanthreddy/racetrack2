const sinon = require('sinon');
const assert = require('assert');
const Racetrack = require('./racetrack');
const {
	INVALID_ENTRY_TIME, MISSING_REQUIRED_PARAMETERS, SUCCESS, RACETRACK_FULL, INVALID_EXIT_TIME,
} = require('./constants');

describe('BOOKING', () => {
	describe('check for INVALID_ENTRY_TIME', () => {
		it('when entryTime earlier than BOOKING START TIME (13:00) command: BOOK SUV A66 11:00', () => {
			const racetrack = new Racetrack();

			const command = 'SUV A66 11:00'.split(' ');
			const [vehicleType, vehicleNo, entryTime] = command;

			const spy = sinon.spy(console, 'log');

			racetrack.book(vehicleType, vehicleNo, entryTime);

			assert(spy.calledWith(INVALID_ENTRY_TIME));
			console.log.restore();
		});

		it('when entryTime later than LAST BOOKING ACCEPTED TIME (17:00) command: BOOK SUV A66 17:10', () => {
			const racetrack = new Racetrack();

			const command = 'SUV A66 17:10'.split(' ');
			const [vehicleType, vehicleNo, entryTime] = command;

			const spy = sinon.spy(console, 'log');

			racetrack.book(vehicleType, vehicleNo, entryTime);

			assert(spy.calledWith(INVALID_ENTRY_TIME));
			console.log.restore();
		});
	});

	describe('check for MISSING_REQUIRED_PARAMETERS', () => {
		describe('when one among vehicleNo, vehicleType, entryTime', () => {
			it('missing parameter vehicleNo', () => {
				const racetrack = new Racetrack();

				const command = 'SUV A66 17:10'.split(' ');

				const vehicleType = undefined;
				const vehicleNo = command[1];
				const entryTime = command[2];

				const spy = sinon.spy(console, 'log');

				racetrack.book(vehicleType, vehicleNo, entryTime);

				assert(spy.calledWith(MISSING_REQUIRED_PARAMETERS));
				console.log.restore();
			});

			it('missing parameter vehicleType', () => {
				const racetrack = new Racetrack();

				const command = 'SUV A66 17:10'.split(' ');

				const vehicleType = command[0];
				const vehicleNo = undefined;
				const entryTime = command[2];

				const spy = sinon.spy(console, 'log');

				racetrack.book(vehicleType, vehicleNo, entryTime);

				assert(spy.calledWith(MISSING_REQUIRED_PARAMETERS));
				console.log.restore();
			});

			it('missing parameter entryTime', () => {
				const racetrack = new Racetrack();

				const command = 'SUV A66 17:10'.split(' ');

				const vehicleType = command[0];
				const vehicleNo = command[1];
				const entryTime = undefined;

				const spy = sinon.spy(console, 'log');

				racetrack.book(vehicleType, vehicleNo, entryTime);

				assert(spy.calledWith(MISSING_REQUIRED_PARAMETERS));
				console.log.restore();
			});
		});
	});

	describe('check for BOOKING', () => {
		describe('should log SUCCESS on successful allocation of racetrack else RACETRACK_FULL should be the response', () => {
			const racetrack = new Racetrack();

			it('should log SUCCESS for command BOOK SUV M40 14:00', () => {
				const command = 'BOOK SUV M40 14:00'.split(' ');

				const vehicleType = command[1];
				const vehicleNo = command[2];
				const entryTime = command[3];

				const spy = sinon.spy(console, 'log');

				racetrack.book(vehicleType, vehicleNo, entryTime);

				assert(spy.calledWith(SUCCESS));
				console.log.restore();
			});

			it('should log SUCCESS for command BOOK SUV O34 15:00', () => {
				const command = 'BOOK SUV O34 15:00'.split(' ');

				const vehicleType = command[1];
				const vehicleNo = command[2];
				const entryTime = command[3];

				const spy = sinon.spy(console, 'log');

				racetrack.book(vehicleType, vehicleNo, entryTime);

				assert(spy.calledWith(SUCCESS));
				console.log.restore();
			});

			it('should log SUCCESS for command BOOK SUV XY4 13:00', () => {
				const command = 'BOOK SUV XY4 13:00'.split(' ');

				const vehicleType = command[1];
				const vehicleNo = command[2];
				const entryTime = command[3];

				const spy = sinon.spy(console, 'log');

				racetrack.book(vehicleType, vehicleNo, entryTime);

				assert(spy.calledWith(SUCCESS));
				console.log.restore();
			});

			it('should log RACETRACK_FULL for command BOOK SUV A56 13:10', () => {
				const command = 'BOOK SUV A56 13:10'.split(' ');

				const vehicleType = command[1];
				const vehicleNo = command[2];
				const entryTime = command[3];

				const spy = sinon.spy(console, 'log');

				racetrack.book(vehicleType, vehicleNo, entryTime);

				assert(spy.calledWith(RACETRACK_FULL));
				console.log.restore();
			});
		});
	});
});

describe('ADDITIONAL BOOKING', () => {
	describe('check for INVALID_EXIT_TIME', () => {
		const racetrack = new Racetrack();

		const [vehicleType, vehicleNo, entryTime] = 'BIKE BIK2 14:00';

		racetrack.book(vehicleType, vehicleNo, entryTime);

		it('when exitTime earlier than BOOKING START TIME (13:00) or its booking entryTime command: ADDITIONAL BIK2 12:50', () => {
			const command = 'ADDITIONAL BIK2 12:50'.split(' ');

			const spy = sinon.spy(console, 'log');

			racetrack.additional(command[1], command[2]);

			assert(spy.calledWith(INVALID_EXIT_TIME));
			console.log.restore();
		});

		it('when exitTime later than its TRACK CLOSING TIME (20:00) command: ADDITIONAL BIK2 20:50', () => {
			const command = 'ADDITIONAL BIK2 20:50'.split(' ');

			const spy = sinon.spy(console, 'log');

			racetrack.additional(command[1], command[2]);

			assert(spy.calledWith(INVALID_EXIT_TIME));
			console.log.restore();
		});
	});

	describe('check for input parameters', () => {
		const racetrack = new Racetrack();

		const [vehicleType, vehicleNo, entryTime] = 'BIKE BIK2 14:00';

		racetrack.book(vehicleType, vehicleNo, entryTime);

		describe('when one among vehicleNo, entryTime', () => {
			it('missing parameter vehicleNo', () => {
				const command = 'ADDITIONAL BIK2 17:50'.split(' ');

				const spy = sinon.spy(console, 'log');

				racetrack.additional(undefined, command[2]);

				assert(spy.calledWith(MISSING_REQUIRED_PARAMETERS));
				console.log.restore();
			});

			it('missing parameter exitTime', () => {
				const command = 'ADDITIONAL BIK2 17:50'.split(' ');

				const spy = sinon.spy(console, 'log');

				racetrack.additional(command[1], undefined);

				assert(spy.calledWith(MISSING_REQUIRED_PARAMETERS));
				console.log.restore();
			});
		});

		// exit time

		//
	});

	describe('check for additional booking', () => {
		describe('should log SUCCESS on successful allocation of racetrack else RACETRACK_FULL should be the response', () => {
			const racetrack = new Racetrack();

			const command1 = 'BOOK SUV A56 13:10'.split(' ');
			const command2 = 'BOOK SUV XY4 14:20'.split(' ');
			const command3 = 'BOOK SUV XY3 13:30'.split(' ');
			const command4 = 'BOOK SUV XY2 16:50'.split(' ');

			racetrack.book(command1[1], command1[2], command1[3]);
			racetrack.book(command2[1], command2[2], command2[3]);
			racetrack.book(command3[1], command3[2], command3[3]);
			racetrack.book(command4[1], command4[2], command4[3]);

			it('should log SUCCESS for command ADDITIONAL XY3 16:40', () => {
				const command = 'ADDITIONAL XY3 16:40'.split(' ');

				const vehicleNo = command[1];
				const exitTime = command[2];

				const spy = sinon.spy(console, 'log');

				racetrack.additional(vehicleNo, exitTime);

				assert(spy.calledWith(SUCCESS));
				console.log.restore();
			});

			it('should log RACETRACK_FULL for command ADDITIONAL A56 16:55', () => {
				const command = 'ADDITIONAL A56 16:55'.split(' ');

				const vehicleNo = command[1];
				const exitTime = command[2];

				const spy = sinon.spy(console, 'log');

				racetrack.additional(vehicleNo, exitTime);

				assert(spy.calledWith(RACETRACK_FULL));
				console.log.restore();
			});
		});
	});
});

describe('REVENUE', () => {
	describe('for these commands/ session BOOK BIKE M40 14:00\nBOOK CAR 034 15:00\nBOOK SUV A66 11:00\nADDITIONAL M40 17:40\nADDITIONAL 034 20:50\n revenue should be 590 0', () => {
		it('revenue should be 590 0', () => {
			const command1 = 'BOOK BIKE M40 14:00'.split(' ');
			const command2 = 'BOOK CAR O34 15:00'.split(' ');
			const command3 = 'BOOK SUV A66 11:00'.split(' ');
			const command4 = 'ADDITIONAL M40 17:40'.split(' ');
			const command5 = 'ADDITIONAL O34 20:50'.split(' ');

			const racetrack = new Racetrack();

			racetrack.book(command1[1], command1[2], command1[3]);
			racetrack.book(command2[1], command2[2], command2[3]);
			racetrack.book(command3[1], command3[2], command3[3]);
			racetrack.additional(command4[1], command4[2]);
			racetrack.additional(command5[1], command5[2]);

			const spy = sinon.spy(console, 'log');

			racetrack.revenue();

			assert(spy.calledWith('590 0'));
			console.log.restore();
		});
	});
});
