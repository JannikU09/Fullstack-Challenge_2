import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        setupFiles: ["./vitest.setup.ts"],
        clearMocks: true,
        coverage: {
            provider: 'v8',
            clean: true,
            cleanOnRerun: true,
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: './.vitest/coverage',
        },
        reporters: ["default"],
        outputFile: {
            html: './.vitest/html/index.html', // wird nur genutzt, wenn der html-Reporter aktiv ist
        },
    },
});
