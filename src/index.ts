import joplin from "api";
import { ToolbarButtonLocation } from "api/types";
import MarkdownIt = require("markdown-it");
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
      const md = new MarkdownIt({ html: true });
      const data = md.parse(note.body, {});
      const body_lines = (note.body as string).split("\n");
      const calc = new TableCalculator();
      for (let i = 0; i < data.length; i++) {
        if (data[i].type === "tbody_open") {
          // end line in a map points to the line AFTER the table
          calc.addTable(data[i].map[0], data[i].map[1] - 1, body_lines);
        } else if (data[i].type === "html_block") {
          calc.checkFormulaList(data[i].map[0], data[i].content);
        }
      }
      // Execute calculations
      calc.execute(body_lines);
      // update note body
      await joplin.commands.execute("editor.setText", body_lines.join("\n"));
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
