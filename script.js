//fetch loading json data

let originalChemicalData = [];
let editingIndex = -1;
let isEditing = false;
let selectedRows = 0;

//function for set delete modal disabled
setDeleteModalDisabled = () => {
  selectedRows = 0;

  const checkbox = document.querySelectorAll('input[name="select"]');
  checkbox.forEach((checkbox) => {
    checkbox.checked = false; // Uncheck each checkbox
  });
  const deleteIconId = document.getElementById("deleteIcon");
  deleteIconId.style.opacity = "0.5";
  deleteIconId.style.pointerEvents = "none";
};

setDeleteModalDisabled();

//function for fetch chemical data

fetchChemicalData = () => {
  fetch("chemical_data.json")
    .then((response) => response.json())

    .then((chemicalDataResponse) => {
      originalChemicalData = chemicalDataResponse.slice();
      getChemicalData(originalChemicalData);

      const checkboxes = document.querySelectorAll('input[name="select"]');
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", selectedCheckboxCount);
      });
    })

    .catch((error) => console.error("Error loading For the JSON data:", error));
};

fetchChemicalData(); //Initialy fetch data

//Function for get table data from JSON
getChemicalData = (chemicalDataResponse) => {
  let placeholder = document.querySelector("#chemical-data");
  let output = "";
  let index = 1;
  for (let chemicalData of chemicalDataResponse) {
    output += `
            <tr>
                <td>
				    <span class="custom-checkbox">
					    <input type="checkbox" id="checkId" name="select" value="${index}" on>
					    <label for="checkbox"></label>
					</span>
                </td>
                <td>${index}</td>
                <td>${chemicalData.ChemicalName}</td>
                <td>${chemicalData.Vendor}</td>
                <td>${chemicalData.Density}</td>
                <td>${chemicalData.Viscosity}</td>
                <td>${chemicalData.Packaging}</td>
                <td>${chemicalData.PackSize}</td>
                <td>${chemicalData.Unit}</td>
                <td>${chemicalData.Quantity}</td>
                <td class="text-center">
                <span data-bs-toggle="modal"
                data-bs-target="#myModal" onclick="editChemicalData(${chemicalData.id})">
                <i class="fa-solid fa-pen text-primary " role="button"></i>
                </span>
                </td>
            </tr>
            `;
    index++;
  }
  placeholder.innerHTML = output;
  const checkboxes = document.querySelectorAll('input[name="select"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", selectedCheckboxCount);
  });

  saveDataIntoLocalStorage(chemicalDataResponse);
};

//Function for select all checkbox
selectedCheckboxCount = () => {
  const checkbox = document.querySelectorAll('input[name="select"]');
  const selectedRows = [...checkbox].filter(
    (checkbox) => checkbox.checked
  ).length;

  if (selectedRows === 0) {
    const deleteIconId = document.getElementById("deleteIcon");
    deleteIconId.style.opacity = "0.5";
    deleteIconId.style.pointerEvents = "none";
  } else {
    const deleteIconId = document.getElementById("deleteIcon");
    deleteIconId.style.opacity = "1";
    deleteIconId.style.pointerEvents = "auto";
  }
};

//Function for sorting table based on ChemicalName
let currentOrderForSort = "";

toggleSorting = (sortField) => {
  currentOrderForSort = currentOrderForSort === "asc" ? "desc" : "asc";
  sortingData(sortField, currentOrderForSort);
};

sortingData = (sortField, order) => {
  chemicalDetailData = originalChemicalData.slice();

  let arrowsForSorting = document.querySelectorAll(".arrow");
  arrowsForSorting.forEach((arrow) => {
    arrow.style.color = "grey";
  });

  chemicalDetailData.sort(function (a, b) {
    return order === "asc"
      ? a[sortField].localeCompare(b[sortField])
      : b[sortField].localeCompare(a[sortField]);
  });
  getChemicalData(chemicalDetailData);

  document.getElementById(
    order === "asc" ? "ascArrow" : "descArrow"
  ).style.color = "blue";
};

//Refresh data to original state

refreshChemicalData = () => {
  fetchChemicalData();
  let arrowsForSorting = document.querySelectorAll(".arrow");
  arrowsForSorting.forEach((arrow) => {
    arrow.style.color = "grey";
  });
  localStorage.clear();
};

// Add/Edit Chemical Data Into Grid

closeModal = () => {
  $("#myModal").modal("hide");
  document.getElementById("chemicalDataForm").reset(); // Reset the form data
  if (isEditing === true) {
    document.getElementById("form-submit-Btn").innerText = "Add";
    document.getElementById("form-header").innerText = "Add Chemical Data";
  }
};

AddChemicalDataIntoGrid = () => {
  const form = document.getElementById("chemicalDataForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (isEditing && editingIndex > -1) {
    const ChemicalName = document.getElementById("chemicalName").value;
    const Vendor = document.getElementById("vendor").value;
    const Density = document.getElementById("density").value;
    const Viscosity = document.getElementById("viscosity").value;
    const Packaging = document.getElementById("packaging").value;
    const PackSize = document.getElementById("packsize").value;
    const Unit = document.getElementById("unit").value;
    const Quantity = document.getElementById("quantity").value;
    const id = document.getElementById("id").value;

    originalChemicalData[editingIndex - 1] = {
      ChemicalName,
      Vendor,
      Density,
      Viscosity,
      Packaging,
      PackSize,
      Unit,
      Quantity,
      id,
    };

    document.getElementById("form-submit-Btn").innerText = "Add";
    document.getElementById("form-header").innerText = "Add Chemical Data";
  } else {
    const ChemicalName = document.getElementById("chemicalName").value;
    const Vendor = document.getElementById("vendor").value;
    const Density = document.getElementById("density").value;
    const Viscosity = document.getElementById("viscosity").value;
    const Packaging = document.getElementById("packaging").value;
    const PackSize = document.getElementById("packsize").value;
    const Unit = document.getElementById("unit").value;
    const Quantity = document.getElementById("quantity").value;
    const id = originalChemicalData.length + 1;

    const newChemicalData = {
      ChemicalName,
      Vendor,
      Density,
      Viscosity,
      Packaging,
      PackSize,
      Unit,
      Quantity,
      id,
    };
    originalChemicalData.push(newChemicalData);
  }

  getChemicalData(originalChemicalData);

  closeModal();

  document.getElementById("chemicalDataForm").reset(); // Reset the form data

  showAlertSuccessMessage();

  editingIndex = -1;
};

// function for edit selected row

editChemicalData = (index) => {
  const chemicalDetail = originalChemicalData[index - 1];

  document.getElementById("chemicalName").value = chemicalDetail.ChemicalName;
  document.getElementById("vendor").value = chemicalDetail.Vendor;
  document.getElementById("density").value = chemicalDetail.Density;
  document.getElementById("viscosity").value = chemicalDetail.Viscosity;
  document.getElementById("packaging").value = chemicalDetail.Packaging;
  document.getElementById("packsize").value = chemicalDetail.PackSize;
  document.getElementById("unit").value = chemicalDetail.Unit;
  document.getElementById("quantity").value = chemicalDetail.Quantity;
  document.getElementById("id").value = chemicalDetail.id;

  editingIndex = index;
  isEditing = true;

  document.getElementById("form-submit-Btn").innerText = "Save Changes";
  document.getElementById("form-header").innerText = "Edit Chemical Data";
};

//function for delete selected row

deleteDataOfChemical = () => {
  selectedRows = document.querySelectorAll('input[name="select"]:checked');

  let selectedRowsIndex = [];
  selectedRows.forEach((row) => {
    selectedRowsIndex.push(parseInt(row.value));
  });

  selectedRowsIndex.sort((a, b) => b - a);

  selectedRowsIndex.forEach((index) => {
    originalChemicalData.splice(index - 1, 1);
  });

  getChemicalData(originalChemicalData);

  $("#deleteModal").modal("hide");

  setDeleteModalDisabled();
};

//function for save and download data into local storage

saveChemicalData = () => {
  localStorage.setItem("chemicalData", JSON.stringify(originalChemicalData));
  downloadChemicalData(originalChemicalData, "chemicalData.csv");
};

//function for JSON to CSV
convertJsonToCSV = (jsonData) => {
  const headers = Object.keys(jsonData[0]);

  const rows = jsonData.map((row) =>
    headers
      .map((header) =>
        JSON.stringify(row[header], (replacer = (key, value) => value || ""))
      )
      .join(",")
  );

  const csvContentData = [headers.join(","), ...rows].join("\r\n");
  return csvContentData;
};

downloadChemicalData = (jsonData, fileName) => {
  const csvContentData = convertJsonToCSV(jsonData);

  const blob = new Blob([csvContentData], { type: "text/csv" });
  const fileURL = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = fileURL;
  a.download = fileName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  $("#saveModal").modal("hide");
};

//function for save data into local storage

saveDataIntoLocalStorage = (chemicalData) => {
  localStorage.setItem("chemicalData", JSON.stringify(chemicalData));
};

//show success alert message
showAlertSuccessMessage = () => {
  const alertElementId = document.getElementById("successAlertToast");
  alertElementId.style.display = "block";

  if (isEditing === true) {
    document.getElementById("successAlertToast").innerText =
      "Data Updated Successfully!";
  } else {
    document.getElementById("successAlertToast").innerText =
      "Data Added Successfully!";
  }

  setTimeout(() => {
    alertElementId.style.display = "none";
    isEditing = false;
  }, 1000);
};
