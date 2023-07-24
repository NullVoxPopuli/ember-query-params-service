import path from 'node:path';

import { packageJson, project } from 'ember-apply';

let root = await project.gitRoot();

for await (let workspace of await project.getWorkspaces()) {
  if (workspace === root) continue;

  let relative = path.join(path.relative(workspace, root), 'package.json');

  await packageJson.modify((json) => {
    json.volta = {
      extends: relative,
    };
  }, workspace);
}
