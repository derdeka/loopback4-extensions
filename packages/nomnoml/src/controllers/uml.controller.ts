import { Constructor, inject } from '@loopback/core';
import { get, Response, RestBindings } from '@loopback/rest';
// import { renderSvg } from 'nomnoml';
import { UmlBindings } from '../keys';
import { DEFAULT_UML_OPTIONS, ModelMetadataService, UmlOptions } from '../types';

// TODO: find out why typing is not working
interface Nomnoml {
  renderSvg(code: string): string;
}
const { renderSvg }: Nomnoml = require('nomnoml');

export function createUMLController(options: UmlOptions = DEFAULT_UML_OPTIONS): Constructor<unknown> {
  class UMLController {
    constructor(
      @inject(RestBindings.Http.RESPONSE)
      private response: Response,
      @inject(UmlBindings.METADATA_SERVICE)
      private metadataService: ModelMetadataService,
    ) { }

    @get(options.umlPath, {
      'x-visibility': 'undocumented',
      responses: {
        200: {
          description: '',
          content: { 'image/svg+xml': { schema: { type: 'string' } } },
        },
      },
    })
    uml() {
      const nomnomlString = this.metadataService.createNomnomlString();
      const svg = renderSvg(nomnomlString);
      this.response
        .status(200)
        .contentType('image/svg+xml')
        .send(svg);
    }
  }

  return UMLController;
}
