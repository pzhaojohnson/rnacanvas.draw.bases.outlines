import { Nucleobase } from './Nucleobase';

import type { Drawing } from './Drawing';

import { assignUUID } from '@rnacanvas/draw.svg';

import { setAttributes } from '@rnacanvas/draw.svg';

import { isNonNullObject } from '@rnacanvas/value-check';

import { isString } from '@rnacanvas/value-check';

export class BaseOutline<T extends BaseOutlineDOMNode, B extends Nucleobase> {
  static defaultValues = {
    /**
     * Default values for base outlines whose corresponding DOM nodes
     * are SVG circle elements.
     */
    'circle': {
      attributes: {
        'r': '5.5',
        'stroke': '#000000',
        'stroke-width': '0',
        'stroke-opacity': '1',
        'fill': '#00ffff',
        'fill-opacity': '1',
      },
    },
  };

  /**
   * Creates and returns a new base outline outlining the provided base.
   *
   * The created base outline will be an SVG circle element.
   */
  static outlining<B extends Nucleobase>(b: B): BaseOutline<SVGCircleElement, B> {
    let domNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    assignUUID(domNode);

    domNode.setAttribute('cx', `${b.centerPoint.x}`);
    domNode.setAttribute('cy', `${b.centerPoint.y}`);

    let bo = new BaseOutline(domNode, b);

    bo.set(BaseOutline.defaultValues['circle']);

    return bo;
  }

  /**
   * Recreates a base outline from its serialized form.
   *
   * Throws if unable to do so.
   *
   * @param savedBaseOutline The serialized form of a saved base outline.
   * @param parentDrawing The drawing that the saved base outline is in.
   */
  static deserialized<B extends Nucleobase>(savedBaseOutline: unknown, parentDrawing: Drawing<B>) {
    if (!isNonNullObject(savedBaseOutline)) { throw new Error('Saved base outline must be an object.'); }

    // base outline IDs used to be saved under `circleId`
    let id = savedBaseOutline.id ?? savedBaseOutline.circleId;
    if (!id) { throw new Error('Base outline ID is missing.'); }
    if (!isString(id)) { throw new Error('Base outline ID must be a string.'); }

    let domNode = parentDrawing.domNode.querySelector('#' + id);
    if (!domNode) { throw new Error('Unable to find base outline DOM node.'); }
    if (!(domNode instanceof SVGCircleElement)) { throw new Error('Base outline DOM node must be an SVG circle element.'); }

    let ownerID = savedBaseOutline.ownerID;
    if (!ownerID) { throw new Error('Missing base outline owner ID.'); }
    if (!isString(ownerID)) { throw new Error('Base outline owner ID must be a string.'); }

    let owner = [...parentDrawing.bases].find(b => b.id === ownerID);
    if (!owner) { throw new Error('Unable to find base outline owner.'); }

    return new BaseOutline(domNode, owner);
  }

  /**
   * @param domNode The actual DOM node corresponding to the base outline.
   * @param owner The base that the base outline belongs to.
   */
  constructor(readonly domNode: T, readonly owner: B) {
    owner.centerPoint.addEventListener('move', () => {
      domNode.setAttribute('cx', `${owner.centerPoint.x}`);
      domNode.setAttribute('cy', `${owner.centerPoint.y}`);
    });
  }

  /**
   * Returns the serialized form of the base outline,
   * which is used when saving drawings.
   *
   * Throws if unable to do so.
   */
  serialized() {
    let id = this.id;
    if (!id) { throw new Error('Base outline ID is falsy.'); }

    let ownerID = this.owner.id;
    if (!ownerID) { throw new Error('Base outline owner ID is falsy.'); }

    return { id, ownerID };
  }

  /**
   * Simply forwards the value of the `id` property
   * of the DOM node corresponding to the base outline.
   */
  get id() {
    return this.domNode.id;
  }

  /**
   * Get an attribute of the DOM node corresponding to the base outline.
   */
  getAttribute(name: string) {
    return this.domNode.getAttribute(name);
  }

  /**
   * Set an attribute of the DOM node corresponding to the base outline.
   */
  setAttribute(name: string, value: string): void {
    this.domNode.setAttribute(name, value);
  }

  /**
   * Set multiple attributes of the DOM node corresponding to the base outline at once.
   */
  setAttributes(attributes: { [name: string]: string }): void {
    setAttributes(this.domNode, attributes);
  }

  /**
   * Set values of the base outline.
   */
  set(values: Partial<BaseOutlineValues>): void {
    if (values.attributes) {
      this.setAttributes(values.attributes);
    }
  }
}

/**
 * For now, base outlines can only be SVG circle elements,
 * but this type definition might get expanded in the future
 * (e.g., to also include SVG rect elements).
 */
type BaseOutlineDOMNode = SVGCircleElement;

type BaseOutlineValues = {
  attributes: { [name: string]: string },
};
