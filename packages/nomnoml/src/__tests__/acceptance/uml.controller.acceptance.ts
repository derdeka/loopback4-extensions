import { belongsTo, Entity, model, property } from '@loopback/repository';
import { RestApplication, RestServerConfig } from '@loopback/rest';
import { Client, createRestAppClient, expect, givenHttpServerConfig } from '@loopback/testlab';
import { readFile } from 'fs-extra';
import { UmlComponent } from '../../component';
import { UmlBindings } from '../../keys';
import { ModelMetadataService } from '../../types';

describe('UmlController (acceptance)', () => {
  let app: RestApplication;
  let client: Client;

  afterEach(async () => {
    if (app) await app.stop();
    (app as unknown) = undefined;
  });

  context('with default config', () => {
    @model()
    class ModelA extends Entity {
      @property({
        id: true,
      })
      prop1: string;
    }

    @model()
    class ModelB extends Entity {
      @belongsTo(() => ModelA)
      prop1: string;
      @property()
      prop2: number;
    }

    beforeEach(async () => {
      app = givenRestApplication();
      app.component(UmlComponent);
      await app.start();
      client = createRestAppClient(app);

      const service = await app.get<ModelMetadataService>(UmlBindings.METADATA_SERVICE);
      service.inspect(ModelA);
      service.inspect(ModelB);
    });

    it('creates svg at "/uml"', async () => {
      const svg = await readFile(`${__dirname}/../../../fixtures/nomnoml-testmodels.svg`, 'utf8');
      const res = await client.get('/uml').expect(200);
      expect(res.header['content-type']).to.equal('image/svg+xml; charset=utf-8');
      expect(res.body.toString()).to.equal(svg);
    });
  });

  function givenRestApplication(config?: RestServerConfig) {
    const rest = Object.assign({}, givenHttpServerConfig(), config);
    return new RestApplication({ rest });
  }
});
