import XLSX from 'xlsx';
import React from 'react';
import * as FileSystem from 'expo-file-system';
import { processExport } from '../utils/TimerUtils';
import * as Sharing from 'expo-sharing';

const sum = function(items, prop){
  return items.reduce( function(a, b){
      return a + parseFloat(b[prop]);
  }, 0);
};
function autofitColumns(json, worksheet, header) {
  const jsonKeys = header ? header : Object.keys(json[0]);
  console.log(jsonKeys)
  let objectMaxLength = []; 
  for (let i = 0; i < json.length; i++) {
    let value = json[i];
    for (let j = 0; j < jsonKeys.length; j++) {
      if (typeof value[jsonKeys[j]] == "number") {
        objectMaxLength[j] = 10;
      } else {

        const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0;

        objectMaxLength[j] =
          objectMaxLength[j] >= l
            ? objectMaxLength[j]
            : l;
      }
    }

    let key = jsonKeys;
    for (let j = 0; j < key.length; j++) {
      objectMaxLength[j] =
        objectMaxLength[j] >= key[j].length
          ? objectMaxLength[j]
          : key[j].length;
    }
  }

  const wscols = objectMaxLength.map(w => { return { width: w} });
  worksheet["!cols"] = wscols;

}
function add_cell_to_sheet(worksheet, address, value) {
  /* cell object */
  let cell = {t:'?', v:value};

  /* assign type */
  if(typeof value == "string") cell.t = 's'; // string
  else if(typeof value == "number") cell.t = 'n'; // number
  else if(value === true || value === false) cell.t = 'b'; // boolean
  else if(value instanceof Date) cell.t = 'd';
  else throw new Error("cannot store value");

  /* add to worksheet, overwriting a cell if it exists */
  worksheet[address] = cell;

  /* find the cell range */
  let range = XLSX.utils.decode_range(worksheet['!ref']);
  let addr = XLSX.utils.decode_cell(address);

  /* extend the range to include the new cell */
  if(range.s.c > addr.c) range.s.c = addr.c;
  if(range.s.r > addr.r) range.s.r = addr.r;
  if(range.e.c < addr.c) range.e.c = addr.c;
  if(range.e.r < addr.r) range.e.r = addr.r;

  /* update range */
  worksheet['!ref'] = XLSX.utils.encode_range(range);
}
async function exportAsExcel(data, fileName, name, branch) {
  let ws = XLSX.utils.aoa_to_sheet([["Volunteer Service Report Form"]])
  let wb = XLSX.utils.book_new();
  const totalTime = sum(data, 'Service Hours')
  const Aylus = data.filter(obj => {
    return obj['Aylus Event?'] === 'Yes'
  })
  const NotAylus = data.filter(obj => {
    return obj['Aylus Event?'] === 'No'
  })
  const aylusTime = sum(Aylus, 'Service Hours')
  const notAylusTime = sum(NotAylus, 'Service Hours')
  XLSX.utils.sheet_add_aoa(ws, [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']], {origin:-1});
  XLSX.utils.sheet_add_json(ws, data, {origin:"A2"});
  const merge = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }]
  ws["!merges"] = merge;
  const arr = ['Volunteer Name', name, "Branch Name:", branch, "Total Hours: " + totalTime, "Aylus Hours: " + aylusTime, "Non-Aylus Hours: " + notAylusTime]
  const longest = arr.sort(function (a, b) { return b.length - a.length; })[0];
  let headers = ["Service Date", "Description of Serviceswwwwwwwwwwww", "Service Hours", "Aylus Event?", "Advisor or Organizer Signature blah", longest]
  autofitColumns(data, ws, headers)
  add_cell_to_sheet(ws, "F3", name)
  add_cell_to_sheet(ws, "F4", "Branch Name:")
  add_cell_to_sheet(ws, "F5", branch)
  add_cell_to_sheet(ws, "F6", "Total Hours: " + totalTime)
  add_cell_to_sheet(ws, "F7", "Aylus Hours: " + aylusTime)
  add_cell_to_sheet(ws, "F8", "Non-Aylus Hours: " + notAylusTime)
  XLSX.utils.book_append_sheet(wb, ws, fileName);
  const wbout = XLSX.write(wb, {
  type: 'base64',
  bookType: "xlsx"
  });
  const uri = FileSystem.cacheDirectory + fileName + '.xlsx';
  // console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
  await FileSystem.writeAsStringAsync(uri, wbout, {
  encoding: FileSystem.EncodingType.Base64
  });
  await Sharing.shareAsync(uri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Aylus Hour Tracker Export',
      UTI: 'com.microsoft.excel.xlsx'
  });
}

export default function exportXlsx(input, filename, name, branch) {
  let sortData = input
  sortData.sort(function(a,b){
    return new Date(b.date) - new Date(a.date);
  });
  console.log(sortData)
  const data = processExport(input)
  const newJson = data.map(rec => {
    return {
      'Service Date': rec.Date,
      'Description of Services': rec.Description,
      'Service Hours': rec.Service_Hours,
      'Aylus Event?': rec.Aylus_Event,
      'Advisor or Organizer Signature and Contact': rec.Signature,
      'Volunteer Name:': rec.Name,
    }
  })
  //console.log(newJson)
  exportAsExcel(newJson, filename, name, branch)
  return null;
}
