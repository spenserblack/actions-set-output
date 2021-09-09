import { parseLine } from './parser';

test('hardcoded value is detected', () => {
  expect(parseLine('FOO=BAR')).toEqual({ name: 'FOO', value: 'BAR' });
});
test('command is detected', () => {
  expect(parseLine('VERSION=$(git describe --tags)')).toEqual({
    name: 'VERSION',
    command: 'git describe --tags',
  });
});
