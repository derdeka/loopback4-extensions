import { bind, BindingScope, Constructor, inject } from '@loopback/core';
import { get } from '@loopback/rest';
// import { renderSvg } from 'nomnoml';
import { UmlBindings } from '../keys';
import { DEFAULT_UML_OPTIONS, ModelMetadataService, UmlOptions } from '../types';

// TODO: find out why typing is not working
interface Nomnoml {
  renderSvg(code: string): string;
}
const { renderSvg }: Nomnoml = require('nomnoml');

export function createUMLController(options: UmlOptions = DEFAULT_UML_OPTIONS): Constructor<unknown> {
  @bind({ scope: BindingScope.SINGLETON })
  class UMLController {
    constructor(
      @inject(UmlBindings.METADATA_SERVICE)
      private metadataService: ModelMetadataService,
    ) {}

    @get(options.umlPath, {
      responses: {},
      'x-visibility': 'undocumented',
    })
    uml() {
      const nomnomlString = this.metadataService.createNomnomlString();
      const svg = renderSvg(nomnomlString);
      return svg;
    }
  }

  return UMLController;
}
