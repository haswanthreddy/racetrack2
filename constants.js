exports.TYPE_OF_VEHICLE = {
	SUV: 1,
	CAR: 2,
	BIKE: 3,
};

exports.MAX_VEHICLES_PER_TRACK = {
	REGULAR: {
		BIKE: 4,
		CAR: 2,
		SUV: 2,
	},
	VIP: {
		CAR: 1,
		SUV: 1,
	},
};

exports.CLOSING_TIME = '20:00';

exports.TRACK_TYPE = {
	VIP: 1,
	REGULAR: 2,
};

exports.BOOKING_START_TIME = '13:00';

exports.BOOKING_END_TIME = '17:00';

exports.ADDITIONAL_END_TIME = '20:00';

exports.BOOKING_TYPE = {
	BOOKING: 1,
	ADDITIONAL: 2,
};

exports.COST_PER_HOUR = {
	REGULAR: {
		BIKE: 60,
		CAR: 120,
		SUV: 200,
	},
	VIP: {
		CAR: 250,
		SUV: 300,
	},
};

exports.BOOK = 'BOOK';

exports.REVENUE = 'REVENUE';

exports.ADDITIONAL = 'ADDITIONAL';

exports.ADDITIONAL_BOOKING_CHARGES_PER_HOUR = 50;

exports.GRACE_PERIOD = 15;

exports.DEFAULT_BOOKING_TIME_IN_HOURS = 3;

exports.HOURS_IN_A_DAY = 24;

exports.MINS_IN_A_HOUR = 60;
