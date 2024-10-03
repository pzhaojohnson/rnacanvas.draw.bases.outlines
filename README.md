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

The `BaseOutline` class represents a base outline.

### `static outlining()`

The `outlining()` static method creates and returns a new base outline
outlining a specified base.

```javascript
// the base to outline
var b = Nucleobase.create('G');

var bo = BaseOutline.outlining(b);

bo.owner === b; // true
```

Bases to be outlined must fulfill the following interface
to be compatible with the `BaseOutline` class.

```typescript
interface Nucleobase {
  readonly centerPoint: {
    readonly x: number;
    readonly y: number;

    // the specified listener is to be called whenever the center point of the base moves
    // (i.e., its X or Y coordinates change)
    addEventListener(name: 'move', listener: () => void): void;

    removeEventListener(name: 'move', listener: () => void): void;
  }
}
```

### `constructor()`

```javascript
// the base to outline
var owner = Nucleobase.create('G');

// the DOM node that will correspond to the base outline
var domNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

var bo = new BaseOutline(domNode, owner);

// are publicly accessible
bo.domNode;
bo.owner;
```

Base outlines automatically move with their owner base.

```javascript
// move the owner base
owner.setCenterPoint({ x: 518, y: 1071 });

// follows automatically
domNode.getAttribute('cx'); // "518"
domNode.getAttribute('cy'); // "1071"
```
