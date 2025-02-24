const flagList = [];
const answerButton = Array.from(document.getElementsByClassName('answer'));
answerButton.forEach(element => {
    addAnswerButtonEventListeners(element);
});
const continueButton = document.getElementById('nextButton');
hideContinueButton();
var currentScore = 0;
var highScore = 0;
if (localStorage.getItem('highScore') != null)
{
    highScore = localStorage.getItem('highScore');
}

setHighScore();
pickRandomFlag();

function setHighScore() {
    let highScoreCounter = document.getElementById('highScore').children[0];
    highScoreCounter.innerHTML = "HIGH SCORE: " + highScore;
}

async function fetchJSONData() {
    try {
        const res = await fetch("flags.json");
        if (!res.ok) {
            throw new Error(res.status);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function pickRandomFlag() {
    var chosenFlag = Math.floor(Math.random() * 251);

    if (!flagList.includes(chosenFlag))
    {
        flagList.push(chosenFlag);
        let flag = await populateFlag(chosenFlag);
        populateAnswers(flag)
    }
    else
    {
        pickRandomFlag();
    }
}

async function populateFlag(index) {
    const data = await fetchJSONData();
    let flag = getFlagFromIndex(data, index);
    let flagImg = document.getElementById('flagImg');
    flagImg.src = "https://flagcdn.com/w320/" + flag + ".png";
    return flag;
}

function getFlagFromIndex(data, index) {
    var count = 0;
    for (var d in data) {
        if (count == index) {
            return d;
        }
        count++;
    }
}

async function populateAnswers(flag) {
    const data = await fetchJSONData();
    console.log(flag);
    answerList = [];
    answerList.push(flag);
    correctAnswer = Math.floor(Math.random() * 4);
    let flagText = "";
    for (let i = 0; i < 4; i++)
    {
        const answerText = answerButton[i].children[0];
        if (i == correctAnswer)
        {
            flagText = data[flag];
            answerButton[i].addEventListener("click", correctAnswerClick);
        }
        else 
        {
            let count = 0;
            let valid = false;
            while (!valid)
            {
                let index = Math.floor(Math.random() * 251);
            for (var d in data) {
                if (count == index) {
                    flagText = data[d];
                    break;
                }
                count++;
            }
            if (!answerList.includes(d))
            {
                valid = true;
                answerList.push(d);
            }
            }
            let index = Math.floor(Math.random() * 251);
            for (var d in data) {
                if (count == index) {
                    flagText = data[d];
                }
                count++;
            }
            answerButton[i].correctIndex = correctAnswer;
            answerButton[i].addEventListener("click", incorrectAnswerClick);
        }
        resizeText(flagText, answerText)
        answerText.innerHTML = flagText.toUpperCase();
    }
}

function resizeText(text, h1) {
    h1.style.fontSize = "20pt"
    if (text.length > 30)
    {
        h1.style.fontSize = (text.length)/3 + "pt"
    }
    else if (text.length > 24)
    {
        h1.style.fontSize = (text.length)/2 + "pt"
    }
    else if (text.length > 20)
    {
        h1.style.fontSize = (text.length)/1.5 + "pt"
    }
    else if (text.length > 18)
    {
        h1.style.fontSize = (text.length)/1.2 + "pt"
    }
}

async function correctAnswerClick(evt)
{
    answerButton.forEach(element => {
        removeAnswerButtonEventListeners(element);
    });

    evt.currentTarget.style.backgroundColor = "#95ff9e";
    incrementScore();
    showContinueButton()
}

function incorrectAnswerClick(evt)
{
    answerButton.forEach(element => {
        removeAnswerButtonEventListeners(element);
    });
    evt.currentTarget.style.backgroundColor = "#f76b6b";
    answerButton[evt.currentTarget.correctIndex].style.backgroundColor = "#95ff9e";
    if (currentScore >= highScore)
    {
        localStorage.setItem('highScore', currentScore);
    }
    showPlayAgainButton();
}

function addAnswerButtonEventListeners(button)
{
    button.addEventListener('mouseover', answerButtonMouseOver);
    button.addEventListener('mouseout', answerButtonMouseOut);
    
}

function removeAnswerButtonEventListeners(button)
{
    button.removeEventListener('mouseover', answerButtonMouseOver);
    button.removeEventListener('mouseout', answerButtonMouseOut);
    button.removeEventListener("click", incorrectAnswerClick);
    button.removeEventListener("click", correctAnswerClick);
}

function answerButtonMouseOver(evt) {
    evt.currentTarget.style.backgroundColor = '#fff4df';
}

function answerButtonMouseOut(evt) {
    evt.currentTarget.style.backgroundColor = '#f8e8b5';
}

function incrementScore() {
    currentScore++;
    let scoreCounter = document.getElementById('currentScore').children[0];
    scoreCounter.innerHTML = "CURRENT SCORE: " + currentScore;
    if (highScore < currentScore)
    {
        highScore = currentScore;
        let highScoreCounter = document.getElementById('highScore').children[0];
        highScoreCounter.innerHTML = "HIGH SCORE: " + highScore;
    }
}

function hideContinueButton() {
    continueButton.style.backgroundColor = "#ffcc5d";
    continueButton.style.boxShadow = "0 0 0 0";
    continueButton.children[0].innerHTML = "";
    removeContinueButtonEventListeners();
}

function showContinueButton() {
    continueButton.style.backgroundColor = "#fff130";
    continueButton.style.boxShadow = "1px 1px 2px #0000009d";
    continueButton.children[0].innerHTML = "CONTINUE";
    addContinueButtonEventListeners();
}

function addContinueButtonEventListeners() {
    continueButton.addEventListener('mouseover', continueButtonMouseOver);
    continueButton.addEventListener('mouseout', continueButtonMouseOut);
    continueButton.addEventListener('click', continueButtonClick);
}

function removeContinueButtonEventListeners() {
    continueButton.removeEventListener('mouseover', continueButtonMouseOver);
    continueButton.removeEventListener('mouseout', continueButtonMouseOut);
    continueButton.removeEventListener('click', continueButtonClick);
}

function continueButtonMouseOver(evt) {
    evt.currentTarget.style.backgroundColor = '#fff89b';
}

function continueButtonMouseOut(evt) {
    evt.currentTarget.style.backgroundColor = '#fff130';
}

function continueButtonClick() {
    hideContinueButton();
    answerButton.forEach(element => {
        element.style.backgroundColor = "#f8e8b5";
        addAnswerButtonEventListeners(element);
    })
    pickRandomFlag();
}

function showPlayAgainButton() {
    showContinueButton();
    continueButton.children[0].innerHTML = "PLAY AGAIN?";
    continueButton.addEventListener('click', resetScore);
}

function resetScore() {
    currentScore = 0;
    let scoreCounter = document.getElementById('currentScore').children[0];
    scoreCounter.innerHTML = "CURRENT SCORE: 0"
    continueButton.removeEventListener('click', resetScore);
}