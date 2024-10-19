/**
 * @jest-environment jsdom
 */

import { BaseOutline } from './BaseOutline';

class Point {
  #x = 0;
  #y = 0;

  #eventListeners = {
    'move': [],
  };

  get x() {
    return this.#x;
  }

  set x(x) {
    this.#x = x;

    this.#callEventListeners('move');
  }

  get y() {
    return this.#y;
  }

  set y(y) {
    this.#y = y;

    this.#callEventListeners('move');
  }

  addEventListener(name, listener) {
    this.#eventListeners[name].push(listener);
  }

  #callEventListeners(name) {
    this.#eventListeners[name].forEach(listener => listener());
  }
}

class NucleobaseMock {
  id = `${Math.random()}`;

  centerPoint = new Point();
}

describe('`BaseOutline` class', () => {
  test('`outlining()` static method', () => {
    let b = new NucleobaseMock();

    b.centerPoint.x = 98.4;
    b.centerPoint.y = -1002.34;

    BaseOutline.defaultValues['circle'].attributes['stroke-width'] = '5.7';
    BaseOutline.defaultValues['circle'].attributes['fill-opacity'] = '0.28';

    let bo = BaseOutline.outlining(b);

    expect(bo.owner).toBe(b);

    // assigns a UUID to the base outline
    expect(bo.domNode.getAttribute('id').length).toBeGreaterThanOrEqual(36);

    // positions the base outline
    expect(bo.domNode.getAttribute('cx')).toBe('98.4');
    expect(bo.domNode.getAttribute('cy')).toBe('-1002.34');

    // applies default values
    expect(bo.domNode.getAttribute('stroke-width')).toBe('5.7');
    expect(bo.domNode.getAttribute('fill-opacity')).toBe('0.28');
  });

  test('`static deserialized()`', () => {
    let bo1 = BaseOutline.outlining(new NucleobaseMock());
    bo1.domNode.id = 'id-873716728648726';
    bo1.owner.id = 'id-754231325462';

    let parentDrawing = new DrawingMock();

    expect(parentDrawing.domNode.childNodes.length).toBeGreaterThanOrEqual(8);
    parentDrawing.domNode.insertBefore(bo1.domNode, parentDrawing.domNode.childNodes[5]);

    expect(parentDrawing.bases.length).toBeGreaterThanOrEqual(8);
    parentDrawing.bases.splice(4, 0, bo1.owner);

    // `SVGCircleElement` is not defined by JSDOM by default
    expect(globalThis.SVGCircleElement).toBeFalsy();
    globalThis.SVGCircleElement = SVGElement;

    let bo2 = BaseOutline.deserialized(bo1.serialized(), parentDrawing);
    expect(bo2.domNode).toBe(bo1.domNode);
    expect(bo2.owner).toBe(bo1.owner);

    // base outline IDs used to be saved under `circleId`
    let bo3 = BaseOutline.deserialized({ circleId: 'id-873716728648726', ownerID: 'id-754231325462' }, parentDrawing);
    expect(bo3.domNode).toBe(bo1.domNode);
    expect(bo3.owner).toBe(bo1.owner);
  });

  it('moves with its owner nucleobase', () => {
    let domNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    let owner = new NucleobaseMock();

    let bo = new BaseOutline(domNode, owner);

    owner.centerPoint.x = 1057;
    expect(bo.domNode.getAttribute('cx')).toBe('1057');

    owner.centerPoint.y = -812;
    expect(bo.domNode.getAttribute('cy')).toBe('-812');
  });

  test('`serialized()` method', () => {
    let bo = BaseOutline.outlining(new NucleobaseMock());

    bo.domNode.id = 'id-8987158957185';
    bo.owner.id = 'id-174681274872';
    expect(bo.serialized()).toStrictEqual({ id: 'id-8987158957185', ownerID: 'id-174681274872' });

    bo.domNode.id = '';
    bo.owner.id = 'id-174681274872';
    expect(() => bo.serialized()).toThrow();

    bo.domNode.id = 'id-8987158957185';
    bo.owner.id = '';
    expect(() => bo.serialized()).toThrow();
  });

  test('`id` getter', () => {
    let bo = BaseOutline.outlining(new NucleobaseMock());

    bo.domNode.setAttribute('id', 'id-7389165891');

    expect(bo.id).toBe('id-7389165891');
  });

  test('`getAttribute()` method', () => {
    let bo = BaseOutline.outlining(new NucleobaseMock());

    bo.domNode.setAttribute('fill-opacity', '0.712731');

    expect(bo.getAttribute('fill-opacity')).toBe('0.712731');
  });

  test('`setAttribute()` method', () => {
    let bo = BaseOutline.outlining(new NucleobaseMock());

    bo.setAttribute('stroke', '#12bd69');

    expect(bo.domNode.getAttribute('stroke')).toBe('#12bd69');
  });

  test('`setAttributes()` method', () => {
    let bo = BaseOutline.outlining(new NucleobaseMock());

    bo.setAttributes({ 'stroke': '#bca311', 'fill': '#abc654', 'fill-opacity': '0.16' });

    expect(bo.domNode.getAttribute('stroke')).toBe('#bca311');
    expect(bo.domNode.getAttribute('fill')).toBe('#abc654');
    expect(bo.domNode.getAttribute('fill-opacity')).toBe('0.16');
  });

  test('`set()` method', () => {
    let bo = BaseOutline.outlining(new NucleobaseMock());

    bo.set({ attributes: { 'stroke': '#bc5590', 'fill-opacity': '0.81' } });

    expect(bo.domNode.getAttribute('stroke')).toBe('#bc5590');
    expect(bo.domNode.getAttribute('fill-opacity')).toBe('0.81');

    // no attributes object
    expect(() => bo.set({})).not.toThrow();
  });
});

class DrawingMock {
  bases = [
    new NucleobaseMock(),
    new NucleobaseMock(),
    new NucleobaseMock(),
    new NucleobaseMock(),
    new NucleobaseMock(),
    new NucleobaseMock(),
    new NucleobaseMock(),
    new NucleobaseMock(),
    new NucleobaseMock(),
  ];

  constructor() {
    this.domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'circle'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'rect'));
    this.domNode.append(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
  }
}
