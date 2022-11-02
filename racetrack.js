const {
	TRACK_TYPE,
	BOOKING_START_TIME,
	BOOKING_END_TIME,
	MAX_VEHICLES_PER_TRACK,
	TYPE_OF_VEHICLE,
	BOOKING_TYPE,
	ADDITIONAL_END_TIME,
	COST_PER_HOUR,
} = require('./constants');

module.exports = class RaceTrack {
	#bookingData = [];

	#checkForInvalidTimeSlot(timeSlot, bookingType) {
		const endTime = (bookingType === BOOKING_TYPE.BOOKING ? BOOKING_END_TIME : ADDITIONAL_END_TIME);
		return ((timeSlot < BOOKING_START_TIME) || (timeSlot > endTime));
	}

	#getTotalHours(startTimeString, endTimeString) {
		const [startTimeHours, startTimeMins] = startTimeString.split(':');
		const [endTimeHours, endTimeMins] = endTimeString.split(':');

		const differenceInMins = (endTimeHours * 60 + (+endTimeMins))
        - (startTimeHours * 60 + (+startTimeMins));

		const totalHours = Math.floor(differenceInMins / 60)
        + (((differenceInMins / 60) - Math.floor(differenceInMins / 60)) > 0 ? 1 : 0);

		return totalHours;
	}

	#addTime(timeString, timeToAdd) {
		const [hour, minutes] = timeString.split(':');
		const mins = (hour * 60) + (+minutes) + (+timeToAdd);

		const hoursString = (mins % (24 * 60) / 60 | 0) < 10 ? '0' : `${mins % (24 * 60) / 60 | 0}`;
		const minsString = (mins % 60) < 10 ? '0' : `${mins % 60}`;

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

	book(vehicleType, vehicleNo, entryTime) {
		if (!(vehicleNo && entryTime && vehicleType)) {
			console.log('MISSING_REQUIRED _ARGUMENTS');
			return;
		}

		if (!TYPE_OF_VEHICLE[vehicleType]) {
			console.log('INVALID_VEHICLE_TYPE');
			return;
		}

		const isInvalid = this.#checkForInvalidTimeSlot(entryTime, BOOKING_TYPE.BOOKING);

		if (isInvalid) {
			console.log('INVALID_ENTRY_TIME');
			return;
		}

		const exitTime = this.#addTime(entryTime, 3 * 60);

		const trackVacancy = this.#vacancyCheck(vehicleType, entryTime, exitTime);

		if (trackVacancy.regularVehiclesCount < 1 && ((trackVacancy.vipVehiclesCount < 1) || (vehicleType === 'BIKE'))) {
			console.log('RACETRACK_FULL');
			return;
		}

		const booking = {
			vehicleType,
			entryTime,
			vehicleNo,
			trackType: trackVacancy.regularVehiclesCount >= 1 ? TRACK_TYPE.REGULAR : TRACK_TYPE.VIP,
			bookingType: BOOKING_TYPE.BOOKING,
			exitTime,
		};

		this.#bookingData.push(booking);

		console.log('SUCCESS');
	}

	additional(vehicleNo, newExitTime) {
		if (!(vehicleNo && newExitTime)) {
			console.log('MISSING REQUIRED ARGUMENTS');
			return;
		}

		const isInvalid = this.#checkForInvalidTimeSlot(newExitTime, BOOKING_TYPE.ADDITIONAL);
		if (isInvalid) {
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

		const bookingAddition = {
			entryTime: exitTime,
			exitTime: newExitTime,
			vehicleType,
			vehicleNo,
			trackType: trackVacancy.regularVehiclesCount >= 1 ? TRACK_TYPE.REGULAR : TRACK_TYPE.VIP,
			bookingType: BOOKING_TYPE.ADDITIONAL,
		};

		this.#bookingData.push(bookingAddition);

		console.log('SUCCESS');
	}

	revenue() {
		let vipTrackIncome = 0;
		let regularTrackIncome = 0;

		this.#bookingData.forEach((booking) => {
			// for booking period
			if (booking.bookingType === BOOKING_TYPE.BOOKING) {
				if (booking.trackType === TRACK_TYPE.VIP) {
					vipTrackIncome += (COST_PER_HOUR.VIP[booking.vehicleType] * 3);
				} else {
					regularTrackIncome += (COST_PER_HOUR.REGULAR[booking.vehicleType] * 3);
				}
				return;
			}

			// for additional booking period

			if (this.#addTime(booking.entryTime, 15) >= booking.exitTime) return;

			const totalHours = this.#getTotalHours(booking.entryTime, booking.exitTime);

			if (booking.trackType === TRACK_TYPE.VIP) {
				vipTrackIncome += (50 * totalHours);
			} else {
				regularTrackIncome += (50 * totalHours);
			}
		});

		console.log(`${regularTrackIncome} ${vipTrackIncome}`);
	}
};
