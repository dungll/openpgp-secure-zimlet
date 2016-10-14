/*
 * mimemessage v1.0.4
 * MIME messages for JavaScript (RFC 2045 & 2046)
 * Copyright 2015-2016 Iñaki Baz Castillo at eFace2Face, inc. (https://eface2face.com)
 * License MIT
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mimemessage=f()}})(function(){var w,module,exports;return(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(c,d,e){d.exports=Entity;var f=c('debug')('mimemessage:Entity'),debugerror=c('debug')('mimemessage:ERROR:Entity'),randomString=c('random-string'),grammar=c('./grammar'),parseHeaderValue=c('./parse').parseHeaderValue;debugerror.log=console.warn.bind(console);function Entity(){f('new()');this._headers={};this._body=null}Entity.prototype.contentType=function(a){if(!a&&a!==null){return this._headers['Content-Type']}else if(a){this._headers['Content-Type']=parseHeaderValue(grammar.headerRules['Content-Type'],a)}else{delete this._headers['Content-Type']}};Entity.prototype.contentTransferEncoding=function(a){var b=this._headers['Content-Transfer-Encoding'];if(!a&&a!==null){return b?b.value:undefined}else if(a){this._headers['Content-Transfer-Encoding']=parseHeaderValue(grammar.headerRules['Content-Transfer-Encoding'],a)}else{delete this._headers['Content-Transfer-Encoding']}};Entity.prototype.header=function(a,b){a=grammar.headerize(a);if(!b&&b!==null){if(this._headers[a]){return this._headers[a].value}}else if(b){this._headers[a]={value:b}}else{delete this._headers[a]}};Object.defineProperty(Entity.prototype,'body',{get:function(){return this._body},set:function(a){if(a){setBody.call(this,a)}else{delete this._body}}});Entity.prototype.isMultiPart=function(){var a=this._headers['Content-Type'];if(a&&a.type==='multipart'){return true}else{return false}};Entity.prototype.toString=function(a){var b='',name,header,i,len,contentType=this._headers['Content-Type'],boundary;a=a||{noHeaders:false};if(!a.noHeaders){for(name in this._headers){if(this._headers.hasOwnProperty(name)){header=this._headers[name];b+=name+': '+header.value+'\r\n'}}b+='\r\n'}if(Array.isArray(this._body)){boundary=contentType.params.boundary;for(i=0,len=this._body.length;i<len;i++){if(i>0){b+='\r\n'}b+='--'+boundary+'\r\n'+this._body[i].toString()}b+='\r\n--'+boundary+'--'}else if(typeof this._body==='string'){b+=this._body}else if(typeof this._body==='object'){b+=JSON.stringify(this._body)}return b};function setBody(a){var b=this._headers['Content-Type'];this._body=a;if(Array.isArray(a)){if(!b||b.type!=='multipart'){this.contentType('multipart/mixed;boundary='+randomString())}else if(!b.params.boundary){this.contentType(b.fulltype+';boundary='+randomString())}}else{if(!b||b.type==='multipart'){this.contentType('text/plain;charset=utf-8')}}}},{"./grammar":3,"./parse":5,"debug":6,"random-string":9}],2:[function(c,d,e){d.exports=factory;var f=c('debug')('mimemessage:factory'),debugerror=c('debug')('mimemessage:ERROR:factory'),Entity=c('./Entity');debugerror.log=console.warn.bind(console);function factory(a){f('factory() | [data:%o]',a);var b=new Entity();a=a||{};if(a.contentType){b.contentType(a.contentType)}if(a.contentTransferEncoding){b.contentTransferEncoding(a.contentTransferEncoding)}if(a.body){b.body=a.body}return b}},{"./Entity":1,"debug":6}],3:[function(c,d,e){var f=d.exports={},REGEXP_CONTENT_TYPE=/^([^\t \/]+)\/([^\t ;]+)(.*)$/,REGEXP_CONTENT_TRANSFER_ENCODING=/^([a-zA-Z0-9\-_]+)$/,REGEXP_PARAM=/^[ \t]*([^\t =]+)[ \t]*=[ \t]*([^"\t =]+|"([^"]*)")[ \t]*$/;f.headerRules={'Content-Type':{reg:function(a){var b=a.match(REGEXP_CONTENT_TYPE),params={};if(!b){return undefined}if(b[3]){params=parseParams(b[3]);if(!params){return undefined}}return{fulltype:b[1].toLowerCase()+'/'+b[2].toLowerCase(),type:b[1].toLowerCase(),subtype:b[2].toLowerCase(),params:params}}},'Content-Transfer-Encoding':{reg:function(a){var b=a.match(REGEXP_CONTENT_TRANSFER_ENCODING);if(!b){return undefined}return{value:b[1].toLowerCase()}}}};f.unknownHeaderRule={reg:/(.*)/,names:['value']};f.headerize=function(a){var b={'Mime-Version':'MIME-Version','Content-Id':'Content-ID'},name=a.toLowerCase().replace(/_/g,'-').split('-'),hname='',parts=name.length,part;for(part=0;part<parts;part++){if(part!==0){hname+='-'}hname+=name[part].charAt(0).toUpperCase()+name[part].substring(1)}if(b[hname]){hname=b[hname]}return hname};Object.keys(f.headerRules).forEach(function(a){var b=f.headerRules[a];if(!b.reg){b.reg=/(.*)/}});function parseParams(a){var b,i,len,paramMatch,params={};if(a===''||a===undefined||a===null){return params}b=a.split(';');if(b.length===0){return undefined}for(i=1,len=b.length;i<len;i++){paramMatch=b[i].match(REGEXP_PARAM);if(!paramMatch){return undefined}params[paramMatch[1].toLowerCase()]=paramMatch[3]||paramMatch[2]}return params}},{}],4:[function(a,b,c){b.exports={factory:a('./factory'),parse:a('./parse'),Entity:a('./Entity')}},{"./Entity":1,"./factory":2,"./parse":5}],5:[function(e,f,g){f.exports=parse;parse.parseHeaderValue=parseHeaderValue;var h=e('debug')('mimemessage:parse'),debugerror=e('debug')('mimemessage:ERROR:parse'),grammar=e('./grammar'),Entity=e('./Entity'),REGEXP_VALID_MIME_HEADER=/^([a-zA-Z0-9!#$%&'+,\-\^_`|~]+)[ \t]*:[ \t]*(.*)$/;debugerror.log=console.warn.bind(console);function parse(a){h('parse()');var b;if(typeof a!=='string'){throw new TypeError('given data must be a string');}b=new Entity();if(!parseEntity(b,a,true)){debugerror('invalid MIME message');return false}return b}function parseEntity(a,b,c){h('parseEntity()');var d=-1,rawHeaders,rawBody,contentType,boundary,boundaryRegExp,boundaryEndRegExp,match,partStart,parts=[],i,len,subEntity;if(/^[^\r\n]/.test(b)){d=b.indexOf('\r\n\r\n')}if(d!==-1){rawHeaders=b.slice(0,d);rawBody=b.slice(d+4)}else if(c){debugerror('parseEntity() | wrong MIME headers in top level entity');return false}else{if(/^\r\n/.test(b)){rawBody=b.slice(2)}else{debugerror('parseEntity() | wrong sub-entity');return false}}if(rawHeaders&&!parseEntityHeaders(a,rawHeaders)){return false}contentType=a.contentType();if(contentType&&contentType.type==='multipart'){boundary=contentType.params.boundary;if(!boundary){debugerror('parseEntity() | "multipart" Content-Type must have "boundary" parameter');return false}boundaryRegExp=new RegExp('(\\r\\n)?--'+boundary+'[\\t ]*\\r\\n','g');boundaryEndRegExp=new RegExp('\\r\\n--'+boundary+'--[\\t ]*');while(true){match=boundaryRegExp.exec(rawBody);if(match){if(partStart!==undefined){parts.push(rawBody.slice(partStart,match.index))}partStart=boundaryRegExp.lastIndex}else{if(partStart===undefined){debugerror('parseEntity() | no bodies found in a "multipart" sub-entity');return false}boundaryEndRegExp.lastIndex=partStart;match=boundaryEndRegExp.exec(rawBody);if(!match){debugerror('parseEntity() | no ending boundary in a "multipart" sub-entity');return false}parts.push(rawBody.slice(partStart,match.index));break}}a._body=[];for(i=0,len=parts.length;i<len;i++){subEntity=new Entity();a._body.push(subEntity);if(!parseEntity(subEntity,parts[i])){debugerror('invalid MIME sub-entity');return false}}}else{a._body=rawBody}return true}function parseEntityHeaders(a,b){var c=b.split('\r\n'),line,i,len;for(i=0,len=c.length;i<len;i++){line=c[i];while(/^[ \t]/.test(c[i+1])){line=line+' '+c[i+1].trim();i++}if(!parseHeader(a,line)){debugerror('parseEntityHeaders() | invalid MIME header: "%s"',line);return false}}return true}function parseHeader(a,b){var c=b.match(REGEXP_VALID_MIME_HEADER),name,value,rule,data;if(!c){debugerror('invalid MIME header "%s"',b);return false}name=grammar.headerize(c[1]);value=c[2];rule=grammar.headerRules[name]||grammar.unknownHeaderRule;try{data=parseHeaderValue(rule,value)}catch(error){debugerror('wrong MIME header: "%s"',b);return false}a._headers[name]=data;return true}function parseHeaderValue(a,b){var c,i,len,data={};if(typeof a.reg!=='function'){c=b.match(a.reg);if(!c){throw new Error('parseHeaderValue() failed for '+b);}for(i=0,len=a.names.length;i<len;i++){if(c[i+1]!==undefined){data[a.names[i]]=c[i+1]}}}else{data=a.reg(b);if(!data){throw new Error('parseHeaderValue() failed for '+b);}}if(!data.value){data.value=b}return data}},{"./Entity":1,"./grammar":3,"debug":6}],6:[function(g,h,i){i=h.exports=g('./debug');i.log=log;i.formatArgs=formatArgs;i.save=save;i.load=load;i.useColors=useColors;i.storage='undefined'!=typeof chrome&&'undefined'!=typeof chrome.storage?chrome.storage.local:localstorage();i.colors=['lightseagreen','forestgreen','goldenrod','dodgerblue','darkorchid','crimson'];function useColors(){return('WebkitAppearance'in document.documentElement.style)||(window.console&&(console.firebug||(console.exception&&console.table)))||(navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31)}i.formatters.j=function(v){return JSON.stringify(v)};function formatArgs(){var b=arguments;var d=this.useColors;b[0]=(d?'%c':'')+this.namespace+(d?' %c':' ')+b[0]+(d?'%c ':' ')+'+'+i.humanize(this.diff);if(!d)return b;var c='color: '+this.color;b=[b[0],c,'color: inherit'].concat(Array.prototype.slice.call(b,1));var e=0;var f=0;b[0].replace(/%[a-z%]/g,function(a){if('%%'===a)return;e++;if('%c'===a){f=e}});b.splice(f,0,c);return b}function log(){return'object'===typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function save(a){try{if(null==a){i.storage.removeItem('debug')}else{i.storage.debug=a}}catch(e){}}function load(){var r;try{r=i.storage.debug}catch(e){}return r}i.enable(load());function localstorage(){try{return window.localStorage}catch(e){}}},{"./debug":7}],7:[function(m,n,o){o=n.exports=debug;o.coerce=coerce;o.disable=disable;o.enable=enable;o.enabled=enabled;o.humanize=m('ms');o.names=[];o.skips=[];o.formatters={};var p=0;var q;function selectColor(){return o.colors[p++%o.colors.length]}function debug(k){function disabled(){}disabled.enabled=false;function enabled(){var e=enabled;var f=+new Date();var g=f-(q||f);e.diff=g;e.prev=q;e.curr=f;q=f;if(null==e.useColors)e.useColors=o.useColors();if(null==e.color&&e.useColors)e.color=selectColor();var h=Array.prototype.slice.call(arguments);h[0]=o.coerce(h[0]);if('string'!==typeof h[0]){h=['%o'].concat(h)}var i=0;h[0]=h[0].replace(/%([a-z%])/g,function(a,b){if(a==='%%')return a;i++;var c=o.formatters[b];if('function'===typeof c){var d=h[i];a=c.call(e,d);h.splice(i,1);i--}return a});if('function'===typeof o.formatArgs){h=o.formatArgs.apply(e,h)}var j=enabled.log||o.log||console.log.bind(console);j.apply(e,h)}enabled.enabled=true;var l=o.enabled(k)?enabled:disabled;l.namespace=k;return l}function enable(a){o.save(a);var b=(a||'').split(/[\s,]+/);var c=b.length;for(var i=0;i<c;i++){if(!b[i])continue;a=b[i].replace(/\*/g,'.*?');if(a[0]==='-'){o.skips.push(new RegExp('^'+a.substr(1)+'$'))}else{o.names.push(new RegExp('^'+a+'$'))}}}function disable(){o.enable('')}function enabled(a){var i,len;for(i=0,len=o.skips.length;i<len;i++){if(o.skips[i].test(a)){return false}}for(i=0,len=o.names.length;i<len;i++){if(o.names[i].test(a)){return true}}return false}function coerce(a){if(a instanceof Error)return a.stack||a.message;return a}},{"ms":8}],8:[function(e,f,g){var s=1000;var m=s*60;var h=m*60;var d=h*24;var y=d*365.25;f.exports=function(a,b){b=b||{};if('string'==typeof a)return parse(a);return b.long?long(a):short(a)};function parse(a){a=''+a;if(a.length>10000)return;var b=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(a);if(!b)return;var n=parseFloat(b[1]);var c=(b[2]||'ms').toLowerCase();switch(c){case'years':case'year':case'yrs':case'yr':case'y':return n*y;case'days':case'day':case'd':return n*d;case'hours':case'hour':case'hrs':case'hr':case'h':return n*h;case'minutes':case'minute':case'mins':case'min':case'm':return n*m;case'seconds':case'second':case'secs':case'sec':case's':return n*s;case'milliseconds':case'millisecond':case'msecs':case'msec':case'ms':return n}}function short(a){if(a>=d)return Math.round(a/d)+'d';if(a>=h)return Math.round(a/h)+'h';if(a>=m)return Math.round(a/m)+'m';if(a>=s)return Math.round(a/s)+'s';return a+'ms'}function long(a){return plural(a,d,'day')||plural(a,h,'hour')||plural(a,m,'minute')||plural(a,s,'second')||a+' ms'}function plural(a,n,b){if(a<n)return;if(a<n*1.5)return Math.floor(a/n)+' '+b;return Math.ceil(a/n)+' '+b+'s'}},{}],9:[function(c,d,e){'use strict';var f='0123456789',letters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',specials='!$%^&*()_+|~-=`{}[]:;<>?,./';function _defaults(a){a||(a={});return{length:a.length||32,numeric:typeof a.numeric==='boolean'?a.numeric:true,letters:typeof a.letters==='boolean'?a.letters:true,special:typeof a.special==='boolean'?a.special:false}}function _buildChars(a){var b='';if(a.numeric){b+=f}if(a.letters){b+=letters}if(a.special){b+=specials}return b}d.exports=function randomString(a){a=_defaults(a);var i,rn,rnd='',len=a.length,randomChars=_buildChars(a);for(i=1;i<=len;i++){rnd+=randomChars.substring(rn=Math.floor(Math.random()*randomChars.length),rn+1)}return rnd}},{}]},{},[4])(4)});