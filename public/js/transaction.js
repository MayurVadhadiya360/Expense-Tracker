function validate_description() {
    let desc = document.getElementById("form_description").value;
    if (desc.length < 1) {
        document.getElementById("form_description").style.borderColor = "red";
        // document.getElementById("form_description").style.borderWidth = "thick";
        return false;
    } else {
        document.getElementById("form_description").style.borderColor = "green";
        // document.getElementById("form_description").style.borderWidth = "0px";
        return true;
    }
}

function validate_category() {
    let cate = document.getElementById("CatagoryDataList").value;
    if (cate === "Select Catagory...") {
        document.getElementById("CatagoryDataList").style.borderColor = "red";
        return false;
    } else {
        document.getElementById("CatagoryDataList").style.borderColor = "green";
        return true;
    }
}

function validate_date() {
    let date = document.getElementById("form_Date").value;
    if (date.length < 1) {
        document.getElementById("form_Date").style.borderColor = "red";
        return false;
    } else {
        document.getElementById("form_Date").style.borderColor = "green";
        return true;
    }
}

function validate_amount() {
    let amt = document.getElementById("form_Amount").value;
    if (amt.length < 1 || amt <= 0) {
        document.getElementById("form_Amount").style.borderColor = "red";
        return false;
    } else {
        document.getElementById("form_Amount").style.borderColor = "green";
        return true;
    }
}

function add_transaction(){
    if (validate_description() && validate_category() && validate_date() && validate_amount()) {
        // console.log("Succeeded!");
        let desc = document.getElementById("form_description").value;
        let cate = document.getElementById("CatagoryDataList").value;
        let date = document.getElementById("form_Date").value;
        let trans_types = document.getElementsByName("type_of_trans");
        let trans_type;
        trans_types.forEach(element => {
            if (element.checked) {
                trans_type = element.value;
            }
        });
        let amt = document.getElementById("form_Amount").value;
        if(trans_type == "Paid") {
            amt = 0-amt;
        }
        amt = Number(amt);

        console.log("Description: ", desc, validate_description());
        console.log("Catagory: ", cate, validate_category());
        console.log("Date: ", date, validate_date());
        console.log("Type: ", trans_type);
        console.log("Amount: ", amt, typeof amt, validate_amount());

        data = {
            email: localStorage.getItem('expense_email'),
            password: localStorage.getItem('expense_password'),
            name: localStorage.getItem('expense_name'),
            description: desc,
            category: cate,
            date: date,
            type: trans_type,
            amount: amt
        }

        let for_return=false;
        fetch("/add_transaction",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify(data)
        }).then(response => response.json())
        .then(data => {
          console.log(data.success, true);
          if(data.success){
            alert("Transaction added successfully!");
            for_return = true;
            window.location.reload();
          }else{
            alert("Transaction insert failed!");
            for_return = false;
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
        return for_return;
    }else{
        return false;
    }
}

//Selecting whether to display "add transaction" or "Sort by" field
let select_add_trans = document.getElementById("select_add_trans");
let select_sort_by = document.getElementById("select_sort_by");
select_add_trans.addEventListener('click', ()=> {

    if(select_add_trans.classList.contains("btn-outline-secondary")){
        select_add_trans.classList.remove("btn-outline-secondary");
    }
    if(!select_add_trans.classList.contains("btn-secondary")){
        select_add_trans.classList.add("btn-secondary");
        if(select_sort_by.classList.contains("btn-secondary")){
            select_sort_by.classList.remove("btn-secondary");
            select_sort_by.classList.add("btn-outline-secondary");
        }
    }
    document.getElementById("Add_New_Transaction_div").hidden = false;
    document.getElementById("Sort_By_div").hidden = true;
});

select_sort_by.addEventListener('click', ()=> {

    if(select_sort_by.classList.contains("btn-outline-secondary")){
        select_sort_by.classList.remove("btn-outline-secondary");
    }
    if(!select_sort_by.classList.contains("btn-secondary")){
        select_sort_by.classList.add("btn-secondary");
        if(select_add_trans.classList.contains("btn-secondary")){
            select_add_trans.classList.remove("btn-secondary");
            select_add_trans.classList.add("btn-outline-secondary");
        }
    }
    document.getElementById("Add_New_Transaction_div").hidden = true;
    document.getElementById("Sort_By_div").hidden = false;
});

// Delete a transaction
function Delete_Transaction(transID){
    // alert(`Deleting ${transID} ....`);
    let result = confirm(`Are you sure you want to delete this Transaction?`);
    if (result) {
        let x = {
            transID: transID,
            email: localStorage.getItem('expense_email'),
            password: localStorage.getItem('expense_password'),
            name: localStorage.getItem('expense_name')
        }
        fetch("/delete_transaction", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(x)
        }).then(response => response.json())
            .then(data => {
                console.log("deleted transaction", data.delete_success);
                if (data.delete_success) {
                    alert("Transaction deleted successfully!");
                    window.location.reload();
                } else {
                    alert("Transaction delete failed!");
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}