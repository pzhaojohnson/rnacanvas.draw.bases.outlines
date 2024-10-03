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
  centerPoint = new Point();
}

describe('`BaseOutline` class', () => {
  test('`outlining()` static method', () => {
    let b = new NucleobaseMock();

    b.centerPoint.x = 98.4;
    b.centerPoint.y = -1002.34;

    let bo = BaseOutline.outlining(b);

    expect(bo.owner).toBe(b);

    // assigns a UUID to the base outline
    expect(bo.domNode.getAttribute('id').length).toBeGreaterThanOrEqual(36);

    expect(bo.domNode.getAttribute('cx')).toBe('98.4');
    expect(bo.domNode.getAttribute('cy')).toBe('-1002.34');
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
});
