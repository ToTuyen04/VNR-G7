import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the Excel file
const workbook = XLSX.readFile(path.join(__dirname, 'public/quiz/Quiz.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('Total rows:', data.length);
console.log('First row:', JSON.stringify(data[0], null, 2));

// Format questions for the game
const questions = data.map((row, index) => {
  // Try different possible column names
  const question = row['Question'] || row['question'] || row['Câu hỏi'] || row['Q'] || '';
  const optionA = row['A'] || row['Option A'] || row['Đáp án A'] || '';
  const optionB = row['B'] || row['Option B'] || row['Đáp án B'] || '';
  const optionC = row['C'] || row['Option C'] || row['Đáp án C'] || '';
  const optionD = row['D'] || row['Option D'] || row['Đáp án D'] || '';
  const correctAnswer = row['Answer'] || row['Correct'] || row['Đáp án đúng'] || row['Đáp án'] || '';
  
  // Find the correct answer index (0-3)
  let answerIndex = 0;
  if (typeof correctAnswer === 'string') {
    const upperAnswer = correctAnswer.trim().toUpperCase();
    if (upperAnswer === 'A' || upperAnswer === '0') answerIndex = 0;
    else if (upperAnswer === 'B' || upperAnswer === '1') answerIndex = 1;
    else if (upperAnswer === 'C' || upperAnswer === '2') answerIndex = 2;
    else if (upperAnswer === 'D' || upperAnswer === '3') answerIndex = 3;
  } else if (typeof correctAnswer === 'number') {
    answerIndex = correctAnswer;
  }
  
  return {
    q: question,
    opts: [String(optionA), String(optionB), String(optionC), String(optionD)],
    ans: answerIndex
  };
});

// Save to TypeScript file
const tsContent = `// Auto-generated from Quiz.xlsx
export const QUESTION_POOL = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'src/data/questions.ts'), tsContent);
console.log(`\n✅ Extracted ${questions.length} questions to src/data/questions.ts`);

// Print sample
console.log('\nSample questions:');
questions.slice(0, 3).forEach((q, i) => {
  console.log(`\n${i + 1}. ${q.q}`);
  q.opts.forEach((opt, j) => console.log(`   ${['A', 'B', 'C', 'D'][j]}. ${opt}`));
  console.log(`   Answer: ${['A', 'B', 'C', 'D'][q.ans]}`);
});
