import {
  parse as parseArgs,
  ControlOperator,
  ParseEntry,
} from 'shell-quote';

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

const isOp = (arg: ParseEntry): arg is { op: ControlOperator } => {
  return typeof arg !== 'string' && !('pattern' in arg);
};

const isArg = (arg: ParseEntry | undefined): arg is string => {
  return typeof arg === 'string';
};

export const parseCommand = (varName: string, allArgs: string): Command | PipedCommand => {
  const args = parseArgs(allArgs);
  let arg = args.shift();

  if (typeof arg === 'undefined' || typeof arg !== 'string') {
    throw new Error('No base command provided');
  }

  const command: Command | PipedCommand = { name: varName, command: arg, args: [] };
  let currentCommand: PipedCommand | Into = command as PipedCommand;

  for (arg = args.shift(); typeof arg !== 'undefined'; arg = args.shift()) {
    if (isArg(arg)) {
      currentCommand.args.push(arg);
      continue;
    }
    if (isOp(arg)) {
      const { op } = arg;
      arg = args.shift();

      if (!isArg(arg)) {
        throw new Error('Pipe with no following command');
      }
      if (op === '|') {
        const into: Into = { command: arg, args: [] };
        currentCommand.into = into;
        currentCommand = currentCommand.into;
      }
    }
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
