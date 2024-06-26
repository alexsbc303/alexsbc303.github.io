// const RED_COLOR_HEXCODE = "#A83025";
// const BLUE_COLOR_HEXCODE = "#264D7D";

const RED_COLOR_HEXCODE = "#ff0000";
const BLUE_COLOR_HEXCODE = "#116fff";
const DEFAULT_HEXCODE = "#f1c40f";
const SETTING_MILLISEC = 60000;
const READY_MILLISEC = 3000;
const GAME_MILLISEC = 180000;

const AUDIO_BEEP = new Audio("files/beep.wav");
const AUDIO_START = new Audio("files/start.wav");
const AUDIO_WIN = new Audio("files/win.wav");
const AUDIO_MUA_VANG_WIN = new Audio("files/mua_vang_v2.wav");
const AUDIO_DRAW = new Audio("files/draw_game.wav");
const AUDIO_DING_DONG = new Audio("files/ding_dong.wav");
AUDIO_BEEP.preload = "auto";
AUDIO_START.preload = "auto";
AUDIO_WIN.preload = "auto";
AUDIO_MUA_VANG_WIN.preload = "auto";
AUDIO_DRAW.preload = "auto";
AUDIO_DING_DONG.preload = "auto";
let matchNo = 1;
let isRematch = false;

const gameTimer = new GameTimer();
const overlayTimer = new OverlayTimer();
const area3 = Area3();
const red = new Team("red");
const blue = new Team("blue");

$(window).on("load", function () {
  console.log("loaded");
  $("#match_no").text(matchNo);
});

function startTickerSetting() {
  gameTimer.start(SETTING_MILLISEC, () => AUDIO_START.play());
}

function startTickerGame() {
  gameTimer.start(READY_MILLISEC, () => {
    AUDIO_START.play();
    const startTimestamp = Date.now();
    gameTimer.start(GAME_MILLISEC, (drift) => {
      area3.setEndTimestamp(Date.now() - drift);
      area3.displayWinner();
    });
    red.gameStartTimestamp = startTimestamp;
    blue.gameStartTimestamp = startTimestamp;
    area3.setStartTimestamp(startTimestamp);
  });
}
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

function switchRematch() {
  isRematch = !isRematch;
  if (isRematch) {
    $("#rematch").css("display", "block");
  } else {
    $("#rematch").css("display", "none");
  }
}

function resetAll() {
  area3.clearAll();
  gameTimer.reset();
  red.reset();
  blue.reset();
}

function exitAppeal() {
  overlayTimer.reset();
  document.getElementById("overlay").style.display = "none";
}

function appeal() {
  document.getElementById("overlay").style.display = "flex";
  overlayTimer.start(30000, () => {
    AUDIO_DING_DONG.play();
    console.log("Overlay Timer End");
  });
}

$(document).on("keydown", function (e) {
  console.log(e.which);
  // q
  if (e.which == 81) {
    e.preventDefault();
    console.log("a fired");
    red.areaTwoMinus();
    return;
  }
  // e
  if (e.which == 69) {
    e.preventDefault();
    console.log("s fired");
    red.areaTwoPlus();
    return;
  }
  // a
  if (e.which == 65) {
    e.preventDefault();
    console.log("a fired");
    red.areaOneMinus();
    return;
  }
  // d
  if (e.which == 68) {
    e.preventDefault();
    console.log("s fired");
    red.areaOnePlus();
    return;
  }
  // u
  if (e.which == 85) {
    e.preventDefault();
    console.log("a fired");
    blue.areaTwoMinus();
    return;
  }
  // o
  if (e.which == 79) {
    e.preventDefault();
    console.log("s fired");
    blue.areaTwoPlus();
    return;
  }
  // j
  if (e.which == 74) {
    e.preventDefault();
    console.log("a fired");
    blue.areaOneMinus();
    return;
  }
  // l
  if (e.which == 76) {
    e.preventDefault();
    console.log("s fired");
    blue.areaOnePlus();
    return;
  }
});
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
