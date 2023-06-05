export const filters = [
  { icon: 'country', label: 'Country', size: 'md', name: 'country' },
  // { icon: 'ageing', label: 'Ageing Method', size: 'md' },
  { icon: 'year', label: 'Year', size: 'sm', name: 'age', sufix: ' years' },
  // { icon: 'solera', label: '% Solera Mother', size: 'md' },
  // { icon: 'spirit', label: 'Spirit', size: 'md' },
  // { icon: 'agave', label: 'Agave', size: 'md' },
  // { icon: 'fruit', label: 'Crop/Fruit', size: 'md' },
  // { icon: 'grape', label: 'Grape Variety', size: 'md' },
  { icon: 'region', label: 'Region', size: 'md', name: 'location' },
  { icon: 'rarity', label: 'Rarity', size: 'sm', name: 'rarity' },
  // { icon: 'sugar', label: 'Sugar Cane', size: 'md' },
  // { icon: 'grain', label: 'Grain', size: 'xs' },
  {
    icon: 'capacity',
    label: 'Cask Capacity',
    size: 'md',
    name: 'cask_size',
    sufix: ' L',
  },
  { icon: 'abv', label: 'ABV', size: 'md', name: 'abv', sufix: '%' },
  { icon: 'distillery', label: 'Distillery', size: 'md', name: 'distillery' },
  { icon: 'wood', label: 'Wood Type', size: 'md', name: 'cask_wood' },
  // { icon: 'eu_market', label: 'Avarage Market Price EU', size: 'md' },
]

export const sufixesByType: any = {
  age: ' years',
  abv: '%',
  cask_size: ' L',
}
