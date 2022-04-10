import uuidv4 from 'uuid/v4';
import moment from 'moment'

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

export const roundMillisecondsToHours = ms => {
  const hours = Math.round(ms / 1000 / 60 / 60);

  const humanized = hours.toString()

  return humanized;
};

export const decMillisecondsToHours = ms => {
  const hours = Math.round((ms / 1000 / 60 / 60) * 10) / 10

  const humanized = hours.toString()

  return humanized;
};

export const millisecondsToMinutes = ms => {
  const minutes = Math.floor((ms / 1000 / 60) % 60);

  const humanized = minutes.toString()

  return humanized;
};

const pad = (numberString, size) => {
  let padded = numberString;
  while (padded.length < size) {
    padded = `0${padded}`;
  }
  return padded;
};

export const sortTimers = ( timers ) => {
  let sorted = [];
  let i = 0;
  for (; i < timers.length; i++){
    const timer = Object(timers[i])
    const month = timer.date.slice(0, 2)
    const year = timer.date.slice(6, 10)
    const date = year + month
    const dateExists = sorted.findIndex(x => x.date === date);
    if (dateExists != -1) {
      sorted[dateExists].timers.push(timer)
    }
    else {
      const pushDate = {
        date: date,
        timers: [timer],
        id: date,
      }
      sorted.push(pushDate)
    }
  }
  sorted = sorted.sort((a, b) => parseInt(b.date) - parseInt(a.date));
  return sorted;
};

export const processDate = ( date ) => {
  const month = parseInt(date.slice(4, 7))
  const year = parseInt(date.slice(0, 4))
  const monthNames = ["placeholder", "January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
  const processedDate = monthNames[month] + ' (' + month + '), ' + year
  return processedDate;
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
    aylus: attrs.aylus,
  };

  return timer;
};
export const newEventTimer = (attrs = {}) => {
  const eventTimer = {
    title: attrs.title || 'Timer',
    date: attrs.date || moment().format('L'),
    id: uuidv4(),
    elapsed: attrs.elapsed || 0,
    isRunning: false,
    aylus: attrs.aylus,
  };
  return eventTimer;
};
export const processExport = (timers) => {
  let processedArr = timers.map(({id, isRunning, ...rest}) => rest)
  processedArr.forEach(function(obj) {
    obj.Description = obj.title;
    obj.Date = obj.date;
    obj.Service_Hours = decMillisecondsToHours(obj.elapsed);
    obj.Aylus_Event = obj.aylus ? 'Yes':'No';
    obj.Signature = ''
    obj.Name = ''
    delete obj.title
    delete obj.date
    delete obj.elapsed
    delete obj.aylus
  });
  return processedArr
}