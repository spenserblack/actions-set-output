import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { parseLine } from './parser';

const parsed = core.getInput('variables')
  .split('\n')
  .filter((line) => line.length)
  .map(parseLine);

const results = parsed.map(({ name, ...attrs }) => {
  if ('value' in attrs) {
    core.info(`Setting ${name}`);
    core.setOutput(name, attrs.value);
    return;
  }

  return exec(attrs.command, attrs.args, {
    listeners: {
      stdout: (data: Buffer) => {
        core.info(`Setting ${name}`);
        core.setOutput(name, data.toString());
      },
    },
  });
});

Promise.all(results);
