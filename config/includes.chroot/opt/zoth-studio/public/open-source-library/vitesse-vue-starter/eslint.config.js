// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    pnpm: true,
  },
  {
    files: ['README.md', 'README.zh-CN.md'],
    rules: {
      'markdown/heading-increment': 'off',
    },
  },
)
