import { MTTable } from "../lib/table";

const SAMPLE = `|A|B|C|
|--|--|--|
|1|2|3|
|4|5|6|
|7|8|9|
`;

const SAMPLE2 = `|A|B|C|
|--|--|--|
|1|2|3|
|4|5|6|
|7|8|9|

Some text which is not important
|D|E|F|
|--|--|--|
|10|20|30|
|40|50|60|
|70|80|90|
|100|110|120|
`;

test("Find cell by label", () => {
  const table = new MTTable(2, 4);
  table.parse(SAMPLE.split("\n"));
  let cell = table.findCell("A1");
  expect(cell.value).toBe("1");
  cell = table.findCell("B2");
  expect(cell.value).toBe("5");
  cell = table.findCell("C3");
  expect(cell.value).toBe("9");
});

test("Table parsing", () => {
  const table = new MTTable(2, 4);
  table.parse(SAMPLE.split("\n"));
  expect(table.rows.length).toBe(3);
  expect(table.rows[0].cells.length).toBe(3);
  expect(table.rows[1].cells.length).toBe(3);
  expect(table.rows[2].cells.length).toBe(3);
  expect(table.findCell("A3").value).toBe("7");
  expect(table.findCell("B3").value).toBe("8");
  expect(table.findCell("C3").value).toBe("9");
});

test("Multiple tables parsing", () => {
  const table = new MTTable(2, 4);
  table.parse(SAMPLE2.split("\n"));
  expect(table.rows.length).toBe(3);
  expect(table.findCell("A3").value).toBe("7");
  expect(table.findCell("B3").value).toBe("8");
  expect(table.findCell("C3").value).toBe("9");
  const table2 = new MTTable(9, 12);
  table2.parse(SAMPLE2.split("\n"));
  expect(table2.rows.length).toBe(4);
  expect(table2.findCell("C1").value).toBe("30");
  expect(table2.findCell("C2").value).toBe("60");
  expect(table2.findCell("C3").value).toBe("90");
  expect(table2.findCell("C4").value).toBe("120");
});

test("Cell range parsing", () => {
  const table = new MTTable(9, 12);
  table.parse(SAMPLE2.split("\n"));
  const fragment = table.getfragment(
    table.cellCoordinate("A1"),
    table.cellCoordinate("B3")
  );
  // 3 rows, 2 columns each
  expect(fragment.length).toBe(3);
  expect(fragment[0].length).toBe(2);
  expect(fragment[1].length).toBe(2);
  expect(fragment[2].length).toBe(2);
  expect(fragment[0][0]).toBe(10);
  expect(fragment[0][1]).toBe(20);
  expect(fragment[1][0]).toBe(40);
  expect(fragment[1][1]).toBe(50);
  expect(fragment[2][0]).toBe(70);
  expect(fragment[2][1]).toBe(80);
});
