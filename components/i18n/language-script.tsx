/**
 * Applies Arabic RTL before paint so the first frame is not LTR.
 */
export function LanguageScript() {
  const code = `(function(){try{var k="rw-language";var l=null;try{l=localStorage.getItem(k);}catch(e){}if(!l){var parts=document.cookie.split("; ");for(var i=0;i<parts.length;i++){if(parts[i].indexOf(k+"=")==0){l=parts[i].slice(k.length+1);break;}}}if(l==="ar"){document.documentElement.dir="rtl";document.documentElement.lang="ar";}else{document.documentElement.dir="ltr";}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
