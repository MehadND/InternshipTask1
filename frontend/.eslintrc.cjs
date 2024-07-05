{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint", "prettier"],
  "ignorePatterns": ["node_modules", "dist", "public", "src/assets"],
  "rules": {
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": ["off"],
    "react/react-in-jsx-scope": "off",
    "react/jsx-no-target-blank": "off",
    "no-restricted-syntax": [
      "error",
      {
        "selector": "VariableDeclarator[init.callee.name='useTranslation'] > ObjectPattern > Property[key.name='t']:not([parent.declarations.0.init.callee.object.name='i18n'])",
        "message": "Destructuring 't' from useTranslation is not allowed. Please use the 'useTranslate' hook from '@/utils/i18n'."
      }
    ]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "overrides": [
    {
      "files": ["src/utils/i18n.ts"],
      "rules": {
        "no-restricted-syntax": "off"
      }
    }
  ]
}