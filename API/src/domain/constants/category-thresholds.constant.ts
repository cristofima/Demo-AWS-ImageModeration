// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const thresholds: {
  [key: string]: {
    [key: string]: {
      blur?: number;
      reject?: number;
      [key: string]: { blur: number; reject: number } | number;
    };
  };
} = {
  Explicit: {
    'Explicit Nudity': {
      blur: 40,
      reject: 75,
      'Exposed Male Genitalia': { blur: 40, reject: 70 },
      'Exposed Female Genitalia': { blur: 40, reject: 70 },
      'Exposed Buttocks or Anus': { blur: 60, reject: 85 },
      'Exposed Female Nipple': { blur: 50, reject: 75 },
    },
    'Explicit Sexual Activity': { blur: 50, reject: 75 },
    'Sex Toys': { blur: 60, reject: 85 },
  },
  'Non-Explicit Nudity of Intimate parts and Kissing': {
    'Non-Explicit Nudity': {
      blur: 50,
      reject: 97,
      'Bare Back': { blur: 70, reject: 95 },
      'Exposed Male Nipple': { blur: 50, reject: 90 },
      'Partially Exposed Buttocks': { blur: 65, reject: 97 },
      'Partially Exposed Female Breast': { blur: 65, reject: 97 },
      'Implied Nudity': { blur: 55, reject: 80 },
    },
    'Obstructed Intimate Parts': {
      blur: 45,
      reject: 97,
      'Obstructed Female Nipple': { blur: 55, reject: 95 },
      'Obstructed Male Genitalia': { blur: 55, reject: 95 },
    },
  },
  'Swimwear or Underwear': {
    'Female Swimwear or Underwear': { blur: 80, reject: 99 },
    'Male Swimwear or Underwear': { blur: 80, reject: 99 },
  },
  Violence: {
    Weapons: { blur: 50, reject: 80 },
    'Graphic Violence': {
      'Weapon Violence': { blur: 60, reject: 85 },
      'Physical Violence': { blur: 60, reject: 85 },
      'Self-Harm': { blur: 70, reject: 90 },
      'Blood & Gore': { blur: 70, reject: 90 },
      'Explosions and Blasts': { blur: 60, reject: 85 },
    },
  },
  'Visually Disturbing': {
    'Death and Emaciation': {
      blur: 70,
      reject: 90,
      'Emaciated Bodies': { blur: 70, reject: 90 },
      Corpses: { blur: 80, reject: 95 },
    },
    Crashes: {
      'Air Crash': { blur: 60, reject: 85 },
    },
  },
  'Drugs & Tobacco': {
    Products: {
      Pills: { blur: 50, reject: 75 },
    },
    'Drugs & Tobacco Paraphernalia & Use': {
      Smoking: { blur: 50, reject: 70 },
    },
  },
  Alcohol: {
    'Alcohol Use': {
      Drinking: { blur: 30, reject: 50 },
    },
  },
  'Rude Gestures': {
    'Middle Finger': { blur: 30, reject: 70 },
  },
  'Hate Symbols': {
    'Nazi Party': { blur: 70, reject: 90 },
    'White Supremacy': { blur: 70, reject: 90 },
    Extremist: { blur: 70, reject: 90 },
  },
};
