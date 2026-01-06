module.exports = function (plop) {
  plop.setGenerator("component", {
    description: "Create a new CMS component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (e.g. Hero Section)",
      },
      {
        type: "list",
        name: "category",
        message: "Select the component category",
        choices: ["Layout", "Typography", "Elements", "Sections", "Items"],
      },
    ],
    actions: function (data) {
      const actions = [
        {
          type: "add",
          path: "components/registry/{{kebabCase category}}/{{kebabCase name}}/index.tsx",
          templateFile: "templates/CMSComponent.hbs",
        },
        {
          type: "modify",
          path: "components/registry/index.ts",
          pattern: /\/\/ -- PLOP IMPORTS HERE --/,
          template: `import { {{pascalCase name}} } from "@/components/registry/{{kebabCase category}}/{{kebabCase name}}";\n// -- PLOP IMPORTS HERE --`,
        },
        {
          type: "modify",
          path: "components/registry/index.ts",
          pattern: /\/\/ -- PLOP REGISTRY HERE --/,
          template: `[{{pascalCase name}}.id]: {{pascalCase name}},\n  // -- PLOP REGISTRY HERE --`,
        },
      ];

      const categoryUpper = data.category.toUpperCase();

      actions.push({
        type: "modify",
        path: "components/registry/index.ts",
        pattern: new RegExp(`// -- PLOP ${categoryUpper} HERE --`),
        template: `{{pascalCase name}}.id,\n      // -- PLOP ${categoryUpper} HERE --`,
      });

      return actions;
    },
  });
};
