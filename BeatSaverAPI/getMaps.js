const axios = require('axios');
const fs = require('fs');
const { Parser } = require('json2csv');

const leaderboardIDs = {
  'Hedonism': 562578, //32d8d
  'Requiem.Harumachi.Clover': 557621, //31adf
  'Gravity.Falls': 642686, //43fcb
  'Rolling.Girl': 598915, //3024a
  'Rolling.Girl2': 643422, //44212
  'Jeff.Bezos': 616714, //3dec2
  'P.Light...SatAN': 327106, //13735
  'Lusumi...Out.of.This.Planet': 519180, //29d0e
  'LittleaVMills...Gurenge': 642694, //43fcc
  'LittleVMills...Gurenge': 643428, //43fcd
  'Malefisole': 643426, //4420c
  'Requiem.Harumachi': 643405, //4420e
  'Tetoris.BSt': 643417, //4420f
  'Tetoris.IS': 644951, //44210
  'They.will.not.escape': 643435//44211
};

const note_count = {
  'Hedonism': 1500,
  'Requiem.Harumachi.Clover': 186,
  'Gravity.Falls': 231,
  'Rolling.Girl': 1150,
  'Rolling.Girl2': 1120,
  'Jeff.Bezos': 202,
  'P.Light...SatAN': 1040,
  'Lusumi...Out.of.This.Planet': 1320,
  'LittleaVMills...Gurenge': 485,
  'LittleVMills...Gurenge': 328,
  'Malefisole': 1111,
  'Requiem.Harumachi': 242,
  'Tetoris.BSt': 968,
  'Tetoris.IS': 1360,
  'They.will.not.escape': 1160
};

const fetchScoresToCSV = async (leaderboardIDs) => {
  try {
    let allFormattedScores = [];

    for (const [mapName, leaderboardId] of Object.entries(leaderboardIDs)) {
      let page = 1;
      while (true) {
        const response = await axios.get(`https://scoresaber.com/api/leaderboard/by-id/${leaderboardId}/scores?page=${page}`);
        const scores = response.data.scores;

        if (!scores || scores.length === 0) {
          break; // No more scores to fetch
        }

        const formattedScores = scores.map(score => ({
          MapName: mapName,
          MapID: leaderboardId,
          PlayerName: score.leaderboardPlayerInfo.name,
          Country: score.leaderboardPlayerInfo.country,
          Score: score.modifiedScore,
          Percent: (100 * score.modifiedScore / ((note_count[mapName] - 14 )*8*115 + 4830)).toFixed(4), // Calculate percent: 100/score*maxScore
          MaxCombo: score.maxCombo,
          FullCombo: score.fullCombo,
          TimeSet: score.timeSet,
          HMD: score.deviceHmd,
          ControllerLeft: score.deviceControllerLeft,
          ControllerRight: score.deviceControllerRight,
        }));
        
        //console.log(formattedScores)
        //exit()

        allFormattedScores = allFormattedScores.concat(formattedScores);
        console.log(`Fetched page ${page} for map ${mapName}`);
        page++;
      }
    }

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(allFormattedScores);

    fs.writeFileSync('scores.csv', csv);
    console.log('Scores have been saved to scores.csv');
  } catch (error) {
    console.error('Error fetching or writing scores:', error);
  }
};

fetchScoresToCSV(leaderboardIDs)