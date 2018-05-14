import MarkdownIt from 'markdown-it';

const markdownIt = new MarkdownIt({
  html: true,
  langPrefix: 'hljs ',
  highlight: function(str: string, lang: string) {
    const hljs: any = (<any>window).hljs;

    if (hljs == null) {
      console.warn('highlight.js (`window.hljs`) is missing');
      return '';
    }

    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (e) {
        console.error(e);
      }
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (e) {
      console.error(e);
    }

    return ''; // use external default escaping
  },
});

export function compileMarkdown(markdown: string): string {
  markdownIt.renderer.rules.link_open = linkOpenAsTargetBlank;
  return markdownIt.render(markdown);
}

function linkOpenAsTargetBlank(tokens: any[], idx: number, options: any, _: any, self: any) {
  const linkOpenToken = tokens[idx];
  const targetAttrIndex = linkOpenToken.attrIndex('target');
  if (targetAttrIndex < 0) {
    linkOpenToken.attrPush(['target', '_blank']);
  } else {
    linkOpenToken.attrs[targetAttrIndex][1] = '_blank';
  }
  return self.renderToken(tokens, idx, options);
}
