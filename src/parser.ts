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

// A command without the variable name to save to.
type RawCommand = Omit<Command, 'name'>;

export type Into = RawCommand & { into?: RawCommand | null } ;

export interface PipedCommand extends Command {
  into: Into;
}

export const parseCommand = (varName: string, allArgs: string): Command | PipedCommand => {
  const args = parseArgs(allArgs);
  let arg = args.shift();

  if (typeof arg === 'undefined' || typeof arg !== 'string') {
    throw new Error('No base command provided');
  }

  const command: Command | PipedCommand = { name: varName, command: arg, args: [] };
  let currentCommand: Command | PipedCommand | Into = command;

  for (arg = args.shift(); typeof arg !== 'undefined'; arg = args.shift()) {
    if (typeof arg !== 'string') {
      const { op } = arg;
      arg = args.shift();

      if (typeof arg === 'undefined') {
        throw new Error('Pipe with no following command');
      }
      if (op === '|') {
        const into: Into = { command: arg, args: [] };
        currentCommand.into = into;
        currentCommand = currentCommand.into;
      }
      continue;
    }
    currentCommand.args.push(arg);
  }

  return command;
};

export const parseLine = (line: string): Hardcoded | Command | PipedCommand => {
  const [name, value] = line.split('=');
  const commandMatch = value.match(/\$\((?<args>.+)\)$/);

  if (commandMatch == null) {
    return { name, value };
  }

  const { groups: { args: allArgs } }
    = commandMatch as Required<Pick<typeof commandMatch, 'groups'>>;

  return parseCommand(name, allArgs);
};
