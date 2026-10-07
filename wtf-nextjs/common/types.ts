import { FeaturesEnum } from './enums';

export interface IAnalysis {
  [key: string]: string | boolean | number | ICharacteristic;
  submission: number;
  characteristic: ICharacteristic;
  comment: string;
  isSlight: boolean;
  isExcessive: boolean;
  isGreaterOnRight: boolean;
  isGreaterOnLeft: boolean;
  isSelected: boolean;
  faceShapePrimary: number;
  faceShapeSecondary: number;
  faceShapeTertiary: number;
  age: number;
  leftEyeNotes: string;
  rightEyeNotes: string;
}

export interface ICharacteristic {
  feature: IFeature;
  id: number;
  name: string;
  order: number;
}

export interface IFeature {
  icon?: {
    fullSize?: string;
  };
  id: number;
  name: string;
  order?: number;
  physiologicalNote?: string;
  psychologicalNote?: string;
  type?: FeaturesEnum;
}

export interface IShapes {
  icon?: {
    fullSize?: string;
  };
  id: number;
  name: string;
  order?: number;
}

export interface IPrice {
  amount: number;
}

export interface IPlan {
  slug: string;
  price: IPrice;
}