import moment from "moment";

export const isInteger = (value: number): boolean => {
    return Number.isInteger(value);
}


export function capitalizeFirstLetter(str) {
    return str.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }


  export const dateFormat = date => {
    const now = moment();
    const inputDate = moment(date);
  
    if (now.isSame(inputDate, 'day')) {
      // Same day: show time difference
      const duration = moment.duration(now.diff(inputDate));
      const hours = duration.hours();
      const minutes = duration.minutes();
      console.log("hours",hours)
  
      if (hours > 0) {
        return `${hours}h ago`;
      }
      if (minutes > 0) {
        return `${minutes}m ago`;
      }
      return 'few second ago';
    }
  
    if (now.diff(inputDate, 'days') === 1) {
      // Yesterday: show "Yesterday"
      return 'Yesterday';
    }
  
    if (now.diff(inputDate, 'days') < 7) {
      // Within the last week: show day of the week
      return inputDate.format('dddd');
    }
  
    // Older than a week: show date
    return inputDate.format('DD MMM YY');
  };


 export const formatTimeDifference = (date) => {
    const now = moment();
    const inputDate = moment(date);
  
    const diffInSeconds = now.diff(inputDate, 'seconds');
    const diffInMinutes = now.diff(inputDate, 'minutes');
    const diffInHours = now.diff(inputDate, 'hours');
    const diffInDays = now.diff(inputDate, 'days');
    const diffInWeeks = now.diff(inputDate, 'weeks');
    const diffInMonths = now.diff(inputDate, 'months');
    const diffInYears = now.diff(inputDate, 'years');
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays === 1) {
      return `1d`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks}w`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths}mo`;
    } else {
      return `${diffInYears}y`;
    }
  };

  export const formatChannelDate = (date) => {
    const now = moment();
    const inputDate = moment(date);
  
    if (inputDate.isSame(now, 'day')) {
      return inputDate.format('dddd MMMM DD');
    } else if (inputDate.isSame(now.add(1, 'year'), 'day')) {
      return inputDate.format('dddd MMMM DD YYY');
    } else {
      return inputDate.format('dddd MMMM DD');
    }
  };