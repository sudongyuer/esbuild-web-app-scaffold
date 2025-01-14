import fs from 'fs-extra';
import path from 'path';
import consola from 'consola';
import minimist from 'minimist';

const PACKAGE_DIR = 'packages';
console.log('进来了');
const getInitialContent = (pkg: string) => `
console.log('pkg');
`;

const getPackageJsonContent = (pkg: string) => ({
  name: pkg,
  version: '0.0.1',
  description: '',
  main: './src/index.js',
  license: 'MIT',
  scripts: {
    build: 'tsc',
    watch: 'tsc --watch',
    check: 'tsc --noEmit'
  },
  dependencies: {
    typescript: '^4.5.0-beta'
  }
});

const getTSConfigContent = (pkg: string) => ({
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    rootDir: 'src'
  },
  include: ['src']
});

(async () => {
  const arg = minimist(process.argv.slice(2));

  const pkgName = arg['_'][0];

  consola.info(`Creating ${pkgName}`);

  if (!pkgName) {
    throw new Error();
  }

  const packageDir = path.resolve(PACKAGE_DIR, pkgName);
  const initialFile = path.join(packageDir, 'src', 'index.ts');
  const packageFile = path.join(packageDir, 'package.json');
  const tsconfigFile = path.join(packageDir, 'tsconfig.json');

  fs.ensureDirSync(packageDir);
  fs.ensureFileSync(initialFile);

  fs.writeFileSync(initialFile, getInitialContent(pkgName));
  fs.writeFileSync(
    packageFile,
    JSON.stringify(getPackageJsonContent(pkgName), null, 2)
  );
  fs.writeFileSync(
    tsconfigFile,
    JSON.stringify(getTSConfigContent(pkgName), null, 2)
  );

  consola.success(`Create ${pkgName}`);
})();
