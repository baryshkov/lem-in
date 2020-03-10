#!/usr/bin/env node

let data = "";

const stdin = process.stdin;

stdin.resume();
stdin.on("data", chunk => (data += chunk));

stdin.on("end", () => exec(data));
stdin.on("error", console.error);

const struct = {
  numberOfAnts: 0,
  rooms: []
};
module.exports = struct;

const addRoom = (str, isStartOrEnd) => {
  const room = str.split(" ");
  const index = room[0];
  const x = room[1];
  const y = room[2];

  struct.rooms.push({ index, x, y, isStartOrEnd, links: [] });
};

const parseRoom = (arr, i) => {
  const command = arr[i].slice(2);
  const START = 1;
  const END = 2;

  if (command === "start") {
    addRoom(arr[i + 1], START);
    return 1;
  } else if (command === "end") {
    addRoom(arr[i + 1], END);
    return 1;
  } else {
    addRoom(arr[i], 0);
    return 0;
  }
};

const parseAntsNum = str => {
  const num = Number(str);
  if (!isNaN(num)) {
    struct.numberOfAnts = num;
  }
};

const parseLinks = str => {
  const [a, b] = str.split("-");
  struct.rooms.forEach(room => {
    if (room.index === a) {
      room.links.push(b);
    } else if (room.index === b) {
      room.links.push(a);
    }
  });
};

const isComment = str => str[0] === "#" && str[1] !== "#";
const isLink = str => str.includes("-");

const validate = str => {
  console.log(str);
  const arr = str.split("\n");
  let skip = 0;

  arr.forEach((str, i, arr) => {
    if (skip !== 0 || str === '') {
      skip = 0;
      return;
    }

    if (!isComment(str) && !isLink(str)) {
      i === 0 ? parseAntsNum(str) : (skip = parseRoom(arr, i));
    } else if (isLink(str)) {
      parseLinks(str);
    }
  });
};

function exec(example) {
  // if (examples.indexOf(example) === -1) {
  //   // console.log(data);
  //   console.warn(
  //       'Invalid example "%s" provided. Must be one of:\n  *',
  //       example,
  //       examples.join('\n  * ')
  //   );
  //   process.exit(0);
  // }
  validate(example);
  console.log(struct);

  // eslint-disable-next-line no-unused-expressions
  require('./server.js');
}
