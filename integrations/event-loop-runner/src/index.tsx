import { createIntegration, createComponent } from '@gitbook/runtime';
import { assets } from '../.build/assets';

const DEFAULT_CODE = [
  'setTimeout(function() {',
  '  console.log(1);',
  '}, 0);',
  'new Promise(function(resolve, reject) {',
  '  console.log(2);',
  '  resolve(3);',
  '}).then(function(val) {',
  '  console.log(val);',
  '});',
  'console.log(4);'
].join('\n');

/**
 * GitBook 官方 ContentKit 组件，不能用任意 iframe 标签代替。
 * Git Sync 中的 ```js-run 会被映射成 props.content。
 * 访问者修改代码只影响自己的浏览器，不会改掉书的 Markdown。
 */
type RunnerState = { expanded: boolean };
type RunnerAction = { action: 'open-runner' | 'close-runner' };

export const eventLoopRunner = createComponent<{ content?: string }, RunnerState, RunnerAction>({
  componentId: 'eventloop-runner',
  initialState: { expanded: false },
  async render(element, context) {
    const original = typeof element.props.content === 'string'
      ? element.props.content
      : DEFAULT_CODE;
    const code = original.slice(0, 4000);
    const endpoint = context.environment.integration.urls.publicContentEndpoint;
    const url = new URL(`${endpoint.replace(/\/$/, '')}/inline/`);
    url.searchParams.set('code', code);
    url.searchParams.set('autorun', '1');

    // A book chapter can contain dozens of code blocks. Do not eagerly launch
    // one iframe/Worker-ready runtime per block at page-load time.
    // First show a native codeblock and one button. The editor starts only
    // when the reader explicitly asks to experiment.
    const expanded = element.state?.expanded === true;
    if (!expanded) {
      return (
        <block>
          <codeblock content={code} syntax="javascript" lineNumbers={true} />
          <button label="▶ 运行这段代码" onPress={{ action: "open-runner" }} />
        </block>
      );
    }
    return (
      <block>
        <webframe source={{ url: url.toString() }} aspectRatio={0.6} />
        <button label="收起运行区" onPress={{ action: "close-runner" }} />
      </block>
    );
  },
  async action(element, action) {
    if (action.action === "open-runner") return { state: { expanded: true } };
    if (action.action === "close-runner") return { state: { expanded: false } };
    return {};
  }
});

export function serveRunnerAsset(request: Request): Response {
  const path = new URL(request.url).pathname;
  const key = path.endsWith('/inline/') ? 'inline/index.html'
    : path.endsWith('/inline/run.js') ? 'inline/run.js'
    : path.endsWith('/runner-worker.js') ? 'runner-worker.js' : undefined;
  if (!key || !['GET', 'HEAD'].includes(request.method)) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(request.method === 'HEAD' ? null : assets[key], {
    headers: {
      'Content-Type': key.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/javascript; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer'
    }
  });
}

export default createIntegration({
  components: [eventLoopRunner],
  fetch: serveRunnerAsset
});
