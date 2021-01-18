import Token = require("markdown-it/lib/token");
import { extractLabel } from "hot-formula-parser";

export const CELL_DELIMITER = "|";
export const FORMULA_REGEXP: RegExp = /(.*)<!--(FM|FORMULA) (.*)-->(.*)/g;
export const FORMULA_LIST_REGEXP: RegExp = /<!--(TBLFM|TABLE_FORMULAS) (.*)-->/g;
export const FORMULA_SEP = ";";

// Cell coordinate type used by a parser
export interface Coordinate {
  index: number;
  label: string;
  isAbsolute: boolean;
}

export interface CellCoordinate {
  label: string;
  row: Coordinate;
  column: Coordinate;
}

// Markdown table cell
export interface MTCell {
  value: string; // cell value
  formula: string | null; // formula inside the cell
  formulaPrefix: string | null; // only for replace purposes
}

// Markdown table row
export class MTRow {
  cells: MTCell[] = [];

  parse(data: string, line: number) {
    const parts = data.split(CELL_DELIMITER);
    for (let i = 1; i < parts.length - 1; i++) {
      let cvalue = parts[i];
      let frm = null;
      let frmpx = null;
      FORMULA_REGEXP.lastIndex = 0; // reset if reuse
      // find formula
      const rx = FORMULA_REGEXP.exec(parts[i]);
      if (rx && rx.length == 5) {
        frm = rx[3].trim();
        cvalue = "";
        // Only one value present is taken into consideration
        if (rx[1].trim() != "") {
          cvalue = rx[1].trim();
        } else if (rx[4].trim() != "") {
          cvalue = rx[4].trim();
        }
        frmpx = rx[2];
      }
      this.cells.push(<MTCell>{
        value: cvalue,
        formula: frm,
        formulaPrefix: frmpx,
      });
    }
  }

  // Serialize to markdown text.
  serialize() {
    const values = this.cells.map((it) => {
      if (it.formula && it.formulaPrefix) {
        return `<!--${it.formulaPrefix} ${it.formula}--> ${it.value}`;
      } else {
        return it.value;
      }
    });
    return CELL_DELIMITER + values.join(CELL_DELIMITER) + CELL_DELIMITER;
  }
}

// Markdown table
export class MTTable {
  rows: MTRow[] = [];
  startLine: number;
  endLine: number;

  // Only table body lines are taken into account
  constructor(sline: number, eline: number) {
    this.startLine = sline;
    this.endLine = eline;
  }

  // Parse table rows from the whole note data
  parse(data: string[]) {
    for (let i = this.startLine; i <= this.endLine; i++) {
      const row = new MTRow();
      row.parse(data[i], this.startLine + i);
      this.rows.push(row);
    }
  }

  // Parse formulas taken from a comment below the table.
  // WARNING: formula list definitions override inline cell formulas!
  parseList(comment: string) {
    FORMULA_LIST_REGEXP.lastIndex = 0; // reset regex before reuse
    const rx = FORMULA_LIST_REGEXP.exec(comment);
    if (rx && rx.length == 3) {
      const flist = rx[2].split(FORMULA_SEP);
      flist.forEach((f: string) => {
        const parts = f.split("=");
        if (parts && parts.length == 2) {
          const cell = this.findCell(parts[0]);
          if (cell) {
            cell.formula = parts[1];
            cell.formulaPrefix = null;
          }
        }
      });
    }
  }

  // Find cell with a given label.
  findCell(id: string): MTCell | null {
    const coords = extractLabel(id) as Coordinate[];
    const rowidx = coords[0].index;
    const colidx = coords[1].index;
    if ((rowidx as number) >= this.rows.length) {
      return null;
    }
    const row = this.rows[rowidx];
    if ((colidx as number) >= row.cells.length) {
      return null;
    }
    return row.cells[colidx];
  }

  // Find cell with a given label and return CellCoordinate.
  cellCoordinate(id: string): CellCoordinate {
    const coords = extractLabel(id) as Coordinate[];
    return { row: coords[0], column: coords[1], label: id } as CellCoordinate;
  }

  // Get data from a given coordinate, convert to number
  get(coord: CellCoordinate): number {
    const rowidx = coord.row.index;
    const colidx = coord.column.index;
    const value = Number.parseFloat(this.getat(rowidx, colidx));
    return value;
  }

  getfragment(
    startCellCoord: CellCoordinate,
    endCellCoord: CellCoordinate
  ): string[] {
    let fragment = [];
    for (
      var row = startCellCoord.row.index;
      row <= endCellCoord.row.index;
      row++
    ) {
      var colFragment = [];

      for (
        var col = startCellCoord.column.index;
        col <= endCellCoord.column.index;
        col++
      ) {
        const value = Number.parseFloat(this.getat(row, col));
        colFragment.push(value);
      }
      fragment.push(colFragment);
    }
    return fragment;
  }

  getat(row: number, column: number): string {
    // TODO: input validation
    return this.rows[row].cells[column].value;
  }

  // Update text lines with a calculated data.
  update(data: string[]) {
    for (let i = 0; i < this.rows.length; i++) {
      data[this.startLine + i] = this.rows[i].serialize();
    }
  }
}
