// helper functions
const getElement = (id) => document.getElementById(id);
const getGender = () => document.querySelector('input[name="gender"]:checked');
const clearTextInput = (id) => (getElement(id).value = "");
const clearGender = () =>
  (document.querySelector('input[name="gender"]:checked').checked = false);

const addPatientButton = getElement("addPatient");
const report = getElement("report");
const btnSearch = getElement("btnSearch");
const patients = [];

/**
 * function to retrieve patient form data
 * ensures input data is valid
 * and adds new patient to patient array
 */
function addPatient() {
  const name = getElement("name").value;
  const gender = getGender();
  const age = getElement("age").value;
  const condition = getElement("condition").value;

  if (name && gender && age && condition) {
    patients.push({ name, gender: gender.value, age, condition });
    resetForm();
    generateReport();
  }
}

/**
 * function to reset the input form
 * clears values
 */
function resetForm() {
  clearTextInput("name");
  clearTextInput("age");
  clearTextInput("condition");
  clearGender();
}

function searchCondition() {
  const input = getElement("conditionInput").value.toLowerCase();
  const resultDiv = getElement("result");
  resultDiv.innerHTML = "";

  fetch("health_analysis.json")
    .then((response) => response.json())
    .then((data) => {
      const condition = data.conditions.find(
        (item) => item.name.toLowerCase() === input,
      );

      if (!condition) {
        resultDiv.innerHTML = "Condition no found.";
        return;
      }

      const symptoms = condition.symptoms.join(", ");
      const prevention = condition.prevention.join(", ");
      const treatment = condition.treatment;

      resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
      resultDiv.innerHTML += `<img src="./${condition.imagesrc}" alt="hjh">`;

      resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
      resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
      resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
    })
    .catch((error) => {
      console.error("Error:", error);
      resultDiv.innerHTML = "An error occurred while fetching data.";
    });
}

function generateReport() {
  const numPatients = patients.length;
  const conditionsCount = {
    Diabetes: 0,
    Thyroid: 0,
    "High Blood Pressure": 0,
  };

  const genderConditionsCount = {
    Male: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
    Female: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
  };

  for (const patient of patients) {
    conditionsCount[patient.condition]++;
    genderConditionsCount[patient.gender][patient.condition]++;
  }

  report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
  report.innerHTML += `Conditions Breadkdown: <br>`;

  for (const condition in conditionsCount) {
    report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
  }

  report.innerHTML += `<br>Gender-Based Conditions:<br>`;
  for (const gender in genderConditionsCount) {
    report.innerHTML += `${gender}:<br>`;
    for (const condition in genderConditionsCount[gender]) {
      report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
    }
  }
}

addPatientButton.addEventListener("click", addPatient);
btnSearch.addEventListener("click", searchCondition);
