import { Constructor, Entity, ModelDefinition, ModelMetadataHelper } from '@loopback/repository';
import { ModelMetadataService } from '../types';
import { generateUmlClass, generateUmlRelations } from './uml-metadata.util';

const uniqueFilter = (value: string, index: number, arr: string[]) => arr.indexOf(value) === index;

export class UmlMetadataService implements ModelMetadataService {
  private classDefinitions: string[] = [];
  private relationDefinitions: string[] = [];

  inspect(ctor: Constructor<Entity>) {
    const meta: {} | ModelDefinition = ModelMetadataHelper.getModelMetadata(ctor);
    if (meta instanceof ModelDefinition) {
      this.classDefinitions.push(generateUmlClass(meta));
      this.relationDefinitions.push(...generateUmlRelations(meta.relations));
    }
  }

  createUmlString(): string {
    const classDefinitions: string = this.classDefinitions.sort().filter(uniqueFilter).join('\n\n');
    const relationDefinitions: string = this.relationDefinitions.sort().filter(uniqueFilter).join('\n');
    return `@startuml\n\n${classDefinitions}\n\n${relationDefinitions}\n\n@enduml\n`;
  }
}
