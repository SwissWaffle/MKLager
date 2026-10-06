async function tester() {
    const output = document.getElementById("testing_out");
    const test = document.getElementById("test").value;
    const d = new Date(test);
    datearray = test.split("-");
    db = datearray[1] + "/" + datearray[0].slice(-2);
    output.textContent = db;
}

/*testig for date formatting

04/26

look into month overflow and year adjustment*/