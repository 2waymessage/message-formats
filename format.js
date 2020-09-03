function outgoingMessageFormat(originator, recipient, body, uuid, setupTime, account, carrier) {
    const MessageBody = JSON.stringify({
        "originator": originator,
        "recipient": recipient,
        "text": body,
        "uuid": uuid,
        "setupTime": setupTime,
        "account": account,
        "carrier": carrier
    });
    return (MessageBody);
}

function statusMessageFormat(messageUuid, senderAccount, statusTimestamp, deliveryProtocol, carrier, communicationChannel, status, statusReason, messageCount) {
    const MessageBody = JSON.stringify({
        "uuid": messageUuid,
        "account": senderAccount,
        "statusTimestamp": statusTimestamp * 1,
        "protocol": deliveryProtocol,
        "carrier": carrier,
        "communicationChannel": communicationChannel,
        "status": status,
        "statusReason": statusReason,
        "messageCount": messageCount
    });
    return (MessageBody);
}

let generateExtraFields = function (channel, carrier, messageAttrs, replaceDiacritics, messageUuid, env) {
    channel = channel.toUpperCase();
    carrier = carrier.toUpperCase();
    return ({
        "carrier": message.carrier[channel][carrier],
        "smsParams.characterCount": String(messageAttrs.char_count),
        "smsParams.replaceDiacritics": String(replaceDiacritics),
        "smsParams.isUnicode": String(messageAttrs.is_unicode),
        "messageUUID": messageUuid,
        "additionalData": messageAttrs.additionalData,
        "env": env
    })
};

function incomingMessageFormat(uuid, originator, recipient, deliveryTimestamp, messageBody, supplier, messageId, isOriginatorValid, originatorNumberType, communicationChannel, arrivalTimestamp, attachment, userDetails) {
    const MessageBody = JSON.stringify({
        "uuid": uuid,
        "originator": originator,
        "recipient": recipient,
        "deliveryTimestamp": deliveryTimestamp,
        "arrivalTimestamp": arrivalTimestamp,
        "body": messageBody,
        "supplier": supplier,
        "carrrierMessageId": messageId,
        "isOriginatorValid": isOriginatorValid,
        "originatorNumberType": originatorNumberType,
        "communicationChannel": communicationChannel,
        "attachment": attachment,
        "userDetails": userDetails
    });
    return (MessageBody);
}

module.exports = {
    outgoingMessageFormat,
    statusMessageFormat,
    generateExtraFields,
    incomingMessageFormat
}