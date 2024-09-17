# Installation

With `npm`:

```
npm install @rnacanvas/draw.bases.outlines
```

# Usage

All exports of this package can be accessed as named imports.

```javascript
// an example import
import { BaseOutline } from '@rnacanvas/draw.bases.outlines';
```

## `BaseOutline`

The `BaseOutline` class can be used to outline bases.

```javascript
// the base to outline
var owner = Nucleobase.create('G');

// the DOM node that will correspond to the base outline
var domNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

var baseOutline = new BaseOutline(domNode, owner);

// move the owner base
owner.setCenterPoint({ x: 518, y: 1071 });

// base outlines automatically move with their owner base
baseOutline.domNode.getAttribute('cx'); // "518"
baseOutline.domNode.getAttribute('cy'); // "1071"
```
