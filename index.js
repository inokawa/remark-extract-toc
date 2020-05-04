"use strict";

var uuIndex = require("unist-util-index");

module.exports = extractToc;

function extractToc(opt) {
  opt = opt || {};

  return transformer;

  function transformer(ast) {
    var typeIndex = new uuIndex(ast, "type");
    var headings = typeIndex.get("heading");

    var root = [];
    var current = root;
    headings.forEach(function (node, index) {
      if (current.length === 0) {
        return current.push(createObj(node));
      }

      var beforeNode = current[current.length - 1];
      if (beforeNode.depth === node.depth) {
        // do nothing
      } else if (beforeNode.depth < node.depth) {
        current = beforeNode.children;
      } else {
        current = root;
        if (node.depth > 1) {
          var tmpBef = current;
          var tmpCur = current;
          var tmpObj = tmpCur[tmpCur.length - 1];
          while (tmpObj && tmpObj.depth <= node.depth) {
            tmpBef = tmpCur;
            tmpCur = tmpObj.children;
            tmpObj = tmpCur[tmpCur.length - 1];
          }
          if (tmpBef[tmpBef.length - 1].depth === node.depth) {
            current = tmpBef;
          } else {
            current = tmpCur;
          }
        }
      }

      current.push(createObj(node));
    });

    return root;
  }

  function createObj(node) {
    var textNode = node.children.find(function (n) {
      return n.type === "text";
    });
    var obj = {
      depth: node.depth,
      value: textNode ? textNode.value : "",
      children: [],
    };
    return obj;
  }
}
