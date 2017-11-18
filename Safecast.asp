<%@
EnableSessionState=false
Language=JScript 
%>

<!-- #include FILE="js/DataDefs.js" -->
<!-- #include FILE="js/Util.js" -->
<!-- #include FILE="js/Safecast.js" -->

<%

Response.CodePage = 65001;
Response.CharSet = "utf-8";


//////////////////////
// 
// Current version v1.0
// 
// Modification History
// 2015-01-02 - Arka - Initial Creation
// 					
//////////////////////


//////////////////////
// Functions
//////////////////////

function OutputError(errorCode)
{
	var NPCQL_ERROR = "<?xml version=\"1.0\" encoding=\"utf-8\"?><NPCQL version=\"1.0\" resultCode=\"" + errorCode + "\"></NPCQL>";
	Response.ContentType = "text/xml";
	Response.Write(NPCQL_ERROR);
	Response.End;
	abortedFlag = true;
}


//////////////////////
// Processing Start
//////////////////////

// Set to false on release
var DEBUGMODE = true;

var fs = new ActiveXObject("Scripting.FileSystemObject");
var xmlstrRequest = GetElement("NPCQL", 4096);
var jsonResponse = "";
var xmlResponse = "";


//////////////////////
// Init Debug
//////////////////////

if( DEBUGMODE )
{
	// Initialize debug log
	StartLogging(fs, "C:\\TransformerLogs\\SafecastCGI_Log.txt");
	WriteLogLine("Start Logging");
	WriteLogLine("Server Name: " + serverName);

	// Dump input data
	var inDump = fs.OpenTextFile("C:\\TransformerLogs\\SafecastCGI_Request.xml", 2, "True", -1);
	inDump.WriteLine(xmlstrRequest);
	inDump.Close();
}


//////////////////////
// Basic sanity checks
//////////////////////

if( xmlstrRequest.length <= 0 )
{
	WriteLogLine("Data is empty");
	OutputError(600);
}
else if( xmlstrRequest.indexOf( "<NPCQL" ) < 0 )
{
	WriteLogLine("No opening NPCQL tag");
	OutputError(601);
}
else if( xmlstrRequest.indexOf( "</NPCQL>" ) < 0)
{
	WriteLogLine("No closing NPCQL tag");
	OutputError(602);
}
else if( xmlstrRequest.indexOf( "<CurrentCriteria" ) < 0)
{
	WriteLogLine("No opening CurrentCriteria tag");
	OutputError(603);
}
else if( xmlstrRequest.indexOf( "</CurrentCriteria>" ) < 0)
{
	WriteLogLine("No closing CurrentCriteria tag");
	OutputError(604);
}


//////////////////////
// Main Processing
//////////////////////

if( !abortedFlag )
{
	var xmlInputDoc = CreateDocumentFromString(xmlstrRequest);
	WriteLogLine("CreateDocumentFromString xmlstrRequest done");

	if( xmlInputDoc != null ) 
	{
		WriteLogLine("xmlInputDoc not null");

		var xml = xmlInputDoc.documentElement;
		if( xml != null )
		{
			WriteLogLine("xml.nodeName:" + xml.nodeName );
			
			infoType = GetRequestInfoType( xml );

			// Core Process - API is called in here
			xmlResponse = GetSafecastData( xml, infoType );
			WriteLogLine("xmlResponse:" + xmlResponse);
			
			//var arrayResponse = eval('(' + jsonResponse + ')');

			switch(infoType)
			{
				case "TotalCount":
					//WriteLogLine('arrayResponse["count"]:' + arrayResponse["count"]);
					//WriteLogLine('arrayResponse.count:' + arrayResponse.count);
					break;

				case "Users":
					//WriteLogLine('arrayResponse.length:' + arrayResponse.length);
					//WriteLogLine('arrayResponse[0]:' + arrayResponse[0]);
					//WriteLogLine('arrayResponse[0]["name"]:' + arrayResponse[0]["name"]);
					break;

				case "Measurements":
					break;

				case "Devices":			
					break;

				default:
					break;
			}
			
			// Clear xmlInputDoc
			xmlInputDoc = null;

			// Debug output
			if( DEBUGMODE )
			{
				// Dump output data
				//var outDump = fs.OpenTextFile("C:\\TransformerLogs\\SafecastCGI_APIResponse.txt", 2, "True", -1);
				//outDump.WriteLine(jsonResponse);
				//outDump.Close();
			}
		}
		else
		{
			WriteLogLine("xml is null");
			OutputError(605);
		}

	}
	else 
	{
		WriteLogLine("xmlInputDoc could not be created");
		OutputError(606);
	}
}


//////////////////////
// Exit Debug
//////////////////////

WriteLogLine("End Logging");
StopLogging();
fs = null;


if( !abortedFlag )
{
	Response.ContentType = "text/xml";
	Response.Write(xmlResponse);
}

%>

