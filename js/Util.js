<%

// Help utility functions and constants
//
// v3


// If 84 minutes, return 1時間24分
function Minutes2StringJ(minStr)
{
	var outStr = "";
	
	var mins = parseInt(minStr);
	var hours = Math.floor(mins/60);
	mins = mins % 60;

	if(0 < hours)
	{
		outStr = outStr + hours + "時間";
	}

	if( (0 < mins) || ("" == outStr) )
	{
		outStr = outStr + mins + "分";
	}
	
	return outStr;
}


// Added 11-07-26
// JIRA issue NPTF-31
function StripHTMLTags(str)
{
	var re_BR;
	
	re_BR = new RegExp("<br>", "g");
	str = str.replace(re_BR, " ");
	
	re_BR = new RegExp("<BR>", "g");
	str = str.replace(re_BR, " ");

	return str;
}

// Moved from TestClient_Formatter.asp by Arka
function HTMLEscape(str)
{
	var re_LT = new RegExp("<", "g");
	var re_GT = new RegExp(">", "g");
	var re_AMP = new RegExp("&", "g");

	str = str.replace(re_LT, "&lt;");
	str = str.replace(re_GT, "&gt;");
	str = str.replace(re_AMP, "&amp;");

	return str;
}

function GetSession(name)
{
	var val = "" + Session(name);

	if (val == "undefined") {
		return "";
	}

	return val;
}

var FUNC_PREF = "function ";

function GetFuncName(str)
{
	var pos1 = FUNC_PREF.length;
	var pos2 = str.indexOf("(");

	return str.substring(pos1, pos2);
}


function GetCallStack()
{
	// Ignore the call to ourselves

	var callPtr = GetCallStack.caller;

	var str = "";

	while (callPtr.caller != null) {
		callPtr = callPtr.caller;

		str += GetFuncName(callPtr.toString()) + "<br>";
	}

	return str;
}

function SystemError(str)
{
	var callStack = GetCallStack();

	Response.Write("*** Runtime Error ***<p>" + callStack + "<p>" + str);
	Response.End
}

// Values

var NAN = "NaN";

function ToFixedPt(v, num)
{
	var str = v.toString();

	if (str.toLowerCase() == "nan") {
		return NAN;
	}

	var pos = str.indexOf(".");

	if (pos < 0) {
		pos = str.length;
		str += ".";
	}

	str += "000000000000000000";

	return str.substr(0, pos+num+1);
}


// XML

function CreateDocumentFromString(str)
{
	var xmlDoc;

	try {
		xmlDoc = new ActiveXObject("MSXML2.DOMDocument");
		// xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		// xmlDoc = new ActiveXObject("MSXML");
	}
	catch(e) {
		Error(msg_requirementsXML);
		return null;
	}

	xmlDoc.async = false;
	xmlDoc.loadXML(str);

	return xmlDoc;
}

function LoadDocument(file)
{
	var data = NP_Util.LoadUTF8File(file);

	if (IsNil(data)) {
		// SystemError(msg_failedLoad + file);
		return null;
	}

	var doc = CreateDocumentFromString(data);

	if (doc == null || doc.documentElement == null) {
		// SystemError(msg_failedParse + file);
		return null;
	}

	return doc;
}

function SaveDocument(doc, file)
{
	var str = doc.xml;

	return NP_Util.SaveFileAsUTF8(file, str);
}

function LoadFile(file)
{
	return NP_Util.LoadFile(file);
}

function SaveFile(data, file)
{
	return NP_Util.SaveFile(file, data);
}

function SaveFileAsUTF8(data, file)
{
	return NP_Util.SaveFileAsUTF8(file, data);
}

function ElementIndexByName(parent, name)
{
	if (parent == null) {
		SystemError("null parent to ElementIndexByName for " + name);
		return -1;
	}

	var _cnt = GetChildCount(parent);

	var i;

	for (i=0; i<_cnt; i++) {
		if (parent.childNodes(i).nodeName == name) {
			return i;
		}
	}
	return -1;
}


function ElementByName(parent, name)
{
	var ind = ElementIndexByName(parent, name);

	if (ind < 0) {
		return null;
	}

	return parent.childNodes(ind);
}

function ElementByIndex(parent, ind)
{
	return parent.childNodes(ind);
}

function GetValue(node)
{
	if (node == null) {
		SystemError("Null node");
		return "";
	}

	if (node.firstChild != null) {
		return node.firstChild.nodeValue;
	}
	
	return "";
}

function GetValueByName(parent, name)
{
	if (parent == null) {
		SystemError("Null parent to GetValueByName for " + name);
		return "";
	}

	var node = ElementByName(parent, name);

	if (node == null) {
		return "";
	}

	return GetValue(node);
}

function GetValueByIndex(parent, ind)
{
	if (parent == null) {
		SystemError("Null parent to GetValueByIndex for " + ind);
		return "";
	}

	var node = parent.childNodes(ind);

	return GetValue(node);
}

function SetValue(node, val)
{
	if (node.firstChild == null) {
		var tnode = node.ownerDocument.createTextNode(val);

		node.appendChild(tnode);
	}
	else {
		node.firstChild.nodeValue = val;
	}	
}

function SetValueByName(parent, name, val)
{
	var el = ElementByName(parent, name);

	if (el == null) {
		Error("No element: " + name);
		return;
	}

	SetValue(el, val);
}

function SetValueByIndex(parent, ind, val)
{
	var node;

	try {
		node = parent.childNodes(ind);
		SetValue(node, val);
	}
	catch(e) {
		SystemError(e.description);
	}
}

function GetChildCount(node)
{
	if (node == null) {
		SystemError("null to GetChildCount");
		return 0;
	}

	if (node.hasChildNodes()) {
		return node.childNodes.length;
	}

	return 0;
}


// Added by Arka

// Loop through children
// Return the first one that has an attribute attrName with value attrValue
// If not found then return null
function GetChildByAttribute(parent, attrName, attrValue)
{
	var retNode = null;

	if (parent == null) {
		SystemError("null parent to GetChildByAttribute");
		return null;
	}

	var _cnt = GetChildCount(parent);

	var i;
	var nodeAttrVal
	var currNode;

	for (i=0; i<_cnt; i++) 
	{
		currNode = parent.childNodes(i);
		nodeAttrVal = currNode.getAttribute(attrName);
		if(nodeAttrVal === attrValue)
		{
			retNode = currNode;
			break;
		}
	}

	return retNode;
}


// Constants

var UNDEFINED = "undefined";

var UTF8   = "utf8";
var UTF16  = "utf16le";

// Functions

function Replace(str, sstr, rstr)
{
    var re = new RegExp(sstr, "g");

    return str.replace(re, rstr);
}


function IsNil(str)
{
	return (str == null || str == "" || str == "null");
}

function IsInteger(v)
{
	var len = v.length;

	if (len == 0) {
		return false;
	}

	var iv = parseInt(v);

	if (isNaN(iv)) {
		return false;
	}

	var str = iv.toString();

	if (str == v) {
		return true;
	}

	var i; 

	for (i=v.length-1; i>0; i--) {
		var c = v.charAt(i);

		if (c < "0" || c > "9") {
			return false;
		}
	}

	return true;
}

function IsFloat(v)
{
	var f = parseFloat(v);

	if (isNaN(f)) {
		return false;
	}

	return true;
}

function IsNumber(v)
{
	return (IsInteger(v) || IsFloat(v));
}

function IsSpace(c)
{
	switch(c)
	{
	case " ":
	case "\t":
	case "\r":
	case "\n":
	case "\u3000":
		return true;
	}

	return false;
}

function IsDollars(s)
{
	var len = s.length;

	return (s.charAt(0) == "$" && 
			s.charAt(len-3) == "." &&
			IsFloat(s.substr(1)));
}

function IsDigit(s)
{
	return (s >= "0" && s <= "9");
}

function Left(s, cnt)
{
	return s.substring(0, cnt);
}

function Trim(str)
{
	// Trim whitespace left and right

	if (str == null) {
		return "";
	}

	var epos = str.length;
	var spos = 0;

	while (spos < epos && IsSpace(str.charAt(spos))) {
		spos++;
	}

	if (spos == epos) {
		return "";
	}

	epos--;
	while (epos > spos && IsSpace(str.charAt(epos))) {
		epos--;
	}

	return str.substr(spos, epos-spos+1);
}

function TrimLeft(str)
{
	// Trim whitespace left

	if (str == null) {
		return "";
	}	

	var spos = 0;

	while (spos < str.length && IsSpace(str.charAt(spos))) {
		spos++;
	}

	return str.substr(spos);
}

function TrimRight(str)
{
	// Trim whitespace right

	if (str == null) {
		return "";
	}	

	var epos = str.length;

	epos--;
	while (epos >= 0 && IsSpace(str.charAt(epos))) {
		epos--;
	}

	if (epos < 0) {
		return "";
	}

	return str.substr(0, epos+1);
}

function ToList(str, delim)
{
	if (str.length == 0) {
		return new Array();
	}

	if (delim == null) {
		delim = ",";
	}

	return str.split(delim);
}


function GetElement(name, sz)
{
	var v = "" + Request.Form(name);

	if (v == UNDEFINED) {
		v = "" + Request.QueryString(name);

		if (v == UNDEFINED) {
			v = "";
		}
	}

	return v.substr(0, sz);
}

function LoadFile(path)
{
	return NP_Util.LoadFile(path);
}

function LoadUTF8File(path)
{
	return NP_Util.LoadUTF8File(path);
}

function FileExists(path)
{
	return NP_Util.FileExists(path);
}

var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encode64(input) {
     input = escape(input);
     var output = "";
     var chr1, chr2, chr3 = "";
     var enc1, enc2, enc3, enc4 = "";
     var i = 0;
 
     do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
 
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
 
        if (isNaN(chr2)) {
           enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
           enc4 = 64;
        }
 
        output = output +
           keyStr.charAt(enc1) +
           keyStr.charAt(enc2) +
           keyStr.charAt(enc3) +
           keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
     } while (i < input.length);
 
     return output;
}
            
function decode64(input) {
     var output = "";
     var chr1, chr2, chr3 = "";
     var enc1, enc2, enc3, enc4 = "";
     var i = 0;

     do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
 
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
 
        output = output + String.fromCharCode(chr1);
 
        if (enc3 != 64) {
           output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
           output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
 
     } while (i < input.length);
 
     return unescape(output);
}

function D2(v)
{
	var str = v.toString();

	return (str.length == 1) ? ("0" + str) : str;
}

// Takes a possibly nested config file and compiles it into an Array

var m_cc_lineno;

function ConfigError(typ, line, msg)
{
	if (line.length > 0) {
		Response.Write(typ + "\n\nError at line " + m_cc_lineno + " - '" + line + "'\n\n" + msg);
		Response.End
	}
	else {
		Response.Write(typ + "\n\nError at line " + m_cc_lineno + "\n\n" + msg);
		Response.End		
	}
}

function IsConfigCodeLine(line)
{
     return (line.length > 0 && (line.length < 2 || line.substr(0, 2) != "//"));
}

function CompileConfigLines(lines, depth, typ)
{
	var values = new Array();

        while (m_cc_lineno < lines.length) {
		var line = Trim(lines[m_cc_lineno++]);

		if (line == "}") {
			if (depth == 0) {
				// LOCALIZE
				ConfigError(typ, line, "Unexpected }");
				return null;
			}

			return values;
		}

		if (IsConfigCodeLine(line)) {
 			var comp = line.split("=");

			if (comp.length != 2) {
				// LOCALIZE
				ConfigError(typ, line, "Missing RHS of =");
				return null;
			}

			var ent = new Array();

			ent[0] = Trim(comp[0]);

			var val = Trim(comp[1]);
	    
			if (val == "{") {
				var rc = CompileConfigLines(lines, depth+1, typ);

				if (rc == null) {
					return null;
				}

				ent[1] = rc;
			}
			else {
				ent[1] = val;
			}

			values[values.length] = ent;
		}
	}

	if (depth != 0) {
		ConfigError(typ, "", "Unexpected EOF - Expecting '}'");
		return null;
	}

	return values;
}

function CompileConfig(dat, typ)
{
    var lines = dat.split("\n");

    m_cc_lineno = 0;

    return CompileConfigLines(lines, 0, typ);
}

  
//////////////////////////////
// Logging functionality
//	11-04-07 Arka
//////////////////////////////

function GetFormattedDate(dt)
{
	var retStr = "";

	// Use today date if there is no incoming parameter
	if(typeof dt == 'undefined')
	{
		dt = new Date();
	}

	// The getMonth method uses a zero offset for the month number.
	var year 	= dt.getFullYear();
	var month 	= dt.getMonth()+1;
	var day 	= dt.getDate();
	var hours 	= dt.getHours();
	var mins 	= dt.getMinutes();
	var secs 	= dt.getSeconds();

	retStr = year + '/' + month + '/' + day + " " + hours + ':' + mins + ':' + secs;
	return(retStr);
}

//////////////////////////////
// Logging functionality
//	11-04-07 Arka
//////////////////////////////

var logFile = null;

function StartLogging(fs, logFileName)
{
	logFile = fs.OpenTextFile(logFileName, 2, "True", -1);
}

function WriteLogLine(str)
{
	if( logFile != null )
	{
		// Output a blank line if there is no incoming parameter
		if(typeof str == 'undefined')
		{
			str = "";
		}
		
		var dateTimeStr = GetFormattedDate();
		str = "[" + dateTimeStr + "] " + str;
		logFile.WriteLine(str);
	}
}

function StopLogging()
{
	if( logFile != null )
	{
		logFile.Close();
	}
}

%>