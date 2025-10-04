#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Module = require('module');
const ts = require('typescript');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const TEST_DIR = path.join(ROOT, '__tests__');

const compilerOptions = {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2019,
  esModuleInterop: true,
  jsx: ts.JsxEmit.React,
};

function registerTypeScriptLoader() {
  const load = (module, filename) => {
    const source = fs.readFileSync(filename, 'utf8');
    const result = ts.transpileModule(source, {
      compilerOptions,
      fileName: filename,
    });
    module._compile(result.outputText, filename);
  };

  require.extensions['.ts'] = load;
  require.extensions['.tsx'] = load;
}

registerTypeScriptLoader();

function findTestFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findTestFiles(entryPath));
    } else if (/\.test\.ts$/.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function createSuite(name) {
  return {
    name,
    suites: [],
    tests: [],
    beforeEach: [],
    afterEach: [],
  };
}

function createExpect(actual) {
  const matchers = {
    toBe(expected) {
      assert.strictEqual(actual, expected);
    },
    toEqual(expected) {
      assert.deepStrictEqual(actual, expected);
    },
    toBeCloseTo(expected, precision = 2) {
      if (typeof actual !== 'number' || typeof expected !== 'number') {
        throw new Error('toBeCloseTo matcher requires numeric values');
      }
      const diff = Math.abs(actual - expected);
      const tolerance = Math.pow(10, -precision) / 2;
      assert.ok(
        diff <= tolerance,
        `Expected ${actual} to be within ${tolerance} of ${expected} (precision ${precision})`,
      );
    },
    toBeGreaterThan(expected) {
      assert.ok(actual > expected, `Expected ${actual} to be greater than ${expected}`);
    },
    toBeGreaterThanOrEqual(expected) {
      assert.ok(actual >= expected, `Expected ${actual} to be greater than or equal to ${expected}`);
    },
    toBeLessThan(expected) {
      assert.ok(actual < expected, `Expected ${actual} to be less than ${expected}`);
    },
    toBeLessThanOrEqual(expected) {
      assert.ok(actual <= expected, `Expected ${actual} to be less than or equal to ${expected}`);
    },
    toBeDefined() {
      assert.notStrictEqual(actual, undefined, 'Expected value to be defined');
    },
    toBeUndefined() {
      assert.strictEqual(actual, undefined, 'Expected value to be undefined');
    },
    toThrow(expectedMessage) {
      if (typeof actual !== 'function') {
        throw new Error('toThrow matcher requires a function');
      }
      let threw = false;
      try {
        actual();
      } catch (error) {
        threw = true;
        if (expectedMessage !== undefined) {
          const message = error && error.message ? error.message : String(error);
          if (expectedMessage instanceof RegExp) {
            assert.ok(
              expectedMessage.test(message),
              `Expected error message ${message} to match ${expectedMessage}`,
            );
          } else {
            assert.strictEqual(message, expectedMessage);
          }
        }
      }
      if (!threw) {
        throw new Error('Expected function to throw an error');
      }
    },
  };

  matchers.not = {
    toBe(expected) {
      assert.notStrictEqual(actual, expected);
    },
    toEqual(expected) {
      try {
        assert.deepStrictEqual(actual, expected);
      } catch (error) {
        return;
      }
      throw new Error('Expected values to be different');
    },
  };

  return matchers;
}

function setupGlobals(filePath) {
  const original = {
    describe: global.describe,
    it: global.it,
    test: global.test,
    beforeEach: global.beforeEach,
    afterEach: global.afterEach,
    expect: global.expect,
  };

  const rootSuite = createSuite(path.relative(ROOT, filePath));
  const stack = [rootSuite];

  const getCurrentSuite = () => stack[stack.length - 1];

  global.describe = (name, fn) => {
    const suite = createSuite(name);
    getCurrentSuite().suites.push(suite);
    stack.push(suite);
    try {
      fn();
    } finally {
      stack.pop();
    }
  };

  const registerTest = (name, fn) => {
    getCurrentSuite().tests.push({ name, fn });
  };

  global.it = global.test = (name, fn) => {
    registerTest(name, fn);
  };

  global.beforeEach = (fn) => {
    getCurrentSuite().beforeEach.push(fn);
  };

  global.afterEach = (fn) => {
    getCurrentSuite().afterEach.push(fn);
  };

  global.expect = (value) => createExpect(value);

  return { original, rootSuite };
}

function restoreGlobals(original) {
  Object.assign(global, original);
}

async function executeSuite(suite, ancestors = []) {
  let passed = 0;
  let failed = 0;
  const suitePath = ancestors.map((ancestor) => ancestor.name).filter(Boolean);
  const currentPath = suite.name ? suitePath.concat(suite.name) : suitePath;

  for (const childSuite of suite.suites) {
    const result = await executeSuite(childSuite, ancestors.concat(suite));
    passed += result.passed;
    failed += result.failed;
  }

  const beforeHooks = ancestors.concat(suite);
  const afterHooks = beforeHooks.slice().reverse();

  for (const test of suite.tests) {
    const fullName = currentPath.concat(test.name).filter(Boolean).join(' › ');
    const runHooks = async (hooks) => {
      for (const suiteHooks of hooks) {
        for (const hook of suiteHooks.beforeEach) {
          await hook();
        }
      }
    };

    const runAfterHooks = async () => {
      for (const suiteHooks of afterHooks) {
        for (const hook of suiteHooks.afterEach) {
          await hook();
        }
      }
    };

    try {
      await runHooks(beforeHooks);
      await Promise.resolve().then(() => test.fn());
      await runAfterHooks();
      console.log(`✓ ${fullName}`);
      passed += 1;
    } catch (error) {
      failed += 1;
      console.error(`✗ ${fullName}`);
      if (error && error.stack) {
        console.error(error.stack);
      } else {
        console.error(error);
      }
      try {
        await runAfterHooks();
      } catch (hookError) {
        console.error('Error in afterEach hook:', hookError);
      }
    }
  }

  return { passed, failed };
}

async function runTestFile(filePath) {
  const { original, rootSuite } = setupGlobals(filePath);
  let compiled;

  try {
    const source = fs.readFileSync(filePath, 'utf8');
    const result = ts.transpileModule(source, {
      compilerOptions,
      fileName: filePath,
    });
    compiled = result.outputText;
  } catch (error) {
    restoreGlobals(original);
    throw error;
  }

  try {
    const testModule = new Module(filePath, module);
    testModule.filename = filePath;
    testModule.paths = Module._nodeModulePaths(path.dirname(filePath));
    const originalRequire = testModule.require.bind(testModule);
    testModule.require = (request) => {
      if (request.startsWith('@/')) {
        const resolvedPath = path.join(ROOT, request.slice(2));
        return originalRequire(resolvedPath);
      }
      return originalRequire(request);
    };
    testModule._compile(compiled, filePath);
    const result = await executeSuite(rootSuite);
    restoreGlobals(original);
    return result;
  } catch (error) {
    restoreGlobals(original);
    throw error;
  }
}

async function main() {
  const testFiles = findTestFiles(TEST_DIR);
  if (testFiles.length === 0) {
    console.log('No test files found.');
    return;
  }

  let totalPassed = 0;
  let totalFailed = 0;

  for (const filePath of testFiles) {
    const relativePath = path.relative(ROOT, filePath);
    console.log(`\nRunning ${relativePath}`);
    try {
      const result = await runTestFile(filePath);
      totalPassed += result.passed;
      totalFailed += result.failed;
      if (result.failed === 0) {
        console.log(`PASS ${relativePath}`);
      } else {
        console.log(`FAIL ${relativePath}`);
      }
    } catch (error) {
      totalFailed += 1;
      console.error(`Error executing ${relativePath}`);
      console.error(error && error.stack ? error.stack : error);
    }
  }

  console.log(`\nTest summary: ${totalPassed} passed, ${totalFailed} failed`);
  if (totalFailed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Unexpected error while running tests');
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
