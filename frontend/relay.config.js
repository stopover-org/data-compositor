module.exports = {
  src: "./src",
  language: "typescript", // "javascript" | "typescript" | "flow"
  schema: "../compositor/internal/graphql/schema.graphql",
  excludes: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
};
