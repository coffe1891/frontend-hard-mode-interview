// 从《前端内参》TypeScript 样章提取的示例，用于编译回归。
export {};

type WithId = { id: string };

function getById<T extends WithId>(
  items: readonly T[],
  id: string
): T | undefined {
  return items.find(item => item.id === id);
}

type Product = { id: string; price: number; name: string };

const products: Product[] = [
  { id: "p1", name: "耳机", price: 199 },
  { id: "p2", name: "键盘", price: 299 }
];

const found = getById(products, "p2");
console.log(found?.price); // >> 299
