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

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const googlePhoneNumberTypes = {
    "0": "FIXED_LINE",
    "1": "MOBILE",
    "2": "FIXED_LINE_OR_MOBILE",
    "3": "TOLL_FREE",
    "4": "PREMIUM_RATE",
    "5": "SHARED_COST",
    "6": "VOIP",
    "7": "PERSONAL_NUMBER",
    "8": "PAGER",
    "9": "UAN",
    "10": "VOICEMAIL",
    "-1": "UNKNOWN"
};

function isValidNumber(phoneNumber) {
    try {
        const normalizedPhoneNumber = normalizePhoneNumberWithPlus(phoneNumber);
        const number = phoneUtil.parseAndKeepRawInput(normalizedPhoneNumber);
        if (phoneUtil.getNumberType(number) >= 0)
            return 1;
        else
            return 0;
    } catch (e) {
        return 0;
    }
}

function getCountryCode(phoneNumber) {
    try {
        const normalizedPhoneNumber = normalizePhoneNumberWithPlus(phoneNumber);
        const number = phoneUtil.parseAndKeepRawInput(normalizedPhoneNumber);
        return (number.getCountryCode());
    } catch (e) {
        return 0;
    }
}

function isMobileNumber(phoneNumber) {
    try {
        const normalizedNumber = normalizePhoneNumberWithPlus(phoneNumber);
        const number = phoneUtil.parseAndKeepRawInput(normalizedNumber);
        if (googlePhoneNumberTypes[phoneUtil.getNumberType(number)] === "MOBILE") {
            return 1;
        } else {
            return 0;
        }
    } catch (e) {
        return 0;
    }
}

function getNumberType(phoneNumber) {
    if (isValidNumber(phoneNumber)) {
        const normalizedNumber = normalizePhoneNumberWithPlus(phoneNumber);
        const number = phoneUtil.parseAndKeepRawInput(normalizedNumber);
        return googlePhoneNumberTypes[phoneUtil.getNumberType(number)];
    }
    return "INVALID";
}

function normalizePhoneNumberWithPlus(phoneNumber) {
    const leadingDigitsRegex = /\+|^00/i;
    if (phoneNumber.includes('+')) {
        return (phoneNumber);
    } else {
        return ('+' + phoneNumber.replace(leadingDigitsRegex, ''));
    }
}

function normalizePhoneNumberWithoutPlus(phoneNumber) {
    const leadingDigitsRegex = /\+|^00/i;
    return phoneNumber.replace(leadingDigitsRegex, '');
}

module.exports = {
    outgoingMessageFormat,
    statusMessageFormat,
    generateExtraFields,
    incomingMessageFormat,
    googlePhoneNumberTypes,
    normalizePhoneNumberWithPlus,
    isMobileNumber,
    isValidNumber,
    getNumberType,
    normalizePhoneNumberWithoutPlus,
    getCountryCode
}