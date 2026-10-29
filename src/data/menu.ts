// Source: reference/Speisekarte.pdf, reference/Mittagstisch.pdf, reference/Saisonale-Speisen.pdf.
// All prices are integer cents. Corrections to the printed text are listed in docs/kararlar.md.
import { choice, group, mainCategory } from "./menu-builders";
import type { MainCategory } from "./menu-types";

const MILK_ALTERNATIVES = group("Milch", [
  ["Hafermilch", 50],
  ["Laktosefreie Milch", 50],
]);
const COFFEE_EXTRAS = group("Extras", [
  ["Hafermilch", 50],
  ["Laktosefreie Milch", 50],
  ["Entkoffeiniert", 50],
  ["Extra Shot", 150],
  ["Geeist", 100],
]);
const AROMA = group("Aroma", [
  ["Karamell", 50],
  ["Vanille", 50],
  ["Mandel", 50],
]);
const MOHN = group("Extras", [["Mohn", 50]]);
const SAHNE = group("Sahne", [["Sahne", 100]]);
const SALATBEILAGE = group("Beilage", [["Salatbeilage", 200]]);
const DRESSING = group(
  "Dressing",
  [
    ["Zitronen-Balsamico", 0],
    ["Olivenöl und Balsamico", 0],
  ],
  { max: 1 },
);
const KAKAO_SORTE = choice("Sorte", ["Zartbitter", "Vollmilch", "Weiß"]);
const SAEFTE = choice("Saft", [
  "Apfel naturtrüb",
  "Rhabarber",
  "Maracuja",
  "Tomate",
  "Grapefruit",
  "Schwarze Johannisbeere",
  "Orange",
]);
const SCHORLE = (name: string, small: number, large: number) => ({
  name,
  variants: [
    ["0,3l", small],
    ["0,5l", large],
  ] as [string, number][],
});
const WINE = (
  name: string,
  prices: [number, number, number, number?],
  bottle = "Flasche 0,75l",
  description?: string,
) => ({
  name,
  description,
  variants: [
    ["0,1l", prices[0]],
    ["0,2l", prices[1]],
    ["0,5l Karaffe", prices[2]],
    ...(prices[3] === undefined ? [] : [[bottle, prices[3]]]),
  ] as [string, number][],
});

const mittagstisch = mainCategory("Mittagstisch", [
  {
    name: "Fisch",
    station: "kitchen",
    options: [SALATBEILAGE],
    items: [
      {
        name: "1. Backfisch (Seelachsfilet) / Pommes / Remoulade",
        price: 1300,
      },
      {
        name: "2. Pfannkuchen / Räucherlachs / Avocado / Meerrettich",
        price: 1300,
      },
    ],
  },
  {
    name: "Vegetarisch",
    station: "kitchen",
    options: [SALATBEILAGE],
    items: [
      { name: "3. Gemüsemaultaschen in Rührei gebraten", price: 1100 },
      { name: "4. Salat / Antipasti Gemüse / Schafskäse / Brot", price: 1300 },
    ],
  },
  {
    name: "Vegan",
    station: "kitchen",
    options: [SALATBEILAGE],
    items: [
      {
        name: "5. Gelbes Thai Curry / Tofu / Gemüse / Basmatireis",
        price: 1200,
      },
      { name: "6. Kichererbsencurry / Gemüse / Basmatireis", price: 1200 },
    ],
  },
  {
    name: "Fleisch",
    station: "kitchen",
    options: [SALATBEILAGE],
    items: [
      {
        name: "7. Königsberger Klopse (Rinderhack) / Kapernsauce / Kartoffeln / Rote Beete",
        price: 1300,
      },
      { name: "8. Bauernfrühstück", price: 1200 },
      {
        name: "9. Hähnchenbrustfiletstreifen / Erdnusssauce / Bohnen / Basmatireis",
        price: 1300,
      },
      {
        name: "10. Burger (150g Färsen Patty) / Pommes",
        variants: [
          ["Burger", 1200],
          ["Cheeseburger", 1300],
        ],
      },
      { name: "11. Currywurst / Pommes", price: 1100 },
      {
        name: "12. Leberkäse / Spiegeleier / Pommes / Gewürzgurke",
        price: 1200,
      },
    ],
  },
  {
    name: "Süß",
    station: "kitchen",
    items: [
      { name: "Espresso auf Vanilleeis", price: 390 },
      { name: "Orangensaft auf Vanilleeis", price: 350 },
      { name: "Pfannkuchen / Rote Grütze / Vanilleeis", price: 1000 },
    ],
  },
]);

const saisonal = mainCategory(
  "Saisonale Speisen",
  [
    {
      name: "Fisch",
      station: "kitchen",
      items: [
        {
          name: "Backfisch (Seelachsfilet) / Remoulade / Salatbeilage",
          price: 1690,
          options: [choice("Beilage", ["Kartoffelsalat", "Pommes"])],
        },
        {
          name: "Nordseekrabben (100g)",
          variants: [
            ["mit Eiern und Bratkartoffeln mit Speck", 1980],
            ["mit Eiern auf Vollkornbrot", 1780],
          ],
          options: [choice("Eier", ["Rührei", "Spiegeleier"])],
        },
      ],
    },
    {
      name: "Vegetarisch",
      station: "kitchen",
      items: [
        { name: "Pasta / Ziegenkäse / Gemüse / Basilikum Pesto", price: 1490 },
        {
          name: "Salatteller / Antipasti Gemüse frisch gebraten / Ziegenkäse / Brot",
          price: 1590,
        },
      ],
    },
    {
      name: "Vegan",
      station: "kitchen",
      items: [
        { name: "Kichererbsen Curry / Gemüse / Basmatireis", price: 1490 },
        { name: "Salat / Falafel / Humus (ohne Brot vegan)", price: 1490 },
      ],
    },
    {
      name: "Fleisch",
      station: "kitchen",
      items: [
        {
          name: "Pasta / Hähnchenstreifen / Dijonsenf-Sahnesauce",
          price: 1490,
        },
        {
          name: "Burger (150g Färsen Patty) / Pommes / Salatbeilage",
          variants: [
            ["Burger", 1390],
            ["Cheeseburger", 1490],
            ["Westwind Burger + Spiegelei + Bacon", 1590],
          ],
        },
        {
          name: "Hähnchenbrustfiletstreifen / Erdnusssauce / Bohnen / Basmatireis",
          price: 1690,
        },
        { name: "Schnitzel vom Schwein / Rahmsauce / Pommes", price: 1590 },
        { name: "Currywurst XL / Pommes", price: 1190 },
        { name: "Leberkäse / Spiegeleier / Gewürzgurke / Pommes", price: 1490 },
      ],
    },
    {
      name: "Süß",
      station: "kitchen",
      items: [
        {
          name: "Espresso auf Vanilleeis",
          variants: [
            ["klassisch", 390],
            ["mit Amaretto", 590],
            ["mit Eierlikör", 590],
          ],
        },
        { name: "Orangensaft auf Vanilleeis", price: 390 },
        { name: "Pfannkuchen / Rote Grütze / Vanilleeis", price: 1090 },
      ],
    },
    {
      name: "Elbling",
      station: "bar",
      items: [
        WINE(
          "Elbling",
          [350, 690, 1710, 3290],
          "Flasche 1l",
          "Weingut Friedenberg, Mosel, trocken",
        ),
      ],
    },
    {
      name: "Neue Sommerdrinks",
      station: "bar",
      items: [
        {
          name: "Veneziano Select Spritz",
          price: 850,
          description: "Veneziano Aperitivo, Secco, Soda, Olive, Eis",
        },
        {
          name: "Monte Tonic",
          price: 850,
          description: "Amaro Montenegro, Tonic Water, Orange, Eis",
        },
      ],
    },
  ],
  "saisonal",
);

// Main categories follow the order of the printed Speisekarte; Mittagstisch and
// Saisonale Speisen are separate printed cards and appear as their own main categories.
export const MENU: MainCategory[] = [
  mainCategory("Frühstück", [
    {
      name: "Frühstück",
      station: "kitchen",
      items: [
        {
          name: "Westwind",
          variants: [
            ["für 2 Personen", 3290],
            ["für 3 Personen", 4590],
          ],
          description:
            "4 Brötchen, Brot, 2 Orangensäfte 0,1l, Räucherlachs, cremiger Joghurt mit Früchten, Krabbensalat, Heringssalat, Rühreier, Serrano Schinken, Salami- und Aufschnitt Auswahl, Käseauswahl, Honig, Konfitüre, Frischkäse, Nutella und frisches Obst",
          additives: [1, 2, 3],
        },
        {
          name: "Big for Two",
          price: 5990,
          description:
            "Nur am Wochenende o. Feiertags, sonst auf Vorbestellung. 2 Mimosa, 2 Heißgetränke nach Wahl, 0,75l Viva con Agua, 4 Brötchen, 2 Croissants, Brot, Räucherlachs, Joghurt mit Früchten und Müsli, Krabbensalat, Heringssalat, 4 Spiegeleier mit Bacon, Serrano Schinken, Salami- und Aufschnitt Auswahl, Käseauswahl, Honig, Konfitüre, Frischkäse, Nutella, halbe Avocado und frisches Obst",
          additives: [1, 2, 3, 9],
        },
        {
          name: "St. Georg",
          price: 1390,
          description:
            "2 Brötchen, Brot, Aufschnitt Auswahl, Serrano Schinken, Käseauswahl, Rühreier, Nutella, Konfitüre, frisches Obst, Honig, Butter",
          additives: [1, 2, 3, 4],
        },
        {
          name: "Elbe",
          price: 1590,
          description:
            "2 Brötchen, Brot, Räucherlachs, Frischkäse, Heringssalat, Meerrettich, Krabbensalat, Rührei, Rollmops, Butter",
          additives: [1, 2, 7],
        },
        {
          name: "Sweet",
          price: 1290,
          description:
            "2 Brötchen, Brot, Käse, Rühreier, cremiger Joghurt mit Früchten, Nutella, Honig, frisches Obst, Konfitüre, Butter",
          additives: [9],
        },
        {
          name: "Käse",
          price: 1390,
          description:
            "2 Brötchen, Brot, Käseauswahl, Rühreier, Frischkäse, Konfitüre, frisches Obst, Honig, Butter",
          additives: [1, 2],
        },
        {
          name: "Deftig",
          price: 990,
          description: "Rühreier mit Speck",
          options: [choice("Brot", ["Schwarzbrot", "Toastbrot"])],
          additives: [2, 3],
        },
        {
          name: "English",
          price: 1590,
          description:
            "Spiegeleier, Bacon, Baked Beans, Nürnberger, Tomaten, frische Champignons, Toast und Butter",
        },
        {
          name: "St. Pauli",
          price: 1090,
          description:
            "1 Brötchen, Schwarzbrot oder Toast, 3 Spiegeleier, Bacon",
          options: [choice("Brot", ["Schwarzbrot", "Toast"])],
          additives: [2, 3],
        },
        {
          name: "Alster (vegan)",
          price: 1590,
          description:
            "2 Brötchen, Schwarzbrot, Rühreier auf Tofu-Basis, Humus, Porridge mit Hafermilch, Avocado, Schokocreme, Konfitüre, Margarine, Obst",
        },
        {
          name: "Lange Reihe (vegetarisch)",
          price: 1490,
          description:
            "2 Brötchen, Brot, Rühreier mit Gemüse, Käseauswahl, Konfitüre, Nutella, Honig, Avocado, Humus, Obst",
          additives: [1, 2],
        },
        {
          name: "Porridge mit Obst",
          price: 790,
          options: [choice("Milch", ["Milch", "Hafermilch"])],
        },
        {
          name: "Shakshuka",
          price: 1290,
          options: [
            choice("Art", [
              "Mit wachsweichen Eiern und Feta",
              "Vegan mit Tofu, Humus, Kichererbsen",
            ]),
          ],
        },
      ],
    },
    {
      name: "Extras zum Frühstück",
      station: "kitchen",
      items: [
        {
          name: "Cremiger Sahne Joghurt",
          variants: [
            ["mit frischen Früchten und Honig", 790],
            ["mit Müsli, frischen Früchten und Honig", 890],
          ],
          options: [group("Extras", [["Chia-Samen", 150]])],
        },
        { name: "Frischer Obstsalat", price: 750 },
        {
          name: "Rühreier von 4 Eiern",
          variants: [
            ["natur mit Schnittlauch", 590],
            ["mit Speckwürfeln", 750],
            ["mit Gemüse", 780],
            ["mit Räucherlachs", 890],
            ["mit Garnelen", 1190],
            ["mit Käse, Tomaten und Zwiebeln", 790],
          ],
        },
        { name: "Veganes Rührei (Tofu)", price: 790 },
        { name: "Spiegeleier mit Bacon", price: 850, additives: [2, 3] },
        { name: "1 gekochtes Ei", price: 150 },
        { name: "Franzbrötchen (an Wochenenden)", price: 350 },
        { name: "Butter Croissant (an Wochenenden)", price: 290 },
        {
          name: "2 Scheiben Toast oder Schwarzbrot",
          price: 150,
          options: [choice("Brot", ["Toast", "Schwarzbrot"])],
        },
        { name: "1 Brötchen", price: 180 },
        { name: "Glutenfreies Brot", price: 300 },
        {
          name: "1 Portion Käse, Aufschnitt oder Krabbensalat",
          price: 490,
          options: [choice("Auswahl", ["Käse", "Aufschnitt", "Krabbensalat"])],
        },
        { name: "½ Avocado", price: 390 },
        {
          name: "1 Portion Räucherlachs oder Serrano Schinken",
          price: 650,
          options: [choice("Auswahl", ["Räucherlachs", "Serrano Schinken"])],
        },
        {
          name: "1 Portion Konfitüre, Frischkäse, Nutella oder Honig",
          price: 120,
          options: [
            choice("Auswahl", ["Konfitüre", "Frischkäse", "Nutella", "Honig"]),
          ],
        },
        { name: "1 Portion Humus", price: 150 },
        {
          name: "Müsli",
          variants: [
            ["klein", 350],
            ["groß", 650],
          ],
          options: [
            choice("Milch", ["Milch", "Laktosefreie Milch", "Hafermilch"]),
          ],
        },
      ],
    },
  ]),
  mainCategory("Tapas", [
    {
      name: "Veggi",
      station: "kitchen",
      items: [
        { name: "Portion Brot", price: 150 },
        {
          name: "Gemischter Antipastiteller",
          price: 1490,
          description: "Frisch gebratenes Gemüse mit Aioli und Brot",
        },
        { name: "Pimentos del Patron", price: 650 },
        { name: "Papas Arrugadas mit Mojo", price: 690 },
        { name: "3 Gebratene Gemüsemaultaschen", price: 690 },
        { name: "1 Gebratener Camembert, Preiselbeeren", price: 650 },
        { name: "5 Falafel Taler mit Minzjoghurt", price: 690 },
        { name: "Gebackener Schafkäse mit Balsamico-Honigcreme", price: 690 },
        {
          name: "Bruschetta mit Tomaten und Knoblauch",
          price: 690,
          options: [group("Extras", [["Avocado-Würfel", 200]])],
        },
        { name: "Manchego Käse mit Brot", price: 990 },
        { name: "Käsewürfel (Gouda), Brot", price: 690 },
        { name: "Aioli", price: 350 },
        { name: "Oliven, Olivenöl und Brot", price: 890, additives: [8] },
      ],
    },
    {
      name: "Fleisch",
      station: "kitchen",
      items: [
        {
          name: "6 Datteln im Speckmantel, Brot",
          price: 790,
          additives: [2, 3],
        },
        {
          name: "Hähnchenstreifen in Tomaten-Rosmarin-Olivenöl, Brot",
          price: 790,
        },
        {
          name: "Bratkartoffeln mit Zwiebeln und Speck",
          price: 690,
          additives: [2, 3],
        },
        { name: "Kalbsleber mit Zwiebeln und Apfel", price: 1190 },
        { name: "Serrano Schinken, Brot", price: 890, additives: [2] },
        { name: "Hackbällchen in Tomate", price: 690 },
        {
          name: "Fuetec mit Brot",
          price: 590,
          description: "Katalanische, luftgetrocknete Hartsalami",
        },
        { name: "Chorizo Paprika Pfännchen", price: 690 },
        { name: "Ziegenkäse im Speckmantel", price: 790, additives: [2, 3] },
      ],
    },
    {
      name: "Fisch",
      station: "kitchen",
      items: [
        { name: "Tintenfischstreifen im Teigmantel", price: 690 },
        {
          name: "Halbe Avocado, Krabbensalat, Brot",
          price: 1090,
          additives: [1, 2],
        },
        { name: "Gebratene Sardellen", price: 690 },
        { name: "8 Garnelen in Knoblauch-Olivenöl", price: 1290 },
        { name: "Lachsfilet (160g) in Zitronen-Knoblauch-Butter", price: 1390 },
        {
          name: "Hamburger Platte",
          price: 1890,
          description:
            "Rollmops, Räucherlachs, Herings- und Krabbensalat, Matjesfilet, Schwarzbrot und Ciabatta, Butter",
          additives: [1, 2],
        },
      ],
    },
  ]),
  mainCategory("Unsere Klassiker", [
    {
      name: "Unsere Klassiker",
      station: "kitchen",
      items: [
        {
          name: "Senfeier, Kartoffeln, Rote Beete",
          price: 1180,
          description: "3 Eier in leckerer Senfsauce mit Kartoffeln",
        },
        {
          name: "Gemüse Maultaschen in Rührei gebraten, Salatbeilage",
          price: 1490,
        },
        {
          name: "Hamburger Labskaus, Spiegeleier, Gewürzgurke, Rollmops",
          price: 1450,
          additives: [1, 2, 5],
        },
        {
          name: "3 Matjesfilets mit Hausfrauensauce und Bratkartoffeln mit Speck",
          price: 1590,
          additives: [2, 3],
        },
        {
          name: "Kalbsleber mit Zwiebeln, Apfelmus und Kartoffelpüree",
          variants: [
            ["klein", 1790],
            ["groß", 2390],
          ],
        },
        {
          name: "Bauernfrühstück mit Speck, Eiern, Kartoffeln, Gewürzgurke",
          price: 1390,
          additives: [1, 2, 3, 5],
        },
        {
          name: "Königsberger Klopse (Rinderhack), Kapernsauce, Kartoffeln, Rote Beete",
          price: 1690,
        },
        { name: "2 Matjesfilets auf Schwarzbrot mit Zwiebeln", price: 950 },
        {
          name: "Pasta Arrabiata",
          price: 1290,
          description: "Scharf, auf Wunsch mit Tomatensauce",
          options: [
            group("Sauce", [["Mit Tomatensauce statt scharf", 0]]),
            group(
              "Einlage",
              [
                ["Hähnchen", 300],
                ["Garnelen", 700],
                ["Grillgemüse und Ziegenkäse", 400],
              ],
              { max: 1 },
            ),
          ],
        },
        {
          name: "Thai Curry mit Gemüse und Basmatireis (vegan)",
          price: 1390,
          options: [
            choice("Sorte", ["Rot", "Gelb", "Grün"]),
            group(
              "Einlage",
              [
                ["Hähnchen", 300],
                ["Garnelen", 600],
                ["Tofu", 200],
              ],
              { max: 1 },
            ),
          ],
        },
      ],
    },
  ]),
  mainCategory("Salate", [
    {
      name: "Salate",
      station: "kitchen",
      options: [DRESSING],
      items: [
        {
          name: "Westwind Salat",
          price: 1690,
          description:
            "Mit gebratenen Hähnchenbrustfiletstreifen, gebratenem Gemüse und warmem Ziegenkäse, mit Brot",
        },
        {
          name: "Warmer Ziegenkäse mit Rosmarin und Honig auf Apfel mit Salatbeilage",
          price: 1390,
        },
        {
          name: "Hamburger Salat mit Räucherlachs und Tintenfischstreifen",
          price: 1790,
        },
        {
          name: "Gemischter Salat",
          variants: [
            ["als Beilage", 490],
            ["klein", 690],
            ["groß", 890],
          ],
          options: [
            group("Toppings", [
              ["Gebratener Ziegenkäse", 500],
              ["Gegrilltes Gemüse", 500],
              ["Gebackener Schafkäse", 500],
              ["Gebratene Hähnchenbrustfiletstreifen", 500],
              ["5 Garnelen", 500],
              ["½ Avocado und getrocknete Tomaten", 500],
              ["Thunfisch und Ei", 450],
              ["Gebratener Tofu", 450],
              ["Gebratene Tintenfischstreifen", 450],
            ]),
          ],
        },
      ],
    },
  ]),
  mainCategory("Pfannkuchen", [
    {
      name: "Herzhaft",
      station: "kitchen",
      items: [
        {
          name: "Pfannkuchen mit Speck und Zwiebeln",
          price: 1080,
          additives: [2, 3],
        },
        { name: "Pfannkuchen mit Ziegenkäse und Ahornsirup", price: 1590 },
        {
          name: "Pfannkuchen mit Räucherlachs, Avocado und Meerrettich",
          price: 1390,
        },
        {
          name: "Pfannkuchen mit Bacon und Ahornsirup",
          price: 1390,
          additives: [2, 3],
        },
        {
          name: "Pfannkuchen mit Speck und Apfelspalten",
          price: 1090,
          additives: [2, 3],
        },
      ],
    },
    {
      name: "Süß",
      station: "kitchen",
      options: [MOHN],
      items: [
        {
          name: "Pfannkuchen mit Apfelmus und Äpfeln",
          price: 890,
          additives: [3],
        },
        {
          name: "Pfannkuchen mit Schokoladensauce und Vanilleeis",
          price: 990,
          additives: [1],
        },
        {
          name: "Pfannkuchen mit Eierlikör, Vanilleeis, Sahne und Schokosauce",
          price: 1250,
          additives: [1],
        },
        { name: "Pfannkuchen mit Zucker und Zimt", price: 790 },
        { name: "Pfannkuchen mit Ahornsirup", price: 1290 },
        { name: "Pfannkuchen mit Nutella", price: 990 },
        {
          name: "Pfannkuchen mit Vanilleeis und Himbeeren",
          price: 1390,
          additives: [1],
        },
      ],
    },
  ]),
  mainCategory("Frische Waffeln", [
    {
      name: "Frische Waffeln",
      station: "kitchen",
      options: [MOHN, SAHNE],
      items: [
        { name: "Waffel mit Puderzucker", price: 690 },
        { name: "Waffel mit Puderzucker und frischem Obst", price: 920 },
        { name: "Waffel mit Puderzucker, Ahornsirup und Butter", price: 1290 },
        {
          name: "Waffel mit Puderzucker, roter Grütze und Vanilleeis",
          price: 990,
          additives: [1],
        },
        { name: "Waffel mit Puderzucker, Eierlikör und Sahne", price: 990 },
        {
          name: "Waffel mit Puderzucker, Schokosauce und Vanilleeis",
          price: 990,
          additives: [1],
        },
      ],
    },
  ]),
  mainCategory("Noch mehr Süßes", [
    {
      name: "Noch mehr Süßes",
      station: "kitchen",
      items: [
        { name: "Wechselnde Kuchenauswahl (auf Nachfrage)", price: 450 },
        { name: "Mandelkuchen", price: 500 },
        { name: "Warmes Schokotörtchen mit Vanilleeis", price: 790 },
        { name: "Vanilleeis mit warmen Himbeeren", price: 890, additives: [1] },
        {
          name: "Warmer Milchreis",
          variants: [
            ["mit Zimt und Zucker", 590],
            ["mit Zimt und Apfelmus", 690],
            ["mit roter Grütze", 690],
          ],
        },
        {
          name: "Eiskaffee oder Eisschokolade mit Vanilleeis und Sahne",
          variants: [
            ["klassisch", 650],
            ["mit Eierlikör", 850],
          ],
          options: [choice("Sorte", ["Eiskaffee", "Eisschokolade"])],
          additives: [1, 10],
        },
        { name: "Mandelkuchen mit Vanilleeis", price: 690, additives: [1] },
        {
          name: "Affogato",
          variants: [
            ["klassisch", 390],
            ["mit Amaretto", 590],
            ["mit Eierlikör", 590],
          ],
        },
      ],
    },
  ]),
  mittagstisch,
  saisonal,
  mainCategory("Warme Getränke", [
    {
      name: "Warme Getränke",
      station: "bar",
      items: [
        {
          name: "Becher Kakao",
          price: 490,
          options: [
            KAKAO_SORTE,
            group("Extras", [["Mit Chili", 0]]),
            SAHNE,
            MILK_ALTERNATIVES,
          ],
        },
        {
          name: "Schale Kakao",
          price: 590,
          options: [KAKAO_SORTE, SAHNE, MILK_ALTERNATIVES],
        },
        {
          name: "Becher Chocolaccino",
          price: 590,
          description: "Wie Cappuccino, mit Kakao statt Milch",
          additives: [10],
        },
        {
          name: "Becher heiße Milch mit Honig oder Aroma",
          price: 390,
          options: [
            choice("Geschmack", ["Honig", "Karamell", "Vanille", "Mandel"]),
            MILK_ALTERNATIVES,
          ],
          additives: [5],
        },
        { name: "Becher heiße, frische Zitrone mit Honig", price: 490 },
        {
          name: "Dirty Chai",
          price: 550,
          description: "Becher Yogi Tee mit einem Espresso",
          options: [MILK_ALTERNATIVES],
        },
        { name: "Heißer Fliederbeersaft mit Honig (im Winter)", price: 450 },
        {
          name: "Heißer Apfel",
          price: 490,
          description: "Trüber Apfelsaft mit Zimt und Nelken",
        },
        {
          name: "Goldene Milch Latte",
          price: 500,
          description: "Mit Ingwer, Kurkuma und Zimt",
          options: [MILK_ALTERNATIVES],
        },
        {
          name: "Matcha Latte oder Pink Chai Latte",
          price: 500,
          options: [
            choice("Sorte", ["Matcha Latte", "Pink Chai Latte"]),
            MILK_ALTERNATIVES,
          ],
        },
        {
          name: "Dirty Matcha Latte",
          price: 550,
          options: [MILK_ALTERNATIVES],
        },
      ],
    },
    {
      name: "Mit Schuss",
      station: "bar",
      items: [
        {
          name: "Espresso mit Likör 43, Sahne und Zimt",
          price: 550,
          additives: [10],
        },
        { name: "Fliederbeerpunsch mit Rum", price: 590 },
        { name: "Heiße Milch mit Eierlikör und Sahne", price: 550 },
        {
          name: "Frosteule",
          price: 590,
          description: "Becher Yogi Tee mit Likör 43",
        },
        {
          name: "Irish Coffee",
          price: 590,
          description: "Espresso mit irischem Whisky und Sahne",
          additives: [10],
        },
        {
          name: "Pharisäer",
          price: 590,
          description: "Espresso mit Rum und Sahne",
          additives: [10],
        },
        {
          name: "Tote Tante",
          price: 590,
          description: "Kakao mit Rum und Sahne",
        },
        { name: "Rumgrog", price: 450, description: "Wasser mit Rum" },
        {
          name: "Coffee Shooter",
          price: 550,
          description: "Espresso, Eierlikör und Sahne",
          additives: [10],
        },
        {
          name: "Winzer Glühwein (im Winter)",
          price: 490,
          options: [choice("Sorte", ["Weiß", "Rot"])],
        },
        {
          name: "Eisbrecher (im Winter)",
          price: 590,
          description: "Glühwein mit Rum oder Amaretto",
          options: [choice("Schuss", ["Rum", "Amaretto"])],
        },
        {
          name: "Glühgin",
          price: 690,
          description:
            "Heißer Apfelsaft mit Zimt, Nelken, Orangen, Ingwer und Gin",
        },
      ],
    },
  ]),
  mainCategory("Tee", [
    {
      name: "Tee",
      station: "bar",
      items: [
        { name: "Schale Yogi Tee mit Milch und Honig", price: 590 },
        { name: "Frische Minze", price: 490 },
        { name: "Frischer Ingwertee mit Honig", price: 490 },
        { name: "Frischer Salbei-Zitronengras Tee", price: 490 },
        {
          name: "Tee aus loser Teeauswahl",
          variants: [
            ["Glas", 450],
            ["Schale", 550],
          ],
          options: [
            choice("Sorte", [
              "Ceylon",
              "Earl Grey",
              "Rooibos Sanddorn",
              "Fenchel-Anis",
              "Grüner",
              "Hamburger Grütze",
              "Bio Fresh Tulsi",
              "Darjeeling",
            ]),
          ],
        },
      ],
    },
  ]),
  mainCategory("Espresso & Kaffee", [
    {
      name: "Espresso & Kaffee",
      station: "bar",
      options: [COFFEE_EXTRAS],
      items: [
        {
          name: "Schale Milchkaffee",
          price: 590,
          options: [group("Kaffee", [["Mit Getreidekaffee", 0]]), AROMA],
          additives: [10],
        },
        { name: "Becher Kaffee", price: 540, additives: [10] },
        { name: "Flat White", price: 450, additives: [10] },
        { name: "Café Crema", price: 400, additives: [10] },
        { name: "Espresso", price: 300, additives: [10] },
        { name: "Espresso mit Milchschaumhaube", price: 330, additives: [10] },
        {
          name: "Cappuccino",
          variants: [
            ["klein", 400],
            ["groß", 550],
          ],
          options: [AROMA],
          additives: [10],
        },
        {
          name: "Latte Macchiato",
          price: 450,
          options: [AROMA],
          additives: [10],
        },
        {
          name: "Espresso-Tonic",
          price: 790,
          description: "Doppelter Espresso, Tonic, Eis",
          additives: [10],
        },
      ],
    },
  ]),
  mainCategory("Alkoholfreie Getränke", [
    {
      name: "Alkoholfreie Getränke",
      station: "bar",
      items: [
        SCHORLE("Holunderblütenschorle", 400, 550),
        SCHORLE("Grapefruit Lemon Schorle", 400, 550),
        SCHORLE("Lemon Ingwer Schorle", 400, 550),
        { ...SCHORLE("Lemon Squash", 370, 530), additives: [2] },
        { ...SCHORLE("Fruchtschorle", 370, 530), options: [SAEFTE] },
        { name: "Red Bull auf Eis 0,2l", price: 390 },
        { name: "Saft / Nektar 0,2l", price: 400, options: [SAEFTE] },
        { name: "Frisch gepresster Orangensaft 0,2l", price: 550 },
        { name: "Spezi 0,33l", price: 380, additives: [1, 10] },
        { name: "Cola 0,33l", price: 380, additives: [1, 10] },
        {
          name: "Cola ohne Zucker 0,33l",
          price: 380,
          additives: [1, 5, 6, 10],
        },
        {
          name: "Limo 0,33l",
          price: 380,
          options: [choice("Sorte", ["Zitrone", "Orange"])],
        },
        { name: "Club Mate 0,5l", price: 550, additives: [10] },
        {
          name: "Mineralwasser Viva con Agua",
          variants: [
            ["0,33l Flasche", 330],
            ["0,75l Flasche", 690],
          ],
          options: [choice("Sorte", ["Laut", "Leise"])],
        },
        {
          name: "Schweppes 0,2l",
          price: 400,
          options: [
            choice("Sorte", [
              "Ginger Ale",
              "Bitter Lemon",
              "Tonic Water",
              "Ginger Beer",
              "Wild Berry",
              "Pomegranate",
            ]),
          ],
          additives: [1, 3, 5, 11],
        },
      ],
    },
  ]),
  mainCategory("Biere", [
    {
      name: "Vom Fass",
      station: "bar",
      items: [
        SCHORLE("Pinkus Spezial (naturtrübes Pils)", 390, 590),
        SCHORLE("Einbecker Brauherrn Pils", 390, 590),
        { ...SCHORLE("Alsterwasser", 390, 590), additives: [3] },
      ],
    },
    {
      name: "Flaschenbiere",
      station: "bar",
      items: [
        {
          name: "Schneider Weissbier 0,5l",
          price: 580,
          options: [choice("Sorte", ["Hell", "Alkoholfrei"])],
        },
        { name: "Pinkus alkoholfrei naturtrüb 0,33l", price: 440 },
        { name: "Einbecker Dunkel 0,33l", price: 390 },
        { name: "Cidre 0,33l", price: 490 },
        { name: "Chiemseer Hell Lager 0,5l", price: 590 },
      ],
    },
  ]),
  mainCategory("Sekt, Prosecco, Crémant & Champagner", [
    {
      name: "Sekt, Prosecco, Crémant & Champagner",
      station: "bar",
      items: [
        { name: "Flasche Winzer Sekt, trocken 0,75l", price: 2890 },
        {
          name: "Gratien & Meyer, Crémant de Loire, Brut 0,75l",
          price: 3990,
          description: "Frankreich, 12% Vol.",
        },
        {
          name: "Secco trocken",
          variants: [
            ["Glas 0,1l", 390],
            ["auf Eis 0,2l", 550],
          ],
        },
        { name: "Piccolo Champagner 0,2l", price: 3900 },
        { name: "Flasche Champagner 0,75l", price: 8800 },
      ],
    },
  ]),
  mainCategory("Weine", [
    {
      name: "Rotweine",
      station: "bar",
      items: [
        WINE(
          "El Abuelo de Piqueras Reserva",
          [360, 690, 1710, 2590],
          undefined,
          "Spanien, trocken",
        ),
        WINE("Merlot", [340, 650, 1610], undefined, "Italien, trocken"),
        WINE(
          "Primitivo",
          [360, 690, 1710, 2590],
          undefined,
          "Italien, halbtrocken",
        ),
        {
          name: "Lambrusco Reggiano DOC Piccolo 0,2l",
          price: 690,
          description: "Italien, süß",
        },
        WINE(
          "Cabernet Sauvignon",
          [340, 650, 1610, 2990],
          "Flasche 1l",
          "Frankreich",
        ),
      ],
    },
    {
      name: "Roséweine",
      station: "bar",
      items: [
        WINE(
          "Spätburgunder",
          [360, 690, 1710, 3290],
          "Flasche 1l",
          "Deutschland, halbtrocken",
        ),
      ],
    },
    {
      name: "Weißweine",
      station: "bar",
      items: [
        WINE(
          "Riesling",
          [360, 690, 1710, 2590],
          undefined,
          "Deutschland, trocken",
        ),
        WINE(
          "Sauvignon Blanc",
          [390, 750, 1850, 2790],
          undefined,
          "Deutschland, trocken",
        ),
        WINE(
          "Weißburgunder",
          [340, 650, 1610, 2990],
          "Flasche 1l",
          "Deutschland, trocken",
        ),
        WINE(
          "Grauburgunder",
          [340, 650, 1610, 2990],
          "Flasche 1l",
          "Deutschland, trocken",
        ),
        WINE(
          "Chardonnay",
          [390, 750, 1850, 2790],
          undefined,
          "Deutschland, trocken",
        ),
        WINE(
          "Elbling",
          [360, 690, 1710, 3290],
          "Flasche 1l",
          "Deutschland, Mosel, trocken",
        ),
        WINE(
          "Grüner Veltliner",
          [340, 650, 1610, 2990],
          "Flasche 1l",
          "Österreich, trocken",
        ),
        WINE(
          "Aveleda Vinho Verde",
          [340, 650, 1610, 2390],
          undefined,
          "Portugal, halbtrocken",
        ),
        {
          name: "Weißweinschorle",
          variants: [
            ["0,2l", 550],
            ["0,5l", 1350],
          ],
        },
        {
          name: "Wein-Tonic",
          price: 1290,
          description: "0,3l Weißwein, 0,2l Tonic, Minze, Eis",
        },
        {
          name: "Rotwein mit Orangenlimo oder Cola auf Eis 0,5l",
          price: 990,
          options: [choice("Mit", ["Orangenlimo", "Cola"])],
        },
      ],
    },
  ]),
  mainCategory("Aperitif", [
    {
      name: "Aperitif",
      station: "bar",
      items: [
        {
          name: "Martini 5cl",
          price: 450,
          options: [choice("Sorte", ["Bianco", "Rosso", "Dry"])],
          additives: [1],
        },
        {
          name: "Kir 0,2l",
          price: 650,
          description: "Weißwein mit Crème de Cassis",
        },
        {
          name: "Dalva Port 4cl",
          price: 400,
          options: [choice("Sorte", ["Tawny", "Rosé", "White"])],
        },
        {
          name: "White Port Tonic",
          price: 790,
          description: "4cl Port, 0,2l Tonic, Eis",
        },
        {
          name: "Déjà-Vu Antique Rosé",
          price: 840,
          description: "6cl Déjà-Vu, 4cl Weißwein, 4cl Soda, Eis",
        },
      ],
    },
  ]),
  mainCategory("Longdrinks & Cocktails", [
    {
      name: "Longdrinks & Cocktails",
      station: "bar",
      items: [
        {
          name: "Gordons Gin Tonic / Lemon",
          price: 990,
          options: [choice("Mit", ["Tonic", "Lemon"])],
        },
        { name: "Campari Orange", price: 790, additives: [1] },
        { name: "Southern Ginger", price: 990, additives: [1] },
        { name: "Tequila Sunrise", price: 810 },
        {
          name: "Wodka Lemon / Orange / Tonic / Red Bull",
          price: 950,
          options: [choice("Mit", ["Lemon", "Orange", "Tonic", "Red Bull"])],
        },
        { name: "Havanna Cola", price: 890, additives: [1, 10] },
        { name: "Jack Daniels Cola", price: 870, additives: [1, 10] },
        { name: "Pernod Wasser", price: 620, additives: [1] },
        { name: "Pernod Cola", price: 850, additives: [1, 10] },
        {
          name: "Cuba Libre",
          price: 990,
          description: "Havana Club, Limettensaft und brauner Zucker",
        },
        { name: "Caipirinha", price: 990 },
        { name: "Mojito", price: 990 },
        { name: "Mai Tai", price: 990 },
        { name: "Long Island Iced Tea", price: 1190 },
        { name: "Bloody Mary", price: 790 },
      ],
    },
    {
      name: "Alkoholfreie Cocktails",
      station: "bar",
      items: [
        { name: "Sanbitter Spritz", price: 750 },
        { name: "Crodino Spritz", price: 750 },
        {
          name: "Ipanema",
          price: 790,
          description: "Ginger Ale, Limette, Rohrzucker, Eis",
        },
        {
          name: "Hugo alkoholfrei",
          price: 790,
          description: "Ginger Ale, Holunderblütensirup, Minze, Eis",
        },
      ],
    },
  ]),
  mainCategory("Special Drinks", [
    {
      name: "Special Drinks",
      station: "bar",
      items: [
        {
          name: "Aperol / Campari Spritz",
          variants: [
            ["mit Secco", 890],
            ["mit Maracujasaft und Secco", 900],
            ["mit Rhabarbersaft, Secco, Soda und Minze", 900],
          ],
          options: [choice("Sorte", ["Aperol", "Campari"])],
        },
        { name: "Hugo", price: 850 },
        {
          name: "Black Hugo",
          price: 890,
          description: "Mit schwarzem Johannisbeersaft",
        },
        {
          name: "Helga",
          price: 850,
          description: "Secco mit Himbeeren, Minze und Himbeersirup, Eis",
        },
        {
          name: "Inge",
          price: 850,
          description: "Secco mit Ingwer, Minze und Ingwersirup, Eis",
        },
        {
          name: "Hamburger Liebe",
          price: 850,
          description:
            "4cl Helbing Kümmel, frischer Zitronensaft, Ginger Ale, Eis",
        },
        {
          name: "Moscow Mule",
          price: 850,
          description: "4cl Wodka, Spicy Ginger, frischer Limettensaft, Eis",
        },
        {
          name: "Helbing Tonic",
          price: 850,
          description: "4cl Helbing Kümmel, Tonic, Zitrone, Eis",
        },
        {
          name: "Gin Sul Tonic",
          price: 1180,
          description: "4cl Gin Sul, Tonic, Rosmarin, Orange, Eis",
        },
        { name: "Mimosa", price: 790, description: "Sekt, Orangensaft, Eis" },
        {
          name: "Lillet Spritz",
          price: 790,
          description: "Lillet, Prosecco, Mineralwasser, Gurke, Minze, Eis",
        },
        {
          name: "Saft Spritz",
          price: 750,
          description: "Saft nach Wahl, Secco, Mineralwasser, Eis",
          options: [SAEFTE],
        },
        {
          name: "Green Secco",
          price: 790,
          description: "P31 mit Secco, Soda, Limette, Minze, Eis",
        },
        {
          name: "Green Tonic",
          price: 850,
          description: "P31 mit weißem Martini, Tonic, Limette, Eis",
        },
        {
          name: "Negroni",
          price: 890,
          description: "Campari, roter Martini, Gin, Orange, Eis",
        },
        {
          name: "Espresso Martini",
          price: 890,
          description: "Espresso, Wodka, Kaffeelikör und Eis",
        },
        {
          name: "Lillet Tonic",
          price: 850,
          description: "8cl Lillet, 0,2l Tonic, Orange, Zitrone, Eis",
        },
        {
          name: "Lillet Wild Berry",
          price: 850,
          description: "8cl Lillet, 0,2l Wild Berry, Himbeeren, Eis",
        },
        {
          name: "Gin Wild Berry",
          price: 1150,
          description:
            "6cl Gin, 0,2l Wild Berry, 1cl Limettensaft, Himbeeren, Minze, Eis",
        },
        {
          name: "Wodka Wild Berry",
          price: 1150,
          description: "6cl Wodka, 0,2l Wild Berry, Himbeeren, Eis",
        },
        {
          name: "Dark & Stormy",
          price: 890,
          description: "4cl Rum, Limettensaft, Ginger Beer, Eis",
        },
        {
          name: "Déjà-Vu Longdrink",
          price: 850,
          options: [choice("Mit", ["Tonic", "Wild Berry", "Ginger Beer"])],
        },
        {
          name: "Pepino",
          variants: [
            ["mit Soda", 790],
            ["mit Wild Berry", 850],
            ["mit Tonic", 850],
          ],
        },
        {
          name: "Limoncello Spritz",
          price: 850,
          description: "Limoncello, Sodawasser, Secco, Zitrone, Eis",
        },
        {
          name: "Limoncello Gin Fizz",
          price: 890,
          description:
            "Gin, Limoncello, Sodawasser, Zitronensaft, Zitrone, Eis",
        },
        {
          name: "Schweppes Pomegranate Longdrink",
          description: "Mit Minze, Zitrone, Eis",
          variants: [
            ["+ 4cl Martini Bianco", 800],
            ["+ 4cl Campari", 850],
            ["+ 4cl Gin", 890],
          ],
        },
      ],
    },
  ]),
  mainCategory("Spirituosen", [
    {
      name: "Gin (4cl)",
      station: "bar",
      items: [
        { name: "Gordons", price: 600 },
        { name: "Gin Sul", price: 850 },
        { name: "Tanqueray", price: 750 },
      ],
    },
    {
      name: "Whiskey (4cl)",
      station: "bar",
      items: [
        { name: "Jack Daniels", price: 480 },
        { name: "Glenfiddich", price: 550 },
        { name: "Tullamore Dew", price: 470 },
        { name: "Four Roses Kentucky Straight Bourbon", price: 490 },
      ],
    },
    {
      name: "Brandy & Cognac (2cl)",
      station: "bar",
      items: [
        { name: "Osborne Veterano", price: 390 },
        { name: "Carlos", price: 570 },
        { name: "Cardenal Mendoza", price: 590 },
      ],
    },
    {
      name: "Liköre (2cl)",
      station: "bar",
      items: [
        { name: "Cointreau", price: 450 },
        { name: "Sambuca Molinari", price: 350 },
        { name: "Hierbas", price: 400 },
        { name: "Amaretto", price: 290 },
        { name: "Eierlikör", price: 290 },
        { name: "Southern Comfort", price: 450 },
        { name: "Likör 43 (4cl)", price: 550 },
        { name: "Baileys (4cl)", price: 550, additives: [1] },
        { name: "Frangelico", price: 450 },
        { name: "Hamborger Lakritz", price: 350 },
        { name: "Kahlua", price: 450 },
      ],
    },
    {
      name: "Rum (4cl)",
      station: "bar",
      items: [
        { name: "Havana Club", price: 650 },
        { name: "Myer's Jamaica", price: 620 },
        { name: "Don Papa Baroko", price: 750 },
        { name: "Bacardi Carta Negra", price: 540 },
      ],
    },
    {
      name: "Brände & Grappa (2cl)",
      station: "bar",
      items: [
        { name: "Grappa", price: 350 },
        {
          name: "Edelbrand Weingut Gerhard Karle",
          price: 500,
          options: [
            choice("Sorte", [
              "Wald Himbeere",
              "Marc vom Gewürztraminer",
              "Williams Christ",
            ]),
          ],
        },
      ],
    },
    {
      name: "Diverse",
      station: "bar",
      items: [
        { name: "Wodka 4cl", price: 530 },
        { name: "Tequila weiß 2cl", price: 350 },
        { name: "Pernod 4cl", price: 590 },
        { name: "Menthe Pastille 4cl", price: 590 },
        { name: "Campari 4cl", price: 490 },
      ],
    },
    {
      name: "Köm",
      station: "bar",
      items: [
        { name: "Helbing Kümmel 2cl", price: 300 },
        { name: "Averna 4cl", price: 490 },
        { name: "Ramazzotti 4cl", price: 490 },
        { name: "Helbing Aquavit 2cl", price: 450 },
        { name: "Jägermeister 2cl", price: 300 },
        { name: "Küstennebel 2cl", price: 300 },
        { name: "Oldesloer Weizenkorn 2cl", price: 250 },
      ],
    },
  ]),
  mainCategory("Zum Knabbern", [
    {
      name: "Zum Knabbern",
      station: "bar",
      items: [
        { name: "Mix Nüsse, Glas 0,1l", price: 750 },
        { name: "Pringles 40g", price: 390 },
        { name: "Tüte Erdnüsse", price: 390 },
        { name: "Käsewürfel 100g, Brot", price: 690, station: "kitchen" },
      ],
    },
  ]),
];
