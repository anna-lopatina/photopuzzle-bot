const express = require('express')
const app = express()
app.use(express.json())

const BOT_TOKEN = process.env.BOT_TOKEN
const APP_URL = 'https://puzzle-app-gray.vercel.app'

async function send(chatId, text, extra = {}) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...extra }),
  })
}

const createBtn = {
  reply_markup: {
    inline_keyboard: [[{
      text: '🧩 Create Puzzle',
      web_app: { url: APP_URL }
    }]]
  }
}

app.post('/webhook', async (req, res) => {
  const { message } = req.body
  if (!message) return res.sendStatus(200)

  const chatId = message.chat.id

  // /start command
  if (message.text?.startsWith('/start')) {
    await send(chatId,
      `👋 <b>Welcome to PhotoPuzzle!</b>\n\n🧩 Turn any photo into a puzzle and challenge your friends to solve it — the photo is only revealed when the puzzle is complete!\n\nTap the button below to create your first puzzle 👇`,
      createBtn
    )
    return res.sendStatus(200)
  }

  // User sends a photo
  if (message.photo || message.document?.mime_type?.startsWith('image/')) {
    await send(chatId,
      `📸 <b>Nice photo!</b>\n\nWant to turn it into a puzzle? Open the app, upload your photo and share the challenge with your friends 👇`,
      createBtn
    )
    return res.sendStatus(200)
  }

  // Any other text or message
  await send(chatId,
    `🧩 <b>Ready to puzzle someone?</b>\n\nUpload a photo, pick a difficulty, and send your friend a link — they'll have to solve the puzzle before the photo is revealed! 👇`,
    createBtn
  )

  res.sendStatus(200)
})

app.get('/', (_, res) => res.send('PhotoPuzzle bot is running! 🧩'))

app.listen(3000, () => console.log('Bot running on port 3000'))
