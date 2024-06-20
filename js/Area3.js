function Area3() {
  const blocks = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ];
  let startTimestamp = null;
  let endTimestamp = null;

  function setStartTimestamp(timestamp) {
    startTimestamp = timestamp;
  }
  function setEndTimestamp(timestamp) {
    endTimestamp = timestamp;
  }

  function displayWinner(isMuaVang = false, team = null) {
    console.log("total timestamp:", endTimestamp - startTimestamp);
    console.log("this.GAME_MILLISEC:", GAME_MILLISEC);
    const timestamp =
      endTimestamp - startTimestamp > GAME_MILLISEC
        ? GAME_MILLISEC
        : endTimestamp - startTimestamp;

    $("#end-timestamp").text(`${timestamp / 1000} sec`);

    // Win by Mua Vang
    console.log("Determine Mua Vang...");
    if (isMuaVang) {
      AUDIO_MUA_VANG_WIN.play();
      if (team === "red") {
        $("#winner").text("Red Team Win!");
        $("#popup").css("background-color", RED_COLOR_HEXCODE);
        $("#popup").css("display", "flex");
      } else if (team === "blue") {
        $("#winner").text("Blue Team Win!");
        $("#popup").css("background-color", BLUE_COLOR_HEXCODE);
        $("#popup").css("display", "flex");
      } else {
        $("#winner").text("Unknown Team");
        $("#popup").css("background-color", DEFAULT_HEXCODE);
        $("#popup").css("display", "flex");
      }
      return;
    }

    const result = red.score - blue.score;

    // Determine if win by higher total score
    console.log("Determine higher total score...");
    if (result > 0) {
      AUDIO_WIN.play();
      document.getElementById("winner").innerHTML = "Red Team Win!";
      document.getElementById("popup").style.backgroundColor =
        RED_COLOR_HEXCODE;
      document.getElementById("popup").style.display = "flex";
      return;
    }
    // blue team win
    else if (result < 0) {
      AUDIO_WIN.play();
      document.getElementById("winner").innerHTML = "Blue Team Win!";
      document.getElementById("popup").style.backgroundColor =
        BLUE_COLOR_HEXCODE;
      document.getElementById("popup").style.display = "flex";
      return;
    }

    // Determine if win by higher score in Area 3
    console.log("Determine higher score in Area 3...");
    if (red.areaThreeMark > blue.areaThreeMark) {
      AUDIO_WIN.play();
      document.getElementById("winner").innerHTML = "Red Team Win!";
      document.getElementById("popup").style.backgroundColor =
        RED_COLOR_HEXCODE;
      document.getElementById("popup").style.display = "flex";
      return;
    } else if (red.areaThreeMark < blue.areaThreeMark) {
      AUDIO_WIN.play();
      document.getElementById("winner").innerHTML = "Blue Team Win!";
      document.getElementById("popup").style.backgroundColor =
        BLUE_COLOR_HEXCODE;
      document.getElementById("popup").style.display = "flex";
      return;
    }

    // Determine if win by higher score in Area 2
    console.log("Determine higher score in Area 2...");
    if (red.areaTwoMark > blue.areaTwoMark) {
      AUDIO_WIN.play();
      document.getElementById("winner").innerHTML = "Red Team Win!";
      document.getElementById("popup").style.backgroundColor =
        RED_COLOR_HEXCODE;
      document.getElementById("popup").style.display = "flex";
      return;
    } else if (red.areaTwoMark < blue.areaTwoMark) {
      AUDIO_WIN.play();
      document.getElementById("winner").innerHTML = "Blue Team Win!";
      document.getElementById("popup").style.backgroundColor =
        BLUE_COLOR_HEXCODE;
      document.getElementById("popup").style.display = "flex";
      return;
    }

    // Determine if win by higher score in Area 1
    console.log("Determine higher score in Area 1...");
    if (red.areaOneMark > blue.areaOneMark) {
      AUDIO_WIN.play();
      document.getElementById("winner").innerHTML = "Red Team Win!";
      document.getElementById("popup").style.backgroundColor =
        RED_COLOR_HEXCODE;
      document.getElementById("popup").style.display = "flex";
      return;
    } else if (red.areaOneMark < blue.areaOneMark) {
      AUDIO_WIN.play();
      document.getElementById("winner").innerHTML = "Blue Team Win!";
      document.getElementById("popup").style.backgroundColor =
        BLUE_COLOR_HEXCODE;
      document.getElementById("popup").style.display = "flex";
      return;
    }

    // Determine if win by gain score of planting
    console.log("Determine gains score...");
    if (red.firstPlantingTimestamp < blue.firstPlantingTimestamp) {
      AUDIO_WIN.play();
      document.getElementById("winner").innerHTML = "Red Team Win!";
      document.getElementById("popup").style.backgroundColor =
        RED_COLOR_HEXCODE;
      document.getElementById("popup").style.display = "flex";
      return;
    } else if (red.firstPlantingTimestamp > blue.firstPlantingTimestamp) {
      AUDIO_WIN.play();
      document.getElementById("winner").innerHTML = "Blue Team Win!";
      document.getElementById("popup").style.backgroundColor =
        BLUE_COLOR_HEXCODE;
      document.getElementById("popup").style.display = "flex";
      return;
    }
  }

  function validateMuaVang() {
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
        if (redCount > blueCount && blocks[2][colIndex] === "red") {
          redMark++;
        } else if (redCount < blueCount && blocks[2][colIndex] === "blue") {
          blueMark++;
        }
      }
    }

    if (redMark >= 3 || blueMark >= 3) {
      area3.setEndTimestamp(Date.now());
      gameTimer.stop();
      const muaVangTeam = redMark >= 3 ? "red" : blueMark >= 3 ? "blue" : null;
      displayWinner(true, muaVangTeam);
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
    validateMuaVang();
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
    console.log("Reset Area 3");

    blocks.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        blocks[rowIndex][colIndex] = null;
      });
    });
    red.areaThreeMark = 0;
    blue.areaThreeMark = 0;
    startTimestamp = null;
    document.getElementById("winner").innerHTML = "Winner Message";
    $("#end-timestamp").text("- - -");
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

  return {
    set,
    clear,
    clearAll,
    refresh,
    refreshBtn,
    displayWinner,
    setStartTimestamp,
    setEndTimestamp,
  };
}
