require('dotenv').config();

const { KINTARO_AUTO_RESPONSER } = process.env;

module.exports = {
    name: 'messageCreate',
    execute(message) {

        if (KINTARO_AUTO_RESPONSER !== 'true') return;

        if (message.author.bot) return;

        const content1 = message.content.toLowerCase();
        const forbiddenWords1 = ['oc', 'oç', 'occ', 'oe'];

        if (forbiddenWords1.includes(content1)) {
            message.reply('ben mi?');
        }

        if (message.content.toLowerCase() === 'selam') {
            message.reply('Selam!');
        }

        if (message.content.toLowerCase() === '<@753989089228750879>') { //kintaro
            message.reply('Çok büyük adam');
        }

        if (message.content.toLowerCase() === '<@1151886628885905500>') { //durden
            message.reply('Çok büyük adam');
        }

        if (message.content.toLowerCase() === '<@502898238760943626>') { //flawes
            message.reply('Çok büyük adam.');
        }

        if (message.content.toLowerCase() === '<@747774599974092871>') { //starx
            message.reply('Çok büyük adam');
        }

        if (message.content.toLowerCase() === '<@1275170909224702113>') { //caylak
            message.reply('Çok büyük adam');
        }

        if (message.content.toLowerCase() === '<@864161804396265522>') { //micsfo
            message.reply('Çok büyük adam');
        }

        if (message.content.toLowerCase() === '<@607636256452509725>') { //leywin
            message.reply('Anime kızı avında. Cevap veremez.');
        }

        if (message.content.toLowerCase() === 'sa') {
            const random = Math.random();

            if (random < 0.5) { // %50
                message.reply('Cami mi lan burası orospu evladı');
            } else {
                message.reply('Aleyküm Selam');
            }
        }
    },
};