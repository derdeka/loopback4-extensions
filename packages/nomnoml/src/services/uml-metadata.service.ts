import { Constructor, Entity, ModelDefinition, ModelMetadataHelper } from '@loopback/repository';
import { ModelMetadataService } from '../types';
import { generateNomnomlClass, generateNomnomlRelations } from './uml-metadata.util';

export class UmlMetadataService implements ModelMetadataService {
  private nomnomlStrings: string[] = ['[nomnoml] is -> [awesome]'];

  inspect(ctor: Constructor<Entity>) {
    const meta: {} | ModelDefinition = ModelMetadataHelper.getModelMetadata(ctor);
    if (meta instanceof ModelDefinition) {
      this.nomnomlStrings.push(generateNomnomlClass(meta), ...generateNomnomlRelations(meta.relations));
    }
  }

  createNomnomlString(): string {
    return this.nomnomlStrings.join('\n');
  }
}
