import { MTTable } from "../lib/table";
import MarkdownIt = require("markdown-it");
import { TableCalculator } from "../lib/calc";
import { TableParser } from "src/lib/parser";

const SAMPLE3 = `|A|B|C|
|--|--|--|
|1|2|3|
|4|5|6|
|7|8|9|
<!--TBLFM B3=A1+A2;C3=C1*A3 -->

Some text which is not important
|D|E|F|
|--|--|--|
|10|20|30|
|40|0|60|
|70|80|90|
|100|110|120|
<!--TBLFM B2=A1+A2;C3=C1*A3-->
`;

const SAMPLE4 = `|A|B|C|
|--|--|--|
|1|2|3|
|4|5|6|
|7|8|9|
<!--TBLFM B3=A1+A2;C3=B3*A3 -->

Some text which is not important
|D|E|F|
|--|--|--|
|10|20|30|
|40|0|60|
|70|80|90|
|100|110|120|
<!--TBLFM B2=C3+A2;C3=C1*A3-->
`;

const SAMPLE5 = `|A|B|C|
|--|--|--|
|<!--FM B2-B3 -->|2|3|
|4|5|6|
|7|8|<!--FM C1/C2-->|
`;

const SAMPLE6 = `|A|B|C|
|--|--|--|
|<!--FM B2-B3 -->|2|3|
|4|5|6|
|7|8|<!--FM C1/C2-->|
<!--TBLFM B2=A1+A2;C3=C1*A3-->
`;

const SAMPLE7 = `|A|B|C|
|--|--|--|
|1|2|3|
|4|5|6|
|7|8|9|
<!--TBLFM C3=SUM(A1:A3);B3=AVERAGE(A1:B3) -->
`;

const calcSample = (text: string): [TableCalculator, string[]] => {
  const md = new MarkdownIt({ html: true });
  const data = md.parse(text, null);
  const body_lines = text.split("\n");
  const calc = new TableCalculator();
  for (let i = 0; i < data.length; i++) {
    if (data[i].type === "tbody_open") {
      // end line in a map points to the line AFTER the table
      calc.addTable(data[i].map[0], data[i].map[1] - 1, body_lines);
    } else if (data[i].type === "html_block") {
      calc.checkFormulaList(data[i].map[0], data[i].content);
    }
  }
  calc.execute(body_lines);
  return [calc, body_lines];
};

test("Table formula computing", () => {
  const [calc, body_lines] = calcSample(SAMPLE3);

  const table = new MTTable(2, 4);
  table.parse(body_lines);
  expect(table.rows.length).toBe(3);
  expect(table.findCell("A3").value).toBe("7");
  expect(table.findCell("B3").value).toBe("5");
  expect(table.findCell("C3").value).toBe("21");

  const table2 = new MTTable(10, 13);
  table2.parse(body_lines);
  expect(table2.rows.length).toBe(4);
  expect(table2.findCell("C1").value).toBe("30");
  expect(table2.findCell("C2").value).toBe("60");
  expect(table2.findCell("C3").value).toBe("2100");
  expect(table2.findCell("B2").value).toBe("50");
});

test("Calculation order", () => {
  const [calc, body_lines] = calcSample(SAMPLE4);

  const table = new MTTable(2, 4);
  table.parse(body_lines);
  expect(table.rows.length).toBe(3);
  expect(table.findCell("A3").value).toBe("7");
  expect(table.findCell("B3").value).toBe("5");
  expect(table.findCell("C3").value).toBe("35");

  const table2 = new MTTable(10, 13);
  table2.parse(body_lines);
  expect(table2.rows.length).toBe(4);
  expect(table2.findCell("C1").value).toBe("30");
  expect(table2.findCell("C2").value).toBe("60");
  expect(table2.findCell("C3").value).toBe("2100");
  expect(table2.findCell("B2").value).toBe("130");
});

test("Cell formula calculation", () => {
  const [calc, body_lines] = calcSample(SAMPLE5);
  const table = new MTTable(2, 4);
  table.parse(body_lines);

  const a1 = table.findCell("A1");
  expect(a1.value).toBe("-3");
  expect(a1.formula).toBe("B2-B3");
  expect(a1.formulaPrefix).toBe("FM");
  const c3 = table.findCell("C3");
  expect(c3.value).toBe("0.5");
  expect(c3.formula).toBe("C1/C2");
  expect(c3.formulaPrefix).toBe("FM");
});

test("Cell and table formula calculation order", () => {
  const [calc, body_lines] = calcSample(SAMPLE6);
  const table = new MTTable(2, 4);
  table.parse(body_lines);

  const a1 = table.findCell("A1");
  expect(a1.value).toBe("-3");
  expect(a1.formula).toBe("B2-B3");
  expect(a1.formulaPrefix).toBe("FM");
  const c3 = table.findCell("C3");
  // Table formulas overwrite cell formulas
  // Cell formula has been replaced by the table one
  expect(c3.value).toBe("21");
  expect(c3.formula).toBe(null);
  expect(c3.formulaPrefix).toBe(null);

  const b2 = table.findCell("B2");
  expect(b2.value).toBe("1");
});

test("Formula functions and ranges", () => {
  const [calc, body_lines] = calcSample(SAMPLE7);
  const table = new MTTable(2, 4);
  table.parse(body_lines);

  const c3 = table.findCell("C3");
  expect(c3.value).toBe("12");
  const b3 = table.findCell("B3");
  expect(b3.value).toBe("4.5");
});
