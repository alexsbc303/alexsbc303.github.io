const RED_COLOR_HEXCODE = "#A83025";
const BLUE_COLOR_HEXCODE = "#264D7D";

function Area3() {
  const blocks = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ];

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

      setTimeout(
        () =>
          red.score > blue.score
            ? alert("Red Team Win!")
            : red.score < blue.score
            ? alert("Blue Team Win!")
            : alert("Draw Game!"),
        200
      );
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

  return { set, clear, clearAll, refresh, refreshBtn };
}

class Team {
  constructor(teamColor) {
    this.teamColor = teamColor;
    this.areaOneMark = 0;
    this.areaTwoMark = 0;
    this.areaThreeMark = 0;
    this.score = 0;
  }

  refreshAreaOne() {
    document.getElementById(`area1_mark_${this.teamColor}`).innerHTML =
      this.areaOneMark;

    document.getElementById(`area1_m_btn_${this.teamColor}`).disabled =
      this.areaOneMark === 0 || this.areaOneMark <= this.areaTwoMark
        ? true
        : false;
    document.getElementById(`area1_p_btn_${this.teamColor}`).disabled =
      this.areaOneMark >= 12 ? true : false;
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

  areaOnePlus() {
    console.log(`${this.teamColor} Area 1 plus`);
    if (this.areaOneMark < 12) {
      this.areaOneMark++;
      this.refreshScore();
      this.refreshAreaOne();
      this.refreshAreaTwo();
    }
  }

  areaOneMinus() {
    console.log(`${this.teamColor} Area 1 minus`);
    if (this.areaOneMark > 0 && this.areaOneMark > this.areaTwoMark) {
      this.areaOneMark--;
      this.refreshScore();
      this.refreshAreaOne();
      this.refreshAreaTwo();
    }
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

function Timer(initSec) {
  const _initSec = initSec;
  let _currentSec = _initSec;
  let _currentInterval;

  function updateTimer() {
    _currentSec--;
    document.getElementById("timer").innerHTML = _currentSec;
    if (_currentSec <= 5) {
      if (_currentSec === 0) {
        document.getElementById("audio_stop").play();
      } else {
        document.getElementById("audio_beep").play();
      }
      document.getElementById("timer").style.color = "red";
    }
    console.log("Update timer");

    if (_currentSec <= 0) {
      console.log("Countdown end");
      return stop();
    }
  }

  function start() {
    if (_currentSec > 0) {
      document.getElementById("gameTimer").disabled = true; // Disable Timer Start button
      document.getElementById("timer").innerHTML = _currentSec;

      _currentInterval = setInterval(() => {
        updateTimer();
      }, 1000);
    }

    document.getElementById("pause").disabled = false; // Enable Time Pause button
  }

  function pause() {
    stop();
    console.log("Timer pause");
  }

  function stop() {
    clearInterval(_currentInterval);
    document.getElementById("gameTimer").disabled = false; // Enable Timer Start button
    document.getElementById("pause").disabled = true; // Disable Time Pause button
  }

  function reset() {
    stop();
    _currentSec = _initSec;
    document.getElementById("timer").innerHTML = "---"; // Reset Timer display value
    document.getElementById("timer").style.color = "black"; // Reset Timer text color
  }

  return { start, reset, pause, stop };
}

const myTimer = Timer(180);
const area3 = Area3();
const red = new Team("red");
const blue = new Team("blue");

function resetAll() {
  console.log("Reset All");
  area3.clearAll();
  myTimer.reset();
  red.reset();
  blue.reset();
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

function play(fld) {
  switch (fld) {
    case "beep":
      var audio = document.getElementById("audio_beep");
      break;
    case "beep2":
      var audio = document.getElementById("audio_beep2");
      break;
    case "stop":
      var audio = document.getElementById("audio_stop");
      break;
    case "winning":
      var audio = document.getElementById("audio_winning");
      break;
    case "winning2":
      var audio = document.getElementById("audio_winning2");
      break;
    case "winning3":
      var audio = document.getElementById("audio_winning3");
      break;
    case "end":
      var audio = document.getElementById("audio_end");
      break;
  }
  audio.play();
}
