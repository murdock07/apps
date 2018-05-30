var db = new Dexie("MovieDB");
var edited_item = null;

db.version(1).stores({
	types: "type_name",
	items: "++id, action, what, type, who, from, to, notify, notify_date, notify_time, notified, comment, returned"
});
db.open();

function populateSomeData() {
    var itemTypesData = [
        { type_name: "dvd"},
        { type_name: "cd"},
        { type_name: "vhs"}
    ];
    return db.transaction("rw", db.types, function () {
        db.types.clear();

        for (var i in itemTypesData) {
            db.types.add(itemTypesData[i]);
        }
    }).catch(function (e) {
            console.log(e, "error");
    });
}

function addNewType() {
    var newType = document.getElementById("new_type").value;
        
    return db.transaction("rw", db.types, function () {
        db.types.add({ type_name : newType});
        alert('New type successfully added!');
        document.getElementById("new_type").value = "";
    }).catch(function (e) {
        alert('This type already exist in the database!');
    });
}

function deleteType(type_name) {   
    var confirm_delete = confirm('delete type ' + type_name + '?');
    if( confirm_delete === true )
    {
        db.types.where("type_name").equals(type_name).delete()
         .then(function () {
             refreshTypeList();
         });
    }
}

function refreshTypeList() {
    var list = document.getElementById("typelist");
    list.innerHTML = "";

    var s = document.getElementById("input_bli_item_type");
    s.innerHTML = "";
    
    var ph = document.createElement("option");
    ph.text = 'select item type...';
    ph.setAttribute("value", "");
    ph.setAttribute("selected", "selected");
    s.add(ph);

    var s2 = document.getElementById("input_bli_item_type2");
    s2.innerHTML = "";
    
    var ph2 = document.createElement("option");
    ph2.text = 'select item type...';
    ph2.setAttribute("value", "");
    ph2.setAttribute("selected", "selected");
    s2.add(ph2);

    var e = document.getElementById("edit_bli_item_type");
    e.innerHTML = "";
    
    var e_ph = document.createElement("option");
    e_ph.text = 'select item type...';
    e_ph.setAttribute("value", "");
    e.add(e_ph);
    
    return db.transaction("r", db.types, function () {
        db.types.orderBy('type_name').each(function (type) {
            var li = document.createElement("li");
            var btn = document.createElement("button");
            
            btn.setAttribute("class", "icon icon-view btn-deleteType");
            btn.appendChild(document.createTextNode(type.type_name));
            btn.addEventListener("click", function() { deleteType(type.type_name); }, false);
            
            li.appendChild(btn);
            list.appendChild(li);

            var option = document.createElement("option");
            option.text = type.type_name;
            option.setAttribute("value", type.type_name);
            s.add(option);

            var option2 = document.createElement("option");
            option2.text = type.type_name;
            option2.setAttribute("value", type.type_name);
            s2.add(option2);

            var e_option = document.createElement("option");
            e_option.text = type.type_name;
            e_option.setAttribute("value", type.type_name);
            e.add(e_option);
        });
    }).catch(function (e) {
        alert(e, "error");
    });
}

function createClickableListItem( item ) {
    var li = document.createElement("li");
    var aLink = document.createElement("a");
    aLink.setAttribute("class", "btn-viewItem");

    var p1 = document.createElement("p");
    p1.setAttribute('class', 'p-line1');
    p1.appendChild(document.createTextNode( item.what ));
    var p2 = document.createElement("p");
    p2.setAttribute('class', 'p-line2');
    p2.appendChild(document.createTextNode( item.who + " (Return: " + item.to + ")" ));

    aLink.appendChild( p1 );
    aLink.appendChild( p2 );
    aLink.addEventListener("click", function() { viewItem(item.id); }, false);
    li.appendChild(aLink);
    return li;
}

function refreshBorrowList() {
    var borrowList = document.getElementById("borrowList");
    borrowList.innerHTML = "";
    
    return db.transaction("r", db.items, function () {
        db.items.where('action').equalsIgnoreCase('borrow')
          .and(function(item) { return (item.returned === 0); })  
          .each(function (item) {
            var li = createClickableListItem( item );
            borrowList.appendChild(li);
        });
    }).catch(function (e) {
        alert(e, "error");
    });
}

function refreshLendList() {
    var lendList = document.getElementById("lendList");
    lendList.innerHTML = "";
    
    return db.transaction("r", db.items, function () {
        db.items.where('action').equalsIgnoreCase('lend')
          .and(function(item) { return (item.returned === 0); })
          .each(function (item) {
            var li = createClickableListItem( item );
            lendList.appendChild(li);
        });
    }).catch(function (e) {
        alert(e, "error");
    });
}

function refreshArchivesList() {
    var archivesList = document.getElementById("archivesList");
    archivesList.innerHTML = "";
    
    return db.transaction("r", db.items, function () {
        db.items.where('returned').equals(1).each(function (item) {
            var li =  createClickableListItem( item );
            archivesList.appendChild(li);
        });
    }).catch(function (e) {
        console.log(e, "error");
    });
}

function viewItem( item_id ) {
    showEditActionView();
    db.items.get(item_id, function (item){
        edited_item = item;
        var actions = document.getElementById("edit_bli_action");
        for(var i=0; i < actions.options.length; i++) {
          if(actions.options[i].value === item.action) {
            actions.selectedIndex = i;
          }
        }

        var itemtypes = document.getElementById("edit_bli_item_type");
        for(var i=0; i < itemtypes.options.length; i++) {
          if(itemtypes.options[i].value === item.type) {
            itemtypes.selectedIndex = i;
          }
        }
        document.getElementById("edit_bli_item").value = item.what;
        document.getElementById("edit_bli_person").value = item.who;
        document.getElementById("edit_bli_from_date").value = item.from;
        document.getElementById("edit_bli_to_date").value = item.to;
        
        if(item.notify === 1) {
            document.getElementById("edit_bli_notify").checked = true;
            document.getElementById("edit_bli_notify_date").value = item.notify_date;
            document.getElementById("edit_bli_notify_time").value = item.notify_time;
        }
        else {
            document.getElementById("edit_bli_notify").checked = false;
            document.getElementById("edit_bli_notify_date").value = "";
            document.getElementById("edit_bli_notify_time").value = "";
        }
        document.getElementById("edit_bli_comment").value = item.comment;
        if(item.returned === 1) {
            document.getElementById("edit_bli_return").checked = true;
        }
        else {
            document.getElementById("edit_bli_return").checked = false;
        }
  });
};

function deleteBorrowLendItem() {
    return db.transaction("rw", db.items, function () {
         db.items.delete(edited_item.id);
         alert('Action deleted succesfully!');
         resetUpdateFields();
         refreshItemCounters();
         refreshItemList();
    }).catch(function (e) {
        console.log(e, "error");
    });
}

function updateBorrowLendItem() {
    
    if( checkInputs( 'update' )) {
       var editedBorrowLendItem = {
            action : document.getElementById("edit_bli_action").value,
            what : document.getElementById("edit_bli_item").value,
            type : document.getElementById("edit_bli_item_type").value,
            who : document.getElementById("edit_bli_person").value,
            from : document.getElementById("edit_bli_from_date").value,
            to : document.getElementById("edit_bli_to_date").value,
            notify : (document.getElementById("edit_bli_notify").checked === true) ? 1 : 0,
            notify_time : document.getElementById("edit_bli_notify_time").value,
            notify_date : document.getElementById("edit_bli_notify_date").value,
            comment : document.getElementById("edit_bli_comment").value,
            returned : (document.getElementById("edit_bli_returned").checked === true) ? 1 : 0,
            notified: 0
        };
        return db.transaction("rw", db.items, function () {
             db.items.delete(edited_item.id);
             db.items.add(editedBorrowLendItem);
             alert('Action updated succesfully!');
             refreshItemCounters();

        }).catch(function (e) {
            console.log(e, "error");
        });
    }
    else {
        alert('Something is missing!');
    }
}

function addBorrowLendItem() {
    if( checkInputs( 'add' )) {
        var borrowLendItem = {
            action : document.getElementById("input_bli_action").value,
            what : document.getElementById("input_bli_item").value,
            type : document.getElementById("input_bli_item_type").value,
            who : document.getElementById("input_bli_person").value,
            from : document.getElementById("input_bli_from_date").value,
            to : document.getElementById("input_bli_to_date").value,
            notify : (document.getElementById("input_bli_notify").checked === true) ? 1 : 0,
            notify_time : document.getElementById("input_bli_notify_time").value,
            notify_date : document.getElementById("input_bli_notify_date").value,
            comment : document.getElementById("input_bli_comment").value,
            returned : 0,
            notified: 0
        };

        return db.transaction("rw", db.items, function () {
            db.items.add( borrowLendItem );
            alert('Action saved succesfully!');
            resetInputFields();
            refreshItemCounters();
        }).catch(function (e) {
            console.log(e, "error");
        });
    }
    else
    {
        alert ('Something is missing!');
    }
}

function validateInputValue(elem) {
    if( elem.value === "" ) {
        elem.classList.remove('normal');
        elem.classList.add('hibas');
        return false;
    }
    else {
        elem.classList.remove('hibas');
        elem.classList.add('normal');
        return true;
    }
}

function checkInputs( action ) {
    var no_errors = true;
    
    if( action === 'add') {
    
        if ( !validateInputValue( document.getElementById("input_bli_action") ) 
          || !validateInputValue( document.getElementById("input_bli_action") )
          || !validateInputValue( document.getElementById("input_bli_item") )
          || !validateInputValue( document.getElementById("input_bli_person") )
          || !validateInputValue( document.getElementById("input_bli_item_type") )
          || !validateInputValue( document.getElementById("input_bli_from_date") )
          || !validateInputValue( document.getElementById("input_bli_to_date") )
        ) {
            no_errors = false;
        }
        
        if ( (document.getElementById("input_bli_notify").checked === true) &&
             ( (document.getElementById("input_bli_notify_time").value === "") ||
              (document.getElementById("input_bli_notify_date").value === "") )
            ){
            no_errors = false;
        }
    }
    else if (action === 'update') {
        if ( !validateInputValue( document.getElementById("edit_bli_action") ) 
          || !validateInputValue( document.getElementById("edit_bli_action") )
          || !validateInputValue( document.getElementById("edit_bli_item") )
          || !validateInputValue( document.getElementById("edit_bli_person") )
          || !validateInputValue( document.getElementById("edit_bli_item_type") )
          || !validateInputValue( document.getElementById("edit_bli_from_date") )
          || !validateInputValue( document.getElementById("edit_bli_to_date") )
        ) {
            no_errors = false;
        }
        if ( (document.getElementById("edit_bli_notify").checked === true) &&
             ( (document.getElementById("edit_bli_notify_time").value === "") ||
              (document.getElementById("edit_bli_notify_date").value === "") )
            ){
            no_errors = false;
        }
    }
    if( !no_errors) {
        return false;
    }
    else {
        return true;
    }
}

function refreshItemCounters() {
    document.querySelector("#countBorrowed").innerHTML = 0;
    document.querySelector("#countLent").innerHTML = 0;
    document.querySelector("#countArchived").innerHTML = 0;
    
    var i=0;
    db.items.where('action').equalsIgnoreCase('borrow')
      .and(function(item) { return (item.returned === 0); })
      .each(function(item){
          i++;
          document.querySelector("#countBorrowed").innerHTML = i;
    });
    var j=0;
    db.items.where('action').equalsIgnoreCase('lend')
      .and(function(item) { return (item.returned === 0); })    
      .each(function(item){
          j++;
          document.querySelector("#countLent").innerHTML = j;
    });
    var k=0;
    db.items.where('returned').equals(1)
      .each(function(item){
          k++;
          document.querySelector("#countArchived").innerHTML = k;
    });
}

function createNotification(item) {
    var img = 'img/icon-30.png';
    var text = 'The item: ' + item.what  + ' needs to be returned on ' + item.notify_date + ' ' + item.notifiy_time  + '!';

    if (!"Notification" in window) {
      console.log("This browser does not support notifications.");
    }
    else if (Notification.permission === "granted") {
      var notification = new Notification('HolMi App', { body: text, icon: img });
      window.navigator.vibrate(500);
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
        if(!('permission' in Notification)) {
            Notification.permission = permission;
        }
        if (permission === "granted") {
            var notification = new Notification('HolMi App', { body: text, icon: img });
            window.navigator.vibrate(500);
        }
      });
    }
}

function checkDeadlines() {
    var now = new Date();
    var minuteCheck = now.getMinutes();
    var hourCheck = now.getHours();
    var dayCheck = now.getDate();
    var monthCheck = now.getMonth() + 1;
    var yearCheck = now.getFullYear();
    
    return db.transaction("rw", db.items, function () {
        db.items.each(function (item) {
            if(item.notify_time != "" && item.notified != 1 ) {
                iDate = new Date(item.notify_date);
                iTime = item.notify_time.split(":");
                var hours = iTime[0];
                var minutes = iTime[1];
                var day = iDate.getDate();
                var month = iDate.getMonth() + 1;
                var year = iDate.getFullYear();
                
                if( ( hours == hourCheck ) && ( minutes == minuteCheck ) && (day == dayCheck) && (month == monthCheck ) && (year == yearCheck)) {
                    createNotification(item);
                    setNotified(item);
                }
            }
        });
    });
}

function setNotified(item) {
    return db.transaction("rw", db.items, function () {
        db.items.update(item.id, { notified: 1} ).then(function(updated){
            if (updated) {
                console.log(' --> ' + item.notified);
            } else {
                console.log ("Nothing was updated... :-(");
            }
        });
    }).catch(function (e) {
        console.log(e, "error");
    });
}

setInterval(checkDeadlines, 2000);

function refreshItemList() {
    var type = document.getElementById('input_bli_item_type2').value;
    var itemList = document.getElementById("byTypeList");
    itemList.innerHTML = "";
    
    return db.transaction("r", db.items, function () {
        db.items.where('type').equalsIgnoreCase(type).each(function (item) {
            var li =  createClickableListItem( item );
             itemList.appendChild(li);
        });
    }).catch(function (e) {
        console.log(e, "error");
    });
}

document.addEventListener("DOMContentLoaded", function() {
    populateSomeData()
    .catch(function (e) {
            log(e, "error");
    });

    document.querySelector("#addButton").addEventListener("click", addBorrowLendItem, false);
    document.querySelector("#addTypeButton").addEventListener("click", addNewType, false);
    document.querySelector("#editButton").addEventListener("click", updateBorrowLendItem, false);
    document.querySelector("#deleteItemButton").addEventListener("click", deleteBorrowLendItem, false);
    document.querySelector("#input_bli_item_type2").addEventListener("change", refreshItemList, false);
    
    refreshTypeList();
    refreshBorrowList();
    refreshLendList();
    resetInputFields();
    resetUpdateFields();
    refreshItemCounters();
});
