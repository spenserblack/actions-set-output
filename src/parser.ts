export interface Variable {
  name: string;
}

export interface Hardcoded extends Variable {
  value: string;
}

export interface Command extends Variable {
  command: string;
  args?: string[];
}

export const parseLine = (line: string): Hardcoded | Command => {
  throw new Error('Not implemented');
};
