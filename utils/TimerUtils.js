import uuidv4 from 'uuid/v4';
import moment from 'moment'
import '../utils/global'

export const millisecondsToHuman = ms => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor(ms / 1000 / 60 / 60);

  const humanized = [
    pad(hours.toString(), 2),
    pad(minutes.toString(), 2),
    pad(seconds.toString(), 2),
  ].join(':');

  return humanized;
};

export const millisecondsToHours = ms => {
  const hours = Math.floor(ms / 1000 / 60 / 60);

  const humanized = hours.toString()

  return humanized;
};

const pad = (numberString, size) => {
  let padded = numberString;
  while (padded.length < size) {
    padded = `0${padded}`;
  }
  return padded;
};

export default function humanToMiliseconds(hrs,min,sec) {
  return((hrs*60*60+min*60+sec)*1000);
};


export const newTimer = (attrs = {}) => {
  const timer = {
    title: attrs.title || 'Timer',
    date: attrs.date || moment().format('L'),
    id: uuidv4(),
    elapsed: 0,
    isRunning: false,
  };

  return timer;
};
export const newEventTimer = (attrs = {}) => {
  const eventTimer = {
    title: attrs.title || 'Timer',
    date: attrs.date || moment().format('L'),
    id: uuidv4(),
    elapsed: humanToMiliseconds(selectHours, selectMinutes, 0),
    isRunning: false,
  };

  return eventTimer;
};