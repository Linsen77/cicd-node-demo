/**
 * 极简统计工具：给实验二的流水线提供真实的 lint / test / build 目标。
 * 业务逻辑故意写得简单，重点在“能被检查、能被测试、能被打包”。
 */

/** 入参必须是数字数组，否则直接抛错——这种“错误输入”在测试里也要覆盖 */
function assertNumbers(list) {
  if (!Array.isArray(list) || list.length === 0) {
    throw new TypeError('需要一个非空数组');
  }
  for (const item of list) {
    // 注意：Number.isNaN('a') 是 false（它不做类型转换），
    // 所以必须先判断 typeof，否则字符串会被静默拼进结果里。
    if (typeof item !== 'number' || Number.isNaN(item)) {
      throw new TypeError(`数组中含有非法数字：${String(item)}`);
    }
  }
}

/** 求和 */
export function sum(list) {
  assertNumbers(list);
  return list.reduce((acc, cur) => acc + cur, 0);
}

/** 平均值，保留两位小数 */
export function average(list) {
  assertNumbers(list);
  const value = sum(list) / list.length;
  return value; // 故障演练 B：去掉四舍五入，让 average 的断言失败
}

/** 最大值 */
export function max(list) {
  assertNumbers(list);
  return Math.max(...list);
}

/** 按分数给出等级，用于演示“边界值”测试 */
export function level(score) {
  if (typeof score !== 'number' || Number.isNaN(score)) {
    throw new TypeError('分数必须是数字');
  }
  if (score < 0 || score > 100) {
    throw new RangeError('分数必须在 0~100 之间');
  }
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}
