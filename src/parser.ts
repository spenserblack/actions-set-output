import { parse as parseArgs } from 'shell-quote';

export interface Variable {
  name: string;
}

export interface Hardcoded extends Variable {
  value: string;
}

export interface Command extends Variable {
  command: string;
  args: string[];
}

export const parseLine = (line: string): Hardcoded | Command => {
  const [name, value] = line.split('=');
  const commandMatch = value.match(/\$\((?<command>\w+)(?:\s(?<args>.+)?)?\)$/);

  if (commandMatch != null) {
    const { groups: { command, args: allArgs } }
      = commandMatch as Required<Pick<typeof commandMatch, 'groups'>>;
    const args: string[] = allArgs ?
      parseArgs(allArgs).filter((arg): arg is string => typeof arg === 'string')
      : [];

    return { name, command, args };
  }
  return { name, value };
};
