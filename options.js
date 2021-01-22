var importInput = document.getElementById("import-input");
var importButton = document.getElementById("import-button");
var exportButton = document.getElementById("export-button");

function notifyImportError() {
  swal({
    text: "Failed to import tab sets. Please try again.",
    icon: "error",
  });

  importInput.value = "";
}

function handleImport() {
  if (!importInput.files[0]) {
    swal({
      text: "Please select a file to import",
      icon: "error",
    });

    return;
  }

  var reader = new FileReader();

  reader.onload = function () {
    Sets.import(JSON.parse(reader.result))
      .then(function () {
        swal({
          text: "Successfully Imported Tab Sets",
        });

        importInput.value = "";
      })
      .catch(notifyImportError);
  };

  reader.onerror = notifyImportError;

  reader.readAsText(importInput.files[0]);
}

function handleExport() {
  Sets.export();
}

document
  .getElementById("import-button")
  .addEventListener("click", handleImport);

document
  .getElementById("export-button")
  .addEventListener("click", handleExport);
