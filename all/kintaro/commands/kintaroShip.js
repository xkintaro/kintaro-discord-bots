const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');
const axios = require('axios');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('İki kullanıcı arasındaki uyumu yüzde olarak gösterir ve bir resim paylaşır.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Uyumunu ölçmek istediğiniz kullanıcıyı seçin')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const user1 = interaction.user;
            const user2 = interaction.options.getUser('user');

            if (!user2) {
                return interaction.reply({ content: 'Lütfen geçerli bir kullanıcı seçin.', flags: 64 });
            }

            const randomNumber = Math.floor(Math.random() * 101);

            const user1AvatarURL = user1.displayAvatarURL({ format: 'png', size: 512 });
            const user2AvatarURL = user2.displayAvatarURL({ format: 'png', size: 512 });

            let user1Avatar, user2Avatar, bgImage;
            try {
                user1Avatar = await loadImage(await convertToSupportedFormat(user1AvatarURL));
                user2Avatar = await loadImage(await convertToSupportedFormat(user2AvatarURL));
                bgImage = await sharp(path.join(__dirname, '..', 'assets', 'bg.jpeg'))
                    .resize(700, 300)
                    .blur(5)
                    .toBuffer();
                bgImage = await loadImage(bgImage);
            } catch (error) {
                console.error('Resim yüklenirken hata oluştu:', error);
                return interaction.reply({ content: 'Resimler yüklenirken bir hata oluştu.', flags: 64 });
            }

            const canvas = createCanvas(580, 300);
            const context = canvas.getContext('2d');

            context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

            const drawRoundedImage = (ctx, img, x, y, width, height) => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(x + width / 2, y + height / 2, (width / 2) + 10, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fillStyle = 'black';
                ctx.fill();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, x, y, width, height);
                ctx.restore();
            };

            const avatarSize = 220;
            const avatarY = (canvas.height - avatarSize) / 2;
            const user1X = 42;
            const user2X = 320;

            drawRoundedImage(context, user1Avatar, user1X, avatarY, avatarSize, avatarSize);
            drawRoundedImage(context, user2Avatar, user2X, avatarY, avatarSize, avatarSize);

            context.font = '75px Arial';
            context.fillStyle = '#ff0000';
            context.lineWidth = 2;
            context.strokeStyle = 'black';
            context.lineJoin = 'round';

            const heartX = (user1X + avatarSize + user2X) / 2;
            context.textAlign = 'center';
            context.strokeText('❤️', heartX, canvas.height / 2 + 15);
            context.fillText('❤️', heartX, canvas.height / 2 + 15);
            context.font = 'bold 30px Arial';
            context.fillStyle = '#ffffff';
            context.shadowColor = 'black';
            context.shadowBlur = 10;
            context.lineWidth = 3;
            context.strokeStyle = 'black';
            context.lineJoin = 'round';
            context.strokeText(`${randomNumber}%`, canvas.width / 2 + 2, canvas.height / 2 + 55);
            context.fillText(`${randomNumber}%`, canvas.width / 2 + 2, canvas.height / 2 + 55);

            const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'ship-image.png' });

            await interaction.reply({
                content: `<@${user1.id}> ve <@${user2.id}>`,
                files: [attachment]
            });
        } catch (error) {
            console.error('Bir hata oluştu:', error);
            interaction.reply({ content: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.', flags: 64 });
        }
    },
};

async function convertToSupportedFormat(imageUrl) {
    const sharp = require('sharp');
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        if (response.status !== 200) {
            throw new Error(`Resim indirilemedi, sunucu ${response.status} hatası döndürdü.`);
        }
        return sharp(response.data).toFormat('png').toBuffer();
    } catch (error) {
        throw new Error('Resim dönüştürme hatası: ' + error.message);
    }
}