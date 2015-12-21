$("<button id='getInfo'>Download as PDF</button>").insertAfter(".Pavadinimas");

$("#getInfo").click(function () {

	//Getting eBook name from DOM
    var fileName = $(".Pavadinimas").text();
    //Getting total number of pages
    var totalPages = $(".flexpaper_lblTotalPages").text();
    //converting string from DOM to integer
	totalPages = parseInt(totalPages.replace(/^\D+/g, ''));

    //Showing user that the code is executing
	$(this).attr("disabled", true).text("Getting your PDF ready (Page: 0/" + totalPages + ")");

    //initialising jsPDF
	var doc = new jsPDF();
	
    //Getting first eBook page path
    //img path is the same for every img except the last number is different as it indicates the page
    //example: ../skf.php?data=S2F..MzA=&format=png&page=1
    //Usually it's in 'img' tag's attribute 'src' but sometimes the 'src' is empty and the image is in background-image
	var firstImgPath = $("#page_0_documentViewer").attr("src");

    //checking if the 'src' attr is containing an empty dataURL (it starts like this 'data/..')
	if (firstImgPath.charAt(0) == 'd') {
	    console.log("'src' tag doesn't have a link, getting it from 'background-image' css attribute");
	    firstImgPath = $("#page_0_documentViewer").css("background-image");
        //removing 'url("")' from the path (starting from 5th char ending in end-2)
	    firstImgPath = firstImgPath.substring(5, firstImgPath.length - 2);
	}
	console.log("eBook's first page path: " + firstImgPath);
	
    //Changing first eBook page path to universal path
	imgPath = firstImgPath.substring(0, firstImgPath.length - 1);

	//We'll be putting all eBook's page paths into an array
	var pagesArray = new Array(totalPages);

	for (var i = 0; i < pagesArray.length; i++) {
	    pagesArray[i] = imgPath + (i + 1);
	}

    //Function for loading image
	var getImageFromUrl = function (url, callback) {
	    var img = new Image();

	    img.onError = function () {
	        alert('Cannot load image: "' + url + '"');
	    };
	    img.onload = function () {
	        callback(img);
	    };
	    img.src = url;
	}

    //This function adds image data to pdf
	var createPDF = function (imgData, currentPage) {
	    //var doc = new jsPDF();

	    doc.addImage(imgData, 'JPEG', 0, 0, 211, 300);
        //checking if not the last page
	    if (currentPage < (totalPages-1)) {
	        doc.addPage();
	    }
	    $("#getInfo").text("Getting your PDF ready (Page: " + (currentPage+1) + "/" + totalPages + ")");
	    console.log("Image added!");
	}

    //Starting a strange loop to execute code consecutive 
    //simple loops such as 'for' and similar don't work, because the loop has to wait for callback
	var x = 0;

	var loopArray = function (arr) {
        //calling function to load image
	    getImageFromUrl(arr[x], function (img) {
            //adding eBook image as a page
	        createPDF(img, x);
	        x++;

            //checking for other elements in the array
	        if (x < arr.length) {
	            loopArray(arr);
	        }
	        else {
                //when no elements left, prompts user to save PDF
	            console.log("Saving pdf...");
	            doc.save(fileName + ".pdf");
	        }
	    });
	}

    //initiate image to PDF conversion
	loopArray(pagesArray);

});

