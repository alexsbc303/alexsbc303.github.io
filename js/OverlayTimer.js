function OverlayTimer() {
  let _expected, _timeout, _timesupCb;
  let _milliseconds = 0;
  const _interval = 1000;

  function start(milliseconds, timesupCb = undefined) {
    if (_timeout) clearTimeout(_timeout);
    _timesupCb = timesupCb;
    _milliseconds = milliseconds;
    _expected = Date.now() + _interval;
    $("#overlay-timer").text(_milliseconds / 1000);
    $("#overlay-timer").css("color", "black");
    if (_milliseconds > 0) {
      _timeout = setTimeout(step, _interval);
    }
  }

  const stop = () => {
    console.log("Overlay Timer Stopped");
    clearTimeout(_timeout);
  };

  const step = () => {
    console.log("Overlay Timer Stepped");
    let drift = Date.now() - _expected;
    console.log("drift:", drift);

    if (drift > _interval) {
      console.error("Overlay Timer step lagged!");
    }
    _expected += _interval;

    _milliseconds -= _interval;

    if (_milliseconds <= 10000 && _milliseconds > 0) {
      $("#overlay-timer").css("color", "red");
    } else {
      $("#overlay-timer").css("color", "black");
    }
    $("#overlay-timer").text(_milliseconds / 1000);

    if (_milliseconds > 0) {
      _timeout = setTimeout(step, Math.max(0, _interval - drift));
    } else {
      if (typeof _timesupCb === "function") _timesupCb();
    }
  };

  const reset = () => {
    clearTimeout(_timeout);
    _milliseconds = 0;
    $("#overlay-timer").text("---");
    $("#overlay-timer").css("color", "black");
    console.log("Reset Overlay Timer");
  };

  return { start, stop, reset };
}
