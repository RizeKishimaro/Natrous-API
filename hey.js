const { GPT4All } = require('gpt4all');

const main = async (question) => {
  // Instantiate GPT4All with default or custom settings
  const gpt4all = new GPT4All('gpt4all-lora-quantized', true); // Default is 'gpt4all-lora-quantized' model
  // Initialize and download missing files
  await gpt4all.init();

  // Open the connection with the model
  await gpt4all.open();
  // Generate a response using a prompt
  const prompt = question;
  const res = await gpt4all.prompt(
    'how to continue ask you question in nodejs'
  );
  console.log(res);
  // Close the connection when you're done
};
module.exports = main;


