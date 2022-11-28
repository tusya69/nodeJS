// dataConverter.js

class Converter {
    constructor(data) {
        this.data = data;
    }

    // конвертуємо JSON в XML і надсилаємо
    jsonToXml(obj = this.data) {
        let xml = '';
        for (let prop in obj) {
            xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
            if (obj[prop] instanceof Array) {
                for (let array in obj[prop]) {
                    xml += "<" + prop + ">";
                    xml += this.jsonToXml(new Object(obj[prop][array]));
                    xml += "</" + prop + ">";
                }
            } else if (typeof obj[prop] == "object") {
                xml += this.jsonToXml(new Object(obj[prop]));
            } else {
                xml += obj[prop];
            }
            xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
        }
        xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
        return xml;
    }

    // конвертуємо JSON в URL-закодовану строку і надсилаємо
    urlEncoded() {
        return encodeURI(JSON.stringify(this.data));

    }
    // надсилаємо JSON у вигляді строки
    json() {
        return JSON.stringify(this.data);
    }
}

module.exports = Converter;