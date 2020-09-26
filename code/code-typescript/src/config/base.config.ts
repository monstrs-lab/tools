export default {
  compilerOptions: {
    lib: ['dom', 'dom.iterable', 'esnext'],

    declaration: false,

    emitDecoratorMetadata: true,
    experimentalDecorators: true,

    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    importHelpers: false,
    isolatedModules: false,
    module: 'esnext',
    moduleResolution: 'node',
    noFallthroughCasesInSwitch: true,

    noImplicitAny: false,
    noImplicitReturns: false,
    noImplicitThis: false,

    noUnusedLocals: false,
    noUnusedParameters: false,

    pretty: true,
    removeComments: true,
    resolveJsonModule: true,

    strict: false,
    strictBindCallApply: false,
    strictFunctionTypes: false,
    strictNullChecks: false,
    strictPropertyInitialization: false,
    stripInternal: false,

    sourceMap: false,
    target: 'es2017',

    jsx: 'react',

    outDir: './dist',
  },
  exclude: ['node_modules', 'src/**/*.spec.ts', 'src/**/*.test.ts', '**/*/dist/**/*.d.ts'],
}
