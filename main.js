const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const dateformat = require('dateformat')
const usernamebot = '@PGTipTokenBot' //ganti atau sesuaikan dengan username bot kamu

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
           
        //Contoh-contoh Lainnya
          
        //Menampilkan Info BOT
        case '/bot': 
        if (ctx.chat.type != 'private') {
          ctx.telegram.getMe() .then ((data)=>{
            
            var pesan = `\ud83e\udd16 <b>Identitas Bot</b>\n\n`
                pesan += `\ud83c\udd94 Bot: <code>${data.id}</code>\n`
                pesan += ` \u251c \ud83d\udc64 Nama: <b>${data.first_name}</b>\n`
                pesan += ` \u2514 \ud83d\udeb9 Username: @${data.username}`
            
            ctx.reply(pesan)  
            ctx.replyWithHTML(`${pesan}`, Extra .inReplyTo(ctx.message.message_id)
                 .markup((m) => m.inlineKeyboard([
                 [m.urlButton(`Start Bot`, `https://telegram.me/${data.username}`)]
                 ])
              )) 
          })
        }
        break;
            
        //Menampilkan Status di Group  
        case '/status': case '!status':
        if (ctx.chat.type != 'private') {
            ctx.getChatMember(ctx.from.id) .then ((data)=>{
            ctx.getChatMembersCount(ctx.chat.id) .then ((anggota) => { 
              var usertipe = ctx.chat.username == undefined 
                  ? ctx.chat.type == `supergroup`
                    ? `\n \u2514 \ud83c\udf99 Tipe: <code>${ctx.chat.type}</code> (private)\n\n` 
                    : `\n \u2514 \ud83c\udf99 Tipe: <code>${ctx.chat.type}</code>\n\n`
                  : `\n \u251c \ud83d\udeb9 Username @${ctx.chat.username}\n \u2514 \ud83c\udf99 Tipe: <code>${ctx.chat.type}</code> (public)\n\n`,
                  nmakhir = ctx.from.last_name == undefined ? `` : `\n \u251c \ud83d\udc64 Akhir: ${ctx.from.last_name}`,
                  nmuser = ctx.from.username == undefined ? `` : `\n \u251c \ud83d\udeb9 Username @${ctx.from.username}`,
                  bahasa = ctx.from.language_code == undefined ? `\n \u251c \ud83c\udfc1 Bahasa: en-US` : `\n \u251c \ud83c\udfc1 Bahasa: ${ctx.from.language_code}`,
                  status = `\ud83c\udd94 Grup: <code>${ctx.chat.id}</code>\n \u251c \ud83d\udc65 <b>${ctx.chat.title}</b>${usertipe}`
                  status += `\ud83c\udd94 User: <code>${ctx.from.id}</code>\n \u251c \ud83d\udc64 Nama: ${ctx.from.first_name}${nmakhir}${nmuser}`
                  status += `${bahasa}\n \u2514 \ud83d\udd30 Level: <b>${data.status}</b>`
                  status += `\n\n#\ufe0f\u20e3 Total: <code>${anggota}</code> anggota.`
            ctx.reply(status)
            ctx.replyWithHTML(`${status}`, Extra .inReplyTo(ctx.message.message_id))
             })
            })
          }
        break;  
          
        //Menampilkan Daftar Admin Group
        case '/admin': case '!admin':
          if (ctx.chat.type != 'private') {
            ctx.getChatAdministrators(ctx.chat.id) .then ((result)=>{
              
              var data = result,
              pesan ='\ud83d\udd30 <b>Administrator</b>\n',
              jmlh = data.length - 1
                
              data.sort((a, b)=>{
                return a.status > b.status
              })
                
              for (var i = 0; i < (data.length); i++)
              if (data[i].status == 'administrator') {
                
                var icon = (i == jmlh - 1) ? ' \u2514 ' : ' \u251c '
                pesan += icon + (i + 1) +'. <a href="tg://user?id='+ data[i].user.id + '">' + data[i].user.first_name
                pesan += data[i].user.last_name == undefined ? '</a>\n' : ' ' + data[i].user.last_name + '</a>\n'
                
              } else {
                
                var creator = data[i].user.last_name == undefined ? `<code>${data[i].user.first_name}</code>` : `<code>${data[i].user.first_name} ${data[i].user.last_name}</code>`
                    creator += data[i].user.username == undefined ? '' : '\n🚹 @' + data[i].user.username 

              }
            ctx.getChatMembersCount(ctx.chat.id)
                .then ((data) => { 
                var line = `\u3030\u3030\u3030\u3030\u3030\u3030\u3030`
                var total =  `\ud83d\udcb9 Total <code>${jmlh}</code> administrator dan <code>${data}</code> anggota.`
                ctx.reply(pesan)
                ctx.replyWithHTML(`\ud83d\udc65 <b>${ctx.chat.title}</b>\n\ud83c\udd94 <code>${ctx.chat.id}</code>\n${line}\n\ud83d\udd30 <b>Creator</b>\n👤 ${creator}\n\n${pesan}\n${total}`, 
                              Extra .inReplyTo(ctx.message.message_id)
                             )
            })
            })
          }
        break; 
          
        //jika tidak didefinisikan alias tidak ada case yg cocok tampilkan default.
        default:
          if (pesan.match(/hai/)){ //<= contoh pakai regex 
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
