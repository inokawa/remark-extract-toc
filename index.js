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
          var tmpObj = current[current.length - 1];
          var tmpCur = root;
          var tmpBef = root;
          while (tmpObj.depth <= node.depth) {
            tmpBef = tmpCur;
            tmpCur = tmpObj.children;
            tmpObj = tmpCur[tmpCur.length - 1];
          }
          current = tmpBef;
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
