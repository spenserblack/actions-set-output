import {
  isPipedCommand,
  parseLine,
} from '../src/parser';

describe('parseLine', () => {
  test('hardcoded value is detected', () => {
    expect(parseLine('FOO=BAR')).toEqual({ name: 'FOO', value: 'BAR' });
  });
  test('command is detected', () => {
    expect(parseLine('VERSION=$(git describe --tags)')).toEqual({
      name: 'VERSION',
      command: 'git',
      args: ['describe', '--tags'],
    });
  });
  test('no command args means Command.args not defined', () => {
    expect(parseLine('USER=$(whoami)').args).toHaveLength(0);
  });
  test('command args do not contain single quotes', () => {
    const { args } = parseLine("GREETING=$(echo 'Hello')");
    expect(args).toHaveLength(1);
    expect(args[0]).toEqual('Hello');
  });
  test('command args do not contain double quotes', () => {
    const { args } = parseLine('GREETING=$(echo "Hello")');
    expect(args).toHaveLength(1);
    expect(args[0]).toEqual('Hello');
  });
  test('quoted argument is one argument', () => {
    const { args } = parseLine('GREETING=$(echo "Hello World")');
    expect(args).toHaveLength(1);
    expect(args[0]).toEqual('Hello World');
  });
  test('piped commands are detected', () => {
    const result = parseLine('VALUE=$(echo "Hello World" | foo | wc -w)');
    expect(result.command).toEqual('echo');
    expect(result.args).toHaveLength(1);
    expect(result.args[0]).toEqual('Hello World');
    expect(result.into).toBeDefined();
    expect(result.into.command).toEqual('foo');
    expect(result.into.args).toHaveLength(0);
    expect(result.into.into).toBeDefined();
    expect(result.into.into.command).toEqual('wc');
    expect(result.into.into.args).toHaveLength(1);
    expect(result.into.into.args[0]).toEqual('-w');
  });
});

describe('isPipedCommand', () => {
  test('returns true when command is piped', () => {
    expect(isPipedCommand({
      name: 'foo',
      args: [],
      command: 'bar',
      into: { command: 'baz', args: [] },
    })).toBe(true);
  });

  test("returns false when command isn't piped", () => {
    expect(isPipedCommand({
      name: 'foo',
      args: [],
      command: 'bar',
    })).toBe(false);
  });
});
