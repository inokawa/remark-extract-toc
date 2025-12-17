import { describe, expect, it } from "vitest";
import { unified } from "unified";
import markdown from "remark-parse";
import toc from ".";

const processor = unified().use(markdown).use(toc);

describe("test", () => {
  it("no headings", async () => {
    const res = await processor.process(
      `aaaa

bbbb

cccc

dddd
`,
    );
    expect(res.result).toEqual([]);
  });

  it("1232", async () => {
    const res = await processor.process(
      `# Alpha

aaaa

## Bravo

bbbb

### Charlie

cccc

## Delta

dddd
`,
    );
    expect(res.result).toEqual([
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

  it("1232(flatten)", async () => {
    const processor = unified().use(markdown).use(toc, { flatten: true });
    const res = await processor.process(
      `# Alpha

aaaa

## Bravo

bbbb

### Charlie

cccc

## Delta

dddd
`,
    );
    expect(res.result).toEqual([
      {
        depth: 1,
        value: "Alpha",
        children: [],
      },
      {
        depth: 2,
        value: "Bravo",
        children: [],
      },
      { depth: 3, value: "Charlie", children: [] },
      {
        depth: 2,
        value: "Delta",
        children: [],
      },
    ]);
  });

  it("1232(with additional key)", async () => {
    const processor = unified()
      .use(markdown)
      .use(toc, { keys: ["type"] });
    const res = await processor.process(
      `# Alpha

aaaa

## Bravo

bbbb

### Charlie

cccc

## Delta

dddd
`,
    );
    expect(res.result).toEqual([
      {
        depth: 1,
        value: "Alpha",
        type: "heading",
        children: [
          {
            depth: 2,
            value: "Bravo",
            type: "heading",
            children: [
              { depth: 3, value: "Charlie", type: "heading", children: [] },
            ],
          },
          {
            depth: 2,
            value: "Delta",
            type: "heading",
            children: [],
          },
        ],
      },
    ]);
  });

  it("1232(has same heading)", async () => {
    const res = await processor.process(
      `# Alpha

  aaaa

  ## Alpha

  bbbb

  ### Alpha

  cccc

  ## Delta

  dddd
  `,
    );
    expect(res.result).toEqual([
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

  it("1231", async () => {
    const res = await processor.process(
      `# Alpha

aaaa

## Bravo

bbbb

### Charlie

cccc

# Delta

dddd
`,
    );
    expect(res.result).toEqual([
      {
        depth: 1,
        value: "Alpha",
        children: [
          {
            depth: 2,
            value: "Bravo",
            children: [{ depth: 3, value: "Charlie", children: [] }],
          },
        ],
      },
      {
        depth: 1,
        value: "Delta",
        children: [],
      },
    ]);
  });

  it("1222", async () => {
    const res = await processor.process(
      `# Alpha

aaaa

## Bravo

bbbb

## Charlie

cccc

## Delta

dddd
`,
    );
    expect(res.result).toEqual([
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

  it("1111", async () => {
    const res = await processor.process(
      `# Alpha

aaaa

# Bravo

bbbb

## Charlie

cccc

# Delta

dddd
`,
    );
    expect(res.result).toEqual([
      {
        depth: 1,
        value: "Alpha",
        children: [],
      },
      {
        depth: 1,
        value: "Bravo",
        children: [{ depth: 2, value: "Charlie", children: [] }],
      },

      {
        depth: 1,
        value: "Delta",
        children: [],
      },
    ]);
  });

  it("123456", async () => {
    const res = await processor.process(
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
  `,
    );
    expect(res.result).toEqual([
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

  it("1232312323", async () => {
    const res = await processor.process(
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
`,
    );
    expect(res.result).toEqual([
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

  it("2534", async () => {
    const res = await processor.process(
      `## Alpha

aaaa

##### Bravo

bbbb

### Charlie

cccc

#### Delta

dddd
`,
    );
    expect(res.result).toEqual([
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
