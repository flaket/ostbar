function convertToHtml(e){
	var temp = e.split('\n');
	console.log(temp);
	var output = "";
	
	for (var i = 0; i<temp.length; i++){
		output += temp[i]+"<br>";
	}
	console.log(output);
	return output;
}