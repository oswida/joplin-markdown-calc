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
      const value = self.table.get(cellCoord);
      done(value);
    });
    this.parser.on(
      "callRangeValue",
      (
        startCellCoord: CellCoordinate,
        endCellCoord: CellCoordinate,
        done: any
      ) => {
        const fragment = self.table.getfragment(startCellCoord, endCellCoord);
        done(fragment);
      }
    );
  }

  parse(frm: string): string {
    let res: CalcResult = this.parser.parse(frm);
    if (res.error == null) {
      return String(res.result);
    } else {
      return String(res.error);
    }
  }
}
