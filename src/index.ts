import joplin from "api";
import { ToolbarButtonLocation } from "api/types";
import MarkdownIt = require("markdown-it");
import { TableCalculator } from "./calc";

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
      const data = md.parse(note.body, null);
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
      // TODO: have a problem with selecting the whole text
      // await joplin.commands.execute("textSelectAll");
      await joplin.data.put(["notes", note.id], null, {
        body: body_lines.join("\n"),
      });
      // TODO: should work assuming I'll be able to run the command above
      // await joplin.commands.execute("replaceSelection", body_lines.join("\n"));
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
      "markdownCalculate",
      ToolbarButtonLocation.EditorToolbar
    );
  },
});
