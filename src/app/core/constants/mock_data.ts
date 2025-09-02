import { IHero, IKeyValue } from "../models/hero.model";

export const POWERS_MOCK: IKeyValue<string>[] = [
    {
      id:0,
      value: "Super fuerza"
    },
    {
      id:1,
      value: "Vuelo"
    },
    {
      id:2,
      value: "Velocidad sobrehumana"
    },
    {
      id:3,
      value: "Telepatía"
    },
    {
      id:4,
      value: "Invisibilidad"
    },
    {
      id:5,
      value: "Regeneración"
    },
  ];

  export const MOCK_HEROES: IHero[] = [
  { id: 1, name: 'Batman', description: 'Batman is a lone hero.', powers:[]},
  { id: 2, name: 'Superman', description: 'Superman is a Super Hero.', powers:[
    POWERS_MOCK[0],POWERS_MOCK[1],POWERS_MOCK[2]
  ]},
  { id: 3, name: 'Hulk', description: 'Hulk is Bruce Banner.', powers:[
    POWERS_MOCK[0],POWERS_MOCK[4]
  ]},
  { id: 4, name: 'Deadpool', description:'deadpool',powers:[] }
];