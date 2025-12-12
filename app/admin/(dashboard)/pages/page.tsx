import React from "react";

function Pages() {
  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Pages</h1>
        <p className="text-lg font-light text-secondary-foreground/70">
          Welcome to the pages management page. Here you can manage pages and
          their content.
        </p>
      </div>
      <div className="flex-1 min-h-0"></div>
    </div>
  );
}

export default Pages;
