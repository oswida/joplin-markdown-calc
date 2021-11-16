import MarkdownIt = require("markdown-it");
import { TableParser } from "./parser";
import { MTTable } from "./table";

// Markdown table formula calculator.
export class TableCalculator {
  tables: MTTable[] = [];
  tblpos: { [id: number]: MTTable } = {};

  // Prepare tables and formulas
  prepareTables(body: string): string[] {
    const md = new MarkdownIt({ html: true });
    const data = md.parse(body, {});
    const body_lines = body.split("\n");
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === "tbody_open") {
        // end line in a map points to the line AFTER the table
        this.addTable(data[i].map[0], data[i].map[1] - 1, body_lines);
      } else if (data[i].type === "html_block") {
        this.checkFormulaList(data[i].map[0], data[i].content);
      } else if (data[i].type === "fence" && data[i].tag === "code") {
        // parse table inside code block (no recursion)
        const block_data = md.parse(data[i].content, {});
        for (let j = 0; j < block_data.length; j++) {
          if (block_data[j].type === "tbody_open") {
            this.addTable(
              data[i].map[0] + block_data[j].map[0] + 1,
              data[i].map[0] + block_data[j].map[1],
              body_lines
            );
          } else if (block_data[j].type === "html_block") {
            this.checkFormulaList(
              data[i].map[0] + block_data[j].map[0] + 1,
              block_data[j].content
            );
          }
        }
      }
    }
    return body_lines;
  }

  // Add a table for processing.
  addTable(sline: number, eline: number, body: string[]) {
    const table = new MTTable(sline, eline);
    this.tables.push(table);
    this.tblpos[eline] = table;
    table.parse(body);
  }

  // Execute calculations.
  execute(body: string[]) {
    for (let i = 0; i < this.tables.length; i++) {
      this.processTable(this.tables[i], body);
    }
  }

  // Process a single table and update note body.
  processTable(table: MTTable, body: string[]) {
    const parser = new TableParser(table);
    for (let r = 0; r < table.rows.length; r++) {
      for (let c = 0; c < table.rows[r].cells.length; c++) {
        const cell = table.rows[r].cells[c];
        if (cell.formula) {
          cell.value = parser.parse(cell.formula);
        }
      }
    }
    table.update(body);
  }

  // Check if a comment can be a formula list.
  // If positive - parse the comment.
  // Formula comment has to be placed at the next line after the table.
  checkFormulaList(line: number, data: string) {
    const table = this.tblpos[line - 1];
    if (table) {
      table.parseList(data);
    }
  }
}
