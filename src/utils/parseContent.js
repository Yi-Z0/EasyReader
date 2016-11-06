//@flow
import stringWidth from './stringWidth';

export default function parseContent(str, width, cleanEmptyLine = true) {
  if (!str || str == '' || typeof(str) != 'string') {
    return [];
  }
  str = cleanContent(str);
  let lines = [];
  let currentLine = '';
  let currentLineWidth = 0;
  for (let i in str) {
    try {
      let s = str[i];
      let code = s.charCodeAt();

      if (code == 10 || code == 13) {
        if (currentLine.trim() == '' && lines.length > 1 && lines[lines.length - 1].trim() == '') {
          //过滤空行
        } else {
          lines.push(currentLine);
        }
        currentLine = '';
        currentLineWidth = 0;
        continue;
      }

      var sWidth = stringWidth(s);
      if (currentLineWidth + sWidth > width) {
        lines.push(currentLine);
        currentLine = '';
        currentLineWidth = 0;
      }

      currentLine += s;
      currentLineWidth += sWidth;
    } catch (error) {
      console.log(error);
    }
  }
  lines.push(currentLine);

  return lines;
}

function cleanContent(str:string){
    let lines = str.split('\n');
    let newlines = [];
    for (var i in lines) {
        let s = lines[i].trim();
        if(s.length>0){
            newlines.push('        '+s);
        }
    }
    return newlines.join('\n\n');
}