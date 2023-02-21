# Joplin Markdown table calculations plugin

## NOTE: unfortunately, I'm not able to maintain this project anymore. There are couple of things which should be done (like moving it to newer formula library or better integration with the current Joplin API) but I won't be able to do it in any reasonable future. 

[Joplin editor](https://github.com/laurent22/joplin) plugin for making calculations in markdown tables. Inspired by an Emacs Org mode feature which allows to make TBLFM comments under the table and perform calculations.

> IMPORTANT: This plugin is not a spreadsheet emulator and I'm not able to mimic whole spreadsheet functionality. If you need specific behaviours, please use your favourite spreadsheet package instead.

## References/thanks

Big thanks to authors of two projects which are the calculation engine core:

- [Markdown-it](https://github.com/markdown-it/markdown-it) with the wonderful Markdown parser, I've used it to locate and extract table data in a Markdown document.
- [Hot formula parser](https://github.com/handsontable/formula-parser) - incredible useful library for evauating mathematical formulas.

## Features

- Define table formulas in Markdown files
- Recalculate all formulas in a file using custom command

## Usage: formula list

To define a set of table formulas, you can add a special HTML comment below a given Markdown table (TBLFM is a tribute to an Emacs Org mode :) . Only **the first comment directly under the table** will be taken into account.
You can use **TBLFM** or **TABLE_FORMULAS** strings to indicate formula list.

```markdown
| Column A | Column B | Column C |
| :------- | :------- | :------- |
| 123      | 456      | 789      |
| 0        | 0        | 0        |
<!--TBLFM C2=A1+A2; C1=56*78/4 -->
```

The comment can span multiple lines and contain multiple formulas separated by a semicolon. Formulas are calculated in the following order:  first row then all its columns fron the left to the right, second row ... etc. Table cells are described using spreadsheet notation, columns designated with letters like A,B,C .. Z (and even more AA, AB etc.) and rows with integers 1,2,3 ... You can also use range notation like `A1:E23`. Moreover, `hot-formula-parser` contains also a big set of predefined functions which can be used in formulas.
For list of the formula functions and their use, please look at: <https://formulajs.info/functions/>  (however, I didn't check all of them).

## Usage: inline cell formulas

There is also a possibility to define formulas directly inside the cell. To do so, you need to insert a special comment inside the cell content with **FM** or **FORMULA** indicator.

```markdown
| Column A | Column B | Column C         |
| :------- | :------- | :--------------- |
| 123      | 456      | 789              |
| 0        | 0        | <!--FM A1+C1 --> |
```

**WARNING! If you use both cases in the same table, inline cell formulas are overwritten by the formulas put into the list below the table!**

## Plugin command

The plugin registers `markdownCalculate` command and adds it to the editor toolbar (the `fa-square-root-alt` icon).

## Important Notes

1. WYSIWYG editor removes HTML comments, so you will loose formula definitions.
2. Table values are updated using internal `editor.setText` command, so you will be unable to undo changes.
3. Cell values are converted to float numbers. If conversion fail, the cell value will be returned as a string. However, you need to remember that strings like `7/18/2011 7:45:00 AM` will be properly parsed as float `7`. To use them as strings, they have to be written in double quote `"7/18/2011 7:45:00 AM"`.

## Building the plugin

To build the plugin, simply run `npm run dist`.
