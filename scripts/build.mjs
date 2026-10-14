import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { minify } from 'terser';

// Validates and bundles in one process, including restricted desktop runtimes.
const root = resolve(import.meta.dirname, '..');
const config = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: filename => filename,
    getCurrentDirectory: () => root,
    getNewLine: () => '\n',
  }));
  process.exit(1);
}
const cssPath = resolve(root, 'src/styles.css');
const tailwindPath = resolve(root, 'src/tailwind.css');
// The Vite plugin owns the same compiler/scanner used by the portable build.
const tailwindRequire = createRequire(import.meta.resolve('@tailwindcss/vite'));
const { compile } = await import(pathToFileURL(tailwindRequire.resolve('@tailwindcss/node')).href);
const { Scanner } = tailwindRequire('@tailwindcss/oxide');
const compiler = await compile(await readFile(tailwindPath, 'utf8'), {
  base: resolve(root, 'src'), onDependency() {},
});
const scanner = new Scanner({ sources: [{ base: resolve(root, 'src'), pattern: '**/*.{ts,tsx,html}', negated: false }] });
const utilityCss = compiler.build(scanner.scan());
const bundle = await rollup({
  input: resolve(root, 'src/main.tsx'),
  plugins: [
    {
      name: 'typescript-and-production',
      resolveId(source, importer) {
        if (source.startsWith('@/')) return this.resolve(resolve(root, 'src', source.slice(2)), importer, { skipSelf: true });
        return null;
      },
      load(id) { if (id.endsWith('.css')) return 'export default {};'; },
      transform(code, id) {
        if (id.endsWith('.tsx') || id.endsWith('.ts')) {
          return { code: ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, isolatedModules: true }, fileName: id }).outputText, map: null };
        }
        if (code.includes('process.env.NODE_ENV')) return { code: code.replaceAll('process.env.NODE_ENV', '"production"'), map: null };
        return null;
      },
    },
    nodeResolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'], browser: true }),
    commonjs(),
    {
      name: 'single-process-minify',
      async renderChunk(code) {
        const result = await minify(code, { module: true, compress: { passes: 2 }, format: { comments: /@license|^!/ }, sourceMap: { asObject: true } });
        if (!result.code) throw new Error('Não foi possível otimizar o JavaScript.');
        return { code: result.code, map: result.map };
      },
    },
  ],
  onwarn(warning, warn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) return;
    warn(warning);
  },
});
await mkdir(resolve(root, 'dist/assets'), { recursive: true });
await bundle.write({ dir: resolve(root, 'dist/assets'), entryFileNames: 'app.js', chunkFileNames: '[name]-[hash].js', format: 'es', sourcemap: true });
await bundle.close();
await cp(resolve(root, 'public'), resolve(root, 'dist'), { recursive: true });
await writeFile(resolve(root, 'dist/assets/app.css'), utilityCss + '\n' + await readFile(cssPath, 'utf8'));
let html = await readFile(resolve(root, 'index.html'), 'utf8');
html = html.replace('<script type="module" src="/src/main.tsx"></script>', '<script type="module" src="/assets/app.js"></script>');
html = html.replace('</head>', '    <link rel="stylesheet" href="/assets/app.css" />\n  </head>');
await writeFile(resolve(root, 'dist/index.html'), html);
console.log('Verificação TypeScript concluída. Site compilado em dist/.');
