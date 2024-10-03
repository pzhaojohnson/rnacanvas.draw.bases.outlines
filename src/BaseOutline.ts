import { Nucleobase } from './Nucleobase';

import { assignUUID } from '@rnacanvas/draw.svg';

export class BaseOutline<T extends BaseOutlineDOMNode, B extends Nucleobase> {
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

    return new BaseOutline(domNode, b);
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
}

/**
 * For now, base outlines can only be SVG circle elements,
 * but this type definition might get expanded in the future
 * (e.g., to also include SVG rect elements).
 */
type BaseOutlineDOMNode = SVGCircleElement;
