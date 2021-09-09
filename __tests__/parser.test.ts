import { parseLine } from '../src/parser';

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
