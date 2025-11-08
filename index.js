const axios = require('axios');
const { Client, MessageMedia } = require('whatsapp-web.js');

// Konfigurasi
const API_BOTCHAX = 'herokimakkk'; // Ganti dengan API key Anda
const CONVERSATIONS = {};

// Inisialisasi client WhatsApp
const client = new Client();

// Event handler saat bot siap
client.on('ready', () => {
    console.log('Bot WhatsApp siap!');
});

// Utility class untuk emoji dan teks (bisa disesuaikan)
class Emoji {
    constructor() {
        this.proses = "⏳"; // Emoji untuk status "sedang memproses"
    }

    async get_costum_text() {
        // Simulasi teks custom yang berbeda
        return ["Teks 1", "Teks 2", "Teks 3", "Teks 4", "Memproses..."];
    }
}

const em = new Emoji();

// Fungsi untuk mendapatkan respons dari AI
async function getAIResponse(conversation) {
    const url = 'https://api.botcahx.eu.org/api/search/openai-custom';
    try {
        const response = await axios.post(url, {
            message: conversation,
            apikey: API_BOTCHAX
        });
        return response.data.response; // Sesuaikan dengan struktur respons API
    } catch (error) {
        console.error('Gagal mendapatkan respons dari AI:', error);
        return 'Maaf, ada masalah saat memproses permintaan Anda.';
    }
}

// Event handler saat ada pesan masuk
client.on('message', async message => {
    const user_id = message.from; // ID user dari pesan
    const question = message.body; // Isi pesan dari user

    // Inisialisasi percakapan jika belum ada
    if (!CONVERSATIONS[user_id]) {
        CONVERSATIONS[user_id] = [
            {
                role: "system",
                content: "Kamu adalah asisten paling canggih yang berbahasa Indonesia gaul, dan jangan gunakan bahasa inggris sebelum saya memulai duluan.",
            },
            {
                role: "assistant",
                content: "Oke siap! Ada yang bisa plana bantu, sensei?",
            },
        ];
    }

    // Status "sedang memproses"
    const proses_ = await em.get_costum_text();
    const pros = await message.reply(`${em.proses} **${proses_[4]}**`);

    try {
        // Tambahkan pesan user ke percakapan
        CONVERSATIONS[user_id].push({ role: "user", content: question });

        // Dapatkan respons dari AI
        const ai_response = await getAIResponse(CONVERSATIONS[user_id]);

        // Tambahkan respons AI ke percakapan
        CONVERSATIONS[user_id].push({ role: "assistant", content: ai_response });

        // Kirim respons ke user
        await message.reply(ai_response);
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        await message.reply('Maaf, terjadi kesalahan saat memproses pesan Anda.');
    } finally {
        // Hapus status "sedang memproses"
        await pros.delete();
    }
});

// Inisialisasi bot
client.initialize();
