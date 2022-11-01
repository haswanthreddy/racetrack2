const fs = require("fs")
const {
    TRACK_TYPE,
    BOOKING_START_TIME,
    BOOKING_END_TIME,
    MAX_VEHICLES_PER_TRACK,
    TYPE_OF_VEHICLE,
    BOOKING_TYPE,
    ADDITIONAL_END_TIME,
    COST_PER_HOUR,
} = require('./constants')

const filename = process.argv[2]

class RaceTrack {
    constructor() {
        this.bookingData = [];
    }
    // add # in front of private methods

    getTotalHours = (timeString1, timeString2) => {
        const [hours1, mins1] = timeString1.split(':');
        const [hours2, mins2] = timeString2.split(':');

        const diff = (Number(hours1) * 60 + Number(mins1)) - (Number(hours2) * 60 + Number(mins2))

        const totalHours = Math.floor(diff / 60) + (((diff / 60) - Math.floor(diff / 60)) > 0 ? 1 : 0)

        return totalHours
    }

    addTime = (timeString, timeToAddInMinutes) => {
        const [hour, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hour, minutes, 0);
        date = new Date(date.getTime() + timeToAddInMinutes * 1000)
        date.toString();
        return `${date.getHours()}:${date.getMinutes()}`
    }

    vacancyCheck = (vehicleType, entryTime, exitTime) => {
        let countOfVehiclesVip = 0;
        let countOfVehiclesRegular = 0;

        if (bookingData.length >= 1) {
            bookingData.forEach((booking) => {
                if (booking.vehicleType !== vehicleType) {
                    return
                }

                if (!(
                    ((booking.entryTime < exitTime) && (booking.exitTime >= exitTime))
                    || ((booking.entryTime <= entryTime) && (booking.exitTime > entryTime))
                )) {
                    return
                }

                if (booking.trackType === TRACK_TYPE.REGULAR) {
                    countOfVehiclesRegular += 1
                } else {
                    countOfVehiclesVip += 1
                }
            })

            return {
                regular: MAX_VEHICLES_PER_TRACK.REGULAR[vehicleType] - countOfVehiclesRegular,
                vip: MAX_VEHICLES_PER_TRACK.VIP[vehicleType] - countOfVehiclesVip
            }
        }

        return {
            regular: MAX_VEHICLES_PER_TRACK.REGULAR[vehicleType],
            vip: MAX_VEHICLES_PER_TRACK.VIP[vehicleType]
        }
    }

    book = (vehicleType, vehicleNo, entryTime) => {
        const exitTime = this.addTime(entryTime, 3 * 60)

        const trackVacancy = this.vacancyCheck(vehicleType, entryTime, exitTime)

        if (trackVacancy.regular < 1 && ((trackVacancy.vip < 1) || (vehicleType === 'BIKE'))) {
            return 'RACE_TRACK_FULL'
        }

        const booking = {
            vehicleType,
            entryTime,
            vehicleNo,
            trackType: trackVacancy.regular >= 1 ? TRACK_TYPE.REGULAR : TRACK_TYPE.VIP,
            bookingType: BOOKING_TYPE.BOOKING,
            exitTime: exitTime,
        }

        this.bookingData.push(booking)

        return 'SUCCESS'
    }

    additional = (vehicleNo, newExitTime) => {
        let vehicleData;

        for (let booking of this.bookingData) {
            if (booking.vehicleNo === vehicleNo && booking.bookingType === BOOKING_TYPE.BOOKING)
                vehicleData = booking
        }

        if (!vehicleData) {
            return 'NO_VEHICLE_EXISTS'
        }

        const {
            vehicleType,
            exitTime,
        } = vehicleData

        const trackVacancy = this.vacancyCheck(vehicleType, exitTime, newExitTime)

        if (trackVacancy.regular < 1 && ((trackVacancy.vip < 1) || (vehicleType === 'BIKE'))) {
            return 'RACE_TRACK_FULL'
        }

        const bookingAddition = {
            entryTime: exitTime,
            exitTime: newExitTime,
            vehicleType: vehicleType,
            vehicleNo,
            trackType: trackVacancy.regular >= 1 ? TRACK_TYPE.REGULAR : TRACK_TYPE.VIP,
            bookingType: BOOKING_TYPE.ADDITIONAL,
        }

        this.bookingData.push(bookingAddition);

        return 'SUCCESS'
    }

    revenue = () => {
        let vipTrackIncome = 0;
        let regularTrackIncome = 0;

        this.bookingData.forEach((booking) => {

            // booking
            if (booking.bookingType === BOOKING_TYPE.BOOKING) {
                if (booking.trackType === TRACK_TYPE.VIP) {
                    vipTrackIncome += (COST_PER_HOUR.VIP[booking.vehicleType] * 3)
                }
                else {
                    regularTrackIncome += (COST_PER_HOUR.REGULAR[booking.vehicleType] * 3)
                }
                return
            }

            // additional
            if (this.addTime(booking.entryTime, 15) > booking.exitTime) return

            const totalHours = this.getTotalHours(booking.entryTime, booking.exitTime)

            if (booking.trackType === TRACK_TYPE.VIP) {
                vipTrackIncome += (50 * totalHours)
            }
            else {
                regularTrackIncome += (50 * totalHours)
            }
        })

        return [regular, vip]
    }
}

const getHours = (timeString1, timeString2) => {
    const [hrs1, mins1] = timeString1.split(':');
    const [hrs2, mins2] = timeString2.split(':');

    const diff = Number(hrs1) * 60 + Number(mins1) - Number(hrs2) * 60 + Number(mins2)
    let [hours, mins] = (diff / 60).toString().split('.')
    hours = Number(hours)
    hours += mins > '0' ? 1 : 0
    return hours
}

const addTime = (timeString, timeToAdd) => {
    function convertToString(remainder) {
        return (remainder < 10 ? '0' : '') + remainder;
    }

    const [hour, minutes] = timeString.split(':');
    let mins = (+hour) * 60 + +minutes + +timeToAdd

    return (convertToString(mins % (24 * 60) / 60 | 0) + ':' + convertToString(mins % 60))
}

/**
 * @desc To check vacancy in track according to vehicle type and entry and exit time
 * @param {*} vehicleType 
 * @param {*} entryTime 
 * @param {*} exitTime 
 * @returns no. of vehicles in vip and regular
 */

const vacancyCheck = (vehicleType, entryTime, exitTime) => {
    let countOfVehiclesVip = 0;
    let countOfVehiclesRegular = 0;

    if (booking_data.length >= 1) {
        booking_data.forEach((booking) => {
            if (booking.vehicleType !== vehicleType) {
                return
            }

            let inBookingTime = ((booking.entryTime < exitTime) && (booking.exitTime > exitTime))
                || ((booking.entryTime < entryTime) && (booking.exitTime > entryTime))
                || ((booking.entryTime === entryTime) || (booking.exitTime === exitTime))

            if (!inBookingTime) {
                return
            }

            if (booking.trackType === TRACK_TYPE.REGULAR) {
                countOfVehiclesRegular += 1
            } else {
                countOfVehiclesVip += 1
            }
        })

        return {
            regular: MAX_VEHICLES_PER_TRACK.REGULAR[vehicleType] - countOfVehiclesRegular,
            vip: MAX_VEHICLES_PER_TRACK.VIP[vehicleType] - countOfVehiclesVip
        }
    }

    return {
        regular: MAX_VEHICLES_PER_TRACK.REGULAR[vehicleType],
        vip: MAX_VEHICLES_PER_TRACK.VIP[vehicleType]
    }
}


/**
 * @desc To book a vehicles booking
 * @param {*} vehicleType 
 * @param {*} vehicleNo 
 * @param {*} entryTime 
 * @returns success if booked else race-track-full if track is occupied
 */
const book = (vehicleType, vehicleNo, entryTime) => {

    const entryDateTime = entryTime//getDateTime(entryTime)
    const exitTime = addTime(entryTime, 3 * 60)

    const trackVacancy = vacancyCheck(vehicleType, entryDateTime, exitTime)

    if (trackVacancy.regular < 1 && ((trackVacancy.vip < 1) || (vehicleType === 'BIKE'))) {
        return 'RACE_TRACK_FULL'
    }

    const booking = {
        vehicleType,
        entryTime: entryDateTime,
        trackType: null,
        vehicleNo,
        bookingType: BOOKING_TYPE.BOOKING,
        exitTime: addTime(entryDateTime, 3 * 60)
    }

    booking.trackType = trackVacancy.regular >= 1 ? TRACK_TYPE.REGULAR : TRACK_TYPE.VIP
    booking_data.push(booking)

    vehicle_data[vehicleNo] = booking

    return 'SUCCESS'
}

/**
 * @desc to handle additional booking for a vehicle
 * @param {*} vehicleNo 
 * @param {*} newExitTime 
 * @returns 
 */
const additional = (vehicleNo, newExitTime) => {
    const vehicleData = vehicle_data[vehicleNo];

    if (!vehicleData) {
        return 'NO_VEHICLE_EXISTS'
    }

    const {
        vehicleType,
        exitTime,
    } = vehicleData

    const timeToCheck = addTime(exitTime, 15)

    if (timeToCheck > newExitTime) {
        return
    }

    const trackVacancy = vacancyCheck(vehicleType, exitTime, newExitTime)

    if (trackVacancy.regular < 1 && ((trackVacancy.vip < 1) || (vehicleType === 'BIKE'))) {
        return 'RACE_TRACK_FULL'
    }

    const bookingAddition = {
        entryTime: exitTime,
        exitTime: newExitTime,
        vehicleType: vehicleType,
        vehicleNo,
        trackType: trackVacancy.regular >= 1 ? TRACK_TYPE.REGULAR : TRACK_TYPE.VIP,
        bookingType: BOOKING_TYPE.ADDITIONAL,
    }

    booking_data.push(bookingAddition);

    return 'SUCCESS'
}



/**
 * @desc to handle calculation of revenue
 * @returns regular and vip tracks income
 */
const revenue = () => {
    vip = 0;
    regular = 0;
    count = 1
    booking_data.forEach((booking) => {

        // booking
        if (booking.bookingType === BOOKING_TYPE.BOOKING) {
            if (booking.trackType === TRACK_TYPE.VIP) vip += (COST_PER_HOUR.VIP[booking.vehicleType] * 3)
            else regular += (COST_PER_HOUR.REGULAR[booking.vehicleType] * 3)

            return
        }

        let hours = getHours(booking.entryTime, booking.exitTime)
        if (booking.trackType === TRACK_TYPE.VIP) vip += (50 * hours)
        else regular += (50 * hours)
    })

    return [regular, vip]
}


const handleInput = (inputArr) => {
    const booking_data = []

    const vehicle_data = {

    }
    if (inputArr[0] === 'BOOK') {

        const vehicleType = inputArr[1];

        const vehicleNo = inputArr[2];

        const entryTime = inputArr[3];

        if ((entryTime < BOOKING_START_TIME) || (entryTime > BOOKING_END_TIME)) {
            console.log('INVALID_ENTRY_TIME')
            return
        }

        if (!TYPE_OF_VEHICLE[vehicleType]) {
            console.log('INVALID_VEHICLE_TYPE');
            return
        }

        console.log(book(vehicleType, vehicleNo, entryTime))
    } else if (inputArr[0] === 'ADDITIONAL') {
        const vehicleNo = inputArr[1];

        const exitTime = inputArr[2];

        if ((exitTime < BOOKING_START_TIME) || (exitTime > ADDITIONAL_END_TIME)) {
            console.log('INVALID_EXIT_TIME')
            return
        }

        console.log(additional(vehicleNo, exitTime))
    } else if (inputArr[0] === 'REVENUE') {
        const [regular, vip] = revenue()
        console.log(`${regular} ${vip}`)
    }
}

//readFile
const read = (filename) => fs.readFile(filename, "utf8", (err, data) => {
    if (err) throw err

    const inputLines = data.toString().split("\n")

    inputLines.forEach((input) => {
        const inputArr = input.trim().split(' ');
        handleInput(inputArr)
    })
})

filename && read(filename)








