//Add your tests here
const sinon = require('sinon');
const assert = require('assert');
const { handleInput } = require('./geektrust')

const sample_input_1 = [
    'BOOK BIKE M40 14:00',
    'BOOK CAR O34 15:00',
    'BOOK SUV A66 11:00',
    'ADDITIONAL M40 17:40',
    'ADDITIONAL O34 20:50',
    'REVENUE'
]

const sample_output_1 = [
    'SUCCESS',
    'SUCCESS',
    'INVALID_ENTRY_TIME',
    'SUCCESS',
    'INVALID_EXIT_TIME',
    '590 0'
]

const sample_input_2 = [
    'BOOK SUV XY4 12:30',
    'BOOK SUV A56 13:10',
    'BOOK CAR AB1 14:20',
    'BOOK BIKE BIK1 13:00',
    'BOOK BIKE BIK2 14:00',
    'ADDITIONAL BIK2 17:50',
    'REVENUE'
]

const sample_output_2 = [
    'INVALID_ENTRY_TIME',
    'SUCCESS',
    'SUCCESS',
    'SUCCESS',
    'SUCCESS',
    'SUCCESS',
    '1370 0'
]

const sample_input_3 = [
    'BOOK SUV M40 14:00',
    'BOOK SUV O34 15:00',
    'BOOK SUV XY4 13:00',
    'BOOK SUV A56 13:10',
    'BOOK SUV AB1 14:20',
    'BOOK SUV S45 15:30',
    'BOOK SUV XY22 17:00',
    'BOOK SUV B56 18:00',
    'REVENUE',
]

const sample_output_3 = [
    'SUCCESS',
    'SUCCESS',
    'SUCCESS',
    'RACETRACK_FULL',
    'RACETRACK_FULL',
    'RACETRACK_FULL',
    'SUCCESS',
    'INVALID_ENTRY_TIME',
    '1800 900',    
]

describe('sample input 1', function() {

    sample_input_1.map((input, index)=>{

        describe(input, function() {
            it(`should return: ${sample_output_1[index]}`, function() {
                let spy = sinon.spy(console, 'log')

                handleInput(input.trim().split(' '))
                
                assert(spy.calledWith(sample_output_1[index]));

                console.log.restore();
            });
        });
    });
});





