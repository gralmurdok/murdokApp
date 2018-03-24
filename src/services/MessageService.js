class MessageService {

  static formatMessage(text) {
    return {
      response_type: 'in_channel',
      text
    }
  }

  static formatChannels(arrayMessage) {
    const formatted = arrayMessage.map(str => `<#${str}>`);
    const result = formatted.join('\n')
    return this.formatMessage(result);
  }
}

export default MessageService;