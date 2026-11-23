import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const textarea = document.querySelector<HTMLTextAreaElement>("#editor")!;
const run = document.querySelector<HTMLButtonElement>("#run")!;
const reset = document.querySelector<HTMLButtonElement>("#reset")!;
const palette = HighlightStyle.define([
  { tag: tags.keyword, color: "#3568a8" },
  { tag: [tags.string, tags.regexp], color: "#96603a" },
  { tag: [tags.number, tags.bool, tags.null], color: "#8056a6" },
  { tag: tags.comment, color: "#818b9a", fontStyle: "italic" },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: "#307492" },
  { tag: [tags.typeName, tags.className], color: "#5377a1" },
  { tag: tags.operator, color: "#607691" },
  { tag: tags.punctuation, color: "#66758a" }
]);
const view = new EditorView({
  doc: textarea.value,
  parent: document.querySelector("#highlight-editor")!,
  extensions: [
    // Run takes precedence over CodeMirror's default Mod-Enter blank-line command.
    keymap.of([{ key: "Mod-Enter", run: () => { run.click(); return true; } }]),
    basicSetup,
    javascript(),
    EditorView.lineWrapping,
    syntaxHighlighting(palette),
    EditorView.contentAttributes.of({ "aria-label": "可编辑的 JavaScript 示例", spellcheck: "false" }),
    EditorView.updateListener.of(update => {
      if (update.docChanged) textarea.value = update.state.doc.toString();
    }),
    EditorView.theme({
      "&": { backgroundColor: "#fff", color: "#344054", fontSize: "14px" },
      "&.cm-focused": { outline: "none", boxShadow: "inset 0 0 0 1px #c8dcf5" },
      ".cm-scroller": { fontFamily: "Consolas, ui-monospace, monospace", lineHeight: "1.85", maxHeight: "390px", overflow: "auto" },
      ".cm-content": { padding: "14px 0", minHeight: "318px", caretColor: "#3568a8" },
      ".cm-line": { padding: "0 20px 0 12px" },
      ".cm-gutters": { backgroundColor: "#fafbfd", color: "#a0abba", borderRight: "1px solid #edf1f6", padding: "0 5px" },
      ".cm-activeLineGutter": { backgroundColor: "#eef5ff", color: "#547eaf" },
      ".cm-activeLine": { backgroundColor: "#f6f9ff" },
      ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": { backgroundColor: "#dfebfb !important" },
      ".cm-cursor": { borderLeftColor: "#3568a8" },
      ".cm-foldGutter": { width: "10px" },
      "@media(max-width:600px)": { "&": { fontSize: "12px" }, ".cm-content": { minHeight: "290px" }, ".cm-line": { padding: "0 12px 0 8px" } }
    })
  ]
});
textarea.value = view.state.doc.toString();
textarea.hidden = true;
textarea.style.display = "none";
reset.addEventListener("click", () => {
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: textarea.value }, selection: { anchor: 0 }, scrollIntoView: true });
  view.scrollDOM.scrollLeft = 0;
  view.scrollDOM.scrollTop = 0;
});
