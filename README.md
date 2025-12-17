# remark-extract-toc

![npm](https://img.shields.io/npm/v/remark-extract-toc) ![npm](https://img.shields.io/npm/dw/remark-extract-toc) ![check](https://github.com/inokawa/remark-extract-toc/workflows/check/badge.svg)

[remark](https://github.com/remarkjs/remark) plugin to store table of contents.

This plugin extracts only `Heading` from [mdast](https://github.com/syntax-tree/mdast) markdown, then converts them to a nested object tree keeping the depth.

## Install

```
npm install remark-extract-toc
```

## Usage

```javascript
import unified from "unified";
import markdown from "remark-parse";
import extractToc from "remark-extract-toc";

import * as fs from "fs";
const text = fs.readFileSync("example.md", "utf8");

const processor = unified().use(markdown).use(extractToc);

const res = processor.processSync(text);
console.log(res.result);
```

This `example.md`

```
# Alpha

aaaa

## Bravo

bbbb

### Charlie

cccc

## Delta

dddd
```

will be converted by this library like...

```
[
  {
    depth: 1,
    value: "Alpha",
    children: [
      {
        depth: 2,
        value: "Bravo",
        children: [{ depth: 3, value: "Charlie", children: [] }],
      },
      {
        depth: 2,
        value: "Delta",
        children: [],
      },
    ],
  },
]
```

## Documentation

- [API reference](./docs/API.md)

# License

MIT
