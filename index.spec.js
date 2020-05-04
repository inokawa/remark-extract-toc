const unified = require("unified");
const markdown = require("remark-parse");
const toc = require("./");

const processor = unified().use(markdown, { commonmark: true }).use(toc);

describe("test", () => {
  it("no headings", () => {
    const node = processor.parse(
      `aaaa

bbbb

cccc

dddd
`
    );
    return processor.run(node).then((res) => {
      expect(res).toEqual([]);
    });
  });

  it("1232", () => {
    const node = processor.parse(
      `# Alpha

aaaa

## Bravo

bbbb

### Charlie

cccc

## Delta

dddd
`
    );
    return processor.run(node).then((res) => {
      expect(res).toEqual([
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
      ]);
    });
  });

  it("1232(has same heading)", () => {
    const node = processor.parse(
      `# Alpha

  aaaa

  ## Alpha

  bbbb

  ### Alpha

  cccc

  ## Delta

  dddd
  `
    );
    return processor.run(node).then((res) => {
      expect(res).toEqual([
        {
          depth: 1,
          value: "Alpha",
          children: [
            {
              depth: 2,
              value: "Alpha",
              children: [{ depth: 3, value: "Alpha", children: [] }],
            },
            {
              depth: 2,
              value: "Delta",
              children: [],
            },
          ],
        },
      ]);
    });
  });

  it("1232", () => {
    const node = processor.parse(
      `# Alpha

aaaa

## Bravo

bbbb

### Charlie

cccc

## Delta

dddd
`
    );
    return processor.run(node).then((res) => {
      expect(res).toEqual([
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
      ]);
    });
  });

  it("123456", () => {
    const node = processor.parse(
      `# 1

  aaaa

  ## 2

  bbbb

  ### 3

  cccc

  #### 4

  dddd

  ##### 5

  eeee

  ###### 6

  ffff
  `
    );
    return processor.run(node).then((res) => {
      expect(res).toEqual([
        {
          depth: 1,
          value: "1",
          children: [
            {
              depth: 2,
              value: "2",
              children: [
                {
                  depth: 3,
                  value: "3",
                  children: [
                    {
                      depth: 4,
                      value: "4",
                      children: [
                        {
                          depth: 5,
                          value: "5",
                          children: [{ depth: 6, value: "6", children: [] }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  it("1232312323", () => {
    const node = processor.parse(
      `# a

## b

### c

## d

### e

# f

## g

### h

## i

### j
`
    );
    return processor.run(node).then((res) => {
      expect(res).toEqual([
        {
          depth: 1,
          value: "a",
          children: [
            {
              depth: 2,
              value: "b",
              children: [{ depth: 3, value: "c", children: [] }],
            },
            {
              depth: 2,
              value: "d",
              children: [{ depth: 3, value: "e", children: [] }],
            },
          ],
        },
        {
          depth: 1,
          value: "f",
          children: [
            {
              depth: 2,
              value: "g",
              children: [{ depth: 3, value: "h", children: [] }],
            },
            {
              depth: 2,
              value: "i",
              children: [{ depth: 3, value: "j", children: [] }],
            },
          ],
        },
      ]);
    });
  });

  it("1222", () => {
    const node = processor.parse(
      `# Alpha

aaaa

## Bravo

bbbb

## Charlie

cccc

## Delta

dddd
`
    );
    return processor.run(node).then((res) => {
      expect(res).toEqual([
        {
          depth: 1,
          value: "Alpha",
          children: [
            {
              depth: 2,
              value: "Bravo",
              children: [],
            },
            { depth: 2, value: "Charlie", children: [] },
            {
              depth: 2,
              value: "Delta",
              children: [],
            },
          ],
        },
      ]);
    });
  });

  it("2534", () => {
    const node = processor.parse(
      `## Alpha

aaaa

##### Bravo

bbbb

### Charlie

cccc

#### Delta

dddd
`
    );
    return processor.run(node).then((res) => {
      expect(res).toEqual([
        {
          depth: 2,
          value: "Alpha",
          children: [
            {
              depth: 5,
              value: "Bravo",
              children: [],
            },
            {
              depth: 3,
              value: "Charlie",
              children: [
                {
                  depth: 4,
                  value: "Delta",
                  children: [],
                },
              ],
            },
          ],
        },
      ]);
    });
  });
});
