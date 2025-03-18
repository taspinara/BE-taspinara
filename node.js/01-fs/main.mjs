import { writeFile, readFile } from 'fs/promises';
 
// try {
//   await writeFile('shrek.txt', 'Shrek is love, Shrek is life');
//   console.log('successfully created shrek.txt');
// } catch (error) {
//   console.error('there was an error:', error.message);
// }

try {
  const fileContent = await readFile('shrek.txt', 'utf8');
  console.log(fileContent);
} catch (error) {
  console.error('there was an error:', error.message);
}