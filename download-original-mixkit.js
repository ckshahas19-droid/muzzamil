import fs from 'fs';
import path from 'path';
import https from 'https';

const assetsToDownload = [
  {
    url: 'https://assets.mixkit.co/videos/preview/mixkit-flying-over-clouds-21985-large.mp4',
    dest: 'flight.mp4'
  },
  {
    url: 'https://assets.mixkit.co/videos/preview/mixkit-private-jet-flying-above-the-clouds-40280-large.mp4',
    dest: 'clouds.mp4'
  }
];

const publicDir = path.resolve(process.cwd(), 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 30000 // 30 seconds timeout
    };

    https.get(url, options, (res) => {
      if (res.statusCode && (res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        console.log(`Redirecting from ${url} to ${res.headers.location}`);
        downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download static asset ${url}, status code: ${res.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Successfully downloaded: ${path.basename(destPath)}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {}); // clean up on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading original Mixkit background videos to local public folder...');
  for (const asset of assetsToDownload) {
    const targetPath = path.join(publicDir, asset.dest);
    try {
      console.log(`Downloading ${asset.url} -> ${targetPath}`);
      await downloadFile(asset.url, targetPath);
    } catch (error) {
      console.error(`Failed to download ${asset.dest}:`, error);
    }
  }
  console.log('Finished background videos local process.');
}

main();
