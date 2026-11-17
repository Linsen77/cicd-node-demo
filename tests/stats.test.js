// 用 Node 内置测试器（node --test），零额外依赖，CI 机器上装完 eslint 就能跑。
// 每个用例都断言“具体结果”，不只断言“函数没报错”。
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { sum, average, max, level } from '../src/stats.js';

test('sum 计算总和', () => {
  assert.equal(sum([1, 2, 3]), 6);
  assert.equal(sum([10]), 10);
});

test('average 计算平均值并保留两位小数', () => {
  assert.equal(average([1, 2, 3, 4]), 2.5);
  // 1+2+2 = 5 / 3 = 1.6666... → 1.67
  assert.equal(average([1, 2, 2]), 1.67);
});

test('max 取出最大值', () => {
  assert.equal(max([3, 9, 4]), 9);
});

test('sum 对空数组给出明确错误', () => {
  assert.throws(() => sum([]), /非空数组/);
});

test('sum 对非数字入参给出明确错误', () => {
  assert.throws(() => sum([1, 'a']), TypeError);
});

test('level 按边界值给出等级', () => {
  assert.equal(level(90), 'A'); // 边界：刚好 90 是 A
  assert.equal(level(89.9), 'B');
  assert.equal(level(80), 'B');
  assert.equal(level(60), 'C');
  assert.equal(level(59.9), 'D');
});

test('level 拒绝越界分数', () => {
  assert.throws(() => level(101), RangeError);
  assert.throws(() => level(-1), RangeError);
});
