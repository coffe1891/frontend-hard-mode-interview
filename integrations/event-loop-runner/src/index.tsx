import { createIntegration, createComponent } from '@gitbook/runtime';

const DEFAULT_CODE = [
  'setTimeout(() => console.log(1), 0);',
  'Promise.resolve().then(() => console.log(3));',
  'console.log(2);'
].join('\n');

const LAB_URL =
  'https://coffe1891.github.io/frontend-hard-mode-interview/labs/event-loop/inline/';

/**
 * GitBook 官方 ContentKit 组件，不能用任意 iframe 标签代替。
 * Git Sync 中的 ```js-run 会被映射成 props.content。
 * 访问者修改代码只影响自己的浏览器，不会改掉书的 Markdown。
 */
const eventLoopRunner = createComponent<{ content?: string }>({
  componentId: 'eventloop-runner',
  async render(element) {
    const original = typeof element.props.content === 'string'
      ? element.props.content
      : DEFAULT_CODE;
    const code = original.slice(0, 4000);
    const url = new URL(LAB_URL);
    url.searchParams.set('code', code);

    return (
      <block>
        <webframe
          source={{ url: url.toString() }}
          aspectRatio={1.68}
        />
      </block>
    );
  }
});

export default createIntegration({
  components: [eventLoopRunner]
});
