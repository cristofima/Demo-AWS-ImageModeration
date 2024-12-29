// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const thresholds: { [key: string]: { [key: string]: { blur?: number; reject?: number;[key: string]: { blur: number; reject: number } | number } } } = {
    "Explicit": {
        "Explicit Nudity": {
            blur: 40, reject: 75,
            "Exposed Male Genitalia": { blur: 40, reject: 70 },
            "Exposed Female Genitalia": { blur: 40, reject: 70 },
            "Exposed Buttocks or Anus": { blur: 60, reject: 80 },
            "Exposed Female Nipple": { blur: 50, reject: 70 }
        },
        "Explicit Sexual Activity": { blur: 50, reject: 70 },
        "Sex Toys": { blur: 60, reject: 80 }
    },
    "Non-Explicit Nudity of Intimate parts and Kissing": {
        "Non-Explicit Nudity": {
            blur: 50, reject: 97,
            "Bare Back": { blur: 50, reject: 95 },
            "Exposed Male Nipple": { blur: 50, reject: 85 },
            "Partially Exposed Buttocks": { blur: 65, reject: 95 },
            "Partially Exposed Female Breast": { blur: 50, reject: 95 },
            "Implied Nudity": { blur: 50, reject: 75 }
        },
        "Obstructed Intimate Parts": {
            blur: 45, reject: 97,
            "Obstructed Female Nipple": { blur: 50, reject: 95 },
            "Obstructed Male Genitalia": { blur: 50, reject: 95 }
        }
    },
    "Swimwear or Underwear": {
        "Female Swimwear or Underwear": { blur: 80, reject: 99 },
        "Male Swimwear or Underwear": { blur: 80, reject: 99 }
    },
    "Violence": {
        "Weapons": { blur: 5, reject: 0.7 },
        "Graphic Violence": {
            "Weapon Violence": { blur: 0.7, reject: 0.9 },
            "Physical Violence": { blur: 0.6, reject: 0.8 },
            "Self-Harm": { blur: 0.7, reject: 0.9 },
            "Blood & Gore": { blur: 0.6, reject: 0.8 },
            "Explosions and Blasts": { blur: 0.5, reject: 0.7 }
        }
    },
    "Visually Disturbing": {
        "Death and Emaciation": {
            blur: 60, reject: 80,
            "Emaciated Bodies": { blur: 0.8, reject: 0.9 },
            "Corpses": { blur: 0.9, reject: 0.95 }
        },
        "Crashes": {
            "Air Crash": { blur: 0.7, reject: 0.9 }
        }
    },
    "Drugs & Tobacco": {
        "Products": {
            "Pills": { blur: 0.3, reject: 0.5 }
        },
        "Drugs & Tobacco Paraphernalia & Use": {
            "Smoking": { blur: 0.2, reject: 0.4 }
        }
    },
    "Alcohol": {
        "Alcohol Use": {
            "Drinking": { blur: 0.1, reject: 0.2 }
        }
    },
    "Rude Gestures": {
        "Middle Finger": { blur: 0, reject: 0.6 }
    },
    "Hate Symbols": {
        "Nazi Party": { blur: 50, reject: 8 },
        "White Supremacy": { blur: 0, reject: 0.8 },
        "Extremist": { blur: 0, reject: 0.8 }
    }
};