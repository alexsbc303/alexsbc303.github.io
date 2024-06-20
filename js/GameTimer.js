function GameTimer() {
  let _expected, _timeout, _timesupCb;
  let _milliseconds = 0;
  const _interval = 1000;

  function start(milliseconds, timesupCb = undefined) {
    if (_timeout) clearTimeout(_timeout);
    _timesupCb = timesupCb;
    _milliseconds = milliseconds;
    _expected = Date.now() + _interval;
    $("#timer").text(_milliseconds / 1000);
    if (_milliseconds <= 10000 && _milliseconds > 0) {
      $("#timer").css("color", "red");
      AUDIO_BEEP.play();
    } else {
      $("#timer").css("color", "black");
    }
    if (_milliseconds > 0) {
      _timeout = setTimeout(step, _interval);
    }
  }

  const stop = () => {
    console.log("NewTimer stopped");
    clearTimeout(_timeout);
  };

  const step = () => {
    console.log("NewTimer stepped");
    let drift = Date.now() - _expected;
    console.log("drift:", drift);

    if (drift > _interval) {
      console.error("NewTimer step lagged!");
    }
    _expected += _interval;

    _milliseconds -= _interval;

    if (_milliseconds <= 10000 && _milliseconds > 0) {
      $("#timer").css("color", "red");
      AUDIO_BEEP.play();
    } else {
      $("#timer").css("color", "black");
    }
    $("#timer").text(_milliseconds / 1000);

    if (_milliseconds > 0) {
      _timeout = setTimeout(step, Math.max(0, _interval - drift));
    } else {
      if (typeof _timesupCb === "function") _timesupCb(drift);
    }
  };

  const reset = () => {
    clearTimeout(_timeout);
    _milliseconds = 0;
    $("#timer").text("---");
    $("#timer").css("color", "black");
    console.log("Reset Accurate Timer");
  };

  return { start, stop, reset };
}
