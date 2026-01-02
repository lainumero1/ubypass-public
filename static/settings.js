document.addEventListener("DOMContentLoaded", function() {
    let campus;
    let campusSelection = document.getElementById("campus-selection")
    campusSelection.addEventListener("change", function() {
        localStorage.setItem("campus", this.value);
    });
    if ("campus" in localStorage) {
        campus = localStorage.getItem("campus")
        for (let i = 0; i < campusSelection.length; i++) {
            if (i.toString() === campus) {
                campusSelection.value = i
            }
        }
    }
    else {
        campus = campusSelection.value
        localStorage.setItem("campus", campus)
    }

    let sortBy;
    let sortSelection = document.getElementById("sort-selection")
    sortSelection.addEventListener("change", function() {
        localStorage.setItem("sortBy", this.value);
    });
    if ("sortBy" in localStorage) {
        sortBy = localStorage.getItem("sortBy")
        for (let i = 0; i < sortSelection.length; i++) {
            if (i.toString() === sortBy) {
                sortSelection.value = i
            }
        }
    }
    else {
        sortBy = sortSelection.value
        console.log(sortBy)
        localStorage.setItem("sortBy", campus)
    }
})

