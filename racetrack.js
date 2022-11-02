const {
	TRACK_TYPE,
	BOOKING_START_TIME,
	BOOKING_END_TIME,
	MAX_VEHICLES_PER_TRACK,
	TYPE_OF_VEHICLE,
	BOOKING_TYPE,
	ADDITIONAL_END_TIME,
	COST_PER_HOUR,
	ADDITIONAL_BOOKING_CHARGES_PER_HOUR,
	GRACE_PERIOD,
	DEFAULT_BOOKING_TIME_IN_HOURS,
	HOURS_IN_A_DAY,
	MINS_IN_A_HOUR,
} = require('./constants');

module.exports = class Racetrack {
	#bookingData = [];

	#checkForInvalidTimeSlot(timeSlot, bookingType) {
		const endTime = (bookingType === BOOKING_TYPE.BOOKING ? BOOKING_END_TIME : ADDITIONAL_END_TIME);
		return ((timeSlot < BOOKING_START_TIME) || (timeSlot > endTime));
	}

	#getTotalHours(startTimeString, endTimeString) {
		const [startTimeHours, startTimeMins] = startTimeString.split(':');
		const [endTimeHours, endTimeMins] = endTimeString.split(':');

		const differenceInMins = (endTimeHours * MINS_IN_A_HOUR + (+endTimeMins))
        - (startTimeHours * MINS_IN_A_HOUR + (+startTimeMins));

		const totalHours = Math.floor(differenceInMins / MINS_IN_A_HOUR)
        + (((differenceInMins / MINS_IN_A_HOUR) - Math.floor(differenceInMins / MINS_IN_A_HOUR)) > 0 ? 1 : 0);

		return totalHours;
	}

	#addTime(timeString, timeToAdd) {
		const [hour, minutes] = timeString.split(':');
		const mins = (hour * MINS_IN_A_HOUR) + (+minutes) + (+timeToAdd);

		const hoursString = (mins % (HOURS_IN_A_DAY * MINS_IN_A_HOUR) / MINS_IN_A_HOUR | 0) < 10 ? '0' : `${mins % (HOURS_IN_A_DAY * MINS_IN_A_HOUR) / MINS_IN_A_HOUR | 0}`;
		const minsString = (mins % MINS_IN_A_HOUR) < 10 ? '0' : `${mins % MINS_IN_A_HOUR}`;

		return (`${hoursString}:${minsString}`);
	}

	#vacancyCheck(vehicleType, entryTime, exitTime) {
		let countOfVehiclesVip = 0;
		let countOfVehiclesRegular = 0;

		if (!this.#bookingData.length) {
			return {
				regularVehiclesCount: MAX_VEHICLES_PER_TRACK.REGULAR[vehicleType],
				vipVehiclesCount: MAX_VEHICLES_PER_TRACK.VIP[vehicleType],
			};
		}

		this.#bookingData.forEach((booking) => {
			if (booking.vehicleType !== vehicleType) {
				return;
			}

			if (!(
				((booking.entryTime < exitTime) && (booking.exitTime >= exitTime))
                || ((booking.entryTime <= entryTime) && (booking.exitTime > entryTime))
			)) {
				return;
			}

			if (booking.trackType === TRACK_TYPE.REGULAR) {
				countOfVehiclesRegular += 1;
			} else {
				countOfVehiclesVip += 1;
			}
		});

		return {
			regularVehiclesCount: MAX_VEHICLES_PER_TRACK.REGULAR[vehicleType] - countOfVehiclesRegular,
			vipVehiclesCount: MAX_VEHICLES_PER_TRACK.VIP[vehicleType] - countOfVehiclesVip,
		};
	}

	#addBookingData(booking) {
		this.#bookingData.push(booking);
	}

	book(vehicleType, vehicleNo, entryTime) {
		if (!(vehicleNo && entryTime && vehicleType)) {
			console.log('MISSING_REQUIRED _ARGUMENTS');
			return;
		}

		if (!TYPE_OF_VEHICLE[vehicleType]) {
			console.log('INVALID_VEHICLE_TYPE');
			return;
		}

		if (this.#checkForInvalidTimeSlot(entryTime, BOOKING_TYPE.BOOKING)) {
			console.log('INVALID_ENTRY_TIME');
			return;
		}

		const exitTime = this.#addTime(entryTime, DEFAULT_BOOKING_TIME_IN_HOURS * MINS_IN_A_HOUR);

		const trackVacancy = this.#vacancyCheck(vehicleType, entryTime, exitTime);

		if (trackVacancy.regularVehiclesCount < 1 && ((trackVacancy.vipVehiclesCount < 1) || (vehicleType === 'BIKE'))) {
			console.log('RACETRACK_FULL');
			return;
		}

		const trackType = trackVacancy.regularVehiclesCount >= 1 ? TRACK_TYPE.REGULAR : TRACK_TYPE.VIP;

		this.#addBookingData({
			vehicleNo, entryTime, vehicleType, trackType, bookingType: BOOKING_TYPE.BOOKING, exitTime,
		});

		console.log('SUCCESS');
	}

	additional(vehicleNo, newExitTime) {
		if (!(vehicleNo && newExitTime)) {
			console.log('MISSING REQUIRED ARGUMENTS');
			return;
		}

		if (this.#checkForInvalidTimeSlot(newExitTime, BOOKING_TYPE.ADDITIONAL)) {
			console.log('INVALID_EXIT_TIME');
			return;
		}

		const vehicleData = this.#bookingData.find((booking) => (
			(booking.vehicleNo === vehicleNo && booking.bookingType === BOOKING_TYPE.BOOKING)
		));

		if (!vehicleData) {
			console.log('NO_VEHICLE_EXISTS');
			return;
		}

		const {
			vehicleType,
			exitTime,
		} = vehicleData;

		const trackVacancy = this.#vacancyCheck(vehicleType, exitTime, newExitTime);

		if (trackVacancy.regularVehiclesCount < 1 && ((trackVacancy.vipVehiclesCount < 1) || (vehicleType === 'BIKE'))) {
			console.log('RACETRACK_FULL');
			return;
		}

		const trackType = trackVacancy.regularVehiclesCount >= 1 ? TRACK_TYPE.REGULAR : TRACK_TYPE.VIP;

		this.#addBookingData({
			entryTime: exitTime, exitTime: newExitTime, vehicleType, vehicleNo, trackType, bookingType: BOOKING_TYPE.ADDITIONAL,
		});

		console.log('SUCCESS');
	}

	#revenueFromBooking() {
		let vipTrackIncome = 0;
		let regularTrackIncome = 0;

		this.#bookingData.forEach((booking) => {
			if (booking.bookingType !== BOOKING_TYPE.BOOKING) return;

			if (booking.trackType === TRACK_TYPE.VIP) {
				vipTrackIncome += (COST_PER_HOUR.VIP[booking.vehicleType] * DEFAULT_BOOKING_TIME_IN_HOURS);
			} else {
				regularTrackIncome += (COST_PER_HOUR.REGULAR[booking.vehicleType] * DEFAULT_BOOKING_TIME_IN_HOURS);
			}
		});

		return {
			vipTrackIncome,
			regularTrackIncome,
		};
	}

	#revenueFromAdditionalBooking() {
		let vipTrackIncome = 0;
		let regularTrackIncome = 0;

		this.#bookingData.forEach((booking) => {
			if (booking.bookingType !== BOOKING_TYPE.ADDITIONAL) return;

			if (this.#addTime(booking.entryTime, GRACE_PERIOD) >= booking.exitTime) return;

			const totalHours = this.#getTotalHours(booking.entryTime, booking.exitTime);

			if (booking.trackType === TRACK_TYPE.VIP) {
				vipTrackIncome += (ADDITIONAL_BOOKING_CHARGES_PER_HOUR * totalHours);
			} else {
				regularTrackIncome += (ADDITIONAL_BOOKING_CHARGES_PER_HOUR * totalHours);
			}
		});

		return {
			vipTrackIncome,
			regularTrackIncome,
		};
	}

	revenue() {
		const additionalRevenue = this.#revenueFromAdditionalBooking();
		const bookingRevenue = this.#revenueFromBooking();

		const regularTrackIncome = additionalRevenue.regularTrackIncome + bookingRevenue.regularTrackIncome;

		const vipTrackIncome = additionalRevenue.vipTrackIncome + bookingRevenue.vipTrackIncome;

		console.log(`${regularTrackIncome} ${vipTrackIncome}`);
	}
};
