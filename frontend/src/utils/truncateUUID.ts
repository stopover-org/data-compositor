export const truncatedUUID = (uuid: string) =>
  `${uuid.slice(0, 8)}...${uuid.slice(-3)}`;
