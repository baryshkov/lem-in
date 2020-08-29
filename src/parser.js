#!/usr/bin/env node

let data = '';

const stdin = process.stdin;

stdin.resume();
stdin.on('data', (chunk) => (data += chunk));

stdin.on('end', () => exec(data));
stdin.on('error', console.error);

const struct = {
  numberOfAnts: 0,
  rooms: [],
};
module.exports = struct;

// isStartOrEnd 0 = not, 1 = start, 2 = end
const addRoom = (str, isStartOrEnd) => {
  const room = str.split(' ');
  const index = room[0];
  const x = room[1];
  const y = room[2];

  struct.rooms.push({ index, x, y, isStartOrEnd, links: [] });
};

const parseRoom = (arr, i) => {
  const command = arr[i].slice(2);
  const START = 1;
  const END = 2;

  if (command === 'start') {
    addRoom(arr[i + 1], START);
    return 1;
  } else if (command === 'end') {
    addRoom(arr[i + 1], END);
    return 1;
  } else {
    addRoom(arr[i], 0);
    return 0;
  }
};

const parseAntsNum = (str) => {
  const num = Number(str);
  if (!isNaN(num)) {
    struct.numberOfAnts = num;
  }
};

const parseLinks = (str) => {
  const [a, b] = str.split('-');
  struct.rooms.forEach((room) => {
    if (room.index === a) {
      room.links.push(b);
    } else if (room.index === b) {
      room.links.push(a);
    }
  });
};

struct.ants = {};
struct.turns = [];

// turn = {
//   turnNum,
//   L1: [start, finish],
//   ...
// }

const createAnts = (str, turnNum) => {
  const ants = str.split(' ');
  ants.forEach((ant) => {
    const [antName, newPos] = ant.split('-');
    if (!struct.ants[antName]) {
      struct.ants[antName] = { startTurn: turnNum, turns: [0, newPos] };
    } else {
      struct.ants[antName].turns.push(newPos);
    }
  });
};

const createTurns = (str, turnNum) => {
  const ants = str.split(' ');
  struct.turns[turnNum] = {
    turnNum,
  };
  ants.forEach((ant) => {
    const [antName, newPos] = ant.split('-');
    const turn = struct.turns[turnNum];
    struct.turns[turnNum] = {
      ...turn,
      [antName]: newPos,
    };
  });
};

const isComment = (str) => str[0] === '#' && str[1] !== '#';

const isLink = (str) => str.includes('-');

const validate = (str) => {
  console.log(str);
  const arr = str.split('\n');
  let skip = 0;
  let turn = 0;

  arr.forEach((str, i, arr) => {
    if (str.includes('L')) {
      createAnts(str, turn);
      createTurns(str, turn);
      turn++;
    }
    if (skip !== 0 || str === '' || str.includes('L')) {
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
  struct.rooms.sort((a, b) => {
    return Number(a.index) - Number(b.index);
  });
  console.log(struct);
  struct.rooms.forEach((room) => {
    console.log(room.index, room.links);
  });

  // eslint-disable-next-line no-unused-expressions
  // todo bring back
  // require('./server.js');
}
