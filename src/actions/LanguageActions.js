import translate from 'google-translate-api';

class LanguageActions {
  static detectLanguageInput(string) {
    return translate(string).then(res => res.from.language.iso);
  }
}

export default LanguageActions;
