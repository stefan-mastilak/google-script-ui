var sheetID = '17OveVnz7nnKQs2M4N2is5bT2pPIQwxuItSh6Ve6rNuc'; // spreadsheet ID
var dataSheet = 'Specification'; // name of the sheet that contains user data
var teamManagerHeader = 'Team Manager'; // column name where team manager email exists
var directorHeader = 'Director'; // column name where director email exists
var managingDirectorHeader = 'MD'; // column name where managing director email exists
var financeStaff = 'Finance staff' //column name where finance staff emails (multiple addresses) are stored
var activeUser = Session.getActiveUser(); //session active user fetching
var ss = SpreadsheetApp.openById(sheetID); //spreadsheet fetching by it's ID

function doGet(request) {
  return HtmlService.createTemplateFromFile('index')
      .evaluate().setTitle('Invoice Data Overview');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function currentUser() {
  if (activeUser !== '') {
    return activeUser.getEmail();
  } else {
    return "Couldn't detect user!!!";
  }
}

function isFloat(value) {
        if (
          typeof value === 'number' &&
          !Number.isNaN(value) &&
          !Number.isInteger(value)
        ) {
          return true;
        }

        return false;
      }

function getData() {
  var sheetName = dataSheet;
  var activeSheet = ss.getSheetByName(sheetName);
  var values = activeSheet.getDataRange().getValues();
  var header = values[0];
  var teamManagerIndex = header.indexOf(teamManagerHeader);
  var directorIndex = header.indexOf(directorHeader);
  var managingDirectorIndex = header.indexOf(managingDirectorHeader);
  var financeStaffIndex = header.indexOf(financeStaff);
  var userData = [];

  for (var i = 1; i < values.length; i++) {
    if ('alina.remescu@visma.com' == activeUser || 'raluca.dreve@visma.com' == activeUser) {
        userData.push(values[i]);
    }
    else if (values[i][teamManagerIndex].toLowerCase() == activeUser) {
      userData.push(values[i]);
    }
    else if (values[i][directorIndex].toLowerCase() == activeUser) {
      userData.push(values[i]);
    }
    else if (values[i][managingDirectorIndex].toLowerCase() == activeUser) {
      userData.push(values[i]);
    }
    else if (values[i][financeStaffIndex].toLowerCase().split(',').map(function(item) {return item.trim();}).includes(activeUser.getEmail())) {
      userData.push(values[i]);
    }
  }

  if (userData.length > 0) {
    var tableStart = '\n<div class="tableFixHead"><table class="centered responsive-table" id="sortable">';
    var tableHead = '\n<thead>\n<tr>';
    for (var j = 0; j < header.length; j++) {
      tableHead = tableHead + '\n<th onclick="sortBy(' + j + '); clearSearchInput()" title="Click to apply ordering by ' + header[j] + '">' + header[j] + '</th>';
    }
    tableHead = tableHead + '\n</tr>\n</thead>';
    var tableBody = '\n<tbody>';
    for (var k = 0; k < userData.length; k++) {
      tableBody = tableBody + '\n<tr>';
      for (var l = 0; l < userData[0].length; l++) {
        currItem = isFloat(userData[k][l]) ? userData[k][l].toFixed(2) : userData[k][l];
        tableBody = tableBody + '\n<td>' + currItem + '</td>';
      }
      tableBody = tableBody + '\n</tr>\n';
    }
    var tableEnd = '</tbody>\n</table></div>';
    var tableHtml = tableStart + tableHead + tableBody + tableEnd;
    return tableHtml;
  } else {
    return '<table class="centered responsive-table table-dark" style="color: black; background: #c6c8ca; border-radius: 10px; font-weight: bold;"><tbody><tr><td style="padding: 18px;" id="no-data-for-user">No data for user ' + activeUser + '</td></tr></tbody></table>';
  }
}

function getContent(filename) {
    return HtmlService.createTemplateFromFile(filename).getRawContent();
}