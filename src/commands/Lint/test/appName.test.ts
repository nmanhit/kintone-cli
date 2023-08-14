import { describe, expect, test } from '@jest/globals';
import { program } from 'commander';
import { APP_NAME, DIR_BUILD_PATH } from '../../../../unit_test/constant';
import {
  createTemplateNotQuick,
  getRandomProjectName,
  initProject
} from '../../../../unit_test/helper';
import lintCommand from '../lintCommand';
import { readFileSync } from 'jsonfile';

export const initializeTestProject = async () => {
  const projectName = getRandomProjectName();
  const currentDir = `${DIR_BUILD_PATH}/${projectName}`;
  await initProject(DIR_BUILD_PATH, projectName);
  await createTemplateNotQuick(projectName);

  return {
    mainProgram: lintCommand(program),
    currentDir
  };
};

describe('Lint command', () => {
  describe('App name', () => {
    test('Should be "test-app" when setting the "--app-name" option to "test-app"', async () => {
      const initTest = await initializeTestProject();

      process.argv = ['node', 'lint', '--fix', '--app-name', APP_NAME];
      await initTest.mainProgram.parseAsync(process.argv);

      const templateFile = readFileSync(`${initTest.currentDir}/package.json`);
      const isLint = `lint-${APP_NAME}-fix` in templateFile.scripts;

      expect(isLint).toEqual(true);
    });

    test('Should be "test-app" when setting the "--app-name" to "test-app" without the "--fix" option', async () => {
      const initTest = await initializeTestProject();
      process.argv = ['node', 'lint', '--app-name', 'test-app'];

      await initTest.mainProgram.parseAsync(process.argv);

      expect(initTest.mainProgram.opts().appName).toEqual('test-app');
    });
  });
});
