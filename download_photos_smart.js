const https = require('https');
const fs = require('fs');

const pages = [
  { url: 'https://www.pexels.com/photo/photo-of-crowd-of-people-gathering-near-jama-masjid-delhi-2989625/', name: 'delhi-mosque.jpg' },
  { url: 'https://www.pexels.com/photo/muslim-gathering-in-jakarta-mosque-34510828/', name: 'jakarta-mosque.jpg' },
  { url: 'https://www.pexels.com/photo/group-of-praying-people-11440986/', name: 'praying-people.jpg' },
  { url: 'https://www.pexels.com/photo/people-with-flags-on-bridge-with-mosque-background-30028978/', name: 'flags-mosque.jpg' },
  { url: 'https://www.pexels.com/photo/pro-palestinian-protest-outside-mosque-in-dhaka-32304388/', name: 'dhaka-protest.jpg' },
  { url: 'https://unsplash.com/photos/man-in-white-hat-observes-a-large-prayer-gathering-r0HlondEF0A', name: 'white-hat.jpg' },
  { url: 'https://unsplash.com/photos/a-large-crowd-of-people-are-gathered-together-l7N02CEh3Z4', name: 'large-crowd.jpg' },
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 308) {
        return fetchHtml(response.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 308) {
        return downloadImage(response.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

async function run() {
  for (const item of pages) {
    try {
      console.log('Fetching ' + item.url);
      const html = await fetchHtml(item.url);
      const match = html.match(/<meta property="og:image" content="([^"]+)"/);
      if (match && match[1]) {
        console.log('Downloading ' + match[1]);
        await downloadImage(match[1], 'public/assets/' + item.name);
        console.log('Success: ' + item.name);
      } else {
        console.log('No og:image found for ' + item.url);
        // Fallback for unsplash if og:image fails
        if (item.url.includes('unsplash.com')) {
          const id = item.url.split('-').pop();
          const dlUrl = `https://unsplash.com/photos/${id}/download?force=true&w=1600`;
          console.log('Trying Unsplash download: ' + dlUrl);
          await downloadImage(dlUrl, 'public/assets/' + item.name);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}
run();
