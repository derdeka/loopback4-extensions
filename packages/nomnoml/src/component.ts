import {
  Application,
  bind,
  BindingScope,
  Component,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config,
  ContextTags,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import { createUMLController } from './controllers/uml.controller';
import { UmlBindings } from './keys';
import { UmlMetadataService } from './services';
import { DEFAULT_UML_OPTIONS, UmlConfig, UmlOptions } from './types';

@bind({ tags: { [ContextTags.KEY]: UmlBindings.COMPONENT } })
export class UmlComponent implements Component {
  providers?: ProviderMap = {};

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @config()
    umlConfig: UmlConfig = DEFAULT_UML_OPTIONS,
  ) {
    const options: UmlOptions = {
      ...DEFAULT_UML_OPTIONS,
      ...umlConfig,
    };

    if (!options.disabled) {
      this.application
        .bind(UmlBindings.METADATA_SERVICE)
        .toClass(UmlMetadataService)
        .inScope(BindingScope.SINGLETON);
      this.application.controller(createUMLController(options));
    }
  }
}
