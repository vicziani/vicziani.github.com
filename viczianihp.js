function lastmod() {
months = "január,február,március, április, május, június, július, augusztus, szeptember, október, november, december".split(',');
var last = "<em>Utolsó módosítás:</em> ";
lastmodf = document.lastModified;
lastmoddate = new Date(lastmodf);
lastmodmilli = Date.parse(lastmodf);
if(lastmodmilli == 0){               
   last = last + "nem ismert";
   } else {   
   last = last + takeYear(lastmoddate) + " " + months[lastmoddate.getMonth()] + " " + lastmoddate.getDate() + "., " + lastModExtra();   
}
return last;
}

function lastModExtra()
{
	var x = new Date (document.lastModified);
	Modif = new Date(x.toGMTString());
	Year = takeYear(Modif);
	Month = Modif.getMonth();
	Day = Modif.getDate();
	Mod = (Date.UTC(Year,Month,Day,0,0,0))/86400000;
	x = new Date();
	today = new Date(x.toGMTString());
	Year2 = takeYear(today);
	Month2 = today.getMonth();
	Day2 = today.getDate();
	now = (Date.UTC(Year2,Month2,Day2,0,0,0))/86400000;
	daysago = now - Mod;
	if (daysago < 0) return '';
	unit = 'napja';
	if (daysago > 730)
	{
		daysago = Math.round(daysago/365);
		unit = 'éve';
	}
	else if (daysago > 60)
	{
		daysago = Math.round(daysago/30);
		unit = 'hónapja';
	}
	else if (daysago > 14)
	{
		daysago = Math.round(daysago/7);
		unit = 'hete'
	}
	towrite = '';
	if (daysago == 0) towrite += 'ma';
	else if (daysago == 1) towrite += 'tegnap';
	else towrite += daysago + ' ' + unit;
	return towrite;
}


function takeYear(theDate)
{
	x = theDate.getYear();
	var y = x % 100;
	y += (y < 38) ? 2000 : 1900;
	return y;
}

function googleAdSense(width, height, style) {
  google_ad_client = "pub-4565464344261052";
  google_ad_width = width;
  google_ad_height = height;
  google_ad_format = width + "x" + height + "_as";
  google_ad_type = "text_image";
  google_ad_channel ="";
  if (style == "bright") {
    google_color_border = "F7F7F7";
    google_color_bg = "FFFFFF";
  }
  else {
    google_color_border = "CCCCCC";
    google_color_bg = "F7F7F7";
  }
  google_color_link = "000000";
  google_color_url = "736B59";
  google_color_text = "000000";
}