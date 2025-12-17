import type { Plugin } from "unified";
import type { Heading, Root } from "mdast";
import { Index } from "unist-util-index";

declare module "unified" {
  interface CompileResultMap {
    extractToc: ExtractedToc[];
  }
}

export interface ExtractTocOptions {
  /**
   * If true, toc is extracted as a list not nested.
   * @default false
   */
  flatten?: boolean;
  /**
   * Add extra field to tree object. For example, use [remark-slug](https://github.com/remarkjs/remark-slug) to add id and set `{ keys: ["data"] }`
   * @default []
   */
  keys?: string[];
}

export interface ExtractedToc {
  depth: number;
  value: string;
  children: ExtractedToc[];
  [key: string]: unknown;
}

const plugin: Plugin<[ExtractTocOptions?], Root, ExtractedToc[]> = function ({
  flatten = false,
  keys = [],
} = {}) {
  this.compiler = (ast) => {
    const typeIndex = new Index("type", ast);
    const headings = typeIndex.get("heading") as Heading[];

    if (flatten) {
      return headings.map((h) => createObj(h));
    }

    const root: ExtractedToc[] = [];
    let current = root;
    headings.forEach((node) => {
      if (current.length === 0) {
        current.push(createObj(node));
        return;
      }

      const beforeNode = current[current.length - 1]!;
      if (beforeNode.depth === node.depth) {
        // do nothing
      } else if (beforeNode.depth < node.depth) {
        current = beforeNode.children;
      } else {
        current = root;
        if (node.depth > 1) {
          let tmpBef = current;
          let tmpCur = current;
          let tmpObj = tmpCur[tmpCur.length - 1];
          while (tmpObj && tmpObj.depth <= node.depth) {
            tmpBef = tmpCur;
            tmpCur = tmpObj.children;
            tmpObj = tmpCur[tmpCur.length - 1];
          }
          if (tmpBef[tmpBef.length - 1]!.depth === node.depth) {
            current = tmpBef;
          } else {
            current = tmpCur;
          }
        }
      }

      current.push(createObj(node));
    });

    return root;
  };

  function createObj(node: Heading): ExtractedToc {
    const textNode = node.children.find((n) => n.type === "text");
    const obj: ExtractedToc = {
      depth: node.depth,
      value: textNode ? textNode.value : "",
      children: [],
    };
    keys.forEach((k) => {
      obj[k] = (node as any)[k];
    });
    return obj;
  }
};

export default plugin;
