console.log("Here is Database.js")

//-----------------------------------DATABASE CDN CONFIG----------------------------------------//

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, child, onValue, get, query, limitToFirst, limitToLast, orderByChild, startAt, startAfter, endAt, endBefore, equalTo } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDYzNxOVmMbrHxggHzEzzy8wF8_-b-mepY",
    authDomain: "leafwise-2.firebaseapp.com",
    databaseURL: "https://leafwise-2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "leafwise-2",
    storageBucket: "leafwise-2.appspot.com",
    messagingSenderId: "1005980205286",
    appId: "1:1005980205286:web:a7523ef5ebb17188a2bb27",
    measurementId: "G-TKKD4LEBY8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

 //---------------------------------------------TABLE CONFIG-----------------------------------------
var userNo = 0;
//var tbody = document.getElementById('tbody1');
var tbody = document.getElementById('tbody1');

function AddItemToTable(disease,image,probability){//,country,district,latitude,longitude,state,postcode,temperature,humidity,weather,uv){
    let trow = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let p2 = document.createElement('p');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    // let td5 = document.createElement('td');
    // let td6 = document.createElement('td');
    // let td7 = document.createElement('td');
    // let td8 = document.createElement('td');
    // let td9 = document.createElement('td');
    // let td10 = document.createElement('td');
    // let td11 = document.createElement('td');
    // let td12 = document.createElement('td');
    // let td13 = document.createElement('td');
    // let td14 = document.createElement('td');

    td1.innerHTML = ++userNo;
    switch (disease) {
        case "leaf_blight":
        p2.className = "disease_class leaf_blight";
        break;
        case "leaf_spot":
        p2.className = "disease_class leaf_spot";
        break;
        case "leaf_anthracnose":
        p2.className = "disease_class leaf_anthracnose";
        break;
        case "leaf_green_algae_rust":
        p2.className = "disease_class leaf_green_algae_rust";
        break;
        case "leaf_yellowing":
        p2.className = "disease_class leaf_yellowing";
        break;
        default:
        p2.className = "disease_class";
        break;
    }
    p2.innerHTML = disease;
    td3.innerHTML = image;
    td4.innerHTML = probability;
    // td5.innerHTML = country;
    // td6.innerHTML = district;
    // td7.innerHTML = latitude;
    // td8.innerHTML = longitude;
    // td9.innerHTML = state;
    // td10.innerHTML = postcode;
    // td11.innerHTML = temperature;
    // td12.innerHTML = humidity;
    // td13.innerHTML = weather;
    // td14.innerHTML = uv;

    trow.appendChild(td1);
    td2.appendChild(p2);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    // trow.appendChild(td5);
    // trow.appendChild(td6);
    // trow.appendChild(td7);
    // trow.appendChild(td8);
    // trow.appendChild(td9);
    // trow.appendChild(td10);
    // trow.appendChild(td11);
    // trow.appendChild(td12);
    // trow.appendChild(td13);
    // trow.appendChild(td14);

    tbody.appendChild(trow);
}


function AddAllItemToTable(theUser){
//descending order the data
//theUser.reverse();

userNo=0;
tbody.innerHTML="";
theUser.forEach(element => {
    //based on naming in firebase realtime
    AddItemToTable(element.disease, element.image, element.probability);
});
}



//----------------------------------GETTING ALL DATA----------------------------------------------//

function GetAllDataOnce(){
// limitToFirst : to get first few data
//const que = query (ref(db, "posts/"), limitToFirst(1));

// limitToLast : to get last few data
// const que = query (ref(db, "posts/"), limitToLast(1));

// orderByChild : to sort based on 1 column (naming based on fibase realtime)
const que = query (ref(db, "posts/"), orderByChild("disease"));

    get(que)
    .then((snapshot)=>{

        var users = [];

        snapshot.forEach(childSnapshot => {
        users.push(childSnapshot.val());
        });

        AddAllItemToTable(users);

    })
}

function GetAllDataRealTime(){
    const dbRef = ref(db, "posts/");

    onValue(dbRef, (snapshot) => {
        var users = [];

        snapshot.forEach(childSnapshot => {
        users.push(childSnapshot.val());
        });

        AddAllItemToTable(users);

    })
}

window.onload = GetAllDataOnce;

/*
function CORSSolve() {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            console.log(xhttp.responseText)
    }
}}
//xhttp.open("GET", "")

//.input-group input
const search = document.querySelector('.input-group input');
const table_rows = document.querySelectorAll('tbody tr');

//input
search.addEventListener("input", searchTable);

// 1. Searching for specific data of HTML table
function searchTable() {
    table_rows.forEach((row, i) => {
        console.log(row.textContent);
        // let table_data = row.textContent,
        //     search_data = search.value;
        // row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
    })
}
*/