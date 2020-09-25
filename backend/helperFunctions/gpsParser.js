const polyline = require('polyline');
const haversine = require('haversine');

exports.returnUsableGPX = (gpxObject) => {
    const objData = gpxObject.gpx.trk.trkseg.trkpt;

    const lat = objData.map(element => {
        return [element.lat, element.lon]
    });
    let encoded = polyline.encode(lat);

    return encoded;

}

exports.returnDistance = (gpxObject) => {
    const objData = gpxObject.gpx.trk.trkseg.trkpt;
    let distance = 0
    objData.forEach((el, i) => {
        //console.log(el)
        if (i < objData.length - 1) {
            let current = {
                latitude: parseFloat(el.lat),
                longitude: parseFloat(el.lon),
            };
           
            let next = {
                latitude: parseFloat(objData[i + 1].lat),
                longitude: parseFloat(objData[i + 1].lon),
            };
            //console.log(next)
            distance += haversine(current, next, {
                unit: "mile"
            });
        
        }
    });
    
    return distance.toFixed(2);
}

exports.diff_hours = (dt2, dt1) => {
   const milliseconds = ((new Date(dt2)) - (new Date(dt1)));
   const minutes = milliseconds/(60000);
   return minutes.toFixed(2);

}

exports.getElgain = (elArr) => {
    //gets elevation gain from array of lat and lon
    let totalElevationGain = 0;
    for(let i = 1; i<elArr.length-1; i++){
        if(i === 0){
            totalElevationGain+=elArr[i]
        } else{
            const currentNum = elArr[i];
            const nextNum = elArr[i+1];
            if(nextNum > currentNum){
                const diff = nextNum - currentNum;
                totalElevationGain+=diff;
            }
        }
    }
    return totalElevationGain.toFixed(2);
}

exports.getPace = (time, distance) => {
    const pace = time/distance; 
    return pace.toFixed(2);
}