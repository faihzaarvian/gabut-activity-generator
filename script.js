async function fetchActivity() {
  const activityType = document.getElementsByName('activity-type');
  const activityPrice = document.getElementsByName('activity-price');

  for (i = 0; i < activityType.length; i++) {
    if (activityType[i].checked === true) {
      selectedActivity = activityType[i].id;
    }
  }
  for (i = 0; i < activityPrice.length; i++) {
    if (activityPrice[i].checked === true) {
      selectedPrice = activityPrice[i].id;
      if (selectedPrice == 0) {
        minPrice = 0;
        maxPrice = 0;
      } else if (selectedPrice == 1) {
        minPrice = 0.01;
        maxPrice = 1.00;
      }
    }
  }

  await fetch(`https://www.boredapi.com/api/activity?type=${selectedActivity}&minprice=${minPrice}&maxprice=${maxPrice}`)
    .then(res=>res.json())
    .then(resp=>{
      // fetch activity data in english
      const activityEng = resp.activity;
      if (activityEng === undefined ) {
        document.getElementById("activity-desc-eng").innerHTML = "Tidak ditemukan kegiatan yang diminta";  
      } else {
        document.getElementById("activity-desc-eng").innerHTML = `EN : ${activityEng}`;
      }

      // translating to indonesian (limited to 500 char/month)
      const encodedParams = new URLSearchParams();
      encodedParams.append("q", resp.activity);
      encodedParams.append("target", "id");
      encodedParams.append("source", "en");

      const options = {
      	method: 'POST',
      	headers: {
	      	'content-type': 'application/x-www-form-urlencoded',
	      	'Accept-Encoding': 'application/gzip',
	      	'X-RapidAPI-Key': '05a33bfcbfmsh531013ad3601157p165aaejsn4f8c443ce627',
	      	'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
	      },
	body: encodedParams
      };

      fetch('https://google-translate1.p.rapidapi.com/language/translate/v2', options)
      	.then(response => response.json())
      	.then(response => {
          console.log(response);
          const translatedActivity = response.data.translations[0].translatedText;
          if (translatedActivity === "tidak terdefinisi" ) {
            document.getElementById("activity-desc").innerHTML = "Tidak ditemukan kegiatan yang diminta";  
          } else {
            document.getElementById("activity-desc").innerHTML = `ID : ${translatedActivity}`;
          }
        })
        .catch(errs => console.error(errs));
    })
    .catch(err => console.error(err));
}
