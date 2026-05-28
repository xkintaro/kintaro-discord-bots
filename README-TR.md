<a href="README.md">
  <img src="https://img.shields.io/badge/Language-English-blue?style=flat-square&logo=google-translate&logoColor=white" alt="English">
</a>
<a href="README-TR.md">
  <img src="https://img.shields.io/badge/Dil-Türkçe-red?style=flat-square&logo=google-translate&logoColor=white" alt="Türkçe">
</a>

  <br />
  <br />

<div align="center">
  <img src="md/logo.png" width="120" height="120" />
  <br />
  <br />

  <p>
    Premium güvenlik ve etkileşimli araçlar barındıran güçlü Discord yönetim botları.
  </p>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Discord.js](https://img.shields.io/badge/discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

  <p>
    <a href="#architectural">Mimari</a> •
    <a href="#security">Güvenlik</a> •
    <a href="#standart-bots">Standart Botlar</a> •
    <a href="#main-bot">Main Bot</a> •
    <a href="#environment-variables">Yapılandırma</a> •
    <a href="#installation">Kurulum</a> •
    <a href="#license">Lisans</a>
  </p>

  <br />
  <br />
</div>

## 📋 Hakkında

**Kintaro Discord Bots**, tek bir makinede aynı anda birden fazla Discord botunu çalıştırmak için geliştirilmiş monorepo yapısında bir projedir. Proje, **discord.js v14** kullanılarak oluşturulmuş toplamda **11 Discord botu** içerir.

Bu botlar arasında yer alan asıl gelişmiş ve kapsamlı bot **Kintaro** botudur. Moderasyon sistemleri, sunucu yönetim araçları, eğlence komutları ve otomatik olay işleyicileri gibi birçok özelliğe sahiptir.

Diğer **10 standart bot** ise genellikle belirli sunucularda ve ses kanallarında AFK olarak beklemeleri amacıyla geliştirilmiş basit botlardır. isteğe göre yeni botlar ekleyebilirsiniz veya silebilirsiniz.

Tüm botlar modüler command/event handler yapısını takip eder ve her biri bağımsız `.env` dosyaları ile yapılandırılır.

**Not**: Bu dökümanda, Kintaro botu dışındaki botlardan "_Standart Bot_" olarak bahsedilecektir.

## ❓ Bilmeniz Gerekenler <a id="what-you-need-to-know"></a>

- Her botun ana dizininde `.env` dosyası bulunur. bu dosyanın düzgün şekilde yapılandırılması gerekir. (bot token, guild ID vs.)
- Projenin kök dizinindeki `install-requirements.js` dosyası, tüm botlar için tek seferde bütün bağımlılıkları yüklemeyi sağlar.
- Projenin kök dizinindeki `deploy.js` dosyası, tüm botlar için tek seferde bütün slash komutlarını yükler.
- Projenin kök dizinindeki `clear.js` dosyası, tüm botlar için tek seferde bütün slash komutlarını temizler.
- Projenin kök dizinindeki `run.js` dosyası, tüm botları aynı anda child processes olarak başlatır.

Ayrıntılı kontrol için her botun kendi `deploy.js` ve `clear.js` dosyaları da tek tek çalıştırılabilir.

## 🏗️ Mimari <a id="architectural"></a>

Her bot `all/` dizini içerisinde, kendi klasöründe yaşadığı düz bir monorepo yapısını takip eder.

```
kintaro-discord-bots/
├── all/
│   ├── atakan/                 # Standart bot
│   ├── caylak/                 # Standart bot
│   ├── durden/                 # Standart bot
│   ├── flawes/                 # Standart bot
│   ├── kintaro/                # ⭐ Main bot
│   ├── leywin/                 # Standart bot
│   ├── luxury/                 # Standart bot
│   ├── micsfo/                 # Standart bot
│   ├── mistazt/                # Standart bot
│   ├── starx/                  # Standart bot
│   └── truvaq/                 # Standart bot
├── run.js                      # Tüm botları başlatır
├── run.bat                     
├── deploy.js                   # Tüm botlar için slash komutlarını yükler
├── deploy.bat                  
├── install-requirements.js     # Tüm botlar için npm paketlerini kurar
├── install-requirements.bat    
├── clear.js                    # Tüm botlar için slash komutlarını temizler
└── clear.bat                   
```

Her bir bot klasörü şunları içerir:

```
bot-name/
├── .env                # Bot token, sunucu ID'si ve özellik ayarlamaları
├── index.js            # Ana giriş noktası
├── deploy.js           # Slash komutu yükleme
├── clear.js            # Slash komutu temizleme
├── package.json        # Bağımlılıklar
├── commands/
│   └── *.js
└── events/
    └── *.js
```

## 🔒 Erişim Kontrolü ve Güvenlik <a id="security"></a>

Tüm botlar iki katmanlı yerleşik bir güvenlik sistemine sahiptir. tercihler her botun kendi `.env` dosyasından yönetilir.

- `KINTARO_BOT_PUBLIC=true`: Bot herhangi bir sunucuya eklenebilir. Yeni bir sunucuya katıldığında bir selamlama mesajı gönderir.
- `KINTARO_BOT_PUBLIC=false`: Bot yalnızca yetkili sunucuda (`GUILD_ID`) çalışır. Başka bir sunucuya eklendiğinde bir uyarı gönderir ve otomatik olarak ayrılır.
- `KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS=true`: Başlangıçta bot, şu anda bulunduğu tüm sunucuları kontrol eder ve yetkili `GUILD_ID` ile eşleşmeyenlerden ayrılır.

## 🔷 Standart Botlar <a id="standart-bots"></a>

Aşağıdaki **10 adet bot**, aynı hafif mimariyi paylaşır.

`atakan`, `caylak`, `durden`, `flawes`, `leywin`, `luxury`, `micsfo`, `mistazt`, `starx`, `truvaq`

### Standart Bot Özellikleri

Her standart bot aşağıdaki yetenekleri içerir:

- **`/ping` Komutu**: "Pong!" ile yanıt veren basit bir health-check
- **Otomatik Sese Katılma**: Yapılandırılabilir aralıklarla belirtilen bir ses kanalına otomatik olarak katılır (`KINTARO_JUMP_VOICE_AUTO` ile açılıp kapatılabilir)
- **Genel/Özel Mod**: Tüm sunucuları kabul edecek veya tek bir yetkili sunucuyla sınırlandırılacak şekilde yapılandırılabilir
- **Yetkisiz Sunucu Koruması**: Eğer `KINTARO_BOT_PUBLIC` değişkeni `false` ise, bot yetkisiz bir sunucuya katıldığında bir uyarı gönderir ve sunucudan otomatik olarak ayrılır
- **Başlangıç Temizliği**: Başlangıçta `KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS` etkinse bot, yetkili sunucu dışındaki tüm sunuculardan ayrılır
- **Üye Önbelleğe Alma**: Yetkili sunucular için başlangıçta tüm üyeleri otomatik olarak çeker ve önbelleğe alır
- **Dinamik Olay Yükleme**: Olaylar, özellik bayraklarına göre `events/` klasöründen yüklenir

### Standart Bot Ortam Değişkenleri

| Variable                                  | Description                                      | Default    |
| ----------------------------------------- | ------------------------------------------------ | ---------- |
| `DISCORD_TOKEN`                           | Bot kimlik doğrulama belirteci (token)           | —          |
| `CLIENT_ID`                               | Bot uygulaması istemci (client) ID'si            | —          |
| `GUILD_ID`                                | Yetkili sunucu (guild) ID'si                     | —          |
| `KINTARO_BOT_PUBLIC`                      | Botun herhangi bir sunucuya katılmasına izin ver | `false`    |
| `KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS` | Başlangıçta yetkisiz sunuculardan ayrıl          | `true`     |
| `KINTARO_JUMP_VOICE_AUTO`                 | Otomatik ses kanalına katılmayı etkinleştir      | `true`     |
| `KINTARO_JUMP_VOICE_AUTO_JOIN_INTERVAL`   | Katılma kontrol aralığı (saniye cinsinden)       | `300`      |
| `KINTARO_JUMP_VOICE_AUTO_CHANNEL_ID`      | Hedef ses kanalı ID'si                           | —          |

## ⭐ Main Bot (Kintaro) <a id="main-bot"></a>

**Kintaro**, bu projenin asıl gelişmiş botudur. Standart bot şablonunu kapsamlı bir paketle genişleterek tam özellikli bir Discord sunucu yönetimi ve eğlence botu haline getirir.

### 🎮 Commands

#### `/ping`

> **Yetki:** Herkes

Basit bir gecikme süresi kontrol komutu. Botun çevrimiçi ve yanıt verebilir olduğunu onaylamak için "Pong!" ile yanıt verir.

#

#### `/avatar`

> **Yetki:** Herkes

Bir kullanıcının profil resmini tam çözünürlükte (1024×1024) görüntüler.

| Option  | Type      | Required |
| ------- | --------- | ------- |
| `user`  | Kullanıcı | ✅      | 

**Özellikler:**

- GIF formatını destekler
- Discord Embed içinde gösterir
- Profil resmini kimin talep ettiğini gösterir

#

#### `/banner`

> **Yetki:** Herkes

Bir kullanıcının profil afişini tam çözünürlükte görüntüler.

| Option  | Type      | Required |
| ------- | --------- | -------  |
| `user`  | Kullanıcı | ✅      |

**Özellikler:**

- Güncel verileri garanti etmek için kullanıcı profilini `force: true` ile çeker
- Hareketli afişleri destekler
- Afişi ayarlanmamış kullanıcıları sorunsuz bir şekilde ele alır

#

#### `/profile`

> **Yetki:** Herkes

Sunucuya özel kapsamlı bilgilerle birlikte bir kullanıcı için ayrıntılı bir profil kartı gösterir.

| Option  | Type      | Required |
| ------- | --------- | ------- | 
| `user`  | Kullanıcı | ❌      | 

**Görüntülenen Bilgiler:**

- Kullanıcı adı
- Hesap oluşturma tarihi
- Sunucuya katılma tarihi
- Hesap türü
- Çevrimiçi/Çevrimdışı durumu
- Nitro Boost durumu ve tarihi
- Mevcut ses kanalı
- Atanmış tüm roller

#

#### `/serverstats`

> **Yetki:** Herkes

Mevcut sunucunun istatistiklerine ait kapsamlı bir genel bakışı zengin bir embed içinde görüntüler.

**Görüntülenen Bilgiler:**

- Sunucu sahibi
- Sunucu oluşturma tarihi
- Toplam üye sayısı
- Bot sayısı
- Toplam kanal sayısı
- Metin kanalı sayısı
- Ses kanalı sayısı
- Rol sayısı
- Yönetici sayısı
- Tüm rollerin tam listesi
- Tüm yönetici kullanıcıların tam listesi

#

#### `/botstats`

> **Yetki:** Herkes

Kintaro botunun kendisi hakkında bilgileri gösterir.

**Görüntülenen Bilgiler:**

- Çalışma süresi
- Bot yapımcısı
- Bot biyografisi/açıklaması

#### `/clear`

> **Yetki:** Mesajları Yönet

Geçerli kanaldan belirtilen sayıda mesajı toplu olarak siler.

| Option   | Type    | Required |
| -------- | -------- | ------- |
| `amount` | Tam Sayı | ✅     |

**Özellikler:**

- Etkin silme işlemi için Discord'un toplu silme API'sini kullanır
- Yalnızca yetkili kullanıcıların mesajları silebilmesini sağlamak için yetki kontrolü yapar

#

#### `/say`

> **Yetki:** Yönetici

Belirtilen bir metin kanalına özel bir mesaj gönderir.

| Option  | Type  | Required | Description               |
| ------- | ----- | ------- | -------------------------- |
| `kanal` | Kanal | ✅      | Hedef metin kanalı         |
| `mesaj` | Metin | ✅      | Gönderilecek mesaj içeriği |

**Özellikler:**

- `\n` kaçış dizilerini kullanarak çok satırlı mesajları destekler
- Yalnızca metin kanallarının seçildiğinden emin olmak için kanal türü doğrulaması

#

#### `/copymessage`

> **Yetki:** Yönetici

İçeriği ve embed'leri koruyarak bir mesajı bir kanaldan diğerine kopyalar.

| Option         | Type  | Required | Description             |
| -------------- | ----- | ------- | ------------------------ |
| `hedef_kanal`  | Kanal | ✅      | Hedef kanal              |
| `kaynak_kanal` | Kanal | ✅      | Kaynak kanal             |
| `mesaj_id`     | Metin | ✅      | Kopyalanacak mesaj ID'si |

**Özellikler:**

- Hem metin içeriğini hem de embed içeriği korur

#

#### `/rolepicker`

> **Yetki:** Yönetici

Kullanıcıların rol atamak/kaldırmak için tıklayabileceği butonlar içeren etkileşimli bir rol seçici mesajı oluşturur.

| Option   | Type  | Required | Description                                  |
| -------- | ----- | ------- | --------------------------------------------- |
| `kanal`  | Kanal | ✅      | Rol seçicinin gönderileceği kanal             |
| `mod`    | Seçim | ✅      | `tek_rol` veya `coklu_rol`                    |
| `roller` | Metin | ✅      | Rol etiketleri (örn. `@Rol1 @Rol2 @Rol3`)     |
| `mesaj`  | Metin | ✅      | Butonların üzerinde görünecek açıklama mesajı |

**Özellikler:**

- **Tek Rol Modu (`tek_rol`)** — Seçiciden aynı anda yalnızca bir rol aktif olabilir. Yeni bir rol seçildiğinde bir önceki otomatik olarak kaldırılır
- **Çoklu Rol Modu (`coklu_rol`)** — Kullanıcılar birden fazla rolü bağımsız olarak açıp kapatabilir
- Satırlar halinde düzenlenmiş rol butonlarını otomatik olarak oluşturur
- Hızlı sıfırlama için kırmızı bir "Tüm Rolleri Kaldır" butonu içerir
- Buton etkileşimlerinde spam'i önlemek için 1 saniyelik bekleme süresi (cooldown) vardır
- Açıklama mesajında `\n` kullanarak çok satırlı desteği sunar

#

#### `/jumpvoice`

> **Yetki:** Yönetici

Botun, komutu yazan kişinin o anda bulunduğu ses kanalına katılmasını sağlar.

**Özellikler:**

- Kararlı ses bağlantıları için `@discordjs/voice` kullanır
- Katılmaya çalışmadan önce kullanıcının bir ses kanalında olduğunu doğrular

#

#### `/ship`

> **Yetki:** Herkes

Komutu yazan kişi ile seçilen bir kullanıcı arasındaki uyumluluk yüzdesini, özel olarak oluşturulmuş bir görsel eşliğinde üreten eğlenceli bir komut.

| Option  | Type      | Required | Description                           |
| ------- | --------- | ------- | -------------------------------------- |
| `user`  | Kullanıcı | ✅      | ship istenen kullanıcı                 |

**Özellikler:**

- Rastgele bir uyumluluk yüzdesi üretir (%0–100)
- Kullanıcıların avatarlarını ile güzel bir canvas görseli oluşturur
- Görsel ön işleme ve format dönüştürme için **Sharp** kullanır

#

### 🎯 Events <a id="events"></a>

#### 1. Giriş/Çıkış Mesajları (`kintaroEntryExit`)

> **Etkinleştirme:** `KINTARO_ENTRY_EXIT=true`

Üyeler sunucuya katıldığında veya ayrıldığında belirlenmiş bir kanala gönderilen basit hoş geldin ve güle güle mesajları.

#### 2.Guard Sistemi (`kintaroEntryExitGuard`)

> **Etkinleştirme:** `KINTARO_ENTRY_EXIT_GUARD=true`

Yeni üyelerin sunucuya tam erişim kazanmadan önce yönetici onayını gerektiren gelişmiş bir üye doğrulama sistemi.

**Nasıl çalışır:**

1. Yeni bir üye katıldığında, otomatik olarak bir **Unverified** rolü atanır
2. Koruma kanalında aşağıdaki bilgileri içeren bir hoş geldin mesajı gönderilir:
   - Yeni üyenin adı/etiketi ve bahsedilmesi
   - Güncel sunucu üye sayısı
   - Davet takip bilgisi (kimin davet ettiği ve hangi davet kodunun kullanıldığı)
   - Yöneticiler için bir **"Register"** butonu
3. Bir yönetici üyenin kaydını onaylamak için **Register** butonuna tıklar:
   - **Unverified** rolünü kaldırır
   - **Verified** rolünü atar
   - Hoş geldin mesajını güncelleyerek üyeyi kimin kaydettiğini gösterir
   - Butonu devre dışı bırakır (yeşil renkte "Registered" olarak değişir)
4. Eğer üye kaydedilmeden önce sunucudan ayrılırsa:
   - Hoş geldin mesajı bir uyarıyla güncellenir
   - Buton devre dışı bırakılır ve kırmızı renkte "User Left the Server" (Kullanıcı Sunucudan Ayrıldı) olarak değişir
   - GIF içeren bir güle güle mesajı gönderilir

#### 3. Otomatik Sese Katılma (`kintaroJumpVoiceAuto`)

> **Etkinleştirme:** `KINTARO_JUMP_VOICE_AUTO=true`

Otomatik olarak sunucuda belirli bir ses kanalında AFK olarak bekler.

- Gereksiz katılmaları önlemek için botun zaten hedef kanalda olup olmadığını kontrol eder
- `KINTARO_JUMP_VOICE_AUTO_JOIN_INTERVAL` aracılığıyla yapılandırılabilir aralık (saniye cinsinden)

#### 4. Otomatik Cevaplayıcı (`kintaroAutoResponder`)

> **Etkinleştirme:** `KINTARO_AUTO_RESPONSER=true`

Belirli mesajlara önceden tanımlanmış yanıtlarla otomatik olarak cevap verir. Topluluk üyeleri için eğlenceli bir etkileşim sistemi olarak çalışır.

- Selamlamalara ve belirli kullanıcı etiketlemelerine yanıt verir
- Özelleştirilebilir yanıtlarla içerik tabanlı eşleştirme yapar
- Diğer botlardan gelen mesajları yok sayar

## 🔑 Ortam Değişkenleri <a id="environment-variables"></a>

```env
# ─── Core Authentication ───
DISCORD_TOKEN=                                # Discord bot token
CLIENT_ID=                                    # Bot uygulamasının client ID'si
GUILD_ID=                                     # Yetkili server ID'si

# ─── Access Control ───
KINTARO_BOT_PUBLIC=false                      # Botun her sunucuya girmesine izin ver
KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS=true  # Başlangıçta yetkisiz sunuculardan ayrıl

# ─── Entry/Exit Messages ───
KINTARO_ENTRY_EXIT=true                       # Basit katılma/ayrılma mesajlarını etkinleştir
KINTARO_ENTRY_EXIT_WELCOME_CHANNEL=           # Katılma/ayrılma mesajları için kanal ID'si

# ─── Guard System ───
KINTARO_ENTRY_EXIT_GUARD=true                 # Doğrulama koruma sistemini etkinleştir
KINTARO_ENTRY_EXIT_GUARD_WELCOME_CHANNEL=     # Koruma hoş geldin mesajları için kanal ID'si
KINTARO_ENTRY_EXIT_GUARD_UNVERIFIED_ROLE=     # Doğrulanmamış üyelere atanan rol ID'si
KINTARO_ENTRY_EXIT_GUARD_VERIFIED_ROLE=       # Doğrulama aşamasından sonra atanan rol ID'si

# ─── Auto Voice Join ───
KINTARO_JUMP_VOICE_AUTO=true                  # Otomatik ses kanalına katılmayı etkinleştir
KINTARO_JUMP_VOICE_AUTO_JOIN_INTERVAL=300     # Kontrol aralığı (saniye cinsinden) (varsayılan: 300)
KINTARO_JUMP_VOICE_AUTO_CHANNEL_ID=           # Hedef ses kanalı ID'si

# ─── Auto Responder ───
KINTARO_AUTO_RESPONSER=true                   # Otomatik mesaj yanıtlarını etkinleştir
```

## 🚀 Kurulum <a id="installation"></a>

### Gereksinimler <a id="gereksinimler"></a>

- **Node.js**: v18 veya daha yüksek bir sürüm
- **npm**: Node.js ile birlikte gelir

### Adım Adım Kurulum

1. **Depoyu klonlayın:**

```bash
git clone https://github.com/xkintaro/kintaro-discord-bots.git
cd kintaro-discord-bots
```

2. **Tüm botların bağımlılıklarını tek seferde yükleyin:**

```bash
node install-requirements.js
```

Bu komut `all/` altındaki her bot klasöründe `npm install` çalıştıracaktır.

3. **Ortam değişkenlerini ayarlayın:**

her botun kök dizinindeki, `.env` dosyasında gerekli ayarlamaları yapın. istediğiniz özellikleri açın/kapatın.

```env
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
```

4. **Slash komutları yükleyin:**

Slash komutlarını kullanmadan önce bunları Discord'a tanıtmanız gerekir:

```bash
node deploy.js
```

Bu işlem, her bot klasörünün içinde `node deploy.js` çalıştırarak tüm slash komutlarını kaydeder.

5. **Botları Çalıştırın:**

```bash
node run.js
```

Her bot ayrı bir child process olarak çalışır.


## 📂 Proje Yapısı <a id="project-structure"></a>

```
kintaro-discord-bots/
│
├── 📁 all/
│   ├── 📁 atakan/           # Standart bot
│   ├── 📁 caylak/           # Standart bot
│   ├── 📁 durden/           # Standart bot
│   ├── 📁 flawes/           # Standart bot
│   ├── 📁 kintaro/          # ⭐ Main bot
│   │   ├── 📁 assets/
│   │   │   └── bg.jpeg          # /ship komutu için arka plan görseli
│   │   ├── 📁 commands/
│   │   │   ├── kintaroAvatar.js
│   │   │   ├── kintaroBanner.js
│   │   │   ├── kintaroBotStats.js
│   │   │   ├── kintaroClear.js
│   │   │   ├── kintaroCopyMessage.js
│   │   │   ├── kintaroJumpVoice.js
│   │   │   ├── kintaroPing.js
│   │   │   ├── kintaroProfile.js
│   │   │   ├── kintaroRolePicker.js
│   │   │   ├── kintaroSay.js
│   │   │   ├── kintaroServerStats.js
│   │   │   └── kintaroShip.js
│   │   ├── 📁 events/
│   │   │   ├── kintaroAutoResponder.js
│   │   │   ├── kintaroEntryExit.js
│   │   │   ├── kintaroEntryExitGuard.js
│   │   │   ├── kintaroJumpVoiceAuto.js
│   │   │   └── ready.js
│   │   ├── .env
│   │   ├── clear.js
│   │   ├── clear-global.js
│   │   ├── deploy.js
│   │   ├── index.js
│   │   └── package.json
│   ├── 📁 leywin/           # Standart bot
│   ├── 📁 luxury/           # Standart bot
│   ├── 📁 micsfo/           # Standart bot
│   ├── 📁 mistazt/          # Standart bot
│   ├── 📁 starx/            # Standart bot
│   └── 📁 truvaq/           # Standart bot
│
├── clear.bat
├── clear.js
├── deploy.bat
├── deploy.js
├── install-requirements.bat
├── install-requirements.js
├── run.bat
├── run.js
└── README.md
```

## 📄 Lisans <a id="license"></a>

Bu proje MIT Lisansı ile lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyebilirsiniz.

#

<p align="center">
  <sub>❤️ Developed by "Mustafa TAŞAL" (kintaro)</sub>
</p>