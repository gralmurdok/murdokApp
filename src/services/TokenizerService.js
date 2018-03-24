import tokenizer from 'string-tokenizer';

class TokenizerService {
  static resolveTokens(string) {
    return tokenizer()
      .input(string)
      .token('command', /\w+/)
      .resolve();
  }
}

export default TokenizerService;