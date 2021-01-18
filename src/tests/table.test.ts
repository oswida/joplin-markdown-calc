import { MTTable } from "../lib/table";

const SAMPLE = `|A|B|C|
|--|--|--|
|1|2|3|
|4|5|6|
|7|8|9|
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

test("Check table parsing", () => {
  const table = new MTTable(2, 4);
  table.parse(SAMPLE.split("\n"));
  expect(table.rows.length).toBe(3);
  expect(table.rows[0].cells.length).toBe(3);
  expect(table.rows[1].cells.length).toBe(3);
  expect(table.rows[2].cells.length).toBe(3);
});
