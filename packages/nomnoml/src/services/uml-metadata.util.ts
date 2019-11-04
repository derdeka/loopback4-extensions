import {
  ModelDefinition,
  ModelMetadataHelper,
  PropertyDefinition,
  PropertyType,
  RelationDefinitionMap,
  RelationMetadata,
  resolveType,
} from '@loopback/repository';

const { getModelMetadata } = ModelMetadataHelper;

const safeType = (type: PropertyType): string => {
  if (typeof type === 'function') {
    return type.name.toString();
  }
  return 'unknown';
};

export const generateNomnomlClass = (meta: ModelDefinition): string => {
  const { name: className, properties } = meta;
  const propsNom = Object.keys(properties)
    .map(propName => generateNomnomlProperty(propName, properties[propName]))
    .join(';');
  return `[${className}|${propsNom}]`;
};

export const generateNomnomlProperty = (name: string, { type }: PropertyDefinition) => {
  return `${name}: ${safeType(type)}`;
};

export const generateNomnomlRelations = (relations: RelationDefinitionMap): string[] => {
  return Object.values(relations).map(generateNomnomlRelation);
};

export const generateNomnomlRelation = ({ source, type, target }: RelationMetadata): string => {
  const targetType = resolveType(target);
  const targetMeta: {} | ModelDefinition = getModelMetadata(targetType);
  if (targetMeta instanceof ModelDefinition) {
    return `[${source.name}] ${type} -> [${targetMeta.name}]`;
  }
  return '';
};
