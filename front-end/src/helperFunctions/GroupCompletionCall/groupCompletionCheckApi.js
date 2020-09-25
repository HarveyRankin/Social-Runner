import axios from "axios";

export default async (cardId) => {
  axios
    .get(`/challenges/group/${cardId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      const challenges = res.data;

      axios
        .get(`/athletes/checkCompleteChallenges/${cardId}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const comparisonArray = res.data;
          if (!res.data.length) {
            //change later
            const elPerRow = challenges[0].colsNum;
            //creating 2d array from the data
            const newArr = challenges.reduce(
              (rows, key, index) =>
                (index % elPerRow == 0
                  ? rows.push([key])
                  : rows[rows.length - 1].push(key)) && rows,
              []
            );

            return newArr;
          } else {
            for (let chall of challenges) {
              chall.complete = false;
              for (let challObj of comparisonArray) {
                if (challObj.challenge_id === chall.challenge_id)
                  chall.complete = true;
              }
            }
            const elPerRow = challenges[0].colsNum;
            //creating 2d array from the data
            const newArr = challenges.reduce(
              (rows, key, index) =>
                (index % elPerRow == 0
                  ? rows.push([key])
                  : rows[rows.length - 1].push(key)) && rows,
              []
            );
            console.log(newArr);
            return newArr;
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
