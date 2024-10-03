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
});
