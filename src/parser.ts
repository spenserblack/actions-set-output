export interface Variable {
  name: string;
}

export interface Hardcoded extends Variable {
  value: string;
}

export interface Command extends Variable {
  command: string;
}

export const parseLine = (line: string): Hardcoded | Command => {
  const [name, value] = line.split('=');
  const commandMatch = value.match(/\$\((.+)\)$/);

  if (commandMatch) {
    const command = commandMatch[1];
    return { name, command };
  }
  return { name, value };
};
