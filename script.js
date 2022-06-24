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

  await fetch(`http://www.boredapi.com/api/activity?type=${selectedActivity}&minprice=${minPrice}&maxprice=${maxPrice}`)
    .then(res=>res.json())
    .then(resp=>{
      // fetch activity data in english
      const activityEng = resp.activity;
      const actEngToStr = String(activityEng);
      if (activityEng === undefined ) {
        document.getElementById("activity-desc-eng").innerHTML = "Tidak ditemukan kegiatan yang diminta";  
      } else {
        document.getElementById("activity-desc-eng").innerHTML = `EN : ${activityEng}`;
      }

      // translating to indonesian 
      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': '05a33bfcbfmsh531013ad3601157p165aaejsn4f8c443ce627',
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        },
        body: `[{"Text":"${actEngToStr}"}]`
      };
      
      fetch('https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D=id&api-version=3.0&profanityAction=NoAction&textType=plain', options)
        .then(response => response.json())
        .then(response => {
          const activityId = response[0].translations[0].text;
          console.log(activityId);
          if (activityId === undefined ) {
            document.getElementById("activity-desc").innerHTML = "Tidak ditemukan kegiatan yang diminta";  
          } else {
            document.getElementById("activity-desc").innerHTML = `ID : ${activityId}`;
          }
        })
        .catch(error => console.error(error));
    })
    .catch(err => console.error(err));
}
