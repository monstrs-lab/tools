export default {
  compilerOptions: {
    // Type Checking
    strict: true,
    noImplicitAny: true,
    noImplicitReturns: true,
    noImplicitThis: true,
    noImplicitOverride: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
    skipLibCheck: true,

    // Modules
    moduleResolution: 'nodenext',
    resolveJsonModule: true,
    module: 'nodenext',

    // Emit
    declaration: false,
    importHelpers: false,
    removeComments: true,
    sourceMap: false,
    outDir: './dist',

    // Interop Constraints
    esModuleInterop: true,
    isolatedModules: false,
    forceConsistentCasingInFileNames: true,

    // Language and Environment
    lib: ['dom', 'dom.iterable', 'esnext'],
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    target: 'es2021',
    jsx: 'react',

    // Output Formatting
    pretty: true,
  },
  exclude: [
    '**/*/next-env.d.ts',
    'integration',
    'node_modules',
    'src/**/*.spec.ts',
    'src/**/*.test.ts',
    'src/**/*.story.ts',
    'src/**/*.stories.ts',
    '**/*/dist/**/*.ts',
    '**/*/dist/**/*.d.ts',
    'integration/**/*.test.ts',
  ],
}
