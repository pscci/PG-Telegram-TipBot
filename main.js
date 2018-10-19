const Telegraf = require('telegraf')
const {Markup, Extra} = require('telegraf')
const dateformat = require('dateformat')
const usernamebot = '@bljrtgbot' //ganti atau sesuaikan dengan username bot kamu

const bot = new Telegraf(process.env.BOT_TOKEN) 
const appName = process.env.PROJECT_NAME
const appPort = process.env.PORT
process.env.TZ = 'Asia/Jakarta'

bot.telegram.setWebhook(`https://${appName}.glitch.me/webhook`)
console.log(`Bot sudah Aktif dan siap menerima pesan.`)
bot.startWebhook('/webhook', null, appPort)

//Contoh Tombol Inline
var TInline = Extra .HTML()
         .markup((m) => m.inlineKeyboard([
          [m.callbackButton('1\ufe0f\u20e3 Satu','1'), m.callbackButton('2\ufe0f\u20e3 Dua', '2')], 
          [m.urlButton('\ud83d\udc49 Buka Tautan', 'https://telegram.me/bljrtgbot')]
         ]))

bot.on('message', (ctx) => {
  
  console.log(ctx.message.from.first_name + ' | '+ ctx.chat.type  + ' | '+ ctx.message.text) //Untuk menampilkan Log Pesan

  if (ctx.updateSubTypes == 'text')  {  
    
      var msg = ctx.message.text.toLowerCase(), //<== Berfungsi mengubah pesan menjadi huruf kecil semua
          pesan = msg.replace(/\s\s+/g, ' '), //<== Menghapus kelebihan spasi
          msgid = ctx.message.message_id,
          chatid = ctx.chat.id,
          userid = ctx.from.id,
          nama = ctx.from.last_name == undefined ? ctx.from.first_name : ctx.from.first_name + ' ' + ctx.from.last_name,
          balas = {reply_to_message_id:ctx.message.message_id}
   
      switch (pesan) {
          
        case '/start': case '/start' + usernamebot:
          ctx.replyWithMarkdown(`Hai [${nama}](tg://user?id=${userid}) 😊`)
        break;
        
        //Contoh Reply metode sendMessage Telegram | https://core.telegram.org/bots/api#sendmessage
        case 'tes':
          ctx.telegram.sendMessage (
            chatid,
            'Ini balasannya jika ada yg chat ke bot dengan kata: *tes*',
            {
              parse_mode: 'Markdown',
              reply_to_message_id: msgid
            }
          )
        break;   
          
        //Contoh reply dengan shortcut telegraf Tes 1, Tes 2 dan Tes 3 | http://telegraf.js.org/context.html
        case 'tes 1':
          ctx.reply('Ini balasannya jika ada yg chat ke bot dengan kata: tes 1')
        break;   
          
        case 'tes 2':
          ctx.replyWithHTML('Contoh <i>balasan</i> <code>dengan</code> <b>Format HTML</b> 😊')
        break; 
          
        case 'tes 3':
          ctx.replyWithMarkdown('Contoh _balasan_ `dengan` *Format Markdown* 😊')
        break; 
          
        //Contoh Pesan dengan tambahan baris baru menggunakan \n
        case 'tes 4':
          ctx.reply('Ini Baris Pertama\nIni Baris Kedua\n\nini Baris Ketiga')
        break; 

        case '/id': case '/id' + usernamebot: case '!id': 
          ctx.reply(`ID Kamu adalah: ${userid}`)
        break;  
          
        case '/time': case '/time' + usernamebot:  case '!time':
          ctx.reply(`Tanggal ${dateformat(new Date(), 'dd/mm/yyyy')} \nPukul ${dateformat(new Date(), 'HH:MM:ss')}  WIB`)
        break;  
          
        case '!ping': case '/ping': case '❗️ ping': case 'ping':
        const DateDiff = require('date-diff')
        var date1 = new Date(),
            date2 = new Date(ctx.message.date*1000),
            diff = new DateDiff(date1, date2) .seconds(),
            selisih = diff < 1 ? `` : `\n\n\u23f3 sekitar <b>${Math.floor(diff)}</b> <code>detik lalu.</code>`

          ctx.replyWithHTML(`\ud83c\udfd3 <b>PONG!!</b> ${selisih}`, balas)
        break;
        
        //Contoh Menampilkan Reply dengan Keyboard Markup | https://core.telegram.org/bots/api#replykeyboardmarkup  
        case '!keyboard':
          ctx.reply(`Ini contoh pesan dengan Tombol Keyboard Markup`, Markup 
                    .keyboard ([   
                                ['Tombol 1' , 'Tombol 2'],
                                ['!inline']
                              ]) 
                    .resize() 
                    .extra()
                   )
        break;
          
        case 'tombol 1':
          ctx.reply(`👍 Tombol Nomor 1️⃣`)
        break;
          
        case 'tombol 2':
          ctx.reply(`👍 Tombol Nomor 2️⃣`)
        break;
        
        //Contoh Menampilkan Reply dengan Inline Keyboard Markup | https://core.telegram.org/bots/api#inlinekeyboardmarkup 
        case '!inline':
          ctx.reply(`Ini contoh pesan dengan Tombol Inline`,  TInline)
        break;        
          
        //Debug Pesan
        case '!debug':
               if (ctx.message.reply_to_message == null){ //Jika tidak mereply pesan
                   ctx.replyWithHTML(`\u267b\ufe0f Reply Pesan, ketikkan: <code>!debug</code>`)
                } else {
                var Debug = JSON.stringify(ctx.message.reply_to_message, null, 4) 
                   ctx.replyWithHTML(`<pre>${Debug}</pre>`, {reply_to_message_id:ctx.message.reply_to_message.message_id})
                }
        break;
           
        //jika tidak didefinisikan alias tidak ada case yg cocok tampilkan default.
        default:
          if (pesan.match(/bot/)){ //<= contoh pakai regex 
             ctx.reply('Hallo...')
          } else {
             ctx.reply('😍') 
          }
        break;
          
      } //end Switch Case 
    
   //end SubType text
    
  } else if (ctx.updateSubTypes == 'new_chat_members') { 
    //Pesan Welcome pada Grup
    var member = ctx.message.new_chat_member.last_name == undefined ? ctx.message.new_chat_member.first_name : ctx.message.new_chat_member.first_name + ' ' + ctx.message.new_chat_member.last_name,
        pesan = `Selamat Datang <a href='tg://user?id=${ctx.message.new_chat_member.id}'>${member}</a> `
        pesan += `di grup <b>${ctx.chat.title}</b> \n\nSelamat berdiskusi 😊`
        
        ctx.replyWithHTML(`${pesan}`, Extra .HTML()
                       .markup((m) => m.inlineKeyboard([
                       [m.urlButton('📃 Baca Dulu ini 📃', 'https://telegram.me/bljrtgbot')]
                       ]))
                       )
          
  } else if (ctx.updateSubTypes == 'left_chat_member') { 
    //Pesan untuk yg keluar Grup
    var pesan = `Selamat Tinggal <a href='tg://user?id=${ctx.message.left_chat_member.id}'>${ctx.message.left_chat_member.first_name}</a> ☹️`
    ctx.replyWithHTML(`${pesan}`)
    
  }
  
})



//Untuk CallBack Query Tombol Inline
bot.on('callback_query', (ctx) =>{   
  switch(ctx.callbackQuery.data) {
    case '1':
      ctx.editMessageText('1\ufe0f\u20e3 <b>Tombol Satu</b>\n\nIni contoh data Tombol Satu', TInline)
    break;
    
    case '2':
      ctx.editMessageText('2\ufe0f\u20e3 <b>Tombol Dua</b>\n\nIni contoh data Tombol Dua', TInline)
    break;   
  }
}) 