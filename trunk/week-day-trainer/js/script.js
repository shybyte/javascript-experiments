/* Author: 
  Marco Stahl
*/

var currentRound;
var errors;
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
    currentWeekDay = weekDayIndex(currentDate);
    $('#currentRoundLabel').text((currentRound + 1) + ' / ' + rounds);
    if (currentRound>0) {
      $('#currentRoundLabel').effect('shake',100);
      //$('#question').animate({backgroundColor:'#b0ff80'}, 300).animate({backgroundColor:'#ffffff'}, 300);
      $('#question').effect('bounce', 300);
    }
}

function getTime(){
    return (new Date()).getTime();
}

function start(){
    $('#gameSettings').slideToggle();
    $('#game').slideToggle();
    $('#statistics').slideUp();
    currentRound = 0;
    errors = 0;
    startTime = getTime();
    rounds = $('#rounds').val();
    showNextQuestion();
}

function showStatistics(){
    $('#statistics').slideDown();
    refreshStatistics()
}

function refreshStatistics(){
    var stats = loadStatisticsForRange();
    if (stats.length == 0){
        $('#noStatsAvailable').show();
        $('#statsAvailable').hide();
    } else {
        $('#noStatsAvailable').hide();
        $('#statsAvailable').show();
        paintChart(stats);
    }
}


function paintTable(stats){
    var table = $('#statisticsTable');
    $('td', table).remove();
    jQuery.each(stats,
    function(i, stat){
        table.append("<tr><td>" + formatTimeStamp(stat.time) + '</td><td>' + stat.timePerDay + '</td><td>' + stat.errors + '</td></tr>');
    });
}

var chartStats;
function paintChart(stats){
    chartStats = stats;
    var series = generateChartDataSeries(stats);
    var chart = $('#chart');
    $.plot(chart, [{
        data: series.timeSeries,
        lines: {
            show: true
        },
        points: {
            show: true
        },
        color: 'rgb(0,255,0)',
        label: 'Time per day calculation (in seconds)'
    },
    {
        data: series.errorsSeries,
        points2: {
            show: true
        },
        bars: {
            show: true,
            align: 'center',
            barWidth: 0.5,
            lineWidth: 0,
            fill: true
        },
        color: 'rgb(255, 0, 0)',
        yaxis: 2,
        label: 'Mean errors per day calculation'
    }],
    {
        xaxis: {
            ticks: 0
        },
        yaxis: {
            min: 0,
            tickFormatter: function formatter(val, axis){
                return val + " s";
            }
        },
        y2axis: {
            min: 0
        },
        legend: {
            position: 'se'
        },
        grid: {
            hoverable: true,
            backgroundColor: {
                colors: ["#fff", "#aaa"]
            }
        }
    });
    chart.bind("plothover", onPlotHover);
}

function showTooltip(x, y, contents){
    $('<div id="tooltip">' + contents + '</div>').css({
        border: '1px solid #fdd',
        padding: '2px',
        position: 'absolute',
        top: y + 5,
        left: x + 5,
        'background-color': '#fee',
        opacity: 0.70
    }).appendTo("body");
}

var previousPoint = null;
function onPlotHover(event, pos, item){
    if (item){
        if (previousPoint != item.datapoint){
            previousPoint = item.datapoint;

            $("#tooltip").remove();
            var x = item.datapoint[0].toFixed(2),
            y = item.datapoint[1].toFixed(2);
            var date = new Date(chartStats[item.dataIndex].time)
            var unitName = item.seriesIndex == 0 ? "Seconds" : "Errors";
            var timeString = y+' '+unitName+' ('+(date.toLocaleString())+')';
            showTooltip(item.pageX, item.pageY,timeString);
        }
    }
    else{
        $("#tooltip").remove();
        previousPoint = null;
    }
}



function generateChartDataSeries(stats){
    var timeSeries = [];
    var errorsSeries = [];
    var msInOneDay = 24 * 60 * 60 * 1000;
    var firstDayTimeStamp = stats[0].time;
    var resolution = 24 * 60 * 60;
    jQuery.each(stats,
    function(i, stat){
        var timeInDays = Math.round((stat.time - firstDayTimeStamp) / msInOneDay * resolution) / resolution;
        timeSeries.push([i, stat.timePerDay]);
        if (stat.errors > 0){
            errorsSeries.push([i, stat.errors]);
        }
    });
    return{
        timeSeries: timeSeries,
        errorsSeries: errorsSeries
    };
}

function clearStats(){
    saveStatisticsForRange([]);
    $('#statistics').slideUp();
}

function formatTimeStamp(timeStamp){
    var date = new Date(timeStamp);
    return (date.getDate() + 1) + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
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
    statistics.push({
        time: getTime(),
        timePerDay: timePerDay,
        errors: errors / rounds
    });
    saveStatisticsForRange(statistics);
}

var fakedLocalStorage = {};
function loadStatisticsForRange(){
    if (isLocalStorageAvailable()) {
      var serData = localStorage.getItem(rangeKey())
      if (serData != null){
          return JSON.parse(serData);
      } else{
          return [];
      }
    } else {
      var fakedResult = fakedLocalStorage[rangeKey()];
      return fakedResult==null ? [] :fakedResult;
    }  
}

function isLocalStorageAvailable(){
  return typeof(localStorage) != 'undefined'; 
}


function rangeKey(){
    var range = getRange();
    return range[0] + "-" + range[1];
}

function saveStatisticsForRange(statistics){
    if (isLocalStorageAvailable()){
      localStorage.setItem(rangeKey(), JSON.stringify(statistics));
    } else {
      fakedLocalStorage[rangeKey()] = statistics;
    }
}


function clickedOnWeekDayButton(weekDayNumber){
    var button = $('#dayButton' + weekDayNumber);
    if (weekDayNumber == currentWeekDay){
        currentRound++;
        button.animate({color:'#00ff00'}, 300).animate({color:'#000000'}, 1000);
        if (currentRound < rounds){
            showNextQuestion();
        } else{
            gameFinished();
        }
    } else{
        errors++;
        button.animate({color:'#ff0000'}, 100);
        button.effect( "shake",{}, 100,function (){
          button.animate({color:'#000000'}, 1000);
        });
    }
}

function isStatisticsVisible(){
  return $('#statistics').is(':visible');
}

function onClickRangeButton (id){
  if (isStatisticsVisible()){
    refreshStatistics();
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
    $("input[name='range']").click(function(){
        onClickRangeButton(this.id);
    });
    $('#startButton').click(function(){
        start();
    });
    $('#quitButton').click(function(){
        quit();
    });
    $('#statisticsLink').click(function(){
        if (isStatisticsVisible()){
            $('#statistics').slideUp();
        } else{
            showStatistics();
        }
    });
    $('#clearStatsButton').click(function(){
        clearStats();
    });    
    addAnswerButtons();
    // start();
});
