import { CellCoordinate, MTTable } from "./table";

let FormulaParser = require("hot-formula-parser").Parser;

interface CalcResult {
  result: any;
  error: any;
}

// Formula parser wrapper.
export class TableParser {
  parser: typeof FormulaParser;
  table: MTTable;

  constructor(table: MTTable) {
    this.table = table;
    const self = this;
    this.parser = new FormulaParser();
    this.parser.on("callCellValue", (cellCoord: CellCoordinate, done: any) => {
      done(self.table.get(cellCoord));
    });
    this.parser.on(
      "callRangeValue",
      (
        startCellCoord: CellCoordinate,
        endCellCoord: CellCoordinate,
        done: any
      ) => {
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
            colFragment.push(self.table.getat(row, col));
          }
          fragment.push(colFragment);
        }
        done(fragment);
      }
    );
  }

  parse(frm: string): string {
    let res: CalcResult = this.parser.parse(frm);
    if (res.error == null) {
      return JSON.stringify(res.result);
    } else {
      return JSON.stringify(res.error);
    }
  }
}
