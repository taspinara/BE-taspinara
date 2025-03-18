const fs = require('fs');

// Reading from a file
// fs.readFile('example.txt', 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading file:', err);
//     return;
//   }
//   console.log('File content:', data);
// });

// Writing to a file
// const contentToWrite = 'This is some content to write to the file. xxxx';
// fs.writeFile('newFile.txt', contentToWrite, 'utf8', (err) => {
//   if (err) {
//     console.error('Error writing to file:', err);
//     return;
//   }
//   console.log('File written successfully.');
// });

// Appending to a file
// const additionalContent = '\nThis content is appended to the file.';
// fs.appendFile('newFile.txt', additionalContent, 'utf8', (err) => {
//   if (err) {
//     console.error('Error appending to file:', err);
//     return;
//   }
//   console.log('Content appended successfully.');
// });

// Checking if a file exists
// fs.access('example.txt', fs.constants.F_OK, (err) => {
//   if (err) {
//     console.error('File does not exist:', err);
//     return;
//   }
//   console.log('File exists.');
// });

// Creating a directory
// fs.mkdir('newDirectory', (err) => {
//   if (err) {
//     console.error('Error creating directory:', err);
//     return;
//   }
//   console.log('Directory created successfully.');
// });

// // Removing a directory
// fs.rmdir('newDirectory', { recursive: true }, (err) => {
//   if (err) {
//     console.error('Error removing directory:', err);
//     return;
//   }
//   console.log('Directory removed successfully.');
// });

// Removing a file
// fs.unlink('newFile.txt', (err) => {
//   if (err) {
//     console.error('Error deleting file:', err);
//     return;
//   }
//   console.log('File deleted successfully.');
// });