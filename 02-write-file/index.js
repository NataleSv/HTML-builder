const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { stdout } = process;

fs.open(path.join(__dirname, 'newtext.txt'), 'a', (err) => {
    if (err) throw err;
    stdout.write('File opened \n');
    stdout.write('Please, type something \n');
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', input => {
    if (input === 'exit') {
        process.exit();
    } else {
        fs.appendFile(path.join(__dirname, 'newtext.txt'), `${input}\n`, (err) => {
            if (err) throw err;
        });
    }
});
process.on('exit', () => stdout.write('Bye! See you later! \n'));