import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import icon from 'astro-icon';
import { indiepub } from '@indiepub/astro';
import { indiepubAdmin } from '@indiepub/admin';

export default defineConfig({
  output: 'server',

  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: 'cloudflare',
  }),

  session: { driver: 'unstorage/drivers/null' },

  vite: {
    environments: {
      ssr: {
        external: ['node:fs/promises', 'node:path', 'node:url', 'node:crypto'],
      },
    },
  },

  markdown: {
    syntaxHighlight: false,
  },

  integrations: [
    icon(),
    indiepub({
      title: 'Tony Sullivan',
      description: 'An IndieWeb site built with IndiePub.',

      author: {
        name: 'Tony Sullivan',
        url: 'https://tonysull.co',
      },

      // Public R2 bucket domain. Set MEDIA_URL=https://media.example.com in .dev.vars
      // (or wrangler.toml [vars]) for production. Leave empty for local dev.
      mediaUrl: process.env.MEDIA_URL ?? '',

      subscriptions: {
        enabled: true,
      },
    }),
    indiepubAdmin(),
  ],

  site: 'https://tonysull.co',
});