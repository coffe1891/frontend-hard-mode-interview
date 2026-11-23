// 从《前端内参》TypeScript 样章提取的示例，用于编译回归。
export {};

type SearchState =
  | { status: "idle" }
  | { status: "loading"; keyword: string }
  | { status: "success"; items: string[] }
  | { status: "error"; message: string };

function assertNever(value: never): never {
  throw new Error("遗漏了状态：" + JSON.stringify(value));
}

function renderText(state: SearchState): string {
  switch (state.status) {
    case "idle": return "请输入关键词";
    case "loading": return "正在搜索：" + state.keyword;
    case "success": return state.items.length
      ? "找到 " + state.items.length + " 条结果"
      : "暂时没有结果";
    case "error": return "搜索失败：" + state.message;
    default: return assertNever(state);
  }
}

console.log(renderText({ status: "loading", keyword: "手机" }));
// >> 正在搜索：手机
