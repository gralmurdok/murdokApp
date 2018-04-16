class MessageService {

  static formatMessage(text, msgProps, msgProps2) {
    return {
      'response_type': 'in_channel',
      text,
      attachments: [
        msgProps,
        msgProps2
      ].filter(x => !!x)
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
