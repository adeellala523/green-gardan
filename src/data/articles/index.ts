import { Article } from '../../types';
import { gardeningTipsArticles } from './gardeningTips';
import { flowersPlantsArticles } from './flowersPlants';
import { indoorGardeningArticles } from './indoorGardening';
import { gardenDesignArticles } from './gardenDesign';
import { wildlifeSustainableArticles } from './wildlifeSustainable';

export const initialArticles: Article[] = [
  ...gardeningTipsArticles,
  ...flowersPlantsArticles,
  ...indoorGardeningArticles,
  ...gardenDesignArticles,
  ...wildlifeSustainableArticles
];

export { defaultAuthor } from './gardeningTips';
