<%

//////////////////////////////////////////////
// Must set these variables when deploying:
//		serverName
//////////////////////////////////////////////

// Japan Live Server
//var serverName = "netpeople-a.inago.co.jp";

// Japan Staging Server
//var serverName = "netpeople-staging.inago.co.jp";

// Japan MVM Server
//var serverName = "netpeople-mia-jp-vm.inago.co.jp";

// Your local machine
var serverName = Request.ServerVariables("SERVER_NAME");


// General purpose constants

// Text strings
var TXT_KARA 	= "から";

var API_KEY 	= "buFt2i4mDiZDJQuBsyaA";
var BASE_URL 	= "https://api.safecast.org/";

// General purpose variables
var abortedFlag = false;

var TPL_NPCQL 		=	"<NPCQL version=\"1.0\" responseType=\"Results\" returnCode=\"%returnCode%\">\n" +
						"%results%" +
						"</NPCQL>";

var TPL_RESULTS		=	"<Results start=\"%start%\" resultCount=\"%resultCount%\" totalCount=\"%totalCount%\" queryCount=\"%queryCount%\">\n" +
						"%resultList%" +
						"</Results>\n";

var	TPL_RESULT 		=	"<Result uid=\"%uid%\" index=\"%index%\">\n" +
						"%fieldList%" +
						"\n" +
						"</Result>";
						
											
var REG_RETURNCODE		= new RegExp("%returnCode%", "g");
var REG_RESULTS 		= new RegExp("%results%", "g");

var REG_START 			= new RegExp("%start%", "g");
var REG_RESULTCOUNT 	= new RegExp("%resultCount%", "g");
var REG_TOTALCOUNT 		= new RegExp("%totalCount%", "g");
var REG_QUERYCOUNT 		= new RegExp("%queryCount%", "g");
var REG_RESULTLIST 		= new RegExp("%resultList%", "g");

var REG_UID 			= new RegExp("%uid%", "g");
var REG_INDEX 			= new RegExp("%index%", "g");
var REG_FIELDLIST 		= new RegExp("%fieldList%", "g");

%>
