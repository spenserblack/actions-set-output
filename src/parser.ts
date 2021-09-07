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
  const [name, value] = line.split('=');
  const commandMatch = value.match(/\$\((.+)\)$/);

  if (commandMatch) {
    const [command, ...args] = commandMatch[1].split(' ');
    return { name, command, args:  args.length ? args : null };
  }
  return { name, value };
};
