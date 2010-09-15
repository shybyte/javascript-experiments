/* Author: 
  Marco Stahl
*/

function randomInt(min, max){
    return Math.round(Math.random() * (max - min) + min);
}

function isLeapYear(year){
    return (year % 4) == 0 && (!(year % 100 == 0) || (year % 400 == 0));
}

function leapYearDelta(year){
    return isLeapYear(year) ? 1: 0;
}

function daysOfMonth(year, month) {
    var normalDaysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return normalDaysOfMonth[month - 1] + (month == 2 ? leapYearDelta(year) : 0)
}

function randomDay(year, month){
    return randomInt(1, daysOfMonth(year,month));
}

function randomDate(minYear, maxYear){
    var year = randomInt(minYear, maxYear);
    var month = randomInt(1, 12);
    return{
        year: year,
        month: month,
        day: randomDay(year, month)
    }
}

function getRange(){
    var rangeString = $('input:radio[name=range]:checked').val().split('-');
    return jQuery.map(rangeString,
    function(el){
        return parseInt(el);
    });
}

function randomDateFromRange(){
    var range = getRange();
    return randomDate(range[0], range[1]);
}

function dateToString(date){
    return $.nano('{day}.{month}.{year}', date);
}

function weekDayIndex(date){
    var centurySummands = [2,0,6];
    var monthSummands = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
    var lastYearDigits = date.year % 100;
    var centurySummand = centurySummands[Math.floor(date.year/100)-18];
    var yearSummand = (lastYearDigits + (Math.floor(lastYearDigits / 4))) % 7;
    var monthSummand = monthSummands[date.month - 1];
    var leapYearDelta = date.month <= 2 && isLeapYear(date.year) ? -1: 0
    return (centurySummand + yearSummand + monthSummand + date.day - leapYearDelta) % 7;
}

function weekDayName(date){
    var weekDayNames = ['Sunday', 'Monday', 'Tuessday', 'Wednesday', 'Thursday', 'Friday','Saturday'];
    return weekDayNames[weekDayIndex(date)];
}

function start(){
    var date = randomDateFromRange();
    /*
    date = {
        year: 2010,
        month: 9,
        day: 15
    };*/
    $('#question ').text(dateToString(date) + " = " + weekDayName(date));
}

$(document).ready(function(){
    $('#startButton ').click(function(){
        start();
    });
    start();
});
