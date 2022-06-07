const CALC_PREFIX = `tblfm`;

function parseInlineFormulas(text: string) {
  //TODO: parse inline formulas and store them for computing
}
function parseTables(text: string) {
  // TODO: parse tables?
}

export default function () {
  return {
    plugin: function (markdownIt, _options) {
      const defaultRenderInline =
        markdownIt.renderer.rules.code_inline ||
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
          return defaultRenderInline(tokens, idx, options, env, self);
        }
      };

      const defaultRenderTable =
        markdownIt.renderer.rules.block ||
        function (tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options, env, self);
        };

      markdownIt.renderer.rules.block = function (
        tokens,
        idx,
        options,
        env,
        self
      ) {
        const token = tokens[idx];
        console.log("token", token);
        return defaultRenderTable(tokens, idx, options, env, self);
      };
    },

    assets: function () {
      return [];
    },
  };
}
