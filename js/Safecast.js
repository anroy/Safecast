<%

// v2.0

function ConcatQueryParm( parmsList, delimiter, parm )
{
	parm = encodeURIComponent(parm);
	parmsList = parmsList + delimiter + parm;
	return parmsList;
}


function AffixUrlParm( url, parmName, parmValue, setAmpersand )
{
	var parm = parmName + "=" + parmValue;

	if( setAmpersand )
	{
		parm += "&";
	}

	url += parm;

	return url;
}


function GetRequestInfoType( xml )
{
	var infoType = "";

	// Parse input document
	var xmlCurrentCriteria = xml.selectSingleNode("//CurrentCriteria");
	var criteriaCount = GetChildCount(xmlCurrentCriteria);
	WriteLogLine("GetRequestInfoType criteriaCount:" + criteriaCount);

	var criteriaIndex;
	var criteriaName;
	var xmlCriteria;

	for( criteriaIndex = 0; criteriaIndex < criteriaCount; criteriaIndex++ ) {
		xmlCriteria = xmlCurrentCriteria.childNodes(criteriaIndex);
		criteriaName = xmlCriteria.getAttribute("name");
		WriteLogLine("GetRequestInfoType criteriaName " + criteriaIndex + ":" + criteriaName);

		if( criteriaName == "InfoType" ) {
			infoType = GetValue(xmlCriteria);
			break;
		}
	}
	
	WriteLogLine("GetRequestInfoType infoType:" + infoType);

	return infoType;
}


function GetSafecastData( xml, infoType )
{
	var xmlResponse = "";

	switch(infoType)
	{
		case "TotalCount":
			xmlResponse = GetSafecastData_TotalCount();
			break;

		case "Users":
			xmlResponse = GetSafecastData_Users(1);
			break;

		case "Measurements":
			xmlResponse = GetSafecastData_Measurements();
			break;

		case "Devices":			
			xmlResponse = GetSafecastData_Devices();
			break;

		default:
			break;
	}

	return xmlResponse;
}

function GetSafecastData_TotalCount()
{
	var xmlhttp = RequestAPI_TotalCount();
	WriteLogLine("GetSafecastData_TotalCount xmlhttp.status:" + xmlhttp.status);
	WriteLogLine("GetSafecastData_TotalCount xmlhttp.statusText:" + xmlhttp.statusText);
	WriteLogLine("GetSafecastData_TotalCount xmlhttp.responseText:" + xmlhttp.responseText);

	var xmlResponse = CreateResponse_TotalCount(xmlhttp.status, xmlhttp.responseText);
	return xmlResponse;
}

function RequestAPI_TotalCount()
{
	var url = BASE_URL;
	url += "measurements/count.json";
	url += "?api_key=" + API_KEY;
	WriteLogLine("RequestAPI_TotalCount url:" + url);

	var xmlhttp = Server.CreateObject ("Msxml2.ServerXMLHTTP.6.0");
	xmlhttp.open("GET",url, false);
	xmlhttp.send();

	return xmlhttp;
}

function CreateResponse_TotalCount(status, responseText)
{
	var arrayResponse = eval('(' + responseText + ')');
	
	var fieldList = new Array();
	fieldList[0] = CreateField( "ContentProvider", "STRING", "SINGLE", "Safecast" );
	fieldList[1] = CreateField( "InfoType", "STRING", "SINGLE", "TotalCount" );
	fieldList[2] = CreateField( "MeasurementsCount", "INTEGER", "SINGLE", arrayResponse["count"] );
	
	var result = TPL_RESULT.replace(REG_UID, 0).replace(REG_INDEX, 0).replace(REG_FIELDLIST, fieldList.join("\n"));
	var results = TPL_RESULTS.replace(REG_START, 0).replace(REG_RESULTCOUNT, 1).replace(REG_TOTALCOUNT, 1).replace(REG_QUERYCOUNT, 1).replace(REG_RESULTLIST, result);
	var npcql = TPL_NPCQL.replace(REG_RETURNCODE, status).replace(REG_RESULTS, results);
		
	return npcql;
}


function GetSafecastData_Users(pageNo)
{
	var xmlhttp = RequestAPI_Users(pageNo);
	WriteLogLine("GetSafecastData_Users xmlhttp.status:" + xmlhttp.status);
	WriteLogLine("GetSafecastData_Users xmlhttp.statusText:" + xmlhttp.statusText);
	WriteLogLine("GetSafecastData_Users xmlhttp.responseText:" + xmlhttp.responseText);

	var xmlResponse = CreateResponse_Users(xmlhttp.status, xmlhttp.responseText);
	return xmlResponse;
}

function RequestAPI_Users(pageNo)
{
	var url = BASE_URL;
	url += "users.json";
	url += "?api_key=" + API_KEY;
	if( pageNo > 1 ) {
		url += "&page=" + pageNo;
	}
	WriteLogLine("RequestAPI_Users url:" + url);

	var xmlhttp = Server.CreateObject ("Msxml2.ServerXMLHTTP.6.0");
	xmlhttp.open("GET",url, false);
	xmlhttp.send();

	return xmlhttp;
}

function CreateResponse_Users(status, responseText)
{
	return xmlResponse;
}



function GetSafecastData_Measurements()
{
	var xmlResponse = "";
	return xmlResponse;
}


function GetSafecastData_Devices()
{
	var xmlResponse = "";
	return xmlResponse;
}


function CreateField( fieldName, valueType, format, value )
{
	var field = "<" + fieldName;
	field 	+= " valueType=\"" + valueType + "\"";
	field 	+= " format=\"" + format + "\">";
	field 	+= value;
	field 	+= "</" + fieldName + ">";

	return field;	
}

%>

