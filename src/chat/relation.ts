export const relation = (text: string): boolean => {
    const foodregex = /\b(приготовить|пища|блюдо|рецепт|диета|план диеты|план питания|продукт)\b/i;
    console.log(`Testing text: "${text}" with regex: ${foodregex}`);
    
    const result = foodregex.test(text);
    console.log(`Result: ${result}`);
    
    return result;
  };
  
  // Вызов функции для теста
  console.log(relation('рецепт')); // Ожидаемый результат: true
  console.log(relation('пища')); // Ожидаемый результат: true
  console.log(relation('блюдо')); // Ожидаемый результат: true
  console.log(relation('что-то другое')); // Ожидаемый результат: false
  