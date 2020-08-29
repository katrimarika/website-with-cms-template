import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { config } from 'dotenv';
import fs from 'fs';
import htmlnano from 'htmlnano';
import posthtml from 'posthtml';
import { hash } from 'posthtml-hash';
import rimraf from 'rimraf';
import copy from 'rollup-plugin-copy';
import livereload from 'rollup-plugin-livereload';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;
const baseDir = 'build/admin';

// Load variables from .env file
config();

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'app',
    file: `${baseDir}/main.[hash].js`,
  },
  plugins: [
    // Handle environment variables
    replace({
      // stringify the object because only top level is allowed as object
      process: JSON.stringify({
        env: {
          DOMAIN_NAME: process.env.DOMAIN_NAME,
          GITHUB_PROJECT: process.env.GITHUB_PROJECT,
          GITHUB_HEAD_BRANCH: process.env.GITHUB_HEAD_BRANCH,
          GITHUB_PROD_BRANCH: process.env.GITHUB_PROD_BRANCH,
          GITHUB_API_URL: process.env.GITHUB_API_URL,
          HUGO_THEME_NAME: process.env.HUGO_THEME_NAME,
        },
      }),
    }),

    // Copy the index.html file, assets and email templates to build folder
    copy({
      targets: [
        { src: 'src/index.html', dest: baseDir },
        { src: 'src/assets', dest: baseDir },
        { src: 'src/email-templates', dest: baseDir },
      ],
    }),

    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write(`${baseDir}/main.[hash].css`, !production);
      },
      preprocess: sveltePreprocess(),
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    typescript({ sourceMap: !production }),

    // If we're building for production, minify and hash assets
    production && terser(),
    production && hashStaticAssets(),

    // Watch the `build/admin` directory and refresh the
    // browser on changes when not in production
    !production && livereload('build/admin'),
  ],
  watch: {
    clearScreen: false,
  },
};

function hashStaticAssets() {
  return {
    name: 'hash-static-assets',
    buildStart() {
      rimraf.sync(`${baseDir}`);
    },
    writeBundle() {
      posthtml([
        // Hashes `main.[hash].css` and `main.[hash].js`
        hash({ path: `${baseDir}`, hashLength: 8 }),

        // Minifies `${baseDir}/index.html`
        htmlnano(),
      ])
        .process(fs.readFileSync(`${baseDir}/index.html`))
        .then((result) =>
          fs.writeFileSync(`${baseDir}/index.html`, result.html)
        );
    },
  };
}
