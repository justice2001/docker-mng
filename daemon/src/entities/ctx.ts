import { Socket } from 'socket.io';

export type RouterCtx = {
  socket: Socket;
  event: string;
  uuid: string;
};
