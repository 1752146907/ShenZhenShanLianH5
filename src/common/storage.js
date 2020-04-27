const token_key = 'token_1.0.0';
const time_stamp = 'time_stamp'

function getToken() {
  let token = localStorage.getItem(token_key);

  if (token === null || typeof (token) === 'undefined') {
    return '';
  }

  return token;
}

function setToken(token) {
  sessionStorage.clear();
  localStorage.clear();

  localStorage.setItem(token_key, token);
}

function getTimeStamp() {
  let times = localStorage.getItem(time_stamp);

  return times;
}

function setTimeStamp(times) {
  localStorage.setItem(time_stamp, times);
}

export default {
  getToken: getToken,
  setToken: setToken,
  getTimeStamp: getTimeStamp,
  setTimeStamp: setTimeStamp
};
