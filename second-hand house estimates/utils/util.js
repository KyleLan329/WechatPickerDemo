function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function toThousands(num) {
  var price = num.toString();
  var num = price.slice(0, price.length - 7);
  var result = "."+price.slice(-7,-5);
  console.log(result);
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  return result;
}



module.exports = {
  formatTime: formatTime,
  toThousands: toThousands
}
