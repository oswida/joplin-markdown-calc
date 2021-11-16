import joplin from "api";
import { ToolbarButtonLocation } from "api/types";
import { TableCalculator } from "./lib/calc";

// Register plugin
joplin.plugins.register({
  onStart: async function () {
    async function calculate() {
      const note = await joplin.workspace.selectedNote();
      if (!note) {
        alert("Please select a note.");
        return;
      }
      const calc = new TableCalculator();
      // Fetch tables
      const body_lines = calc.prepareTables(note.body as string);
      // Execute calculations
      calc.execute(body_lines);
      // update note body
      const newBody = body_lines.join("\n");
      await joplin.commands.execute("editor.setText", newBody);
      await joplin.data.put(["notes", note.id], null, { body: newBody });
      await joplin.commands.execute("editor.focus");
    }

    // Register new command
    await joplin.commands.register({
      name: "markdownCalculate",
      label: "Calculate table formulas",
      iconName: "fas fa-square-root-alt",
      execute: async () => {
        await calculate();
      },
    });

    joplin.views.toolbarButtons.create(
      "markdownCalculateBtn",
      "markdownCalculate",
      ToolbarButtonLocation.EditorToolbar
    );
  },
});
