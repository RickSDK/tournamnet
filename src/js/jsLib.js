function convertNumberToMoney(num) {
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	return formatter.format(numberVal(num)).replace(".00", "");
}
function numberVal(val) {
	if (!val || val.length == 0)
		return 0;
	else
		return Number(val);
}
function getPostDataFromObj(obj) {
	var body = JSON.stringify(obj);
  
	const postData = {
	  method: 'POST',
	  headers: new Headers(),
	  body: body
	};
	return postData;
  }
  function formatNumberToLocalCurrency(amount = 0, refresh = false) {
    if (refresh || !localStorage.geoplugin_currencyCode) {
        $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function (data) {
            localStorage.geoplugin_currencyCode = data.geoplugin_currencyCode;
        });
    }

    const formatter = new Intl.NumberFormat(navigator.language || 'en-US', {
        style: 'currency',
        currency: localStorage.geoplugin_currencyCode || 'USD',
        minimumFractionDigits: 0
    });
    return formatter.format(amount);
}
function getTextFieldValue(id) {
	var e = document.getElementById(id);
	if (e)
		return e.value;
	else {
		return '';
	}
}
function setTextValue(id, text, ignoreFlg) {
	var e = document.getElementById(id);
	if (e)
		e.value = text;
	else if (!ignoreFlg)
		alert(id + ' not found!');
}
function setTextHtml(id, text) {
	var e = document.getElementById(id);
	if (e)
		e.innerHTML = text;
	else
		alert(id + ' not found!');
}
function getTextHtml(id) {
	var e = document.getElementById(id);
	if (e)
		return e.innerHTML;
	else
		alert(id + ' not found!');
}