/* Author: 
  Marco Stahl
*/

var currentRound;
var rounds;
var currentWeekDay;
var startTime;

function randomInt(min, max){
    return Math.round(Math.random() * (max - min) + min);
}

function isLeapYear(year){
    return (year % 4) == 0 && (!(year % 100 == 0) || (year % 400 == 0));
}

function leapYearDelta(year){
    return isLeapYear(year) ? 1: 0;
}

function daysOfMonth(year, month){
    var normalDaysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return normalDaysOfMonth[month - 1] + (month == 2 ? leapYearDelta(year) : 0)
}

function randomDay(year, month){
    return randomInt(1, daysOfMonth(year, month));
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
    var centurySummands = [2, 0, 6];
    var monthSummands = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
    var lastYearDigits = date.year % 100;
    var centurySummand = centurySummands[Math.floor(date.year / 100) - 18];
    var yearSummand = (lastYearDigits + (Math.floor(lastYearDigits / 4))) % 7;
    var monthSummand = monthSummands[date.month - 1];
    var leapYearDelta = date.month <= 2 && isLeapYear(date.year) ? -1: 0
    return (centurySummand + yearSummand + monthSummand + date.day - leapYearDelta) % 7;
}


var weekDayNames = ['Sunday', 'Monday', 'Tuessday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function weekDayName(date){
    return weekDayNames[weekDayIndex(date)];
}

function showNextQuestion(){
    var currentDate = randomDateFromRange();
    //$('#question ').text(dateToString(date) + " = " + weekDayName(date));
    $('#question').text(dateToString(currentDate) + " = ?");
    currentWeekDay = weekDayIndex(currentDate)
    $('#currentRoundLabel').text((currentRound + 1) + ' / ' + rounds)
}

function getTime(){
    return (new Date()).getTime();
}

function start(){
    $('#gameSettings').slideToggle();
    $('#game').slideToggle();
    currentRound = 0;
    startTime = getTime();
    rounds = $('#rounds').val();
    showNextQuestion();
}

function quit(){
    $('#gameSettings').slideToggle();
    $('#game').slideToggle();
}

function gameFinished(){
    var timePerDay = Math.round((getTime() - startTime) / rounds) / 1000;
    alert("You needed " + timePerDay + " seconds per day.");
    saveStatistics(timePerDay);
    $('#gameSettings').slideToggle()
    $('#game').slideToggle()
}

function saveStatistics(timePerDay){
    var statistics = loadStatisticsForRange();
    statistics.push({time:getTime(),timePerDay:timePerDay});
    saveStatisticsForRange(statistics);
}

function loadStatisticsForRange(){
    var serData = localStorage.getItem(rangeKey())
    if (serData != null) {
        return JSON.parse(serData);
    } else{
        return [];
    }
}

function rangeKey(){
    var range = getRange();
    return range[0] + "-" + range[1];
}

function saveStatisticsForRange(statistics){
  localStorage.setItem(rangeKey(),JSON.stringify(statistics));
}


function clickedOnWeekDayButton(weekDayNumber){
    if (weekDayNumber == currentWeekDay){
        currentRound++;
        if (currentRound < rounds){
            showNextQuestion();
        } else{
            gameFinished();
        }
    } else{
        alert("No!");
    }

}

function addAnswerButtons(){
    var panel = $("#answerButtons");
    for (var i = 1; i < 8; i++){
        var dayNumber = i % 7;
        var rowData = {
            dayNumber: dayNumber,
            dayName: weekDayNames[dayNumber]
        };
        var answerRow = $.nano('<div class="answerRow"><button id="dayButton{dayNumber}">{dayName}</button><span id="result{dayNumber}" class="result"></span></div>', rowData);
        panel.append(answerRow);
        $('#dayButton' + dayNumber).bind('click', rowData,
        function(event){
            clickedOnWeekDayButton(event.data.dayNumber);
        });
    }
}

$(document).ready(function(){
    $('#startButton ').click(function(){
        start();
    });
    $('#quitButton ').click(function(){
        quit();
    });
    addAnswerButtons();
    // start();
});
