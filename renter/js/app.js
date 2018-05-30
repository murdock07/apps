var mainView,
    actionView,
    listBorrowView,
    listLendView,
    listArchivesView,
    newTypeView,
    editTypesView,
    editActionView,
    listByTypeView;
    
var n_date_input, 
    n_time_input;

function showActionView() {
    hideAll();
    actionView.classList.remove("hidden");
}

function showMainView() {
    //console.log("Borrowed: " + borrowed);
    refreshItemCounters();
    hideAll();
    mainView.classList.remove("hidden");
}

function showListBorrowView() {
    refreshBorrowList();
    hideAll();
    document.querySelector("#editBackButton").addEventListener("click", showListBorrowView, false);
    listBorrowView.classList.remove("hidden");
}

function showListLendView() {
    refreshLendList();
    hideAll();
    document.querySelector("#editBackButton").addEventListener("click", showListLendView, false);
    listLendView.classList.remove("hidden");
}

function showListArchivesView() {
    refreshArchivesList();
    hideAll();
    document.querySelector("#editBackButton").addEventListener("click", showListArchivesView, false);
    listArchivesView.classList.remove("hidden");
}

function showNewTypeView() {
    document.getElementById("new_type").value="";
    hideAll();
    newTypeView.classList.remove("hidden");
}

function showEditTypesView (){
    refreshTypeList();
    hideAll();
    editTypesView.classList.remove("hidden");
}

function showEditActionView() {
    hideAll();
    editActionView.classList.remove("hidden");
}

function showListByTypeView() {
    refreshTypeList();
    hideAll();
    listByTypeView.classList.remove("hidden");
    document.querySelector("#editBackButton").addEventListener("click", showListByTypeView, false);
}

function hideAll() {
    mainView.classList.add("hidden");
    actionView.classList.add("hidden");
    listBorrowView.classList.add("hidden");
    listLendView.classList.add("hidden");
    listArchivesView.classList.add("hidden");
    newTypeView.classList.add("hidden");
    editTypesView.classList.add("hidden");
    editActionView.classList.add("hidden");
    listByTypeView.classList.add("hidden");
}

function resetInputFields() {
    document.getElementById("input_bli_action").selectedIndex = 0;
    document.getElementById("input_bli_item").value ="";
    document.getElementById("input_bli_item_type").selectedIndex = 0;
    document.getElementById("input_bli_person").value ="";
    document.getElementById("input_bli_from_date").value ="";
    document.getElementById("input_bli_to_date").value ="";
    document.getElementById("input_bli_notify").checked = false;
    document.getElementById("input_bli_notify_time").value = "";
    document.getElementById("input_bli_notify_date").value = "";
    document.getElementById("input_bli_comment").value = "";
}

function resetUpdateFields() {
    document.getElementById("edit_bli_action").selectedIndex = 0;
    document.getElementById("edit_bli_item").value ="";
    document.getElementById("edit_bli_item_type").selectedIndex = 0;
    document.getElementById("edit_bli_person").value ="";
    document.getElementById("edit_bli_from_date").value ="";
    document.getElementById("edit_bli_to_date").value ="";
    document.getElementById("edit_bli_notify").checked = false;
    document.getElementById("edit_bli_notify_time").value = "";
    document.getElementById("edit_bli_notify_date").value ="";
    document.getElementById("edit_bli_comment").value = "";
    document.getElementById("edit_bli_returned").checked = false;
}

function showNotifyDateTimeInputs() {
    if ( document.getElementById("input_bli_notify").checked === true ) {
        document.getElementById("input_bli_notify_time").classList.remove("hidden");
        document.getElementById("input_bli_notify_date").classList.remove("hidden");
    } else {
        document.getElementById("input_bli_notify_time").classList.add("hidden");
        document.getElementById("input_bli_notify_date").classList.add("hidden");
    }
}

window.onload = function () {
    actionView = document.getElementById("actionView");
    mainView = document.getElementById("mainView");
    listBorrowView = document.getElementById("listBorrowView");
    listLendView = document.getElementById("listLendView");
    listArchivesView = document.getElementById("listArchivesView");
    newTypeView = document.getElementById("newTypeView");  
    editTypesView = document.getElementById("editTypesView");  
    editActionView = document.getElementById("editActionView");
    listByTypeView = document.getElementById("listByTypeView");
    
    showMainView();
    
    document.getElementById("input_bli_notify_time").classList.add("hidden");
    document.getElementById("input_bli_notify_date").classList.add("hidden");

    document.getElementById("btn-actionView").addEventListener("click", showActionView);
    document.getElementById("btn-mainView").addEventListener("click", showMainView);
    document.getElementById("btn-listBorrowView").addEventListener("click", showListBorrowView);
    document.getElementById("btn-listLendView").addEventListener("click", showListLendView);
    document.getElementById("btn-listArchivesView").addEventListener("click", showListArchivesView);
    document.getElementById("btn-newTypeView").addEventListener("click", showNewTypeView);
    document.getElementById("btn-back").addEventListener("click", showEditTypesView);
    document.getElementById("btn-editTypesView").addEventListener("click", showEditTypesView);
    document.getElementById("input_bli_notify").addEventListener("change", showNotifyDateTimeInputs);
    document.getElementById("backToMainButton").addEventListener("click", showMainView);
    document.getElementById("btn-listByTypeView").addEventListener("click", showListByTypeView);
};