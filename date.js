exports.getDate = () => {
  const date = new Date();
  //   const currentDay = date.getDay();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return date.toLocaleDateString("en-US", options);

};

exports.getDay = () => {
  const date = new Date();
  //   const currentDay = date.getDay();

  const options = {
    weekday: "long",
  };

  return date.toLocaleDateString("en-US", options);

};

console.log(exports);