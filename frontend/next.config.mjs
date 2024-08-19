/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        relay: {
            src: "./src",
            language: "typescript", // "javascript" | "typescript" | "flow"
            schema: "../data-compositor-service/internal/graphql/schema.graphql",
            excludes: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
        },
    },
};

export default nextConfig;
