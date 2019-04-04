const timeUtil = {
  msecsToHHMMSS(msecs = 0) {
    let hours = msecs / (1000 * 60 * 60);
    let minutes = (hours - parseInt(hours)) * 60;
    let seconds = (minutes - parseInt(minutes)) * 60;

    hours = parseInt(hours);
    minutes = parseInt(minutes);
    seconds = parseInt(seconds);

    hours = hours < 10 ? `0${hours}` : `${hours}`;
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${hours}:${minutes}:${seconds}`;
  },

  msecsToSS(msecs = 0) {
    let secs = parseInt(msecs / 1000);
    secs = Math.max(0, secs);
    return secs < 10 ? `0${secs}` : `${secs}`;
  }
};

module.exports = timeUtil;
