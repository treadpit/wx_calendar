module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 70],
    'type-enum': [
      2,
      'always',
      [
        'docs', // Adds or alters documentation.
        'chore', // Other changes that don't modify src or test files.
        'feat', // Adds a new feature.
        'upd', // update a feature.
        'fix', // Solves a bug.
        'merge', // Merge branch ? of ?.
        'perf', // Improves performance.
        'refactor', // Rewrites code without feature, performance or bug changes.
        'revert', // Reverts a previous commit.
        'style', // Improves formatting, white-space.
        'test' // Adds or modifies tests.
      ]
    ]
  }
};
