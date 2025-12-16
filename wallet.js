function generateAddress() {
  // App pessoal → endereço fixo
  return process.env.MASTER_ADDRESS;
}

module.exports = { generateAddress };
