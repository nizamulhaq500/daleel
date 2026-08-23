import https from 'https';

const urls = [
  "https://media.npr.org/assets/img/2019/03/15/ap_19074128522770-f421f1ed8a719abdbbde4c5bb5f922fc55a5b5cc-s1100-c50.jpg",
  "https://i.cbc.ca/1.3957833.1485787680!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_780/quebec-city-mosque.jpg",
  "https://ichef.bbci.co.uk/news/976/cpsprodpb/9B41/production/_96541573_mediaitem96541571.jpg",
  "https://i.cbc.ca/1.6057038.1623101258!/fileImage/httpImage/image.JPG_gen/derivatives/16x9_780/london-police-investigate-fatal-crash.JPG",
  "https://media.npr.org/assets/img/2015/02/11/chapel-hill-shooting-1_custom-9c8846175e53303cb36531cb48f43573c7dc5c12-s1100-c50.jpg",
  "https://ichef.bbci.co.uk/news/976/cpsprodpb/15697/production/_111002248_059795092-1.jpg",
  "https://media.npr.org/assets/img/2019/08/11/ap_19223363321583_custom-0a02db1dbb2f6ef5391c5304cbbf5b4c489cf306-s1100-c50.jpg",
  "https://media.npr.org/assets/img/2023/10/16/ap23288825867375_custom-0d418bc4823abf89ed387532356263b65a58572e-s1100-c50.jpg",
  "https://ichef.bbci.co.uk/news/976/cpsprodpb/5FCD/production/_97585092_mediaitem97585091.jpg",
  "https://media.npr.org/assets/img/2017/05/27/portland-train-stabbing_custom-69d95fdf32f144a66a152fbafdf363405786ed89-s1100-c50.jpg"
];

for (const url of urls) {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    console.log(`[${res.statusCode}] ${url}`);
  }).on('error', (e) => {
    console.error(`[ERROR] ${url} : ${e.message}`);
  });
}
