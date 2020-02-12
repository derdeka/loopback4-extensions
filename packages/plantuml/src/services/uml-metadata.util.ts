import { ModelDefinition, ModelMetadataHelper, PropertyDefinition, PropertyType, RelationDefinitionMap, RelationMetadata, resolveType } from '@loopback/repository';

const { getModelMetadata } = ModelMetadataHelper;

const safeClass = (name: string): string => {
  return name.toLowerCase();
}

const safeType = (type: PropertyType): string => {
  if (typeof type === 'function') {
    return type.name.toString();
  }
  return 'unknown';
};

export const generateUmlClass = (meta: ModelDefinition): string => {
  const { name: className, properties } = meta;
  const props = Object.keys(properties)
    .map(propName => generateUmlProperty(propName, properties[propName]))
    .join('\n');
  return `class ${safeClass(className)} {\n${props}\n}`;
};

export const generateUmlProperty = (name: string, { type }: PropertyDefinition) => {
  return `  ${name}: ${safeType(type)}`;
};

export const generateUmlRelations = (relations: RelationDefinitionMap): string[] => {
  return Object.values(relations).map(generateUmlRelation);
}

export const mapType = (type: string): string => {
  switch (type) {
    case 'hasMany': return '"1" *-- "many"';
    case 'belongsTo': return '"many" *-- "1"';
    case 'hasOne': return '"1" *-- "1"';
    default: return '*--';
  }
}

export const generateUmlRelation = ({ source, type, target }: RelationMetadata): string => {
  const targetType = resolveType(target);
  const targetMeta: {} | ModelDefinition = getModelMetadata(targetType);
  if (targetMeta instanceof ModelDefinition) {
    return `${safeClass(source.name)} ${mapType(type)} ${safeClass(targetMeta.name)}`;
  }
  return '';
}
