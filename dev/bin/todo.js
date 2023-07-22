#!/usr/bin/env node
import { execa } from 'execa';

async function pending(command) {
  let { stdout } = await execa('pnpm', [
    'turbo',
    'run',
    command,
    '--dry-run=json',
  ]);

  let json = JSON.parse(stdout);
  let tasks = json.tasks;

  let result = {};

  for (let task of tasks) {
    if (task.task === command) {
      result[task.package] = task.cache.status === 'MISS';
    }
  }

  return result;
}

/**
 * This is only based on what is in ci.yml
 * What these cover, and how they're dirtied,
 * and what projects they dirty in what order
 * is determined by the turbo.json
 */
async function gather() {
  let lint = await pending('_:lint');
  let test = await pending('test');
  let typecheck = await pending('lint:types');

  console.info(
    JSON.stringify({
      lint,
      test,
      typecheck,
      atAll: {
        // If all of these values are false, that means that
        // each package had a cache-hit
        lint: Object.values(lint).some(Boolean),
        test: Object.values(test).some(Boolean),
        typecheck: Object.values(typecheck).some(Boolean),
      },
    })
  );
}

await gather();
