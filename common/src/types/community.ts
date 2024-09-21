export type IPacket<T> = {
  event: string;
  uuid: string;
  data: T;
  ok: boolean;
};
