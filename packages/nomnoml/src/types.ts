import { Constructor, Model } from '@loopback/repository';

export interface ModelMetadataService {
  inspect(ctor: Constructor<Model>): void;
  createNomnomlString(): string;
}

export type UmlOptions = {
  disabled?: boolean;
  umlPath: string;
};

export type UmlConfig = Partial<UmlOptions>;

export const DEFAULT_UML_OPTIONS: UmlOptions = {
  umlPath: '/uml',
};
