const dictionary: { [key: string]: string } = {
  "приготовить": "cook",
  "пища": "food",
  "блюдо": "dish",
  "рецепт": "recipe",
  "диета": "diet",
  "план диеты": "diet plan",
  "план питания": "meal plan",
  "продукт": "product",
  "еда": "food",
  "масло": "butter",
  "соль": "salt",
  "сахар": "sugar",
  "завтрак": "breakfast",
  "обед": "lunch",
  "ужин": "dinner",
  "перекус": "snack",
  "десерт": "dessert",
  "фрукт": "fruit",
  "овощ": "vegetable",
  "салат": "salad",
  "мясо": "meat",
  "рыба": "fish",
  "птица": "poultry",
  "морепродукты": "seafood",
  "паста": "pasta",
  "хлеб": "bread",
  "сыр": "cheese",
  "йогурт": "yogurt",
  "суп": "soup",
  "рис": "rice",
  "лапша": "noodles",
  "торт": "cake",
  "пирог": "pie",
  "мороженое": "ice cream",
  "крем": "cream",
  "бутерброд": "sandwich",
  "пицца": "pizza",
  "тако": "taco",
  "буррито": "burrito",
  "суши": "sushi",
  "карри": "curry",
  "соус": "sauce",
  "приправа": "condiments",
  "уксус": "vinegar",
  "специя": "spice",
  "трава": "herbs",
  "чеснок": "garlic",
  "кориандр": "cilantro",
  "шалфей": "sage",
  "лаванда": "lavender",
  "мята": "mint",
  "укроп": "dill",
  "лук": "chives",
  "имбирь": "ginger",
  "куркума": "turmeric",
  "корица": "cinnamon",
  "мускатный орех": "nutmeg",
  "гвоздика": "cloves",
  "паприка": "paprika",
  "кумин": "cumin",
  "горчица": "mustard",
  "майонез": "mayonnaise",
  "кетчуп": "ketchup",
  "песто": "pesto",
  "яблоко": "apple",
  "банан": "banana",
  "апельсин": "orange",
  "грейпфрут": "grapefruit",
  "виноград": "grape",
  "ананас": "pineapple",
  "клубника": "strawberry",
  "голубика": "blueberry",
  "малина": "raspberry",
  "ежевика": "blackberry",
  "клюква": "cranberry",
  "вишня": "cherry",
  "персик": "peach",
  "груша": "pear",
  "слива": "plum",
  "абрикос": "apricot",
  "киви": "kiwi",
  "дыня": "melon",
  "арбуз": "watermelon",
  "морковь": "carrot",
  "брокколи": "broccoli",
  "огурец": "cucumber",
  "помидор": "tomato",
  "перец": "pepper",
  "шпинат": "spinach",
  "капуста": "kale",
  "петрушка": "parsley",
  "базилик": "basil",
  "тимьян": "thyme",
  "розмарин": "rosemary",
  "орегано": "oregano",
  "сельдерей": "celery",
  "спаржа": "asparagus",
  "авокадо": "avocado",
  "баклажан": "eggplant",
  "кабачок": "zucchini",
  "тыква": "squash",
  "редис": "radish",
  "репа": "turnip",
  "свекла": "beet",
  "брюссельская капуста": "brussels",
  "цветная капуста": "cauliflower",
  "артишок": "artichoke",
  "чили": "chili",
  "картофель": "potato",
  "кукуруза": "corn",
  "бамбуковый росток": "bamboo shoot",
  "бобовая росток": "bean sprout",
  "бок чой": "bok choy",
  "даикон": "daikon",
  "корень": "root",
  "окра": "okra",
  "горох": "pea",
  "эдамаме": "edamame",
  "хикама": "jicama",
  "кольраби": "kohlrabi",
  "гриб": "mushroom"
};


const translateAndMatch = (text: string): boolean => {
  const translatedText = translateText(text);
  if (!translatedText) {
      console.error('Translation failed');
      return false;
  }

  console.log(`Testing translated text: "${translatedText}"`);

  const foodRegex = /\b(food|eat|butter|salt|sugar|meal|dish|recipe|cook|breakfast|lunch|dinner|snack|dessert|fruit|vegetable|salad|meat|fish|poultry|seafood|pasta|bread|cheese|yogurt|soup|rice|noodles|cake|pie|ice cream|cream|sandwich|pizza|taco|burrito|sushi|curry|sauce|condiments|oil|vinegar|spice|herbs|garlic|cilantro|sage|lavender|mint|dill|chives|ginger|turmeric|cinnamon|nutmeg|cloves|paprika|cumin|coriander|mustard|mayonnaise|ketchup|pesto|apple|banana|orange|grapefruit|grape|pineapple|strawberry|blueberry|raspberry|blackberry|cranberry|cherry|peach|pear|plum|apricot|kiwi|melon|watermelon|carrot|broccoli|cucumber|tomato|onion|pepper|lettuce|spinach|kale|parsley|basil|thyme|rosemary|oregano|cabbage|celery|asparagus|avocado|eggplant|zucchini|squash|radish|turnip|beet|brussels|sprout|cauliflower|artichoke|chili|pumpkin|potato|corn|bamboo shoot|bean|sprout|bok choy|daikon|root|okra|pea|edamame|jicama|kohlrabi|mushroom)\b/i;
  const result = foodRegex.test(translatedText);
  console.log(`Result: ${result}`);

  return result;
};

const translateText = (text: string): string => {
  const words = text.toLowerCase().split(" ");
  const translatedWords = words.map(word => {
      return dictionary[word] || word;
  });
  return translatedWords.join(" ");
};

// Function to check text matching a regular expression
export const isFoodRelated= (text: string): boolean => {
  return translateAndMatch(text);
};

