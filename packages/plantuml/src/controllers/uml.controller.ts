import { Constructor, inject } from '@loopback/core';
import { get, Response, RestBindings } from '@loopback/rest';
import { promisify } from 'util';
// import { renderSvg } from 'nomnoml';
import { UmlBindings } from '../keys';
import { DEFAULT_UML_OPTIONS, ModelMetadataService, UmlOptions } from '../types';

const plantuml = require('node-plantuml');
const plantumlGenerate = promisify(plantuml.generate);

export function createUMLController(options: UmlOptions = DEFAULT_UML_OPTIONS): Constructor<unknown> {
  class UMLController {
    constructor(
      @inject(RestBindings.Http.RESPONSE)
      private response: Response,
      @inject(UmlBindings.METADATA_SERVICE)
      private metadataService: ModelMetadataService,
    ) { }

    @get(`${options.umlPath}.txt`, {
      'x-visibility': 'undocumented',
      responses: {
        200: {
          description: '',
          content: { 'text/plain': { schema: { type: 'string' } } },
        },
      },
    })
    umlTxt() {
      const nomnomlString = this.metadataService.createUmlString();
      this.response
        .status(200)
        .contentType('text/plain')
        .send(nomnomlString);
    }

    @get(options.umlPath, {
      'x-visibility': 'undocumented',
      responses: {
        200: {
          description: '',
          content: { 'image/svg+xml': { schema: { type: 'string' } } },
        },
      },
    })
    async umlSvg() {
      const umlString = this.metadataService.createUmlString();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const out = await plantumlGenerate(umlString, { format: 'svg' });
      this.response
        .status(200)
        .contentType('image/svg+xml')
        .send(out);
    }
  }

  return UMLController;
}
