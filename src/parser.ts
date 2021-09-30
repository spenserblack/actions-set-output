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
  const commandMatch = value.match(/\$\((?<command>.+)\)$/);

  if (commandMatch != null) {
    const { groups: { command } } = commandMatch as Required<Pick<typeof commandMatch, 'groups'>>;
    return { name, command };
  }
  return { name, value };
};
