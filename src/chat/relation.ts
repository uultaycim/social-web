const dictionary: { [key: string]: string } = {
  "приготовить": "cook",
  "пища": "food",
  "блюдо": "dish",
  "рецепт": "recipe",
  "диета": "diet",
  "план диеты": "diet plan",
  "план питания": "meal plan",
  "продукт": "product"
};

const translateAndMatch = (text: string): boolean => {
  const translatedText = translateText(text);
  if (!translatedText) {
      console.error('Translation failed');
      return false;
  }

  console.log(`Testing translated text: "${translatedText}"`);

  const foodRegex = /\b(cook|food|dish|recipe|diet|diet plan|meal plan|product)\b/i;
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

// Функция для проверки соответствия текста регулярному выражению
export const relation = (text: string): boolean => {
  return translateAndMatch(text);
};

// Пример использования функции relation
const text = 'некий текст о рецептах';
relation(text);
