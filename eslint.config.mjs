import globals from "globals";
import pluginJs from "@eslint/js";
import babelParser from "@babel/eslint-parser";


export default [
  {
    languageOptions: {
      // globals: globals.browser,
      parser: babelParser,
      ecmaVersion: "latest",
      sourceType: "module",
  }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "import/prefer-default-export": "off",
      "max-len": [
        "error",
        {
          ignoreComments: true,
          ignoreUrls: true,
        },
      ],
      "import/extensions": [0, { js: "always" }],
      "no-unused-expressions": ["error", { allowShortCircuit: true }],
    },
  },
];