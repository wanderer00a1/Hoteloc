$(document).ready(function () {
    $("#image").fileinput({
      theme: "fa",
      showUpload: false, // Hides the upload button
      showRemove: true,  // Shows the remove button
      allowedFileExtensions: ["jpg", "jpeg", "png"], // Restrict file types
      maxFileCount: 5,   // Maximum number of files
      previewFileType: "image", // Only show image previews
      browseClass: "btn btn-primary",
      fileActionSettings: {
        showUpload: false, // Disable individual upload
      },
    });
  });

