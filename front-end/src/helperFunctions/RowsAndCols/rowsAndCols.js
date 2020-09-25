import axios from "axios";

export default (
  row,
  col,
  cardColLength,
  cardRowLength,
  groupChallenges,
  cardId
) => {
  let rowComplete = true;

  for (let i = 0; i < cardRowLength; i++) {
    if (!groupChallenges[row][i].complete) {
      rowComplete = false;
      break;
    }
  }
  let colComplete = true;
  for (let i = 0; i < cardColLength; i++) {
    if (!groupChallenges[i][col].complete) {
      colComplete = false;
      break;
    }
  }
  
  if (rowComplete === true) {
    axios
      .post(
        "/challenges/group/addRow",
        {
          card_id: cardId,
          row_num: row,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }
  if (colComplete) {
    
    axios
      .post(
        "/challenges/group/addCol",
        {
          card_id: cardId,
          col_num: col,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
};
