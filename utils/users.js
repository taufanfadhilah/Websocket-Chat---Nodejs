const users = [];

// join user to chat
const userJoin = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);

  return user;
};

// get current users
const getCurrentUsers = (id) => {
  return users.find((user) => user.id === id);
};

// user leave chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// get room users
const getRoomUsers = room => users.filter(user => user.room === room)

module.exports = {
  userJoin,
  getCurrentUsers,
  userLeave,
  getRoomUsers
};
