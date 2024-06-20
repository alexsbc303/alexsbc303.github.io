class Team {
  constructor(teamColor) {
    this.teamColor = teamColor;
    this.areaOneMark = 0;
    this.areaTwoMark = 0;
    this.areaThreeMark = 0;
    this.score = 0;
    this.firstPlantingTimestamp = null;
    this._gameStartTimestamp = null;
  }

  set gameStartTimestamp(timestamp) {
    this._gameStartTimestamp = timestamp;
  }

  refreshAreaOne() {
    console.log("Refresh Area One");
    // no outer mark and inner mark logic
    $(`#area1_mark_${this.teamColor}`).text(this.areaOneMark);
    $(`#area1_m_btn_${this.teamColor}`).prop(
      "disabled",
      this.areaOneMark === 0 || this.areaOneMark <= this.areaTwoMark
        ? true
        : false
    );
    $(`#area1_p_btn_${this.teamColor}`).prop(
      "disabled",
      this.areaOneMark >= 12 ? true : false
    );

    if (this._gameStartTimestamp && this.firstPlantingTimestamp) {
      $(`#${this.teamColor}-planting-timestamp`).text(
        `${(this.firstPlantingTimestamp - this._gameStartTimestamp) / 1000} sec`
      );
    } else {
      $(`#${this.teamColor}-planting-timestamp`).text("- - -");
    }
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
    this._gameStartTimestamp = null;
    this.firstPlantingTimestamp = null;
    this.refreshScore();
    this.refreshAreaOne();
    this.refreshAreaTwo();
    console.log(`Reset Team ${this.teamColor}`);
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
      if (this.areaOneMark === 1) this.firstPlantingTimestamp = Date.now();

      this.refreshScore();
      this.refreshAreaOne();
      this.refreshAreaTwo();
    }
  }

  areaOneMinus() {
    console.log(`${this.teamColor} Area 1 minus`);

    if (this.areaOneMark > 0 && this.areaOneMark > this.areaTwoMark)
      this.areaOneMark--;

    if (this.areaOneMark === 0) this.firstPlantingTimestamp = null;
    this.refreshScore();
    this.refreshAreaOne();
    this.refreshAreaTwo();
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
