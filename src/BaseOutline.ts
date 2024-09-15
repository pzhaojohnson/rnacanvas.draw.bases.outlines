import { Nucleobase } from './Nucleobase';

export class BaseOutline<T extends SVGCircleElement, B extends Nucleobase> {
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
