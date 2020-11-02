exports.minutesAgo = (date, minutes) => {
  return new Date(date.getTime() - minutes * 60000);
}

exports.minutesSince = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
}