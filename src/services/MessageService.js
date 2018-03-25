class MessageService {

  static formatMessage(text, msgProps) {
    return {
      'response_type': 'in_channel',
      text,
      attachments: [
        msgProps
      ]
    };
  }

  static formatChannels(arrayMessage) {
    const formatted = arrayMessage.map(str => `<#${str}>`);
    const result = formatted.join('\n')
    return this.formatMessage(result);
  }

  static formatWaterCoupleUsers(arrayMessage, msgProps) {

    if(typeof arrayMessage === 'string') {
      return this.formatMessage(arrayMessage);
    }

    const formatted = arrayMessage.map(str => `<@${str}>`);
    const result = formatted.join('\n')
    msgProps.text = result;
    return this.formatMessage('', msgProps);
  }
}

export default MessageService;
