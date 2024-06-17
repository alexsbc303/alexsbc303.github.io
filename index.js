// const RED_COLOR_HEXCODE = "#A83025";
// const BLUE_COLOR_HEXCODE = "#264D7D";
const RED_COLOR_HEXCODE = "#ff0000";
const BLUE_COLOR_HEXCODE = "#116fff";
const DEFAULT_HEXCODE = "#f1c40f";

const AUDIO_BEEP = new Audio("files/beep.wav");
const AUDIO_START = new Audio("files/start.wav");
const AUDIO_WIN = new Audio("files/winning_v2.wav");
const AUDIO_DRAW = new Audio("files/end.wav");
const AUDIO_DING_DONG = new Audio("files/ding_dong.wav");
AUDIO_BEEP.preload = "auto";
AUDIO_START.preload = "auto";
AUDIO_WIN.preload = "auto";
AUDIO_DRAW.preload = "auto";
let matchNo = 1;

function Area3() {
  const blocks = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ];

  function displayWinner() {
    const result = red.score - blue.score;
    // red team win
    if (result > 0) {
      // document.getElementById("audio_winning").play();
      AUDIO_WIN.play();
      document.getElementById("winner").innerHTML = "Red Team Win!";
      document.getElementById("popup").style.backgroundColor =
        RED_COLOR_HEXCODE;
      document.getElementById("popup").style.display = "flex";
    }
    // blue team win
    else if (result < 0) {
      // document.getElementById("audio_winning").play();
      AUDIO_WIN.play();
      document.getElementById("winner").innerHTML = "Blue Team Win!";
      document.getElementById("popup").style.backgroundColor =
        BLUE_COLOR_HEXCODE;
      document.getElementById("popup").style.display = "flex";
    }
    // draw game
    else if (result == 0) {
      // document.getElementById("audio_draw").play();
      AUDIO_DRAW.play();
      document.getElementById("winner").innerHTML = "Draw Game!";
      document.getElementById("popup").style.backgroundColor = DEFAULT_HEXCODE;
      document.getElementById("popup").style.display = "flex";
    } else {
      document.getElementById("winner").innerHTML = "Unknown Status";
      document.getElementById("popup").style.backgroundColor = DEFAULT_HEXCODE;
      document.getElementById("popup").style.display = "flex";
    }
  }

  function validateEndGame() {
    let redMark = 0;
    let blueMark = 0;
    for (let colIndex = 0; colIndex < 5; colIndex++) {
      // If column is filled
      if (blocks[2][colIndex] !== null) {
        // Calculate number of each color
        let redCount = 0;
        let blueCount = 0;
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
          if (blocks[rowIndex][colIndex] === "red") {
            redCount++;
          } else if (blocks[rowIndex][colIndex] === "blue") {
            blueCount++;
          }
        }
        console.log(`column${colIndex}: red-${redCount}:blue-${blueCount}`);
        if (redCount > blueCount) {
          redMark++;
        } else if (redCount < blueCount) {
          blueMark++;
        }
      }
    }

    if (redMark >= 3 || blueMark >= 3) {
      myTimer.stop();
      // document.getElementById("audio_winning").play();
      displayWinner();
      // setTimeout(
      //   () =>
      //     red.score > blue.score
      //       ? alert("Red Team Win!")
      //       : red.score < blue.score
      //       ? alert("Blue Team Win!")
      //       : alert("Draw Game!"),
      //   0
      // );
    }
  }

  function set(inputColIndex, team) {
    const currentTeam =
      team === "red" ? red : team === "blue" ? blue : undefined;

    if (!currentTeam) return;

    // If no more available ball then exit
    if (
      currentTeam.areaThreeMark >=
      6 + Math.floor(currentTeam.areaTwoMark / 2)
    )
      return;

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      if (blocks[rowIndex][inputColIndex] === null) {
        blocks[rowIndex][inputColIndex] = team;
        currentTeam.areaThreeMark++;
        currentTeam.refreshScore();
        break;
      }
    }
    refresh();
    validateEndGame();
  }

  function clear(inputRowIndex, inputColIndex) {
    for (let rowIndex = 2; rowIndex > inputRowIndex; rowIndex--) {
      if (blocks[rowIndex][inputColIndex] !== null) return;
    }
    const team = blocks[inputRowIndex][inputColIndex];
    blocks[inputRowIndex][inputColIndex] = null;
    if (team === "red") {
      red.areaThreeMark--;
      red.refreshScore();
    } else if (team === "blue") {
      blue.areaThreeMark--;
      blue.refreshScore();
    }
    refresh();
  }

  function clearAll() {
    console.log("Area 3 Clear All");

    blocks.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        blocks[rowIndex][colIndex] = null;
      });
    });
    red.areaThreeMark = 0;
    blue.areaThreeMark = 0;
    document.getElementById("winner").innerHTML = "Winner Message";
    document.getElementById("popup").style.display = "none";
    document.getElementById("popup").style.backgroundColor = DEFAULT_HEXCODE;

    this.refresh();
    red.refreshScore();
    blue.refreshScore();
  }

  function refresh() {
    blocks.forEach((row, rowIndex) => {
      row.forEach((block, colIndex) => {
        // Set block color
        document.getElementById(
          `b-${rowIndex}${colIndex}`
        ).style.backgroundColor =
          block === "red"
            ? RED_COLOR_HEXCODE
            : block === "blue"
            ? BLUE_COLOR_HEXCODE
            : "#ffffff";

        // Set remove button status
        if (
          blocks[rowIndex][colIndex] === null ||
          (blocks[rowIndex + 1] &&
            blocks[rowIndex + 1][colIndex] &&
            blocks[rowIndex + 1][colIndex] !== null)
        ) {
          document.getElementById(`r-${rowIndex}${colIndex}`).disabled = true;
        } else {
          document.getElementById(`r-${rowIndex}${colIndex}`).disabled = false;
        }
      });
    });

    refreshBtn();
  }

  function refreshBtn() {
    let redCount = 0;
    let blueCount = 0;

    blocks.forEach((row) => {
      row.forEach((block) => {
        //Block count
        if (block === "red") {
          redCount++;
        } else if (block === "blue") {
          blueCount++;
        }
      });
    });

    const redDisableFlag =
      redCount >= 6 + Math.floor(red.areaTwoMark / 2) ? true : false;
    const blueDisableFlag =
      blueCount >= 6 + Math.floor(blue.areaTwoMark / 2) ? true : false;
    for (let index = 0; index < 5; index++) {
      document.getElementById(`area3-b${index}-red`).disabled = redDisableFlag;
      document.getElementById(`area3-b${index}-blue`).disabled =
        blueDisableFlag;
    }
  }

  return { set, clear, clearAll, refresh, refreshBtn, displayWinner };
}

class Team {
  constructor(teamColor) {
    this.teamColor = teamColor;
    this.areaOneMark = 0;
    this.areaOneDisplayMark = 0;
    this.areaTwoMark = 0;
    this.areaThreeMark = 0;
    this.score = 0;
  }

  refreshAreaOne() {
    document.getElementById(`area1_mark_${this.teamColor}`).innerHTML =
      this.areaOneDisplayMark;

    document.getElementById(`area1_m_btn_${this.teamColor}`).disabled =
      this.areaOneMark === 0 || this.areaOneMark <= this.areaTwoMark
        ? true
        : false;
    document.getElementById(`area1_p_btn_${this.teamColor}`).disabled =
      this.areaOneDisplayMark >= 12 ? true : false;

    document.getElementById(`area1_p_d_btn_${this.teamColor}`).disabled =
      this.areaOneDisplayMark >= 12 ? true : false;

    document.getElementById(`area1_m_d_btn_${this.teamColor}`).disabled =
      this.areaOneDisplayMark <= 0 ? true : false;
  }

  refreshAreaTwo() {
    document.getElementById(`area2_mark_${this.teamColor}`).innerHTML =
      this.areaTwoMark;

    document.getElementById(`area2_m_btn_${this.teamColor}`).disabled =
      this.areaTwoMark === 0 ? true : false;
    document.getElementById(`area2_p_btn_${this.teamColor}`).disabled =
      this.areaTwoMark >= 12 || this.areaTwoMark >= this.areaOneMark
        ? true
        : false;
  }

  reset() {
    this.areaOneMark = 0;
    this.areaOneDisplayMark = 0;
    this.areaTwoMark = 0;
    this.areaThreeMark = 0;
    this.score = 0;
    this.refreshScore();
    this.refreshAreaOne();
    this.refreshAreaTwo();
  }

  refreshScore() {
    this.score =
      this.areaOneMark * 10 + this.areaTwoMark * 10 + this.areaThreeMark * 30;
    document.getElementById(`${this.teamColor}TeamScore`).innerHTML =
      this.score;
  }

  areaOnePlusDisplay() {
    if (this.areaOneDisplayMark < 12) {
      this.areaOneDisplayMark++;
      this.refreshAreaOne();
    }
  }

  areaOnePlus() {
    console.log(`${this.teamColor} Area 1 plus`);

    if (this.areaOneDisplayMark < 12) {
      this.areaOneMark++;
      this.areaOneDisplayMark++;
      this.refreshScore();
      this.refreshAreaOne();
      this.refreshAreaTwo();
    }
  }

  areaOneMinusDisplay() {
    if (this.areaOneDisplayMark > 0) {
      this.areaOneDisplayMark--;
      this.refreshAreaOne();
    }
  }

  areaOneMinus() {
    console.log(`${this.teamColor} Area 1 minus`);

    if (this.areaOneDisplayMark > 0 && this.areaOneMark > this.areaTwoMark)
      this.areaOneDisplayMark--;
    if (this.areaOneMark > 0 && this.areaOneMark > this.areaTwoMark)
      this.areaOneMark--;

    this.refreshScore();
    this.refreshAreaOne();
    this.refreshAreaTwo();

    // if (
    //   this.areaOneDisplayMark > 0 &&
    //   this.areaOneDisplayMark > this.areaTwoMark
    // ) {
    //   this.areaOneDisplayMark--;
    //   this.areaOneMark--;
    //   this.refreshScore();
    //   this.refreshAreaOne();
    //   this.refreshAreaTwo();
    // }
  }

  areaTwoPlus() {
    console.log(`${this.teamColor} Area 2 plus`);
    if (this.areaTwoMark < this.areaOneMark) {
      this.areaTwoMark++;
      this.refreshScore();
      this.refreshAreaOne();
      this.refreshAreaTwo();
      area3.refreshBtn();
    }
  }

  areaTwoMinus() {
    console.log(`${this.teamColor} Area 2 minus`);
    if (this.areaTwoMark <= this.areaOneMark && this.areaTwoMark > 0) {
      this.areaTwoMark--;
      this.refreshScore();
      this.refreshAreaOne();
      this.refreshAreaTwo();
      area3.refreshBtn();
    }
  }
}

function Timer() {
  const SETTING_SEC = 60;
  const READY_SEC = 3;
  const GAME_SEC = 180;
  let _initSec = 0;
  let _mode = null;
  let _status = "init";
  let _currentSec = _initSec;
  let _currentInterval;

  function updateTimer() {
    const timerEl = document.getElementById("timer");
    _currentSec--;

    if (_currentSec <= 0 && _mode == "ready") {
      // document.getElementById("audio_start").play();
      AUDIO_START.play();
      _currentSec = GAME_SEC;
      document.getElementById("timer").style.color = "black";
      _mode = "game";
    }

    timerEl.innerHTML = _currentSec;
    if (_currentSec <= 10) {
      if (_currentSec === 0) {
        // document.getElementById("audio_winning").play();
      } else {
        // document.getElementById("audio_beep").play();
        AUDIO_BEEP.play();
      }
      document.getElementById("timer").style.color = "red";
    }
    console.log("Update timer");

    if (_currentSec <= 0) {
      console.log("Timer end");
      _status = "init";
      stop();
      if (_mode !== "setting") {
        area3.displayWinner();
      } else {
        // document.getElementById("audio_start").play();
        AUDIO_START.play();
      }
      return;
    }
  }

  function start(inputMethod) {
    if (_status == "init") {
      if (inputMethod == "setting") {
        _initSec = SETTING_SEC;
        _mode = "setting";
        _currentSec = _initSec;
      } else if (inputMethod == "ready") {
        console.log("ready mode");
        _initSec = READY_SEC;
        _mode = "ready";
        _currentSec = _initSec;
        document.getElementById("timer").style.color = "red";
        // document.getElementById("audio_beep").play();
        AUDIO_BEEP.play();
      }
    }

    // default action
    _status = "start";
    if (_currentSec > 0) {
      document.getElementById("game_start").disabled = true; // Disable Timer Start button
      document.getElementById("setting_start").disabled = true;
      document.getElementById("timer").innerHTML = _currentSec;

      _currentInterval = setInterval(() => {
        updateTimer();
      }, 1000);
    }

    document.getElementById("pause").disabled = false; // Enable Time Pause button
  }

  function pause() {
    _status = "pause";
    stop();
    console.log("Timer pause");
  }

  function stop() {
    clearInterval(_currentInterval);
    if (_mode == "game" || _mode == "ready") {
      document.getElementById("game_start").disabled = false; // Enable Timer Start button
    } else if (_mode == "setting") {
      document.getElementById("setting_start").disabled = false; // Enable Timer Start button
    }
    document.getElementById("pause").disabled = true; // Disable Time Pause button
  }

  function reset() {
    clearInterval(_currentInterval);
    _status = "init";
    document.getElementById("game_start").disabled = false; // Enable Timer Start button
    document.getElementById("setting_start").disabled = false; // Enable Timer Start button
    document.getElementById("pause").disabled = true; // Disable Time Pause button
    _currentSec = _initSec;
    document.getElementById("timer").innerHTML = "---"; // Reset Timer display value
    document.getElementById("timer").style.color = "black"; // Reset Timer text color
  }

  return { start, reset, pause, stop };
}

function OverlayTimer() {
  const APPEAL_SEC = 30;
  let _initSec = 0;
  let _currentSec = _initSec;
  let _currentInterval;

  function update() {
    const timerEl = document.getElementById("overlay-timer");
    _currentSec--;

    timerEl.innerHTML = _currentSec;
    if (_currentSec <= 10) {
      if (_currentSec === 0) {
        // document.getElementById("audio_start").play();
        // AUDIO_START.play();
        AUDIO_DING_DONG.play();
      } else {
        // document.getElementById("audio_beep").play();
        // AUDIO_BEEP.play();
      }
      timerEl.style.color = "red";
    }
    console.log("Update overlay timer");

    if (_currentSec <= 0) {
      console.log("Overlay timer end");
      return stop();
    }
  }

  function stop() {
    clearInterval(_currentInterval);
  }

  function start() {
    _initSec = APPEAL_SEC;
    _currentSec = _initSec;
    const timerEl = document.getElementById("overlay-timer");
    timerEl.style.color = "black";
    timerEl.innerHTML = _currentSec;

    _currentInterval = setInterval(() => update(), 1000);
  }

  return { start, stop };
}

const area3 = Area3();
let myTimer = Timer();
let myOverlayTimer = OverlayTimer();
const red = new Team("red");
const blue = new Team("blue");

$(window).on("load", function () {
  console.log("loaded");
  $("#match_no").text(matchNo);
});

function matchPlus() {
  if (matchNo < 22) {
    matchNo++;
    $("#match_no").text(matchNo);
  }
}

function matchMinus() {
  if (matchNo > 1) {
    matchNo--;
    $("#match_no").text(matchNo);
  }
}

function resetAll() {
  console.log("Reset All");
  area3.clearAll();
  myTimer.reset();
  red.reset();
  blue.reset();
}

function exitAppeal() {
  myOverlayTimer.stop();
  document.getElementById("overlay").style.display = "none";
}

function appeal() {
  document.getElementById("overlay").style.display = "flex";
  myOverlayTimer.start();
}

// ==============================================================
function changeTeamLogo(teamColor) {
  var x;

  if (teamColor == "red") {
    x = document.getElementById("redTeamName").selectedIndex;
    document.getElementById("redTeamLogo").src =
      "images/" + document.getElementsByTagName("option")[x].value;
  } else {
    x = document.getElementById("blueTeamName").selectedIndex;
    document.getElementById("blueTeamLogo").src =
      "images/" + document.getElementsByTagName("option")[x].value;
  }
}
