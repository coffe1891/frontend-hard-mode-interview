// 从《前端内参》TypeScript 样章提取的示例，用于编译回归。
export {};

type User = { id: number; name: string };

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return Number.isInteger(item.id) && typeof item.name === "string";
}

function parseUser(value: unknown): User {
  if (!isUser(value)) throw new TypeError("接口返回的用户数据不合法");
  return value;
}

const raw: unknown = JSON.parse('{"id":123,"name":"小王"}');
console.log(parseUser(raw).name); // >> 小王
