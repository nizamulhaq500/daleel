const https = require('https');
const fs = require('fs');

const urls = [
  { url: 'https://images.pexels.com/photos/2989625/pexels-photo-2989625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', name: 'delhi-mosque.jpg' },
  { url: 'https://images.pexels.com/photos/34510828/pexels-photo-34510828/free-photo-of-muslim-gathering-in-jakarta-mosque.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', name: 'jakarta-mosque.jpg' },
  { url: 'https://images.pexels.com/photos/11440986/pexels-photo-11440986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', name: 'praying-people.jpg' },
  { url: 'https://images.unsplash.com/photo-1706692997637-23b0920a4b75?q=80&w=2000&auto=format&fit=crop', name: 'prayer-gathering.jpg' },
  { url: 'https://images.unsplash.com/photo-1718817296065-df0d9f4854eb?q=80&w=2000&auto=format&fit=crop', name: 'crowd-gathering.jpg' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error('Failed to get ' + url + ' (' + response.statusCode + ')'));
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  const promises = urls.map(item => {
    console.log('Downloading ' + item.name);
    return download(item.url, 'public/assets/' + item.name)
      .then(() => console.log('Success: ' + item.name))
      .catch(e => console.error('Failed ' + item.name, e.message));
  });
  await Promise.all(promises);
}
run();
