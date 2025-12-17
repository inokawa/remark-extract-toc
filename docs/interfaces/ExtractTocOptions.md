[**API**](../API.md)

***

# Interface: ExtractTocOptions

Defined in: [index.ts:11](https://github.com/inokawa/remark-extract-toc/blob/6a3dd0aa2e7257a337ae432f8e8c2bd0c31fd19f/src/index.ts#L11)

## Properties

### flatten?

> `optional` **flatten**: `boolean`

Defined in: [index.ts:16](https://github.com/inokawa/remark-extract-toc/blob/6a3dd0aa2e7257a337ae432f8e8c2bd0c31fd19f/src/index.ts#L16)

If true, toc is extracted as a list not nested.

#### Default

```ts
false
```

***

### keys?

> `optional` **keys**: `string`[]

Defined in: [index.ts:21](https://github.com/inokawa/remark-extract-toc/blob/6a3dd0aa2e7257a337ae432f8e8c2bd0c31fd19f/src/index.ts#L21)

Add extra field to tree object. For example, use [remark-slug](https://github.com/remarkjs/remark-slug) to add id and set `{ keys: ["data"] }`

#### Default

```ts
[]
```
