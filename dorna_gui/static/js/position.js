var precision = 4
function set_joint(data) {
	data["message"] = round_vector(data["message"], precision)

	if (graphic) {
		frame["frames"].push({
		    "joint": data["message"],
		    "time": data["time"]
		})
	}

	for (let i = 0; i<  data["message"].length; i ++) {
		//$(".j"+i+"_v").prop("value", data["message"][i])
		//slider

		$(".slider.j"+i+"_v").prop("value", mode_180_180(data["message"][i]))

		// input
		$(".number_t_1.j"+i+"_v").prop("value", data["message"][i])

		//text
		$(".j"+i+"_t").text(data["message"][i])
	}
}

function set_xyz(data) {
	data["message"] = round_vector(data["message"], precision)
	for (let i = 0; i<  data["message"].length; i ++) {
		$(".xyz"+i+"_v").prop("value", data["message"][i])
		$(".xyz"+i+"_t").text(data["message"][i])
	}
}

function round_vector(v, n){
	for (let i = 0; i < v.length; i++) {
		try {
		  v[i] = Number(v[i].toFixed(n))
		}
		catch(err) {
		  
		}
	}
	return v
}
