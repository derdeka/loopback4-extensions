import { BindingKey } from '@loopback/core';
import { UmlComponent } from './component';
import { ModelMetadataService, UmlConfig } from './types';

export namespace UmlBindings {
  export const COMPONENT = BindingKey.create<UmlComponent>('components.UmlComponent');

  export const CONFIG = BindingKey.buildKeyForConfig<UmlConfig>(COMPONENT.key);

  export const METADATA_SERVICE = BindingKey.create<ModelMetadataService>('service.ModelMetadataService');
}
