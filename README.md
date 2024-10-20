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

// the DOM node corresponding to the base outline
bo.domNode; // an SVG circle element

// a UUID will be assigned to the base outline
bo.domNode.getAttribute('id').length >= 36; // true
```

Base outlines automatically move with their owner base.

```javascript
// move the owner base
b.centerPoint.x = 518;
b.centerPoint.y = 1071;

// follows its owner base
bo.domNode.getAttribute('cx'); // "518"
bo.domNode.getAttribute('cy'); // "1071"
```

Bases to be outlined must fulfill the following interface
to be compatible with the `BaseOutline` class.

```typescript
interface Nucleobase {
  readonly centerPoint: {
    readonly x: number;
    readonly y: number;

    // the specified listener is to be called whenever the center point of the base moves
    // (i.e., whenever its X or Y coordinates change)
    addEventListener(name: 'move', listener: () => void): void;

    removeEventListener(name: 'move', listener: () => void): void;
  }
}
```

### `static defaultValues`

Default values for base outlines
created using static methods such as the `outlining()` method.

Note that the `BaseOutline` class constructor
does not apply default values to constructed base outlines.

```javascript
// example default values for base outlines
// (whose corresponding DOM nodes are SVG circle elements)
BaseOutline.defaultValues['circle']; // {
//   attributes: {
//     'r': '5.5',
//     'stroke': '#000000',
//     'stroke-width': '0',
//     'stroke-opacity': '1',
//     'fill': '#00ffff',
//     'fill-opacity': '1',
//   },
// };
```

### `constructor()`

With the `BaseOutline` class constructor,
the DOM node corresponding to a base outline
and its owner base
are explicitly specified.

Currently, the DOM node corresponding to a base outline
can only be an SVG circle element,
but this type definition might get expanded in the future
(e.g., to include SVG rect and polygon elements as well).

The `BaseOutline` class constructor does not modify
the input DOM node corresponding to a base outline in any way.

```javascript
// the base to outline
var b = Nucleobase.create('G');

// the DOM node that will correspond to the base outline
var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

var bo = new BaseOutline(domNode, owner);

bo.domNode === circle; // true
bo.owner === b; // true
```

### `id`

The ID of a base outline.

This getter simply forwards the value of the `id` property
of the DOM node corresponding to a base outline.

```javascript
bo.domNode.setAttribute('id', 'id-123456');

bo.id; // "id-123456"
```

### `getAttribute()`

Get an attribute of the DOM node corresponding to a base outline.

This method simply forwards the value returned by the `getAttribute()` method
of the DOM node corresponding to a base outline.

```javascript
bo.domNode.setAttribute('fill-opacity', '0.57');

bo.getAttribute('fill-opacity'); // "0.57"
```

### `setAttribute()`

Set an attribute of the DOM node corresponding to a base outline.

```javascript
bo.setAttribute('stroke', '#abc123');

bo.domNode.getAttribute('stroke'); // "#abc123"
```

### `setAttributes()`

Set multiple attributes of the DOM node corresponding to a base outline at once.

```javascript
bo.setAttributes({
  'stroke': '#bc8193',
  'stroke-opacity': '0.88',
  'fill-opacity': '0.2',
});
```

### `set()`

Set values of a base outline.

```javascript
bo.set({
  attributes: { 'stroke': '#aaabbc', 'stroke-width': '2', 'fill': 'red' },
});
```

### `serialized()`

Returns the serialized form of a base outline,
which is used when saving drawings.

Throws if a base outline cannot be serialized properly
(e.g., it has a falsy ID).

```javascript
var owner = Nucleobase.create('G');
owner.id; // "id-123456"

var bo = BaseOutline.outlining(owner);
bo.id; // "id-ABCDEF"

bo.serialized(); // { id: "id-ABCDEF", ownerID: "id-123456" }
```

### `static deserialized()`

Recreates a saved base outline from its serialized form.

Note that this method does not create any new DOM nodes
(it just retrieves the DOM node and owner base for a saved base outline
from the parent drawing).

Throws if unable to recreate a saved base outline.

```javascript
var parentDrawing; // an RNAcanvas drawing

var owner = parentDrawing.addBase('C');
var bo1 = parentDrawing.outlineBase(owner);

var bo2 = BaseOutline.deserialized(bo1.serialized(), parentDrawing);

bo2.domNode === bo1.domNode; // true
bo2.owner === bo1.owner; // true

bo2 === bo1; // false
```
