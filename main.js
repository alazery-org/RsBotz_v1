const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const moment = require('moment-timezone')
const { wait, banner, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, start, info, success, close } = require('./baileys/functions')
const { color } = require('./baileys/color')
const _welkom = JSON.parse(fs.readFileSync('./baileys/data/welcome.json'))
const setting = JSON.parse(fs.readFileSync('./setting.json'))

require('./index.js')
nocache('./index.js', module => console.log(`${module} telah di update !!`))

const starts = async (RsBotz = new WAConnection()) => {
    RsBotz.logger.level = 'warn'
    RsBotz.version = [2, 2142, 12]
    RsBotz.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan Qrnya Kak Waktu Cuma 20 Detik !!'))
    })

    fs.existsSync(`./sessions.json`) && RsBotz.loadAuthInfo(`./sessions.json`)
    RsBotz.on('connecting', () => {
        start('2', 'Menghubungkan...')
    })
    RsBotz.on('open', () => {
        success('2', 'Tersambung !!')
    })
    await RsBotz.connect({timeoutMs: 30*1000})
        fs.writeFileSync(`./sessions.json`, JSON.stringify(RsBotz.base64EncodedAuthInfo(), null, '\t'))

    RsBotz.on('chat-update', async (message) => {
        require('./index.js')(RsBotz, message, _welkom)
    })
RsBotz.on("group-participants-update", async (anu) => {

    const isWelkom = _welkom.includes(anu.jid)
    try {
      groupMet = await RsBotz.groupMetadata(anu.jid)
      groupMembers = groupMet.participants
      groupAdmins = getGroupAdmins(groupMembers)
      mem = anu.participants[0]

      console.log(anu)
      try {
        pp_user = await RsBotz.getProfilePicture(mem)
      } catch (e) {
        pp_user = "https://telegra.ph/file/c9dfa715c26518201f478.jpg"
      }
      try {
        pp_grup = await RsBotz.getProfilePicture(anu.jid)
      } catch (e) {
        pp_grup =
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60"
      }
      if (!isWelkom) return
      if (anu.action == 'add') {
	  num = anu.participants[0]
	  mdata = await RsBotz.groupMetadata(anu.jid)
      memeg = mdata.participants.length
      let v = RsBotz.contacts[num] || { notify: num.replace(/@.+/, "") }
      anu_user = v.vname || v.notify || num.split("@")[0]
      time_wel = moment.tz("Asia/Jakarta").format("HH:mm")
	  try {
	  ppimg = await RsBotz.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
	  } catch {
	  ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
	  }
	  image = await getBuffer(`https://telegra.ph/file/c3769788b1a0d117100ff.jpg`)
	  teks = `𝐇𝐚𝐢 *@${anu_user}*
𝐈𝐧𝐭𝐫𝐨 𝐃𝐮𝐥𝐮 𝐘𝐚𝐤 !!
𝐍𝐚𝐦𝐚 :
𝐀𝐬𝐤𝐨𝐭 :
𝐔𝐦𝐮𝐫 :
𝐊𝐞𝐥𝐚𝐬 :
𝐒𝐭𝐚𝐭𝐮𝐬 :`
	  let buff = await getBuffer(ppimg)
	  RsBotz.sendMessage(mdata.id, image, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
      } else if (anu.action == 'remove') {
	  num = anu.participants[0]
	  mdata = await RsBotz.groupMetadata(anu.jid)
      memeg = mdata.participants.length
      let w = RsBotz.contacts[num] || { notify: num.replace(/@.+/, "") }
      anu_user = w.vname || w.notify || num.split("@")[0]
      time_wel = moment.tz("Asia/Jakarta").format("HH:mm")
	  try {
	  ppimg = await RsBotz.getProfilePicture(`${num.split('@')[0]}@c.us`)
	  } catch {
	  ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
	  }
	  image = await getBuffer(`https://telegra.ph/file/5ee76cb4bed31a84377eb.jpg`)
	  teks = `𝐃𝐚𝐡𝐡 *@${anu_user}*
𝐁𝐞𝐛𝐚𝐧 𝐓𝐞𝐥𝐚𝐡 𝐊𝐞𝐥𝐮𝐚𝐫 𝐃𝐚𝐫𝐢 𝐆𝐫𝐮𝐩
𝐊𝐚𝐫𝐞𝐧𝐚 𝐃𝐢𝐚 𝐒𝐞𝐫𝐢𝐧𝐠 𝐃𝐢 𝐁𝐮𝐥𝐥𝐲
𝐀𝐰𝐨𝐤𝐚𝐰𝐨𝐤 𝐉𝐚𝐝𝐢 𝐃𝐢𝐚 𝐁𝐚𝐩𝐞𝐫𝐚𝐧`
	  let buff = await getBuffer(ppimg)
	  RsBotz.sendMessage(mdata.id, image, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
      }
    } catch (e) {
      console.log("Error : %s", color(e, "red"))
    }

  })
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'Follow Github Alazery')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

starts()
