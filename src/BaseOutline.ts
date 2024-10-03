import { Nucleobase } from './Nucleobase';

export class BaseOutline<T extends BaseOutlineDOMNode, B extends Nucleobase> {
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
