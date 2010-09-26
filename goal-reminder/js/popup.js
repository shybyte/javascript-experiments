$(function(){
    $("#accordion").accordion({
        clearStyle: true,
        autoHeight: false
    });
    initDisplay();
    $('#save').click(function(){
        saveState();
        window.close()
        return false;
    })
});

function saveState(){
    var state = chrome.extension.getBackgroundPage().getState();
    state.goals = getGoalsFromUI();
    chrome.extension.getBackgroundPage().setState(state);
}

function initDisplay(){
    var state = chrome.extension.getBackgroundPage().getState();
    initGoalsGUI(state.goals);
}

function getGoalsFromUI(){
    var goals = [];
    $('tr', getGoalsTableBody()).each(function(){
        goals.push({
            title: trimmedVal($('.title', this)),
            text: trimmedVal($('.text', this))
        });
    });
    return goals;
}

function trimmedVal(jqueryNode){
  return $.trim(jqueryNode.val());
}


function initGoalsGUI(goals){
    displayGoals(goals);
    $('#addGoalButton').click(function(){
        addGoalRow(getGoalsTableBody(), ({
            title: '',
            text: ''
        }), true);
    });
}

function getGoalsTableBody(){
    return $('#goalsTable tbody');
}


function addGoalRow(tableBody, goal, anim){
    tableBody.append($.nano('<tr style="-webkit-transform:scale(0.1)"><td><input type="text" class="title" value="{title}"></td><td><input type="text" class="text" value="{text}"/></td><td><button class="removeButton">-</button></td></tr>', goal));
    initLastRow(tableBody, anim);
}



function isEmpty(s){
    return ! s || s.match(/^\s*$/);
}

function displayGoals(goals){
    var tableBody = getGoalsTableBody();
    if (goals){
        $.each(goals,
        function(i, goal){
            if (!isEmpty(goal.title) || !isEmpty(goal.text)){
                addGoalRow(tableBody, goal, false);
            }
        });
    }
}




/* table utils */

function showRow(row, anim){
    if (anim){
        window.setTimeout(function(){
            row.css('webkitTransform', 'scale(1)')
        },
        10);
    }
    else{
        row.css('webkitTransform', 'scale(1)');
    }
}

function initLastRow(tableBody, anim){
    var row = $('tr:last-child', tableBody);
    showRow(row, anim);
    $('.removeButton', row).click(function(){
        removeRow($(this.parentNode.parentNode));
    });
}

function removeRow(row){
    row.css('webkitTransform', 'scale(0)');
    window.setTimeout(function(){
        row.remove()
    },
    500);
}


/* mock background page */

if (!chrome.extension){
    chrome.extension = {
        getBackgroundPage: function(){
            var state = {
                goals: [{
                    title: 'Become a super man!',
                    text: '20 PushUps'
                },
                {
                    title: 'Become a RockStar!',
                    text: 'Play one Song.'
                }]
            };

            return{
                setState: function(newState){
                    state = newState;
                    console.log(state);
                },
                getState: function(){
                    return state;
                }

            }
        }
    };
}
