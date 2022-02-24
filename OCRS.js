/* Filename: OCRS.js
   Target html: OCRS.html
   Purpose : Online Car Rental System Prototype
   Author: Vicky Vu
   Date written: 28/05/21
   Revisions: Vicky 01/06/21
*/
//global array
var arrQuotes = [];

//release quote
function addToOutput(HTMLid,msg) {
	var output = document.getElementById(HTMLid);
	output.innerHTML = msg;
}

//reset form (1st button)
function resetForm() {
	var allForm = document.getElementById("form")
	allForm.reset();
}

//////validate input
//validate name (onblur event and 2nd button)
function validateName(name) {
	var msg;
	var nameRegEx = /^[a-zA-Z].*\S$/;	/*must have at least 2 characters and started with a letter */
	if (!name.match(nameRegEx)) {
		msg = "*Name needs to have at least 2 characters, first character must be a letter and not end with a space.";
		addToOutput("errorName", msg);
		return false;
	} else {
		msg = "";
		addToOutput("errorName", msg);
		return true;
		}
}

//validate email (onblur event and 2nd button)
function validateEmail(email) {
	var msg;
	var emailRegEx = /^\S+@(\S+\.)+[a-zA-Z]+$/; /*must contain @ and at least one dot*/
	if (!email.match(emailRegEx)) {
		msg = "*Email must contain a @ character and at least 1 dot (.) after the @ character, and the characters after the last dot (.) must be letters (i.e. .com).";
		addToOutput("errorEmail", msg);
		return false;
	} else {
		msg = "";
		addToOutput("errorEmail", msg);
		return true;
		}
}

//validate number of days rent (onblur event and 2nd button)
function validateNoOfDays(noOfDays) {
	var msg;
	var noOfDaysRegEx = /^[0-9]+$/;  /*must be integers*/
	if (!noOfDays.match(noOfDaysRegEx) || Number(noOfDays)<= 1) {  /*must be integers > 1*/
		msg = "*Number of days must be a whole number and greater than 1.";
		addToOutput("errorNoOfDays", msg);
		return false;
	} else {
		msg = "";
		addToOutput("errorNoOfDays", msg);
		return true;
		}
}
		
//validate car group - radio button checked (2nd button)
function validateGroupChoices(groupChoices) {
	var msg;
	var checked = false;
	var groupIndex = -1;
	for (var i=0; ((i < groupChoices.length) && (!checked)); i++) {
		if (groupChoices[i].checked) {checked = true; groupIndex = i;}
	}
	if (!checked) {
		msg = "*Please select one group option";
		addToOutput("errorRadioButton", msg);
	} else {
		msg = "";
		addToOutput("errorRadioButton", msg);
		}
	return groupIndex;
}

//////calculate cost
//return the cost per day based on car group option (2nd button)
function getCostPerDay(optionIndex) {
	var cost = null;
	switch (optionIndex) {
		case 0: cost = 50; break; 
		case 1: cost = 60; break; 
		case 2: cost = 70; break;
	}
	return cost;
}

//adjust cost per day if remove Excess
function excess(costPerDay, noOfDays, removeExcess) {
	if (removeExcess) {
		if (noOfDays < 10) {costPerDay = costPerDay + 3;}
		else {costPerDay = costPerDay + 2;}
	}
	return costPerDay;
}

//apply discount to total cost
function applyDiscount(noOfDays, total) {
	if (noOfDays > 14) {total = total - (total*0.1);}
	else if (noOfDays <= 14 && noOfDays >=10) {total = total - (total*0.05);}
	return total;
}

//calculate total rental cost (2n button)
function calculateCost(noOfDays, groupIndex, removeExcess) {
	var total;
	var costPerDay = getCostPerDay(groupIndex);
	costPerDay = excess(costPerDay, noOfDays, removeExcess);
	total = costPerDay * noOfDays;
	total = applyDiscount(noOfDays, total);
	return total;
}

//////return a quote to output
//return chosen car group description (2nd button)
function getGroupDescription(carGroup) {
	var desc = "";
	switch (carGroup) {
		case "group A": desc = "Group A (Small, compact, e.g. Toyota Yaris)"; break; 
		case "group B": desc = "Group B (Hatch or Sedan, e.g. Toyota Corolla or Camry)"; break; 
		case "group C": desc = "Group C (Family size, station wagon, e.g. Mazda 6 Wagon)"; break;
	}
	return desc;
}

//release all string output for quote (2nd button)
function quoteToString(q) {
	var str;
	var carGroupDesc = getGroupDescription(q.carGroup);
	str = "Customer name " + q.name + " (email: " + q.email + ") books a rental of " + carGroupDesc + " car for " + q.noOfDays;
	if (q.removeExcess == true) {str = str + " days without Excess";}
	else {str = str + " days with Excess";}
	str = str + ". Total rental cost $" + q.totalCost.toFixed(2) +".";
	return str;
}

//////get quote (2nd button)
//process to get the quote, resulting from onlick event, if the quote is validated, add to array
function getQuote() {
	var validate = true;
	var quote = {name: "", email: "", noOfDays: null, carGroup: "", removeExcess: false, totalCost: null};
	
	//name
	var name = document.getElementById("name").value;
	if (validateName(name)) {quote.name = name;}
	else {validate = false;}
	
	//email
	var email = document.getElementById("email").value;
	if (validateEmail(email)) {quote.email = email;}
	else {validate = false;}
	
	//noOfDays
	var noOfDays = document.getElementById("noOfDays").value;
	if (validateNoOfDays(noOfDays)) {quote.noOfDays = Number(noOfDays);}
	else {validate = false;}
	
	//groupChoices
	var groupChoices = document.getElementById("carGroups").getElementsByTagName("input");
	if (validateGroupChoices(groupChoices) >= 0) {
		groupIndex = validateGroupChoices(groupChoices);
		quote.carGroup = groupChoices[groupIndex].value;
	}
	else {validate = false;}

	//remove excess
	var removeExcess = document.getElementById("removeExcess").checked;
	if (removeExcess == true) {quote.removeExcess = true};
	
	//calculate total
	if (validate == true) {
		quote.totalCost = calculateCost(quote.noOfDays, groupIndex, quote.removeExcess);
		var outputQuote = quoteToString(quote, groupIndex);
		addToOutput("quote",outputQuote);    /*output quote*/
		arrQuotes.push(quote);     /*add to arrQuotes*/
	}
}

//////return string of all quotes
function arrayToString(array) {
	var str = "";
	for (var i=0; i<array.length; i++) {
		str = str + quoteToString(array[i]) + "<br /><hr>";
	}
	return str;
}

//list all quotes (3rd button)
function listQuotes() {
	var str = "";
	if (arrQuotes.length == 0) {
		str = "The quotes list has no quote to be displayed.";
		addToOutput("msg", str);
	} else {
		str = arrayToString(arrQuotes);
		addToOutput("msg", str);
	}
}

//////validate input for management functionality
//validate name search (onblur event and 4nd button)
function validateNameSearch(nameSearch) {
	var msg;
	var nameSearchRegEx = /^\s*$/;
	if (nameSearch.match(nameSearchRegEx)) {
		msg = "*Name must be entered for searching";
		addToOutput("errorNameSearch", msg);
		return false;
	} else {
		msg = "";
		addToOutput("errorNameSearch", msg);
		return true;
	}
}

//validate drop down (onblur event and 5nd button)
function validateDropdown(dropdown) {
	var msg;
	if (dropdown == "blank") {
		msg = "*One Group must be chosen for searching";
		addToOutput("errorDropdown", msg);
		return false;
	} else {
		msg = "";
		addToOutput("errorDropdown", msg);
		return true;
	}
}

//////find matching quote(s)
//fine matching quote by name
function findMatchingName(searchValue, array) {
	var matchQuote = {};
	for (var i=0; i<array.length; i++) {
		if (array[i].name == searchValue) {
			matchQuote = array[i];
		}
	}
	return matchQuote;
}

//create a new array of matching quotes for car group
function findMatchingCarGroup(searchValue, array) {
	var arrResult = [];
	for (var i=0; i<array.length; i++) {
		if (array[i].carGroup == searchValue) {
			arrResult.push(array[i]);
		}
	}
	return arrResult;
}

//////4th and 5th buttons
//begin search by name (4th button)
function searchByName() {
	var nameSearch = document.getElementById("nameSearch").value;
	if  (validateNameSearch(nameSearch)) {
		var str;
		var quoteMatch = findMatchingName(nameSearch, arrQuotes);
		if (quoteMatch.name == undefined) {str = "No quote matches customer name " + nameSearch;}
		else {str = "Quote matches customer name " + nameSearch + ":<br /><br />" + quoteToString(quoteMatch);}
		addToOutput("msg",str);
	}
}

//begin search by car group (5th button)
function searchByCarGroup() {
	var carGroupSearch = document.getElementById("carGroupForSearch").value;
	if  (validateDropdown(carGroupSearch)) {
		var str;
		var arrMatch = findMatchingCarGroup(carGroupSearch, arrQuotes);
		if (arrMatch == 0) { str = "No quote matches car " + carGroupSearch;}
		else {str = "Quotes found match car " + carGroupSearch + ":<br /><br />" + arrayToString(arrMatch);}
		addToOutput("msg",str);
	}
}


function init() {
	document.getElementById("resetForm").onclick = resetForm;
	document.getElementById("name").onblur = function() {validateName(document.getElementById("name").value);};
	document.getElementById("email").onblur = function() {validateEmail(document.getElementById("email").value);};
	document.getElementById("noOfDays").onblur = function() {validateNoOfDays(document.getElementById("noOfDays").value);};
	document.getElementById("getQuote").onclick = getQuote;
	document.getElementById("listQuotes").onclick = listQuotes;
	document.getElementById("searchByName").onclick = searchByName; 
	document.getElementById("searchByCarGroup").onclick = searchByCarGroup;
}

window.onload = init;  