import { TableParser } from "./parser";
import { MTTable } from "./table";

// Markdown table formula calculator.
export class TableCalculator {
  tables: MTTable[] = [];
  tblpos: { [id: number]: MTTable } = {};

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
