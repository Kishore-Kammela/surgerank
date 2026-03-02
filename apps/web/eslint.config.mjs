import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const disableReactRulesForEslint10 = (config) => {
  if (!config?.rules) return config;

  return {
    ...config,
    rules: Object.fromEntries(
      Object.entries(config.rules).map(([ruleName, ruleConfig]) => {
        // eslint-plugin-react isn't ESLint 10 compatible yet.
        // TODO: Remove this once eslint-plugin-react adds stable ESLint 10 support.
        if (ruleName.startsWith("react/")) return [ruleName, "off"];
        return [ruleName, ruleConfig];
      }),
    ),
  };
};

const eslintConfig = defineConfig([
  ...[...nextVitals, ...nextTs].map(disableReactRulesForEslint10),
  {
    rules: {
      eqeqeq: ["error", "always"],
      "no-debugger": "error",
      "no-var": "error",
      "prefer-const": "error",
      "@typescript-eslint/consistent-type-imports": ["warn", { fixStyle: "separate-type-imports" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
