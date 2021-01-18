# Joplin Markdown table calculations plugin

[Joplin editor](https://github.com/laurent22/joplin) plugin for making calculations in markdown tables. Inspired by an Emacs Org mode feature which allows to make TBLFM comments under the table and perform calculations.

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
|:---------|:---------|:---------|
| 123      | 456      | 789      |
| 0        | 0        | 0        |
<!--TBLFM C2=A1+A2; C1=56*78/4 -->
```
The comment can span multiple lines and contain multiple formulas separated by a semicolon. Formulas are calculated in the following order:  first row then all its columns fron the left to the right, second row ... etc. Table cells are described using spreadsheet notation, columns designated with letters like A,B,C .. Z (and even more AA, AB etc.) and rows with integers 1,2,3 ... You can also use range notation like `A1:E23`. Moreover, `hot-formula-parser` contains also a big set of predefined functions which can be used in formulas. The list of these functions (taken by SUPPORTED_FORMULAS function) looks like this (however, I didn't check all of them)

```
- ABS,ACCRINT,ACOS,ACOSH,ACOT,ACOTH,ADD,AGGREGATE,AND,ARABIC,ARGS2ARRAY,ASIN,ASINH,ATAN,ATAN2,ATANH,AVEDEV,AVERAGE,AVERAGEA,AVERAGEIF,AVERAGEIFS,
- BASE,BESSELI,BESSELJ,BESSELK,BESSELY,BETA.DIST,BETA.INV,BETADIST,BETAINV,BIN2DEC,BIN2HEX,BIN2OCT,BINOM.DIST,BINOM.DIST.RANGE,BINOM.INV,BINOMDIST,BITAND,BITLSHIFT,BITOR,BITRSHIFT,BITXOR,
- CEILING,CEILINGMATH,CEILINGPRECISE,CHAR,CHISQ.DIST,CHISQ.DIST.RT,CHISQ.INV,CHISQ.INV.RT,CHOOSE,CHOOSE,CLEAN,CODE,COLUMN,COLUMNS,COMBIN,COMBINA,COMPLEX,CONCATENATE,CONFIDENCE,CONFIDENCE.NORM,CONFIDENCE.T,CONVERT,CORREL,COS,COSH,COT,COTH,COUNT,COUNTA,COUNTBLANK,COUNTIF,COUNTIFS,COUNTIN,COUNTUNIQUE,COVARIANCE.P,COVARIANCE.S,CSC,CSCH,CUMIPMT,CUMPRINC,
- DATE,DATEVALUE,DAY,DAYS,DAYS360,DB,DDB,DEC2BIN,DEC2HEX,DEC2OCT,DECIMAL,DEGREES,DELTA,DEVSQ,DIVIDE,DOLLAR,DOLLARDE,DOLLARFR,
- E,EDATE,EFFECT,EOMONTH,EQ,ERF,ERFC,EVEN,EXACT,EXP,EXPON.DIST,EXPONDIST,
- F.DIST,F.DIST.RT,F.INV,F.INV.RT,FACT,FACTDOUBLE,FALSE,FDIST,FDISTRT,FIND,FINV,FINVRT,FISHER,FISHERINV,FIXED,FLATTEN,FLOOR,FORECAST,FREQUENCY,FV,FVSCHEDULE,
- GAMMA,GAMMA.DIST,GAMMA.INV,GAMMADIST,GAMMAINV,GAMMALN,GAMMALN.PRECISE,GAUSS,GCD,GEOMEAN,GESTEP,GROWTH,GTE,
- HARMEAN,HEX2BIN,HEX2DEC,HEX2OCT,HOUR,HTML2TEXT,HYPGEOM.DIST,HYPGEOMDIST,
- IF,IMABS,IMAGINARY,IMARGUMENT,IMCONJUGATE,IMCOS,IMCOSH,IMCOT,IMCSC,IMCSCH,IMDIV,IMEXP,IMLN,IMLOG10,IMLOG2,IMPOWER,IMPRODUCT,IMREAL,IMSEC,IMSECH,IMSIN,IMSINH,IMSQRT,IMSUB,IMSUM,IMTAN,INT,INTERCEPT,INTERVAL,IPMT,IRR,ISBINARY,ISBLANK,ISEVEN,ISLOGICAL,ISNONTEXT,ISNUMBER,ISODD,ISODD,ISOWEEKNUM,ISPMT,ISTEXT,
- JOIN,
- KURT,
- LARGE,LCM,LEFT,LEN,LINEST,LN,LOG,LOG10,LOGEST,LOGNORM.DIST,LOGNORM.INV,LOGNORMDIST,LOGNORMINV,LOWER,LT,LTE,
- MATCH,MAX,MAXA,MEDIAN,MID,MIN,MINA,MINUS,MINUTE,MIRR,MOD,MODE.MULT,MODE.SNGL,MODEMULT,MODESNGL,MONTH,MROUND,MULTINOMIAL,MULTIPLY,
- NE,NEGBINOM.DIST,NEGBINOMDIST,NETWORKDAYS,NOMINAL,NORM.DIST,NORM.INV,NORM.S.DIST,NORM.S.INV,NORMDIST,NORMINV,NORMSDIST,NORMSINV,NOT,NOW,NPER,NPV,NUMBERS,NUMERAL,
- OCT2BIN,OCT2DEC,OCT2HEX,ODD,OR,
- PDURATION,PEARSON,PERCENTILEEXC,PERCENTILEINC,PERCENTRANKEXC,PERCENTRANKINC,PERMUT,PERMUTATIONA,PHI,PI,PMT,POISSON.DIST,POISSONDIST,POW,POWER,PPMT,PROB,PRODUCT,PROPER,PV,
- QUARTILE.EXC,QUARTILE.INC,QUARTILEEXC,QUARTILEINC,QUOTIENT,
- RADIANS,RAND,RANDBETWEEN,RANK.AVG,RANK.EQ,RANKAVG,RANKEQ,RATE,REFERENCE,REGEXEXTRACT,REGEXMATCH REGEXREPLACE,REPLACE,REPT,RIGHT,ROMAN,ROUND,ROUNDDOWN,ROUNDUP,ROW,ROWS,RRI,RSQ,
- SEARCH,SEC,SECH,SECOND,SERIESSUM,SIGN,SIN,SINH,SKEW,SKEW.P,SKEWP,SLN,SLOPE,SMALL,SPLIT,SPLIT,SQRT,SQRTPI,STANDARDIZE,STDEV.P,STDEV.S,STDEVA,STDEVP,STDEVPA,STDEVS,STEYX,SUBSTITUTE,SUBTOTAL,SUM,SUMIF,SUMIFS,SUMPRODUCT,SUMSQ,SUMX2MY2,SUMX2PY2,SUMXMY2,SWITCH,SYD,
- T,T.DIST,T.DIST.2T,T.DIST.RT,T.INV,T.INV.2T,TAN,TANH,TBILLEQ,TBILLPRICE,TBILLYIELD,TDIST,TDIST2T,TDISTRT,TEXT,TIME,TIMEVALUE,TINV,TINV2T,TODAY,TRANSPOSE,TREND,TRIM,TRIMMEAN,TRUE,TRUNC,
- UNICHAR,UNICODE,UNIQUE,UPPER,
- VALUE,VAR.P,VAR.S,VARA,VARP,VARPA,VARS,
- WEEKDAY,WEEKNUM,WEIBULL.DIST WEIBULLDIST,WORKDAY,
- XIRR,XNPV,XOR,
- YEAR,YEARFRAC
```

## Usage: inline cell formulas
There is also a possibility to define formulas directly inside the cell. To do so, you need to insert a special comment inside the cell content with **FM** or **FORMULA** indicator.

```markdown
| Column A | Column B |    Column C     |
|:---------|:---------|:----------------|
| 123      | 456      | 789             |
| 0        | 0        | <!--FM A1+C1 -->|
```

**WARNING! If you use both cases in the same table, inline cell formulas are overwritten by the formulas put into the list below the table!**

## Plugin command
The plugin registers `markdownCalculate` command and adds it to the editor toolbar (the `fa-square-root-alt` icon).

## Notes
WARNING! WYSIWYG editor removes HTML comments, so you will loose formula definitions.
WARNING 2! Table values are updated using internal `editor.setText` command, so you will be unable to undo changes.

## Building the plugin

To build the plugin, simply run `npm run dist`.
