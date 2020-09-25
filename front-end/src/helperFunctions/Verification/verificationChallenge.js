exports.IndividualChallenge = (challenge, challengeType) => {
  const score = +challenge.score;
  const distance = +challenge.distance;
  const elevation = +challenge.elevation;
  let startDateProvided = challenge.startDate;
  console.log(startDateProvided);

  let endDateProvided = challenge.endDate;
  const currentDate = new Date();
  startDateProvided = new Date(startDateProvided);

  endDateProvided = new Date(endDateProvided);
  let todayDate = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;
  let startdate = `${startDateProvided.getFullYear()}-${
    startDateProvided.getMonth() + 1
  }-${startDateProvided.getDate()}`;
  let endDate = `${endDateProvided.getFullYear()}-${
    endDateProvided.getMonth() + 1
  }-${endDateProvided.getDate()}`;
console.log(startdate)
console.log(endDate)
startdate = new Date(startdate)
endDate = new Date(endDate)
todayDate = new Date(todayDate)
console.log(startdate)
console.log(endDate)
  if (challenge.privacy === "club") {
    if (challenge.clubSelected === null) {
      return "Must select a club";
    }
  }
  if (challenge.description.length > 300)
    return "Description must be less than 300 characters";
  if (challenge.title.length > 50)
    return "Title must be less than 50 characters";
  if (!challenge.title) return "Missing Title";
  if (!challenge.description) return "Missing Description";
  if (score > 10) return "Score is too high";
  if (score < 0) return "Score must be 0 or greater";
  if (distance < 0) return "Distance must be greater than 0";
  if (elevation < 0) return "Elevation must be greater than 0";
  if (challengeType === "single") {
    if (!challenge.startDate) return "Missing Start-date";
    if (!challenge.endDate) return "Missing End-date";
    if (startdate < todayDate) return "Please select a later date";
    if (startdate > endDate) return "End date must be after the start date";
  }

  return "verified";
};

exports.GroupChallenge = (challenge) => {
  const errors = [];
  console.log(challenge);
  const flattenedArray = [].concat(...challenge.challenges);
  console.log(flattenedArray);
  for (let i = 0; i < flattenedArray.length; i++) {
    const chall = flattenedArray[i];
    const num = i + 1;
    if (!chall.title || chall.title === "Challenge Title")
      errors.push(`challenge ${num} must have a title`);
    if (chall.title.length > 50)
      errors.push(`Challenge ${num} title must be less than 50 characters`);
    if (!chall.description)
      errors.push(`Challenge ${num} is missing a description`);
    if (chall.distance < 0)
      errors.push(`Challenge ${num} distance must be greater than 0 miles`);
    if (chall.score > 10)
      errors.push(`Challenge ${num} must score must be below 10`);
    if (chall.elevation < 0)
      errors.push(`Challenge ${num} elevation must be above 0 ft`);
  }
  if (errors.length > 0) {
    return errors;
  } else {
    return "verified";
  }
};

exports.NextVerification = (obj) => {
  let startDateProvided = obj.startDate;
  let endDateProvided = obj.endDate;
  const currentDate = new Date();
  startDateProvided = new Date(startDateProvided);
  endDateProvided = new Date(endDateProvided);
  let todayDate = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;
  let startdate = `${startDateProvided.getFullYear()}-${
    startDateProvided.getMonth() + 1
  }-${startDateProvided.getDate()}`;
  let endDate = `${endDateProvided.getFullYear()}-${
    endDateProvided.getMonth() + 1
  }-${endDateProvided.getDate()}`;
  startdate = new Date(startdate)
  endDate = new Date(endDate)
  todayDate = new Date(todayDate)
  const rows = +obj.rows;
  const columns = +obj.columns;
  console.log(rows, columns);
  if (!obj.bingoTitle) return "Missing Title";
  if (!obj.bingoDescription) return "Missing Description";
  if (rows <= 0) return "Must have atleast one row";
  if (columns <= 0) return "Must have atleast one Column";
  if (!obj.startDate) return "Missing Start-date";
  if (!obj.endDate) return "Missing End-date";
  if (startdate < todayDate) return "Date must be today or after";
  if (startdate > endDate) return "End date must be after the start date";
  return "verified";
};
