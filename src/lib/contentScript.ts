const CALC_PREFIX = `tblfm`;

function parseInlineFormulas(text: string) {}
function parseBlockFormulas(text: string) {}

export default function () {
  return {
    plugin: function (markdownIt, _options) {
      const defaultRender =
        markdownIt.renderer.rules.code_inline ||
        markdownIt.renderer.rules.fence ||
        function (tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options, env, self);
        };

      markdownIt.renderer.rules.code_inline = function (
        tokens,
        idx,
        options,
        env,
        self
      ) {
        const token = tokens[idx];
        const content = token.content as string;
        if (content.toLowerCase().startsWith(CALC_PREFIX)) {
          parseInlineFormulas(content);
          return "";
        } else {
          return defaultRender(tokens, idx, options, env, self);
        }
      };

      markdownIt.renderer.rules.fence = function (
        tokens,
        idx,
        options,
        env,
        self
      ) {
        const token = tokens[idx];
        if (token.info.startsWith(CALC_PREFIX)) {
          parseBlockFormulas(token.content);
          return "";
        } else {
          console.log("info");
          return defaultRender(tokens, idx, options, env, self);
        }
      };
    },

    assets: function () {
      return [];
    },
  };
}
