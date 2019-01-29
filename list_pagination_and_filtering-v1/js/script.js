/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/

/*
  This script assumes an html document containing a body with a .page
  div. The div contains a list of students as li elements in a ul element.
  This script will initially display the first ten names in the list and 
  hide the others. The script then creates a .pagination div below
  the .page div, that contains a nav bar to navigate amongst the pages.
  Clicking on an element in the nav bar will display the respective ten
  students (though the last page will be fewer if the number of students 
  is not a multiple of ten). There is also a search bar that will filter
  by the names and emails of each student, then the results will be 
  paginated. There is also a Search button, but it has no actual function
  and is present as a visual cue.

*/

const studentList = document.querySelector(".student-list");
const studentItems = studentList.children;

//the page currently being displayed
let currentPage = 1;

//the class arrays will hold the classes to use for display/hide
let studentBaseClass = [];
let studentHiddenClass = [];

//filterString will be searched against student names/emails
let filterString = "";

//studentItems that have been tested against the filterString
let passedFilter = [];
let failedFilter = [];

//initialize the class arrays
for (var i = 0; i < studentItems.length; i++) {
  studentBaseClass.push(studentItems[i].className);
  studentHiddenClass.push(studentItems[i].className + " hidden");
}

const getItemFieldTextLower = (item, field) =>
  item.querySelector(field).textContent.toLowerCase();

const showPage = page => {
  //set the parent node for the items
  const parent = studentItems[0].parentNode;
  //set the current page
  currentPage = page;
  //set classes on student li

  for (var i = 0; i < failedFilter.length; i++) {
    //student items that gail the filter are not displayed
    const itemIndex = failedFilter[i];
    studentItems[itemIndex].className = studentHiddenClass[itemIndex];
  }

  for (var i = 0; i < passedFilter.length; i++) {
    //displayed when the item being evaluated is within the page range
    const displayed = i < page * 10 && i >= (page - 1) * 10;

    const itemIndex = passedFilter[i];
    if (displayed) {
      studentItems[itemIndex].className = studentBaseClass[itemIndex];
    } else {
      studentItems[itemIndex].className = studentHiddenClass[itemIndex];
    }
  }

  //start no result string
  const noResult = "No results found for ";

  //if there is already a noResult display, remove it
  if (!parent.firstChild.nextSibling.textContent.indexOf(noResult)) {
    parent.removeChild(parent.firstChild.nextSibling);
  }

  //if no results match the gilter, display the no result message
  if (!passedFilter.length && failedFilter.length) {
    const noResultMessage = document.createTextNode(noResult + filterString);
    parent.insertBefore(noResultMessage, studentItems[0]);
  }
};

const activateEl = el => (el.className = "active");
const deactivateEl = el => (el.className = "");

const appendPageLinks = (pageCount, startPage = currentPage) => {
  const existing = document.querySelector(".pagination");
  if (existing) existing.remove();
  //create div and set class
  const div = document.createElement("div");
  div.className = "pagination";
  //create ul
  const ul = document.createElement("ul");
  //create pageCount lis and append to pagination list
  for (var i = 1; i <= pageCount; i++) {
    const link = document.createElement("a");
    const pageNum = document.createTextNode(i);
    const li = document.createElement("li");
    link.setAttribute("href", "#");
    link.appendChild(pageNum);
    if (i === currentPage) {
      activateEl(link);
    } else {
      deactivateEl(link);
    }

    li.appendChild(link);
    ul.appendChild(li);
  }
  //attach the pagination list to the pagination div
  div.appendChild(ul);

  //attach event listener to pagination div to listen for page change clicks
  div.addEventListener("click", event => {
    //skip if tagName !== A || is current page (no page change)
    const notAnchorTarget = event.target.tagName !== "A";
    const targetPage = parseInt(event.target.textContent, 10);
    const pageSame = !notAnchorTarget && targetPage === currentPage;
    if (notAnchorTarget || pageSame) {
      return;
    }

    //get all the links in the the list
    const links = ul.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      //activate the link whose content equals the page we are going to
      if (parseInt(links[i].textContent, 10) === targetPage) {
        activateEl(links[i]);
      } else {
        deactivateEl(links[i]);
      }
    }
    //display the new page
    showPage(targetPage);
  });

  //attach the pagination div to the page div
  document.querySelector(".page").appendChild(div);
};

const filterStudents = () => {
  //store the current state to detect a change
  const oldLength = passedFilter.length;
  passedFilter.length = 0;
  failedFilter.length = 0;
  for (var i = 0; i < studentItems.length; i++) {
    //if theres no filterString, pass everything
    //otherwise, check the item name and email
    const itemName = getItemFieldTextLower(studentItems[i], "h3");
    const nameMatch = itemName.indexOf(filterString.toLowerCase()) > -1;
    const emailName = getItemFieldTextLower(studentItems[i], "span.email");
    const emailMatch =
      nameMatch || emailName.indexOf(filterString.toLowerCase()) > -1;

    //push the i to either the passed array or failed array
    const passed = nameMatch || emailMatch || !filterString;
    const pushArray = passed ? passedFilter : failedFilter;
    pushArray.push(i);
  }
};

const appendSearch = () => {
  //create div and set class
  const div = document.createElement("div");
  div.className = "student-search";
  //create input/button and set attributes/text
  const input = document.createElement("input");
  input.setAttribute("placeholder", "Search for students...");
  const button = document.createElement("button");
  const buttonText = document.createTextNode("Search");

  //hook the elements together and attach to the .page-header div
  button.appendChild(buttonText);
  div.appendChild(input);
  div.appendChild(button);
  const parent = document.querySelector("div.page-header");
  parent.insertBefore(div, parent.firstChild);

  input.addEventListener("input", event => {
    filterString = event.target.value;
    filterStudents();
    //show the first page
    showPage(1);
    //the page count is one for each ten students, with a min of 1
    const pageCount = Math.floor(passedFilter.length / 10) + 1;
    //set up page links, one for each 10 students
    appendPageLinks(pageCount);
  });
};

//after the DOM has been loaded, show the first page and add the page links
document.addEventListener("DOMContentLoaded", event => {
  //sort the items into pass/fail
  filterStudents();

  //show the first page
  showPage(1);
  //the page count is one for each ten students, with a min of 1
  const pageCount = Math.floor(passedFilter.length / 10) + 1;
  //set up page links, one for each 10 students
  appendPageLinks(pageCount);
  appendSearch();
});
