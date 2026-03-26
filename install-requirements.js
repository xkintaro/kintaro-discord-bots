const { exec } = require('child_process');
const path = require('path');

const botFolders = [
    'C:\\kintaro-discord-bots\\all\\atakan',
    'C:\\kintaro-discord-bots\\all\\caylak',
    'C:\\kintaro-discord-bots\\all\\durden',
    'C:\\kintaro-discord-bots\\all\\flawes',
    'C:\\kintaro-discord-bots\\all\\leywin',
    'C:\\kintaro-discord-bots\\all\\luxury',
    'C:\\kintaro-discord-bots\\all\\micsfo',
    'C:\\kintaro-discord-bots\\all\\mistazt',
    'C:\\kintaro-discord-bots\\all\\starx',
    'C:\\kintaro-discord-bots\\all\\truvaq',
    'C:\\kintaro-discord-bots\\all\\kintaro',
];

botFolders.forEach(folder => {
    const botPath = path.resolve(folder);
    console.log(`Starting: ${botPath}`);

    const botProcess = exec('npm i', { cwd: botPath });

    botProcess.stdout.on('data', data => console.log(`[${folder}] ${data}`));
    botProcess.stderr.on('data', data => console.error(`[${folder}] error: ${data}`));
    botProcess.on('close', code => console.log(`[${folder}] exit code: ${code}`));
});
