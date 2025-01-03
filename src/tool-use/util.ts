import readline from 'readline';

export async function askQuestion(rl: readline.Interface): Promise<string> {
    return new Promise((resolve) => {
      rl.question('', resolve);
    });
  }