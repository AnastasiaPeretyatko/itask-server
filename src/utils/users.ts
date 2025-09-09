type UserType = {
  socketId: string;
  id: string;
  username: string;
  roomId: string;
};

const users: UserType[] = [];

export const userJoinRoom = (user: UserType) => {
  const userData = { ...user };

  users.push(userData);
  return userData;
};

export const getCurrentUserById = (id: string) => users.find(user => user.socketId === id);

export const userLeaveRoom = (id: string) => {
  const index = users.findIndex(user => user.socketId === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getRoomUsers = (roomId: string) => users.filter(user => user.roomId === roomId);
